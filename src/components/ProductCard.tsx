import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onProductClick }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  const hasDiscount = product.discount_percentage > 0;
  const discountedPrice = hasDiscount 
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicked(true);
    onAddToCart(product);
    setIsAdded(true);

    setTimeout(() => {
      setIsClicked(false);
    }, 200);

    setTimeout(() => {
      setIsAdded(false);
    }, 500);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full">
      <div className="relative overflow-hidden">
        <img
          onClick={() => onProductClick(product)}
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="text-pink-600 hover:text-pink-700 dark:text-pink-400 transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
          {product.stock < 10 && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              Low Stock
            </div>
          )}
          {product.is_new === true && (
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              New
            </div>
          )}
          {hasDiscount && (
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
              {product.discount_percentage}% Off
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow" onClick={() => onProductClick(product)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{product.category}</span>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-grow">{product.description}</p>

        <div className="flex flex-col items-center justify-center mt-auto">
          <div className="flex items-center space-x-2 mb-3 flex-wrap justify-center">
            {hasDiscount && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-xl font-bold text-pink-600">
              {formatPrice(hasDiscount ? discountedPrice : product.price)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">MEMEXSOL</span>
          </div>
          <button
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-lg transition-all duration-200 transform text-sm font-medium w-full text-center
              ${isAdded ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'}
              ${isClicked ? 'scale-95' : 'hover:scale-105'}`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
