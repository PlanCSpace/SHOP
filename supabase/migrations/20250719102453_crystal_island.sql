/*
  # Insert All Products Data

  1. Products Data
    - Insert 24 premium cosmetic products
    - Includes skincare, makeup, and fragrance categories
    - Each product has name, price, image, category, description, and stock

  2. Categories
    - skincare: Face and body care products
    - makeup: Cosmetic and beauty products  
    - fragrance: Perfumes and scents
*/

-- Insert all 24 products
INSERT INTO products (name, price, image, category, description, stock) VALUES
('Luxury Hydrating Serum', 150, 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 'Advanced hydrating serum with hyaluronic acid and vitamin C for radiant skin.', 25),
('Matte Liquid Lipstick', 45, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 'Long-lasting matte liquid lipstick in premium shades.', 50),
('Anti-Aging Night Cream', 220, 'https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 'Intensive anti-aging night cream with retinol and peptides.', 15),
('Velvet Foundation', 85, 'https://images.pexels.com/photos/3373714/pexels-photo-3373714.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 'Full coverage velvet foundation for all skin types.', 30),
('Luxury Perfume', 320, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', 'fragrance', 'Exclusive luxury perfume with floral and woody notes.', 20),
('Vitamin C Brightening Mask', 75, 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 'Brightening face mask with vitamin C and natural extracts.', 40),
('Rose Gold Highlighter', 65, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 'Luminous rose gold highlighter for a radiant glow.', 35),
('Collagen Eye Cream', 180, 'https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 'Anti-aging eye cream with marine collagen and peptides.', 22),
('Vanilla Orchid Perfume', 280, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', 'fragrance', 'Exotic vanilla orchid fragrance with warm undertones.', 18),
('Waterproof Mascara', 55, 'https://images.pexels.com/photos/3373714/pexels-photo-3373714.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 'Long-lasting waterproof mascara for dramatic lashes.', 45),
('Hyaluronic Acid Toner', 95, 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 'Hydrating toner with hyaluronic acid and botanical extracts.', 38),
('Citrus Bloom Perfume', 240, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', 'fragrance', 'Fresh citrus bloom fragrance with energizing notes.', 28),
('Contouring Palette', 120, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 'Professional contouring palette with 8 versatile shades.', 32),
('Retinol Night Serum', 195, 'https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 'Powerful retinol serum for overnight skin renewal.', 16),
('Musk & Amber Perfume', 350, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', 'fragrance', 'Sophisticated musk and amber fragrance for evening wear.', 12),
('Lip Gloss Set', 85, 'https://images.pexels.com/photos/3373714/pexels-photo-3373714.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 'Set of 6 glossy lip colors with mirror finish.', 42),
('Nourishing Hair Mask', 95, 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 'Deep conditioning hair mask with argan oil and keratin for silky smooth hair.', 28),
('Bronzing Powder', 75, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 'Natural bronzing powder for a sun-kissed glow all year round.', 33),
('Exfoliating Body Scrub', 65, 'https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 'Gentle exfoliating scrub with sea salt and essential oils for smooth skin.', 45),
('Waterproof Eyeliner', 35, 'https://images.pexels.com/photos/3373714/pexels-photo-3373714.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', 'Long-lasting waterproof eyeliner for precise and bold eye definition.', 55),
('Jasmine Night Perfume', 290, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', 'fragrance', 'Enchanting jasmine perfume with mysterious night blooming notes.', 19),
('Moisturizing Day Cream', 125, 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400', 'skincare', 'Lightweight day cream with SPF 30 protection and hydrating ingredients.', 37),
('Eyeshadow Palette', 110, 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', 'makeup', '12-color eyeshadow palette with matte and shimmer finishes.', 26),
('Ocean Breeze Perfume', 260, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=400', 'fragrance', 'Fresh ocean breeze fragrance with aquatic and marine notes.', 23)
ON CONFLICT (id) DO NOTHING;
