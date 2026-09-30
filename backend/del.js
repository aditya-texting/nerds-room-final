import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new pkg.Pool({ connectionString: process.env.DATABASE_URL });
pool.query('DELETE FROM "Event"').then(() => console.log('Deleted all events')).catch(console.error).finally(() => pool.end());
