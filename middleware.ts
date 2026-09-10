import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Per-request middleware: Content-Security-Policy with a fresh nonce plus
 * a structured access log line. The nonce is forwarded to the app via the
 * `x-nonce` request header (consumed by the root layout); Next.js applies
 * it to the scripts it renders itself.
 */
export function middleware(request: NextRequest) {
  const started = Date.now();
  const nonce = crypto.randomUUID().replace(/-/g, "");

  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    `script-src 'nonce-${nonce}' 'strict-dynamic'`,
    "connect-src 'self'",
  ].join("; ");

  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", csp);

  const ms = Date.now() - started;
  console.log(
    JSON.stringify({ msg: "request", method: request.method, path: request.nextUrl.pathname, ms })
  );
  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
