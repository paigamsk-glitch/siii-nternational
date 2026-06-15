import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { trainsTable } from "./schema/trains.js";
import { ALL_TRAINS } from "../../../artifacts/api-server/src/data/trains-data.js";

const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });
const db = drizzle(pool);

async function seed() {
  console.log(`Seeding ${ALL_TRAINS.length} train records…`);
  let inserted = 0;
  const BATCH = 100;
  for (let i = 0; i < ALL_TRAINS.length; i += BATCH) {
    const batch = ALL_TRAINS.slice(i, i + BATCH);
    await db.insert(trainsTable).values(batch).onConflictDoNothing();
    inserted += batch.length;
    process.stdout.write(`  ${inserted}/${ALL_TRAINS.length}\r`);
  }
  console.log(`\nDone — ${ALL_TRAINS.length} trains seeded.`);
  await pool.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
