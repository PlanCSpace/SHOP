import { faker } from '@faker-js/faker';
import { Product } from '../types';

export const generateDemoProducts = (count: number = 10): Product[] => {
  const products: Product[] = [];
  const categories: ('skincare' | 'makeup' | 'fragrance')[] = ['skincare', 'makeup', 'fragrance'];

  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(categories);
    products.push({
      id: i + 1,
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 500, dec: 2 })),
      image: faker.image.urlLoremFlickr({ category: 'fashion', width: 640, height: 480 }),
      category: category,
      description: faker.commerce.productDescription(),
      stock: faker.number.int({ min: 0, max: 100 }),
    });
  }
  return products;
};
