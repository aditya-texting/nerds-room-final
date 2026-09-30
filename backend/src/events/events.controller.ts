import { Controller, Get, Param, Query, Post, Put, Delete, Body, UseGuards, Req, BadRequestException, ConflictException, ForbiddenException, UseInterceptors, UploadedFile, InternalServerErrorException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { AuthGuard } from '@nestjs/passport';
import { db } from '../prisma/db.js';
import pkg from 'pg';
import 'dotenv/config';

const pool = new pkg.Pool({ connectionString: process.env['DATABASE_URL'] });

async function rawQuery(sql: string, values: any[] = []) {
  const result = await pool.query(sql, values);
  return result.rows;
}

@Controller('events')
export class EventsController {
  @Get('categories')
  async getCategories() {
    return db.orm.public.EventCategory.orderBy((m) => m.name.asc()).all();
  }

  @Get('featured')
  async getFeatured() {
    return rawQuery(`
      SELECT id, slug, name, subtitle, location, "locationType", "startDate", "endDate", "isFeatured", "imageUrl"
      FROM "Event"
      WHERE "isFeatured" = true AND status = 'PUBLISH' AND "eventType" = 'PUBLIC'
      ORDER BY "createdAt" DESC
    `);
  }

  @Get()
  async findAll(
    @Query('status') status?: 'DRAFT' | 'PUBLISH',
    @Query('eventType') eventType?: 'PUBLIC' | 'PRIVATE',
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('locationType') locationType?: string,
    @Query('dateFilter') dateFilter?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
    @Query('includeDrafts') includeDrafts?: string
  ) {
    const page = pageStr ? parseInt(pageStr, 10) : 1;
    const limit = limitStr ? parseInt(limitStr, 10) : 10;
    const offset = (page - 1) * limit;

    const conditions: string[] = includeDrafts === 'true' ? [] : ['"status" != \'DRAFT\''];
    const values: any[] = [];
    let idx = 1;

    if (status) { conditions.push(`"status" = $${idx++}`); values.push(status); }
    if (eventType) { conditions.push(`"eventType" = $${idx++}`); values.push(eventType); }
    if (categoryId) { 
      conditions.push(`EXISTS (SELECT 1 FROM "EventCategoryMapping" ecm WHERE ecm."eventId" = e.id AND ecm."categoryId" = $${idx++})`); 
      values.push(categoryId); 
    }
    if (isFeatured === 'true') { conditions.push(`"isFeatured" = true`); }
    if (locationType && locationType !== 'ALL') { conditions.push(`"locationType" = $${idx++}`); values.push(locationType); }
    if (dateFilter === 'upcoming') { conditions.push(`"startDate" > NOW()`); }
    if (dateFilter === 'past') { conditions.push(`"endDate" < NOW()`); }
    if (search) { conditions.push(`"name" ILIKE $${idx++}`); values.push(`%${search}%`); }

    const orderDir = sortBy === 'oldest' ? 'ASC' : 'DESC';
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT id, slug, name, subtitle, description, location, "locationType", "eventType", status,
             "isFeatured", "startDate", "endDate", "imageUrl", "teamType", "minTeamSize", "maxTeamSize"
      FROM "Event" e
      ${whereClause}
      ORDER BY "createdAt" ${orderDir}
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    values.push(limit, offset);

    return rawQuery(sql, values);
  }

  private requireAdmin(req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException('Admin access required');
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('admin/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Req() req: any, @UploadedFile() file: any) {
    this.requireAdmin(req);
    if (!file) throw new BadRequestException('No file provided');

    // Configure cloudinary with provided credentials
    cloudinary.config({ 
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    return new Promise((resolve, reject) => {
      // Use unsigned upload stream to bypass all 403 signature errors
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'nerdsroom_platform';
      const uploadStream = cloudinary.uploader.unsigned_upload_stream(
        uploadPreset,
        { 
          folder: 'nerdsroom',
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'zklkuqr1'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return reject(new InternalServerErrorException('Image upload failed: ' + (error.message || JSON.stringify(error))));
          }
          resolve({ url: result?.secure_url });
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('admin')
  async createAdminEvent(@Req() req: any, @Body() body: any) {
    this.requireAdmin(req);
    const slug = String(body.slug || body.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
    const event = (await rawQuery(`INSERT INTO "Event" (id, slug, name, subtitle, description, "startDate", "endDate", status, "isFeatured", "eventType", "locationType", location, "locationUrl", "imageUrl", "lumaUrl", "teamType", "minTeamSize", "maxTeamSize", "creatorId", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,NOW(),NOW()) RETURNING *`, [slug, body.name, body.subtitle || null, body.description, body.startDate, body.endDate, body.status || 'DRAFT', !!body.isFeatured, body.eventType || 'PUBLIC', body.locationType || 'OFFLINE', body.location || null, body.locationUrl || null, body.imageUrl || null, body.lumaUrl || null, body.teamType || 'INDIVIDUAL', Number(body.minTeamSize || 1), Number(body.maxTeamSize || 1), req.user.sub]))[0];
    const inserts: [string, any[]][] = [
      ['EventTimeline', (body.timelines || []).map((x: any) => [x.title || null, x.description, x.startDate, x.endDate])],
      ['Prize', (body.prizes || []).map((x: any) => [x.title, x.description || null, x.amount || null])],
      ['Track', (body.tracks || []).map((x: any) => [x.title, x.description || null])],
      ['Faq', (body.faqs || []).map((x: any) => [x.question, x.answer])],
      ['ImportantLink', (body.importantLinks || []).map((x: any) => [x.title, x.url])],
      ['Partner', (body.partners || []).map((x: any) => [x.name, x.logoUrl || null, x.websiteUrl || null])],
    ];
    for (const [table, rows] of inserts) for (const row of rows) {
      const columns = table === 'EventTimeline' ? 'title, description, "startDate", "endDate"' : table === 'Prize' ? 'title, description, amount' : table === 'Track' ? 'title, description' : table === 'Faq' ? 'question, answer' : table === 'ImportantLink' ? 'title, url' : 'name, "logoUrl", "websiteUrl"';
      const values = row.map((_: any, i: number) => `$${i + 1}`).join(',');
      await rawQuery(`INSERT INTO "${table}" (id, ${columns}, "eventId") VALUES (gen_random_uuid(), ${values}, $${row.length + 1})`, [...row, event.id]);
    }
    const catIds = Array.isArray(body.categoryIds) ? body.categoryIds : (body.categoryId ? [body.categoryId] : []);
    for (const catId of catIds) {
      if (catId) await rawQuery(`INSERT INTO "EventCategoryMapping" ("eventId", "categoryId") VALUES ($1, $2) ON CONFLICT DO NOTHING`, [event.id, catId]);
    }
    return event;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('admin/:id')
  async updateAdminEvent(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    this.requireAdmin(req);
    const fields = ['name','subtitle','description','startDate','endDate','status','isFeatured','eventType','locationType','location','locationUrl','imageUrl','lumaUrl','teamType','minTeamSize','maxTeamSize'];
    const values: any[] = []; const sets: string[] = [];
    fields.forEach((field) => { if (body[field] !== undefined) { values.push(body[field]); sets.push(`"${field}" = $${values.length}`); } });
    
    let event;
    if (sets.length) {
      values.push(id); 
      event = (await rawQuery(`UPDATE "Event" SET ${sets.join(', ')}, "updatedAt" = NOW() WHERE id = $${values.length} RETURNING *`, values))[0];
    } else {
      event = (await rawQuery('SELECT * FROM "Event" WHERE id = $1', [id]))[0];
    }

    if (!event) throw new BadRequestException('Event not found');

    const inserts: [string, any[]][] = [
      ['EventTimeline', (body.timelines || []).map((x: any) => [x.title || null, x.description, x.startDate, x.endDate])],
      ['Prize', (body.prizes || []).map((x: any) => [x.title, x.description || null, x.amount || null])],
      ['Track', (body.tracks || []).map((x: any) => [x.title, x.description || null])],
      ['Faq', (body.faqs || []).map((x: any) => [x.question, x.answer])],
      ['ImportantLink', (body.importantLinks || []).map((x: any) => [x.title, x.url])],
      ['Partner', (body.partners || []).map((x: any) => [x.name, x.logoUrl || null, x.websiteUrl || null])],
    ];

    for (const [table, rows] of inserts) {
      await rawQuery(`DELETE FROM "${table}" WHERE "eventId" = $1`, [id]);
      for (const row of rows) {
        const columns = table === 'EventTimeline' ? 'title, description, "startDate", "endDate"' : table === 'Prize' ? 'title, description, amount' : table === 'Track' ? 'title, description' : table === 'Faq' ? 'question, answer' : table === 'ImportantLink' ? 'title, url' : 'name, "logoUrl", "websiteUrl"';
        const vals = row.map((_: any, i: number) => `$${i + 1}`).join(',');
        await rawQuery(`INSERT INTO "${table}" (id, ${columns}, "eventId") VALUES (gen_random_uuid(), ${vals}, $${row.length + 1})`, [...row, id]);
      }
    }
    const catIds = Array.isArray(body.categoryIds) ? body.categoryIds : (body.categoryId ? [body.categoryId] : (body.categoryIds || []));
    if (body.categoryIds !== undefined || body.categoryId !== undefined) {
      await rawQuery(`DELETE FROM "EventCategoryMapping" WHERE "eventId" = $1`, [id]);
      for (const catId of catIds) {
        if (catId) await rawQuery(`INSERT INTO "EventCategoryMapping" ("eventId", "categoryId") VALUES ($1, $2) ON CONFLICT DO NOTHING`, [id, catId]);
      }
    }
    return event;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('admin/:id')
  async deleteAdminEvent(@Param('id') id: string, @Req() req: any) {
    this.requireAdmin(req); await rawQuery('DELETE FROM "Event" WHERE id = $1', [id]); return { deleted: true };
  }
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const events = await rawQuery(`
      SELECT e.*
      FROM "Event" e
      WHERE e.slug = $1 OR e.id = $1
      LIMIT 1
    `, [slug]);

    if (!events.length) return null;
    const event = events[0];

    const [timelines, prizes, tracks, faqs, links, partners, registrationCount, categories] = await Promise.all([
      rawQuery(`SELECT * FROM "EventTimeline" WHERE "eventId" = $1 ORDER BY "startDate" ASC`, [event.id]),
      rawQuery(`SELECT * FROM "Prize" WHERE "eventId" = $1`, [event.id]),
      rawQuery(`SELECT * FROM "Track" WHERE "eventId" = $1`, [event.id]),
      rawQuery(`SELECT * FROM "Faq" WHERE "eventId" = $1`, [event.id]),
      rawQuery(`SELECT * FROM "ImportantLink" WHERE "eventId" = $1`, [event.id]),
      rawQuery(`SELECT * FROM "Partner" WHERE "eventId" = $1`, [event.id]),
      rawQuery(`SELECT COUNT(*) as count FROM "Registration" WHERE "eventId" = $1`, [event.id]),
      rawQuery(`SELECT c.id, c.name FROM "EventCategory" c JOIN "EventCategoryMapping" m ON m."categoryId" = c.id WHERE m."eventId" = $1`, [event.id]),
    ]);

    return {
      ...event,
      timelines,
      prizes,
      tracks,
      faqs,
      importantLinks: links,
      partners,
      categories,
      categoryIds: categories.map(c => c.id),
      registrationCount: parseInt(registrationCount[0]?.count || '0'),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':slug/register')
  async register(@Param('slug') slug: string, @Req() req: any) {
    const event = (await rawQuery('SELECT id, "teamType", "minTeamSize", "maxTeamSize", "lumaUrl" FROM "Event" WHERE slug = $1 OR id = $1 LIMIT 1', [slug]))[0];
    if (!event) throw new BadRequestException('Event not found');
    const result = await rawQuery(`INSERT INTO "Registration" (id, "userId", "eventId", "createdAt") VALUES (gen_random_uuid(), $1, $2, NOW()) ON CONFLICT ("userId", "eventId") DO UPDATE SET "createdAt" = "Registration"."createdAt" RETURNING *`, [req.user.sub, event.id]);
    return { registered: true, registration: result[0], event };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':slug/registration')
  async getRegistration(@Param('slug') slug: string, @Req() req: any) {
    const rows = await rawQuery(`SELECT r.*, e.id as "eventId", e."teamType", e."minTeamSize", e."maxTeamSize", e."lumaUrl", t.id as "teamId", t.name as "teamName", t."inviteCode" FROM "Registration" r JOIN "Event" e ON e.id = r."eventId" LEFT JOIN "TeamMember" tm ON tm."userId" = r."userId" AND tm."teamId" IN (SELECT id FROM "Team" WHERE "eventId" = e.id) LEFT JOIN "Team" t ON t.id = tm."teamId" WHERE (e.slug = $1 OR e.id = $1) AND r."userId" = $2 LIMIT 1`, [slug, req.user.sub]);
    return rows[0] || { registered: false };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':slug/teams')
  async createTeam(@Param('slug') slug: string, @Req() req: any, @Body() body: any) {
    const event = (await rawQuery('SELECT id, "teamType", "minTeamSize", "maxTeamSize" FROM "Event" WHERE slug = $1 OR id = $1 LIMIT 1', [slug]))[0];
    if (!event || event.teamType === 'INDIVIDUAL') throw new BadRequestException('Teams are not enabled for this event');
    const existing = await rawQuery(`SELECT t.id FROM "Team" t JOIN "TeamMember" tm ON tm."teamId" = t.id WHERE t."eventId" = $1 AND tm."userId" = $2`, [event.id, req.user.sub]);
    if (existing.length) throw new ConflictException('You are already in a team');
    const name = String(body.name || '').trim();
    if (!name) throw new BadRequestException('Team name is required');
    const team = (await rawQuery(`INSERT INTO "Team" (id, name, "inviteCode", "eventId", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, upper(substr(md5(random()::text), 1, 8)), $2, NOW(), NOW()) RETURNING *`, [name, event.id]))[0];
    await rawQuery(`INSERT INTO "TeamMember" (id, "teamId", "userId", "isLeader", "createdAt") VALUES (gen_random_uuid(), $1, $2, true, NOW())`, [team.id, req.user.sub]);
    return { team };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':slug/teams/join')
  async joinTeam(@Param('slug') slug: string, @Req() req: any, @Body() body: any) {
    const event = (await rawQuery('SELECT id, "maxTeamSize" FROM "Event" WHERE slug = $1 OR id = $1 LIMIT 1', [slug]))[0];
    const team = (await rawQuery(`SELECT t.* FROM "Team" t WHERE t."eventId" = $1 AND t."inviteCode" = $2`, [event?.id, String(body.inviteCode || '').toUpperCase()]))[0];
    if (!event || !team) throw new BadRequestException('Invalid invite code');
    const count = (await rawQuery('SELECT COUNT(*)::int AS count FROM "TeamMember" WHERE "teamId" = $1', [team.id]))[0].count;
    if (count >= event.maxTeamSize) throw new BadRequestException('This team is full');
    await rawQuery(`INSERT INTO "TeamMember" (id, "teamId", "userId", "isLeader", "createdAt") VALUES (gen_random_uuid(), $1, $2, false, NOW()) ON CONFLICT ("teamId", "userId") DO NOTHING`, [team.id, req.user.sub]);
    return { team };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':slug/team')
  async getMyTeam(@Param('slug') slug: string, @Req() req: any) {
    const team = (await rawQuery(`SELECT t.* FROM "Team" t JOIN "Event" e ON e.id = t."eventId" JOIN "TeamMember" tm ON tm."teamId" = t.id WHERE (e.slug = $1 OR e.id = $1) AND tm."userId" = $2 LIMIT 1`, [slug, req.user.sub]))[0];
    if (!team) return { team: null, members: [] };
    const members = await rawQuery(`SELECT tm.id, tm."userId", tm."isLeader", u.name, u.email FROM "TeamMember" tm JOIN "User" u ON u.id = tm."userId" WHERE tm."teamId" = $1 ORDER BY tm."isLeader" DESC, tm."createdAt" ASC`, [team.id]);
    const submission = (await rawQuery(`SELECT * FROM "TeamSubmission" WHERE "teamId" = $1`, [team.id]))[0] || null;
    return { team, members, submission };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':slug/team/:teamId/submit')
  async submitTeam(@Param('teamId') teamId: string, @Req() req: any, @Body() body: any) {
    const leader = (await rawQuery(`SELECT tm."isLeader" FROM "TeamMember" tm WHERE tm."teamId" = $1 AND tm."userId" = $2`, [teamId, req.user.sub]))[0];
    if (!leader?.isLeader) throw new BadRequestException('Only the team leader can submit');
    const result = await rawQuery(`INSERT INTO "TeamSubmission" (id, "teamId", "projectUrl", "videoUrl", description, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) ON CONFLICT ("teamId") DO UPDATE SET "projectUrl" = EXCLUDED."projectUrl", "videoUrl" = EXCLUDED."videoUrl", description = EXCLUDED.description, "updatedAt" = NOW() RETURNING *`, [teamId, body.projectUrl || null, body.videoUrl || null, body.description || null]);
    return { submission: result[0] };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':slug/team/:teamId/remove/:userId')
  async removeTeamMember(@Param('teamId') teamId: string, @Param('userId') userId: string, @Req() req: any) {
    const leader = (await rawQuery(`SELECT "isLeader" FROM "TeamMember" WHERE "teamId" = $1 AND "userId" = $2`, [teamId, req.user.sub]))[0];
    if (!leader?.isLeader) throw new BadRequestException('Only the team leader can remove members');
    if (userId === req.user.sub) throw new BadRequestException('Leader cannot remove themselves');
    await rawQuery(`DELETE FROM "TeamMember" WHERE "teamId" = $1 AND "userId" = $2`, [teamId, userId]);
    return { removed: true };
  }}
