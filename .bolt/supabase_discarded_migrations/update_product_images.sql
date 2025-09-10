/*
      # Update product images

      1. Modified Tables
        - `products`
          - Update `image` column with valid Pexels URLs for existing products.
    */

    DO $$
    BEGIN
      -- Update Luxury Hydrating Serum
      UPDATE products
      SET image = 'https://images.pexels.com/photos/6621190/pexels-photo-6621190.jpeg?auto=compress&cs=tinysrgb&w=800'
      WHERE name = 'Luxury Hydrating Serum' AND image IS DISTINCT FROM 'https://images.pexels.com/photos/6621190/pexels-photo-6621190.jpeg?auto=compress&cs=tinysrgb&w=800';

      -- Update Matte Liquid Lipstick
      UPDATE products
      SET image = 'https://images.pexels.com/photos/6621191/pexels-photo-6621191.jpeg?auto=compress&cs=tinysrgb&w=800'
      WHERE name = 'Matte Liquid Lipstick' AND image IS DISTINCT FROM 'https://images.pexels.com/photos/6621191/pexels-photo-6621191.jpeg?auto=compress&cs=tinysrgb&w=800';

      -- Update Anti-Aging Night Cream
      UPDATE products
      SET image = 'https://images.pexels.com/photos/6621192/pexels-photo-6621192.jpeg?auto=compress&cs=tinysrgb&w=800'
      WHERE name = 'Anti-Aging Night Cream' AND image IS DISTINCT FROM 'https://images.pexels.com/photos/6621192/pexels-photo-6621192.jpeg?auto=compress&cs=tinysrgb&w=800';

      -- Update Velvet Foundation
      UPDATE products
      SET image = 'https://images.pexels.com/photos/6621193/pexels-photo-6621193.jpeg?auto=compress&cs=tinysrgb&w=800'
      WHERE name = 'Velvet Foundation' AND image IS DISTINCT FROM 'https://images.pexels.com/photos/6621193/pexels-photo-6621193.jpeg?auto=compress&cs=tinysrgb&w=800';

      -- Add more product image updates as needed for other products
      -- Example for a new product if you had one:
      -- UPDATE products
      -- SET image = 'https://images.pexels.com/photos/example-new-product.jpeg?auto=compress&cs=tinysrgb&w=800'
      -- WHERE name = 'New Product Name' AND image IS DISTINCT FROM 'https://images.pexels.com/photos/example-new-product.jpeg?auto=compress&cs=tinysrgb&w=800';

    END $$;
