/*
      # Add Arabic translation columns to hero_banner_content table

      1. Modified Tables
        - `hero_banner_content`
          - Added `title_ar` (text)
          - Added `subtitle_ar` (text)
          - Added `description_ar` (text)
          - Added `button_text_ar` (text)
      2. Data Migration
        - Updated existing rows in `hero_banner_content` to set default Arabic values.
    */

    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_banner_content' AND column_name = 'title_ar') THEN
        ALTER TABLE hero_banner_content ADD COLUMN title_ar text DEFAULT '';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_banner_content' AND column_name = 'subtitle_ar') THEN
        ALTER TABLE hero_banner_content ADD COLUMN subtitle_ar text DEFAULT '';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_banner_content' AND column_name = 'description_ar') THEN
        ALTER TABLE hero_banner_content ADD COLUMN description_ar text DEFAULT '';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_banner_content' AND column_name = 'button_text_ar') THEN
        ALTER TABLE hero_banner_content ADD COLUMN button_text_ar text DEFAULT '';
      END IF;
    END $$;

    -- Update existing rows with default Arabic translations
    UPDATE hero_banner_content
    SET
      title_ar = COALESCE(title_ar, 'شوب ميمكس - وجهتك النهائية للتسوق'),
      subtitle_ar = COALESCE(subtitle_ar, 'اكتشف منتجات وعروض مذهلة.'),
      description_ar = COALESCE(description_ar, 'اكتشف منتجات وعروض مذهلة.'),
      button_text_ar = COALESCE(button_text_ar, 'تسوق الآن')
    WHERE title_ar IS NULL OR title_ar = '';
