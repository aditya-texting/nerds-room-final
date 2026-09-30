-- ============================================================================
-- Nerds Room — Add display_order to chapter_events for manual reordering
-- Run in Supabase Dashboard -> SQL Editor (or via CLI).
-- Safe to re-run (IF NOT EXISTS + backfill existing rows).
-- ============================================================================

-- 1. Add the column
ALTER TABLE chapter_events ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- 2. Backfill: give existing rows a stable order by created_at (oldest first)
UPDATE chapter_events
SET display_order = sub.rn - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) AS rn
  FROM chapter_events
  WHERE display_order = 0
) AS sub
WHERE chapter_events.id = sub.id;
