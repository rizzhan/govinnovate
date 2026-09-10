import "dotenv/config";
import { seedAll } from "./seed";

/**
 * DANGER: seedAll wipes every collection. Refuse to run against production
 * unless explicitly overridden — a stray `npm run seed` must never erase
 * live procurement data.
 */
if (process.env.NODE_ENV === "production" && process.env.ALLOW_DESTRUCTIVE_SEED !== "true") {
  console.error(
    "Refusing to seed in production (this wipes the database). " +
      "Re-run with ALLOW_DESTRUCTIVE_SEED=true if you really mean it."
  );
  process.exit(1);
}

seedAll()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Seeding failed:", e?.message ?? e);
    process.exit(1);
  });
