import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const categories = ['IoT', 'Web3', 'AI/ML', 'App Dev', 'Robotics', 'Open Source'];
  const catIds = [];
  
  for (const cat of categories) {
    const res = await pool.query(
      `INSERT INTO "EventCategory" (id, name) VALUES (gen_random_uuid(), $1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
      [cat]
    );
    catIds.push(res.rows[0].id);
  }

  const userRes = await pool.query(`SELECT id FROM "User" LIMIT 1`);
  let userId = userRes.rows[0]?.id;
  if (!userId) {
    const res = await pool.query(
      `INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES (gen_random_uuid(), 'admin@example.com', 'hash', 'Admin', 'ADMIN', NOW(), NOW()) RETURNING id`
    );
    userId = res.rows[0].id;
  }

  await pool.query(`DELETE FROM "Event"`);

  // Generate 35 random events
  for (let i = 0; i < 35; i++) {
    const statuses = ['PUBLISH', 'PUBLISH', 'DRAFT'];
    const status = statuses[i % 3];
    const teamTypes = ['INDIVIDUAL', 'TEAM', 'BOTH'];
    const teamType = teamTypes[i % 3];
    const isFeatured = i % 4 === 0;
    const name = `Innovation Hackathon ${i + 1}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 8);
    const locationTypes = ['ONLINE', 'OFFLINE', 'HYBRID'];
    const locationType = locationTypes[i % 3];
    const locationNames = [null, 'Bangalore, India', 'Delhi, India', 'Mumbai, India', 'Hyderabad, India', 'Pune, India'];
    const location = locationType === 'ONLINE' ? null : locationNames[(i % 5) + 1];
    // Use Unsplash tech images seeded by index for variety
    const unsplashSeeds = ['hackathon', 'technology', 'coding', 'startup', 'innovation', 'robotics', 'ai'];
    const imageUrl = `https://source.unsplash.com/800x450/?${unsplashSeeds[i % unsplashSeeds.length]},${i}`;
    const minTeam = teamType === 'INDIVIDUAL' ? 1 : 2;
    const maxTeam = teamType === 'INDIVIDUAL' ? 1 : (i % 3 === 1 ? 4 : 5);
    // Vary dates: some past (closed), some current (live), some future (upcoming)
    const startOffset = (i % 3 === 0) ? '-10 days' : (i % 3 === 1) ? '0 days' : '7 days';
    const endOffset   = (i % 3 === 0) ? '-5 days'  : (i % 3 === 1) ? '3 days' : '12 days';

    await pool.query(
      `INSERT INTO "Event" (id, slug, name, subtitle, description, "startDate", "endDate", status, "isFeatured", "eventType", "locationType", location, "imageUrl", "teamType", "minTeamSize", "maxTeamSize", "categoryId", "creatorId", "createdAt", "updatedAt") 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW() + interval '${startOffset}', NOW() + interval '${endOffset}', $5, $6, 'PUBLIC', $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())`,
      [
        slug,
        name,
        `Build the future of technology in our annual hackathon ${i + 1}.`,
        `Detailed description for the awesome hackathon ${i + 1} that will change the world.`,
        status,
        isFeatured,
        locationType,
        location,
        imageUrl,
        teamType,
        minTeam,
        maxTeam,
        catIds[i % catIds.length],
        userId
      ]
    );
  }

  console.log("Seeding complete!");
  process.exit(0);
}

main().catch(console.error);
