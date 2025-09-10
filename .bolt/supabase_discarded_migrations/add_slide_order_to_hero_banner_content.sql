/*
  # Add slide_order to hero_banner_content and update existing data

  1. Modified Tables
    - `hero_banner_content`
      - Added `slide_order` (integer, not null, default 0) to define the display order of banner slides.
  2. Data Migration
    - Updates existing rows in `hero_banner_content` to assign a sequential `slide_order` based on their current `title_tr` to ensure initial ordering.
  3. Security
    - No changes to RLS policies, existing policies remain.
*/

DO $$
BEGIN
  -- Add slide_order column if it does not exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_banner_content' AND column_name = 'slide_order'
  ) THEN
    ALTER TABLE hero_banner_content ADD COLUMN slide_order integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Update existing rows to assign a sequential slide_order
-- This ensures existing data gets an initial order.
WITH ordered_slides AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY title_tr) as rn
  FROM hero_banner_content
)
UPDATE hero_banner_content
SET slide_order = os.rn
FROM ordered_slides os
WHERE hero_banner_content.id = os.id AND hero_banner_content.slide_order = 0; -- Only update if default 0
