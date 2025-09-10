/*
  # Seed initial data for the e-commerce application

  1. Categories
    - Insert predefined categories with Turkish and English names
    
  2. Products  
    - Insert sample products with proper categorization
    - Include product codes, barcodes, pricing, and stock information
    
  3. Admin Settings
    - Set default shipping costs and free shipping thresholds
    
  4. Hero Banner Content
    - Set default banner content for both languages
*/

-- Insert categories
INSERT INTO categories (name_tr, name_en, slug) VALUES
('Cilt Bakımı', 'Skincare', 'skincare'),
('Makyaj', 'Makeup', 'makeup'),
('Parfüm', 'Fragrance', 'fragrance'),
('Saç Bakımı', 'Hair Care', 'hair-care'),
('Vücut Bakımı', 'Body Care', 'body-care')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, product_code, barcode, price, cost_usd, image, category, category_id, description, stock) VALUES
('Luxury Hydrating Serum', 'PRD-001001', '1234567890001', 150, 75, 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 1, 'Advanced hydrating serum with hyaluronic acid and vitamin C for radiant skin.', 25),
('Matte Liquid Lipstick', 'PRD-002001', '1234567890002', 45, 22, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 2, 'Long-lasting matte liquid lipstick in premium shades.', 50),
('Anti-Aging Night Cream', 'PRD-001002', '1234567890003', 220, 110, 'https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 1, 'Intensive anti-aging night cream with retinol and peptides.', 15),
('Velvet Foundation', 'PRD-002002', '1234567890004', 85, 42, 'https://images.pexels.com/photos/3373714/pexels-photo-3373714.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 2, 'Full coverage velvet foundation for all skin types.', 30),
('Luxury Perfume', 'PRD-003001', '1234567890005', 320, 160, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', 'fragrance', 3, 'Exclusive luxury perfume with floral and woody notes.', 20),
('Vitamin C Brightening Mask', 'PRD-001003', '1234567890006', 75, 37, 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 1, 'Brightening face mask with vitamin C and natural extracts.', 40),
('Rose Gold Highlighter', 'PRD-002003', '1234567890007', 65, 32, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 2, 'Luminous rose gold highlighter for a radiant glow.', 35),
('Collagen Eye Cream', 'PRD-001004', '1234567890008', 180, 90, 'https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 1, 'Anti-aging eye cream with marine collagen and peptides.', 22),
('Vanilla Orchid Perfume', 'PRD-003002', '1234567890009', 280, 140, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', 'fragrance', 3, 'Exotic vanilla orchid fragrance with warm undertones.', 18),
('Waterproof Mascara', 'PRD-002004', '1234567890010', 55, 27, 'https://images.pexels.com/photos/3373714/pexels-photo-3373714.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 2, 'Long-lasting waterproof mascara for dramatic lashes.', 45),
('Hyaluronic Acid Toner', 'PRD-001005', '1234567890011', 95, 47, 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 1, 'Hydrating toner with hyaluronic acid and botanical extracts.', 38),
('Citrus Bloom Perfume', 'PRD-003003', '1234567890012', 240, 120, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', 'fragrance', 3, 'Fresh citrus bloom fragrance with energizing notes.', 28),
('Contouring Palette', 'PRD-002005', '1234567890013', 120, 60, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 2, 'Professional contouring palette with 8 versatile shades.', 32),
('Retinol Night Serum', 'PRD-001006', '1234567890014', 195, 97, 'https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 1, 'Powerful retinol serum for overnight skin renewal.', 16),
('Musk & Amber Perfume', 'PRD-003004', '1234567890015', 350, 175, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', 'fragrance', 3, 'Sophisticated musk and amber fragrance for evening wear.', 12),
('Lip Gloss Set', 'PRD-002006', '1234567890016', 85, 42, 'https://images.pexels.com/photos/3373714/pexels-photo-3373714.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 2, 'Set of 6 glossy lip colors with mirror finish.', 42),
('Nourishing Hair Mask', 'PRD-004001', '1234567890017', 95, 47, 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400', 'hair-care', 4, 'Deep conditioning hair mask with argan oil and keratin for silky smooth hair.', 28),
('Bronzing Powder', 'PRD-002007', '1234567890018', 75, 37, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 2, 'Natural bronzing powder for a sun-kissed glow all year round.', 33),
('Exfoliating Body Scrub', 'PRD-005001', '1234567890019', 65, 32, 'https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=400', 'body-care', 5, 'Gentle exfoliating scrub with sea salt and essential oils for smooth skin.', 45),
('Waterproof Eyeliner', 'PRD-002008', '1234567890020', 35, 17, 'https://images.pexels.com/photos/3373714/pexels-photo-3373714.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 2, 'Long-lasting waterproof eyeliner for precise and bold eye definition.', 55),
('Jasmine Night Perfume', 'PRD-003005', '1234567890021', 290, 145, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', 'fragrance', 3, 'Enchanting jasmine perfume with mysterious night blooming notes.', 19),
('Moisturizing Day Cream', 'PRD-001007', '1234567890022', 125, 62, 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 1, 'Lightweight day cream with SPF 30 protection and hydrating ingredients.', 37),
('Eyeshadow Palette', 'PRD-002009', '1234567890023', 110, 55, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 2, '12-color eyeshadow palette with matte and shimmer finishes.', 26),
('Ocean Breeze Perfume', 'PRD-003006', '1234567890024', 260, 130, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', 'fragrance', 3, 'Fresh ocean breeze fragrance with aquatic and marine notes.', 23)
ON CONFLICT (product_code) DO NOTHING;

-- Insert admin settings
INSERT INTO admin_settings (id, shipping_cost, free_shipping_threshold) VALUES
('1', 25, 500)
ON CONFLICT (id) DO UPDATE SET
shipping_cost = EXCLUDED.shipping_cost,
free_shipping_threshold = EXCLUDED.free_shipping_threshold;

-- Insert hero banner content
INSERT INTO hero_banner_content (id, title_tr, title_en, subtitle_tr, subtitle_en, button_text_tr, button_text_en, image_url) VALUES
('1', 'Doğal Güzelliğinizi', 'Discover Your', 'Keşfedin', 'Natural Beauty', 'Koleksiyonu İncele', 'Shop Collection', 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT (id) DO UPDATE SET
title_tr = EXCLUDED.title_tr,
title_en = EXCLUDED.title_en,
subtitle_tr = EXCLUDED.subtitle_tr,
subtitle_en = EXCLUDED.subtitle_en,
button_text_tr = EXCLUDED.button_text_tr,
button_text_en = EXCLUDED.button_text_en,
image_url = EXCLUDED.image_url;
