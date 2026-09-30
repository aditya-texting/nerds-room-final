-- ============================================================================
-- Nerds Room — Chapter Content + Subchapters
-- Run in Supabase Dashboard -> SQL Editor (or via CLI).
-- Adds: subchapters (nested under a chapter), chapter_content (per-chapter
-- about/gather/values text), and repurposes chapter_events as the chapter's
-- "Upcoming Events" list (already exists).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. subchapters  (nested under a parent chapter)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subchapters (
  id serial PRIMARY KEY,
  chapter_id integer NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text,
  lead text,
  member_count integer NOT NULL DEFAULT 0,
  banner_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 2. chapter_content  (one row per chapter: About / How We Gather / Our Values)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chapter_content (
  id serial PRIMARY KEY,
  chapter_id integer NOT NULL REFERENCES chapters(id) ON DELETE CASCADE UNIQUE,
  about_title text NOT NULL DEFAULT 'About Us',
  about_text text,
  about_image text,
  gather_title text NOT NULL DEFAULT 'How We Gather',
  gather_text text,
  gather_image text,
  values_title text NOT NULL DEFAULT 'Our Values',
  values_text text,
  values_image text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. chapter_events already exists (used as "Upcoming Events" per chapter).
--    Ensure chapter_id is populated so events are scoped to a chapter.
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- 4. Extend `chapters` with header tagline + partner link
-- ----------------------------------------------------------------------------
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS partner_link text;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- ----------------------------------------------------------------------------
-- 5. Extend `subchapters` with per-subchapter join link
-- ----------------------------------------------------------------------------
ALTER TABLE subchapters ADD COLUMN IF NOT EXISTS join_link text;

-- NOTE: subchapter_id on chapter_events + chapters_header_banner setting
-- live in 009_chapters_images_events_banner.sql

-- ============================================================================
-- ROW LEVEL SECURITY
-- Public = read only. Authenticated (admins) = write.
-- ============================================================================

-- subchapters
ALTER TABLE subchapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view subchapters" ON subchapters FOR SELECT USING (true);
CREATE POLICY "Admins can insert subchapters" ON subchapters FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update subchapters" ON subchapters FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete subchapters" ON subchapters FOR DELETE USING (auth.role() = 'authenticated');

-- chapter_content
ALTER TABLE chapter_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view chapter content" ON chapter_content FOR SELECT USING (true);
CREATE POLICY "Admins can insert chapter content" ON chapter_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update chapter content" ON chapter_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete chapter content" ON chapter_content FOR DELETE USING (auth.role() = 'authenticated');
