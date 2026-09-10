import { LoginForm } from "./login-form";
import MarketingNav from "@/components/MarketingNav";

export default function LoginPage() {
  const demoAccounts = [
    { role: "Government", email: "gov@example.gov.in", dept: "Smart Cities Mission" },
    { role: "Startup", email: "startup@example.com", dept: "AquaSense Technologies" },
    { role: "Evaluator", email: "evaluator@example.com", dept: "IIT Delhi" },
    { role: "Admin", email: "admin@govinnovate.in", dept: "Platform" },
  ];
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="fog-blob left-[-10%] top-[-12%] h-[520px] w-[520px] bg-accent/30" />
      <div className="fog-blob right-[-8%] top-[20%] h-[460px] w-[460px] bg-violet/28" />
      <div className="fog-blob bottom-[-16%] left-[35%] h-[560px] w-[560px] bg-accent/18" />

      <MarketingNav back="/" backLabel="Back to home" themeToggle={false} />

      <main className="relative z-10 flex w-full flex-1 items-start justify-center px-6 pb-16 pt-6 sm:pt-12">
        <div className="w-full max-w-md space-y-5">
          <div className="glass-strong animate-fade-up rounded-[2rem] p-8">
            <h1 className="text-3xl font-semibold tracking-tight text-ink">Sign in</h1>
            <p className="mt-1.5 text-sm text-ink-2">Access the innovation procurement workspace.</p>
            <LoginForm />
          </div>

          <div className="glass animate-fade-up rounded-[2rem] p-6" style={{ animationDelay: "120ms" }}>
            <h2 className="text-sm font-semibold tracking-tight text-ink">Demo accounts</h2>
            <p className="mt-1 text-xs text-ink-3">
              Password for all demo accounts:{" "}
              <code className="rounded-md bg-black/5 px-1.5 py-0.5 font-mono text-[11px] dark:bg-white/10">demo1234</code>
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {demoAccounts.map((a) => (
                <div
                  key={a.email}
                  className="rounded-2xl border border-black/5 bg-white/70 px-3.5 py-2.5 dark:border-white/10 dark:bg-white/10"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">{a.role}</p>
                  <p className="truncate text-xs font-medium text-ink">{a.email}</p>
                  <p className="truncate text-[11px] text-ink-3">{a.dept}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}