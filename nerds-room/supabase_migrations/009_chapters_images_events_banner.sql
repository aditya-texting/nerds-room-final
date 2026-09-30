-- ============================================================================
-- Nerds Room — Chapters: subchapter events + all-chapters header banner
-- Run in Supabase Dashboard -> SQL Editor (or via CLI).
-- Adds the changes from the "banner images + subchapter events" update:
--   1. subchapter_id on chapter_events (events can belong to a subchapter)
--   2. chapters_header_banner site setting (background of /chapters header)
-- Safe to re-run (IF NOT EXISTS / INSERT ... WHERE NOT EXISTS).
-- ============================================================================

-- 1. Let chapter_events belong to a subchapter
ALTER TABLE chapter_events ADD COLUMN IF NOT EXISTS subchapter_id integer REFERENCES subchapters(id) ON DELETE CASCADE;

-- 2. All-Chapters list header background banner (site setting)
INSERT INTO site_settings (key, value)
SELECT 'chapters_header_banner', '""'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'chapters_header_banner');
