-- SQL Optimization Plan for 50k Users
-- [Corrected Version 2]
-- Removed 'user_id' index on registrations table because the column is named 'email' (based on TypeScript interface) or handled differently.
-- Based on src/types/index.ts: Registration interface has 'email', not 'user_id'.

-- ==========================================
-- 1. Indexing Strategy
-- ==========================================

-- HACKATHONS Table
-- Essential for looking up events by slug on detail pages
CREATE INDEX IF NOT EXISTS idx_hackathons_slug ON hackathons(slug);
-- Optimize "Newest First" sorting on listing pages
CREATE INDEX IF NOT EXISTS idx_hackathons_created_at ON hackathons(created_at DESC);

-- OTHER EVENTS Table
CREATE INDEX IF NOT EXISTS idx_other_events_slug ON other_events(slug);
CREATE INDEX IF NOT EXISTS idx_other_events_created_at ON other_events(created_at DESC);

-- WORKSHOPS Table
CREATE INDEX IF NOT EXISTS idx_workshops_slug ON workshops(slug);
CREATE INDEX IF NOT EXISTS idx_workshops_date ON workshops(date);

-- REGISTRATIONS Table
-- Critical for checking "Is this user registered?"
-- Based on the 'Registration' type in src/types/index.ts, the unique identifier for a user in a registration is 'email'.
-- Use (hackathon_id, email) for fast lookups.
CREATE INDEX IF NOT EXISTS idx_registrations_hackathon_email ON registrations(hackathon_id, email);

-- If there IS a column linking to a user ID (e.g. from Clerk/Auth), it might be named differently (e.g. 'clerk_id', 'uid').
-- Since 'user_id' threw an error, we skip indexing it until the column name is verified.
-- If you strictly use email for mapping, the above index is sufficient.

-- For filtering stats (e.g. counting 'approved' registrations)
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
-- For the admin dashboard 'Recent Registrations' list
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

-- FLAGSHIP EVENTS
CREATE INDEX IF NOT EXISTS idx_flagship_created_at ON flagship_events(created_at);

-- PAST EVENTS
CREATE INDEX IF NOT EXISTS idx_past_events_created_at ON past_events(created_at DESC);

-- ==========================================
-- 2. Query Optimization Notes
-- ==========================================
-- a. SELECT Specific Columns
--    When fetching lists (e.g., /hackathons), select only needed columns (id, title, slug, banner, dates)
--    instead of 'SELECT *'.

-- b. Pagination
--    Ensure all lists use `.range(start, end)` in Supabase queries.

-- ==========================================
-- 3. Database Configuration (Supabase)
-- ==========================================
-- a. Enable Point-in-Time Recovery (PITR).
-- b. Use Connection Pooling (Supavisor) for heavy traffic.
-- c. Monitor 'Active Connections' in Supabase Dashboard.
