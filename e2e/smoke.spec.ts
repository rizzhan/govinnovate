import { expect, test } from "@playwright/test";

/**
 * Production smoke suite. Requires the app running against a SEEDED
 * database: MONGODB_URI=... npm run seed && npm run build && npm run start
 */
test("landing renders the mechanism and product previews", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("boot-splash")).toBeHidden({ timeout: 10000 });
  await expect(page.getByRole("heading", { name: /startup-friendly pathway/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /nine stages/i })).toBeVisible();
  await expect(page.getByText("Challenge dashboard")).toBeVisible();
});

test("landing previews compute live from the database", async ({ page }) => {
  await page.goto("/");
  // Milestone-derived KPI rows (seeded pilot: 4 tranches, 2 paid).
  await expect(page.getByText("Tranches paid")).toBeVisible();
  await expect(page.getByText("Budget released")).toBeVisible();
  // Live funnel values from the seeded workspace.
  await expect(page.getByText("this funnel moves with the data")).toBeVisible();
  // Derived transparency record.
  await expect(page.getByText("Milestone completion")).toBeVisible();
});

test("templates library: search, filter, preview, detail", async ({ page }) => {
  await page.goto("/templates");
  await expect(page.getByRole("heading", { name: "Standard Templates" })).toBeVisible();
  await expect(page.getByText("15 of 15 templates")).toBeVisible();

  await page.getByPlaceholder("Search templates...").fill("kpi");
  await expect(page.getByText("2 of 15 templates")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pilot KPI & Measurement Framework" })).toBeVisible();

  await page.getByPlaceholder("Search templates...").fill("");
  await page
    .getByRole("group", { name: /filter by category/i })
    .getByRole("button", { name: "Pilot", exact: true })
    .click();
  await expect(page.getByText("Pilot / Sandbox Agreement")).toBeVisible();

  await page.getByRole("button", { name: /view template/i }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("link", { name: /open full template/i })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("sign in as government lands on the dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("gov@example.gov.in");
  await page.getByLabel("Password").fill("demo1234");
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await page.waitForURL("**/gov");
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  await expect(page.getByText("Smart Cities Mission")).toBeVisible();
});

test("theme toggle flips dark mode", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await page.getByRole("button", { name: /toggle color theme/i }).click();
  await expect(html).toHaveClass(/dark/);
  await page.getByRole("button", { name: /toggle color theme/i }).click();
  await expect(html).not.toHaveClass(/dark/);
});

test("health endpoint reports ok", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.ok()).toBe(true);
  const body = await res.json();
  expect(body.status).toBe("ok");
  expect(body.db).toBe("up");
});

test("no CSP violations or page errors across key flows", async ({ page }) => {
  const problems: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`console: ${msg.text().slice(0, 200)}`);
  });
  page.on("pageerror", (err) => problems.push(`pageerror: ${String(err).slice(0, 200)}`));
  page.on("response", (res) => {
    if (res.url().includes("/_next/") && res.status() >= 400) {
      problems.push(`bad asset: ${res.status()} ${res.url().slice(0, 120)}`);
    }
  });

  await page.goto("/");
  await page.getByRole("button", { name: /toggle color theme/i }).click();
  await page.goto("/templates");
  await page.getByPlaceholder("Search templates...").fill("kpi");
  await page.getByRole("button", { name: /view template/i }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.goto("/login");
  await expect(page.getByRole("button", { name: /^sign in$/i })).toBeVisible();

  const csp = problems.filter((p) => /content security policy|violates|blocked|csp/i.test(p));
  expect(csp).toEqual([]);
  expect(problems).toEqual([]);
});
