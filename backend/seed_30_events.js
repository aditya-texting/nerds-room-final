import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const categories = ['IoT', 'Web3', 'AI/ML', 'App Dev', 'Robotics', 'Open Source'];
const images = [
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80'
];
const topics = ['Future Builders', 'Code for Impact', 'Digital Frontier', 'Launch Lab', 'Tech for Good', 'Open Innovation'];
const cities = ['Bengaluru, India', 'Delhi, India', 'Mumbai, India', 'Hyderabad, India', 'Pune, India'];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userResult = await client.query('SELECT id FROM "User" ORDER BY "createdAt" LIMIT 1');
    let creatorId = userResult.rows[0]?.id;
    if (!creatorId) {
      const created = await client.query(`INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES (gen_random_uuid(), 'seed-admin@example.com', 'seed-password', 'Seed Admin', 'ADMIN', NOW(), NOW()) RETURNING id`);
      creatorId = created.rows[0].id;
    }

    const categoryIds = [];
    for (const name of categories) {
      const result = await client.query(`INSERT INTO "EventCategory" (id, name) VALUES (gen_random_uuid(), $1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`, [name]);
      categoryIds.push(result.rows[0].id);
    }

    await client.query('DELETE FROM "Event"');

    for (let i = 0; i < 30; i++) {
      const category = i % categories.length;
      const teamType = i % 3 === 0 ? 'INDIVIDUAL' : i % 3 === 1 ? 'TEAM' : 'BOTH';
      const locationType = i % 3 === 0 ? 'ONLINE' : i % 3 === 1 ? 'OFFLINE' : 'HYBRID';
      const name = `${topics[i % topics.length]} ${String(i + 1).padStart(2, '0')}`;
      const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-demo-${i + 1}`;
      const offset = i % 3 === 0 ? i - 18 : i % 3 === 1 ? i - 5 : i + 4;
      const start = `${offset} days`;
      const end = `${offset + (i % 4 + 2)} days`;
      const location = locationType === 'ONLINE' ? null : cities[i % cities.length];
      const minTeam = teamType === 'INDIVIDUAL' ? 1 : 2;
      const maxTeam = teamType === 'INDIVIDUAL' ? 1 : teamType === 'TEAM' ? 4 : 6;
      const eventResult = await client.query(`INSERT INTO "Event" (id, slug, name, subtitle, description, "startDate", "endDate", status, "isFeatured", "eventType", "locationType", location, "imageUrl", "teamType", "minTeamSize", "maxTeamSize", "categoryId", "creatorId", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW() + $5::interval, NOW() + $6::interval, 'PUBLISH', $7, 'PUBLIC', $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW()) RETURNING id`, [slug, name, `Build practical solutions with ${topics[i % topics.length]}.`, `<h2>Welcome to ${name}</h2><p>Join builders, designers and problem-solvers for a hands-on event focused on meaningful technology.</p><p>Bring your ideas, form a team and ship something useful.</p>`, start, end, i % 4 === 0, locationType, location, images[i % images.length], teamType, minTeam, maxTeam, categoryIds[category], creatorId]);
      const eventId = eventResult.rows[0].id;

      await client.query(`INSERT INTO "EventTimeline" (id, title, description, "startDate", "endDate", "eventId") VALUES (gen_random_uuid(), $1, $2, NOW() + $3::interval, NOW() + $4::interval, $5)`, ['Kickoff and introductions', '<p>Meet the community, review the brief and choose your direction.</p>', `${offset} days`, `${offset} days`, eventId]);
      await client.query(`INSERT INTO "EventTimeline" (id, title, description, "startDate", "endDate", "eventId") VALUES (gen_random_uuid(), $1, $2, NOW() + $3::interval, NOW() + $4::interval, $5)`, ['Build and showcase', '<p>Work with your team, get mentor feedback and present your final demo.</p>', `${offset + 1} days`, `${offset + 2} days`, eventId]);
      await client.query(`INSERT INTO "Prize" (id, title, description, amount, "eventId") VALUES (gen_random_uuid(), $1, $2, $3, $4), (gen_random_uuid(), $5, $6, $7, $4)`, ['First Prize', '<p>Recognition, mentorship and a builder grant.</p>', '₹50,000', eventId, 'Community Choice', '<p>Special award selected by the community.</p>', '₹15,000']);
      await client.query(`INSERT INTO "Track" (id, title, description, "eventId") VALUES (gen_random_uuid(), $1, $2, $3), (gen_random_uuid(), $4, $5, $3)`, ['Build for People', '<p>Design accessible products that solve real problems.</p>', eventId, 'Next-Gen Technology', '<p>Explore AI, robotics, IoT and emerging platforms.</p>']);
      await client.query(`INSERT INTO "Faq" (id, question, answer, "eventId") VALUES (gen_random_uuid(), $1, $2, $3), (gen_random_uuid(), $4, $5, $3)`, ['Who can participate?', '<p>Students, professionals and curious builders are welcome.</p>', eventId, 'Do I need a team?', '<p>No. You can join solo and find collaborators during kickoff.</p>']);
      await client.query(`INSERT INTO "ImportantLink" (id, title, url, "eventId") VALUES (gen_random_uuid(), $1, $2, $3), (gen_random_uuid(), $4, $5, $6)`, ['Event handbook', 'https://example.com/event-handbook', eventId, 'Community guidelines', 'https://example.com/community-guidelines', eventId]);
      await client.query(`INSERT INTO "Partner" (id, name, "logoUrl", "websiteUrl", "eventId") VALUES (gen_random_uuid(), $1, $2, $3, $4), (gen_random_uuid(), $5, $6, $7, $8)`, ['Nerds Room', 'https://dummyimage.com/160x80/00308f/ffffff&text=Nerds+Room', 'https://nerdsroom.com', eventId, 'Builder Network', 'https://dummyimage.com/160x80/9be600/00308f&text=Builder+Network', 'https://example.com', eventId]);
    }

    await client.query('COMMIT');
    console.log('Seeded 30 complete events with related content.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });