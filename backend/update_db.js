import pkg from 'pg';
const pool = new pkg.Pool({ connectionString: 'postgresql://postgres:kanhaiya@localhost:5432/nerdsroom_platform?schema=public' });

async function run() {
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS "EventCategoryMapping" ("eventId" TEXT NOT NULL, "categoryId" TEXT NOT NULL, PRIMARY KEY ("eventId", "categoryId"));');
    await pool.query('ALTER TABLE "Event" DROP COLUMN IF EXISTS "categoryId";');
    console.log('Database updated successfully');
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
