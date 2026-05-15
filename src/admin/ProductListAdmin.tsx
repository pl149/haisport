import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ProductForm, { type Product } from './ProductForm';

export default function ProductListAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States cho Modal Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        throw error;
      }
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối Supabase hoặc bảng "products" chưa tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`);
    if (!isConfirmed) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== id));
      alert('Đã xóa sản phẩm thành công!');
    } catch (err: any) {
      alert(`Lỗi khi xóa: ${err.message}`);
    }
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchProducts(); // Tải lại danh sách sau khi thêm/sửa thành công
  };

  // Helper format tiền tệ VNĐ
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading && products.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500 animate-pulse">
        Đang tải dữ liệu sản phẩm...
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 relative">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="text-lg leading-6 font-semibold text-gray-900">Danh Sách Sản Phẩm</h3>
        <button 
          onClick={openAddForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm sản phẩm mới
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm border-b border-red-100">
          <span className="font-bold">Lỗi:</span> {error}
        </div>
      )}

      {/* Dạng Bảng hiển thị trên Laptop/Tablet */}
      <div className="hidden md:block overflow-x-auto min-h-[400px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Banners
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Danh Mục SP
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Hình Ảnh
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tên Sản Phẩm
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Giá Gốc
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length > 0 ? products.map((product) => (
              <tr key={product.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {String(product.id).slice(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.main_category || 'Không phân loại'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.sub_category || 'Không phân loại'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-12 rounded overflow-hidden bg-gray-100 border border-gray-200">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">Trống</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 line-through">
                  {product.original_price ? formatPrice(product.original_price) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => openEditForm(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id!, product.name)}
                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors font-semibold"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm bg-gray-50">
                  {loading ? 'Đang tải...' : 'Chưa có sản phẩm nào hoặc chưa kết nối bảng Supabase.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dạng Card hiển thị trên Mobile */}
      <div className="md:hidden divide-y divide-gray-200 min-h-[400px]">
        {products.length > 0 ? products.map((product) => (
          <div key={product.id} className="p-4 flex gap-4 bg-white hover:bg-gray-50 transition-colors">
            <div className="h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">Trống</div>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 line-clamp-2">{product.name}</p>
                <p className="text-xs text-gray-500 mt-1">{product.main_category} / {product.sub_category}</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-sm font-semibold text-blue-600">{formatPrice(product.price)}</p>
                  {product.original_price && (
                    <p className="text-xs text-gray-500 line-through">{formatPrice(product.original_price)}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-3">
                <button 
                  onClick={() => openEditForm(product)}
                  className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded px-3 py-1 text-sm font-semibold"
                >
                  Sửa
                </button>
                <button 
                  onClick={() => handleDelete(product.id!, product.name)}
                  className="text-red-600 bg-red-50 hover:bg-red-100 rounded px-3 py-1 text-sm font-semibold"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="p-8 text-center text-gray-500 text-sm bg-gray-50">
            {loading ? 'Đang tải...' : 'Chưa có sản phẩm nào.'}
          </div>
        )}
      </div>

      {/* Popup Form Thêm/Sửa Sản Phẩm */}
      {isFormOpen && (
        <ProductForm 
          initialData={editingProduct} 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={handleFormSuccess} 
        />
      )}
    </div>
  );
}
