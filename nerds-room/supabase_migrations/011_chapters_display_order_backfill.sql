-- ============================================================================
-- Nerds Room — Add display_order to chapters + backfill all three lists
-- Run in Supabase Dashboard -> SQL Editor (or via CLI).
-- Safe to re-run (IF NOT EXISTS + idempotent backfill).
--
-- WHY: reorderChapter/reorderSubchapter/reorderChapterEvent swap the
-- display_order values of two rows. If every row has display_order = 0
-- (the DEFAULT), swapping 0 with 0 changes nothing, so the admin's
-- up/down buttons appear to do nothing. This migration gives every row
-- a distinct, sequential display_order so reordering actually works.
-- ============================================================================

-- 1. chapters: add the column (was missing entirely)
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- 2. Backfill chapters (oldest first, stable order)
UPDATE chapters
SET display_order = sub.rn - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) AS rn
  FROM chapters
) AS sub
WHERE chapters.id = sub.id;

-- 3. Backfill subchapters (grouped by parent chapter, then created_at)
UPDATE subchapters
SET display_order = sub.rn - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY chapter_id ORDER BY created_at ASC, id ASC
  ) AS rn
  FROM subchapters
) AS sub
WHERE subchapters.id = sub.id;

-- 4. Backfill chapter_events (oldest first)
UPDATE chapter_events
SET display_order = sub.rn - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) AS rn
  FROM chapter_events
) AS sub
WHERE chapter_events.id = sub.id;
