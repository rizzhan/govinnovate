/**
 * Central environment validation. Secrets and connection strings are read
 * lazily so importing this module never throws — the error surfaces on
 * first use with a message that tells the operator exactly what to set.
 */

const DEV_SECRET = "dev-insecure-secret-change-me";

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getMongoUri(): string {
  const uri = (process.env.MONGODB_URI || "").trim();
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Point it at your MongoDB Atlas cluster, e.g. " +
        "MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.[BASE64_PLACEHOLDER_1]"
    );
  }
  return uri;
}

export function getMongoDbName(): string | undefined {
  const name = (process.env.MONGODB_DB || "").trim();
  return name || undefined;
}

export function getSessionSecret(): string {
  const secret = (process.env.SESSION_SECRET || "").trim();
  if (!secret || secret === DEV_SECRET) {
    if (isProduction()) {
      throw new Error(
        "SESSION_SECRET must be set to a long random value in production. " +
          "Generate one with: openssl rand -base64 32"
      );
    }
    return DEV_SECRET;
  }
  return secret;
}
