import "dotenv/config";
import { getDb } from "./db";

/** Explicit migration entrypoint for deploys/CI: `npm run migrate`. */
async function main() {
  const db = await getDb();
  console.log("Migrations up to date.");
  await db.client.close();
}

main().catch((e) => {
  console.error("Migration failed:", e?.message ?? e);
  process.exit(1);
});
