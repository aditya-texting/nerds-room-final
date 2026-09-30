-- Add a site setting to control the opacity of the All Chapters
-- header banner image on the /chapters page (0.0 – 1.0, default 0.6).
INSERT INTO site_settings (key, value)
SELECT 'chapters_header_banner_opacity', to_jsonb(0.6)
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'chapters_header_banner_opacity');
