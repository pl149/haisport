import { useState } from 'react';
import AdminLayout from './AdminLayout';
import ProductListAdmin from './ProductListAdmin';
import SiteSettingsAdmin from './SiteSettingsAdmin';

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('products');

  return (
    <AdminLayout activeMenu={activeMenu} onMenuChange={setActiveMenu}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeMenu === 'products' ? 'Quản Lý Sản Phẩm' : 'Cấu Hình Web'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeMenu === 'products' 
              ? 'Quản lý danh sách sản phẩm, thêm, sửa, xóa.' 
              : 'Quản lý banner trang chủ, giới thiệu, và thông tin founder của trang web.'}
          </p>
        </div>
        
        {activeMenu === 'products' ? <ProductListAdmin /> : <SiteSettingsAdmin />}
      </div>
    </AdminLayout>
  );
}
