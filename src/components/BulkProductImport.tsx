import React, { useState } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { Product, Category } from '../types';
import { convertUsdToMemexSol } from '../utils/currencyConverter';

interface BulkProductImportProps {
  categories: Category[];
  onBulkAddProducts: (products: Omit<Product, 'id'>[]) => void;
}

const BulkProductImport: React.FC<BulkProductImportProps> = ({
  categories,
  onBulkAddProducts
}) => {
  const [csvData, setCsvData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [previewProducts, setPreviewProducts] = useState<Omit<Product, 'id'>[]>([]);
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');

  const downloadTemplate = () => {
    const headers = ['name', 'product_code', 'barcode', 'price_usd', 'cost_usd', 'image', 'category', 'description', 'stock'];
    const sampleData = [
      'Sample Product,PRD-001234,1234567890123,29.99,15.00,https://example.com/image.jpg,skincare,Sample description,100'
    ];
    
    const csvContent = [headers.join(','), ...sampleData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportProducts = async () => {
    try {
      // Fetch all products from Supabase
      const { supabase } = await import('../lib/supabase');
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

      if (error) throw error;

      if (!products || products.length === 0) {
        alert('No products found to export');
        return;
      }

      // Convert to CSV format
      const headers = ['id', 'name', 'price', 'cost_usd', 'image', 'category', 'description', 'stock', 'created_at'];
      const csvRows = [
        headers.join(','),
        ...products.map(product => [
          product.id,
          `"${product.name.replace(/"/g, '""')}"`,
          product.price,
          product.cost_usd || '',
          `"${product.image}"`,
          product.category,
          `"${product.description.replace(/"/g, '""')}"`,
          product.stock,
          product.created_at
        ].join(','))
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert(`Successfully exported ${products.length} products!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting products. Please try again.');
    }
  };

  const parseCsv = (csv: string): string[][] => {
    const lines = csv.trim().split('\n');
    return lines.map(line => {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
  };

  const validateAndParseProducts = async (csvData: string): Promise<{ products: Omit<Product, 'id'>[], errors: string[] }> => {
    const errors: string[] = [];
    const products: Omit<Product, 'id'>[] = [];
    
    try {
      const rows = parseCsv(csvData);
      const headers = rows[0].map(h => h.toLowerCase().trim());
      
      // Validate headers
      const requiredHeaders = ['name', 'product_code', 'price_usd', 'image', 'category', 'description', 'stock'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
        return { products, errors };
      }
      
      // Process data rows
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length === 0 || row.every(cell => !cell.trim())) continue;
        
        try {
          const rowData: any = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index]?.trim() || '';
          });
          
          // Validate required fields
          if (!rowData.name) {
            errors.push(`Row ${i + 1}: Name is required`);
            continue;
          }
          
          if (!rowData.product_code) {
            errors.push(`Row ${i + 1}: Product code is required`);
            continue;
          }
          
          if (!rowData.price_usd || isNaN(parseFloat(rowData.price_usd))) {
            errors.push(`Row ${i + 1}: Valid price_usd is required`);
            continue;
          }
          
          if (!rowData.category) {
            errors.push(`Row ${i + 1}: Category is required`);
            continue;
          }
          
          // Validate category exists
          const categoryExists = categories.some(cat => 
            cat.slug === rowData.category || 
            cat.name_en.toLowerCase() === rowData.category.toLowerCase()
          );
          
          if (!categoryExists) {
            errors.push(`Row ${i + 1}: Invalid category "${rowData.category}"`);
            continue;
          }
          
          // Convert USD price to MEMEXSOL
          const priceInMemexSol = await convertUsdToMemexSol(parseFloat(rowData.price_usd));
          
          const product: Omit<Product, 'id'> = {
            name: rowData.name,
            product_code: rowData.product_code,
            barcode: rowData.barcode || undefined,
            price: priceInMemexSol,
            cost_usd: rowData.cost_usd ? parseFloat(rowData.cost_usd) : undefined,
            image: rowData.image || 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400',
            category: rowData.category,
            description: rowData.description || '',
            stock: parseInt(rowData.stock) || 0
          };
          
          products.push(product);
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      errors.push(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return { products, errors };
  };

  const handlePreview = async () => {
    if (!csvData.trim()) {
      setErrors(['Please enter CSV data']);
      return;
    }
    
    setIsProcessing(true);
    setErrors([]);
    
    const { products, errors } = await validateAndParseProducts(csvData);
    
    setErrors(errors);
    setPreviewProducts(products);
    setIsProcessing(false);
  };

  const handleImport = () => {
    if (previewProducts.length === 0) {
      setErrors(['No valid products to import']);
      return;
    }
    
    onBulkAddProducts(previewProducts);
    setCsvData('');
    setPreviewProducts([]);
    setErrors([]);
    alert(`Successfully imported ${previewProducts.length} products!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Bulk Product Management</h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('import')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'import'
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Upload size={16} />
          <span>Import Products</span>
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'export'
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Download size={16} />
          <span>Export Products</span>
        </button>
      </div>

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <Package className="mx-auto text-blue-600 mb-4" size={48} />
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Export All Products</h4>
            <p className="text-blue-800 mb-4">
              Download all products as a CSV file for backup or external processing.
            </p>
            <button
              onClick={exportProducts}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <Download size={20} />
              <span>Export All Products</span>
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Export Information</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Exports all products with complete information</li>
              <li>• Includes product ID, name, price, cost, category, description, stock, and creation date</li>
              <li>• CSV format compatible with Excel and other spreadsheet applications</li>
              <li>• File name includes current date for easy organization</li>
            </ul>
          </div>
        </div>
      )}

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              <span>Download Template</span>
            </button>
          </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Import Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Download the CSV template to see the required format</li>
          <li>• Required columns: name, product_code, price_usd, image, category, description, stock</li>
          <li>• Optional columns: barcode, cost_usd (for profit tracking)</li>
          <li>• Prices should be in USD and will be automatically converted to MEMEXSOL</li>
          <li>• Categories must match existing category slugs</li>
          <li>• Product codes must be unique</li>
        </ul>
      </div>

      {/* Available Categories */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Available Categories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <span key={category.id} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border">
              {category.slug}
            </span>
          ))}
        </div>
      </div>

      {/* CSV Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText size={16} className="inline mr-2" />
          CSV Data
        </label>
        <textarea
          value={csvData}
          onChange={(e) => setCsvData(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
          placeholder="Paste your CSV data here or upload a file..."
        />
      </div>

      {/* File Upload */}
      <div>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                setCsvData(event.target?.result as string);
              };
              reader.readAsText(file);
            }
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handlePreview}
          disabled={isProcessing || !csvData.trim()}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isProcessing || !csvData.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Upload size={16} />
              <span>Preview Import</span>
            </>
          )}
        </button>

        {previewProducts.length > 0 && (
          <button
            onClick={handleImport}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
          >
            <CheckCircle size={16} />
            <span>Import {previewProducts.length} Products</span>
          </button>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="text-red-600 mr-2" size={16} />
            <h4 className="font-medium text-red-900">Import Errors</h4>
          </div>
          <ul className="text-sm text-red-800 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview */}
      {previewProducts.length > 0 && (
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="text-green-600 mr-2" size={16} />
            <h4 className="font-medium text-green-900">Preview ({previewProducts.length} products)</h4>
          </div>
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-green-200">
                  <th className="text-left py-2">Name</th>
                 <th className="text-left py-2">Code</th>
                  <th className="text-left py-2">Price (MEMEXSOL)</th>
                  <th className="text-left py-2">Cost (USD)</th>
                  <th className="text-left py-2">Category</th>
                  <th className="text-left py-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {previewProducts.slice(0, 10).map((product, index) => (
                  <tr key={index} className="border-b border-green-100">
                    <td className="py-1">{product.name}</td>
                    <td className="py-1 font-mono text-xs">{product.product_code}</td>
                    <td className="py-1">{product.price.toFixed(2)}</td>
                    <td className="py-1">{product.cost_usd ? `$${product.cost_usd}` : 'N/A'}</td>
                    <td className="py-1">{product.category}</td>
                    <td className="py-1">{product.stock}</td>
                  </tr>
                ))}
                {previewProducts.length > 10 && (
                  <tr>
                    <td colSpan={6} className="py-2 text-center text-gray-600">
                      ... and {previewProducts.length - 10} more products
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default BulkProductImport;
