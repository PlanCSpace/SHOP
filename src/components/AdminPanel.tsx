import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Package, DollarSign, Image, FileText, Hash, Upload, Download, Tag, SlidersHorizontal, CheckCircle } from 'lucide-react';
import { Product, Category } from '../types';
import { convertUsdToMemexSol, fetchMemexSolPrice } from '../utils/currencyConverter';
import CategoryManager from './CategoryManager';
import BulkProductImport from './BulkProductImport';
import AdminHeroBannerCarouselSettings from './AdminHeroBannerCarouselSettings'; // Import the new component

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: number, product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: number) => void;
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (id: number, category: Omit<Category, 'id'>) => void;
  onDeleteCategory: (id: number) => void;
  onBulkAddProducts: (products: Omit<Product, 'id'>[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onBulkAddProducts
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'bulk' | 'banner-settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [memexSolPrice, setMemexSolPrice] = useState<number>(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // New state for success alert
  const [formData, setFormData] = useState({
    name: '',
    productCode: '',
    barcode: '',
    priceUsd: '',
    costUsd: '',
    image: '',
    category: 'skincare' as Product['category'],
    description: '',
    stock: ''
  });

  React.useEffect(() => {
    fetchMemexSolPrice().then(price => {
      setMemexSolPrice(price);
      console.log('Fetched MEMEXSOL Price:', price); // Debug log
    });
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      productCode: '',
      barcode: '',
      priceUsd: '',
      costUsd: '',
      image: '',
      category: 'skincare',
      description: '',
      stock: ''
    });
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceInMemexSol = await convertUsdToMemexSol(parseFloat(formData.priceUsd));
    console.log('Converted Price (MEMEXSOL):', priceInMemexSol); // Debug log
    
    const productData: Omit<Product, 'id'> = {
      name: formData.name,
      product_code: formData.productCode,
      barcode: formData.barcode || undefined,
      price: priceInMemexSol,
      cost_usd: parseFloat(formData.costUsd),
      image: formData.image,
      category: formData.category,
      description: formData.description,
      stock: parseInt(formData.stock)
    };

    console.log('AdminPanel: Product data prepared for update/add:', productData); // NEW Debug log

    try {
      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, productData);
      } else {
        await onAddProduct(productData);
      }
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000); // Hide after 3 seconds
    } catch (error) {
      console.error('Error saving product:', error);
      // Optionally show an error alert
    } finally {
      resetForm();
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const priceUsd = memexSolPrice > 0 ? (product.price * memexSolPrice).toFixed(2) : product.price.toString();
    setFormData({
      name: product.name,
      productCode: product.product_code,
      barcode: product.barcode || '',
      priceUsd: priceUsd,
      costUsd: product.cost_usd?.toString() || '',
      image: product.image,
      category: product.category,
      description: product.description,
      stock: product.stock.toString()
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDeleteProduct(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fade-in-down">
          <CheckCircle size={20} />
          <span>Product saved successfully!</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Admin Panel</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => { setActiveTab('products'); setIsFormOpen(true); }} // Ensure product tab is active when adding product
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package size={16} />
          <span>Products</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'categories'
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Tag size={16} />
          <span>Categories</span>
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'bulk'
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Upload size={16} />
          <span>Bulk Import</span>
        </button>
        <button
          onClick={() => setActiveTab('banner-settings')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'banner-settings'
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <SlidersHorizontal size={16} />
          <span>Banner Settings</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'categories' && (
        <CategoryManager
          categories={categories}
          onAddCategory={onAddCategory}
          onUpdateCategory={onUpdateCategory}
          onDeleteCategory={onDeleteCategory}
        />
      )}

      {activeTab === 'bulk' && (
        <BulkProductImport
          categories={categories}
          onBulkAddProducts={onBulkAddProducts}
        />
      )}

      {activeTab === 'banner-settings' && (
        <AdminHeroBannerCarouselSettings />
      )}

      {activeTab === 'products' && (
        <>
      {/* Product Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="inline mr-2" />
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash size={16} className="inline mr-2" />
                  Product Code
                </label>
                <input
                  type="text"
                  value={formData.productCode}
                  onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="PRD-001234"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Unique product identifier
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package size={16} className="inline mr-2" />
                  Barcode/SKU
                </label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="1234567890123"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Barcode or SKU (optional)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-2" />
                  Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.priceUsd}
                  onChange={(e) => setFormData({ ...formData, priceUsd: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                {formData.priceUsd && memexSolPrice > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    ≈ {(parseFloat(formData.priceUsd) / memexSolPrice).toFixed(2)} MEMEXSOL
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-2" />
                  Cost (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.costUsd}
                  onChange={(e) => setFormData({ ...formData, costUsd: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Product cost for profit calculation
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image size={16} className="inline mr-2" />
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package size={16} className="inline mr-2" />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Product['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name_en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="inline mr-2" />
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash size={16} className="inline mr-2" />
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Save size={16} />
                  <span>{editingProduct ? 'Update' : 'Add'} Product</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code/Barcode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                // Defensive check: Ensure product and product.image are not null/undefined
                if (!product || !product.image) {
                  console.warn('Skipping product due to missing data or image:', product);
                  return null; // Skip rendering this row
                }
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">{product.product_code}</div>
                      {product.barcode && (
                        <div className="text-sm text-gray-500 font-mono">{product.barcode}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-pink-600">{product.price} MEMEXSOL</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {product.cost_usd ? `$${product.cost_usd}` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}

      {products.length === 0 && activeTab === 'products' && (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600">Add your first product to get started!</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
