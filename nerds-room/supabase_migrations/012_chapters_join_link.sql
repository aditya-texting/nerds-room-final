-- Add a per-chapter join link so the "Join Our Chapter" button
-- on the chapter detail page uses the chapter's own link instead
-- of the global Discord link.
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS join_link text;
