import { ReactNode, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
  children: ReactNode;
  activeMenu?: string;
  onMenuChange?: (menu: string) => void;
}

export default function AdminLayout({ children, activeMenu, onMenuChange }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600 tracking-tight">Hải Sport Admin</span>
            </div>
            {/* Desktop menu */}
            <div className="hidden sm:flex sm:items-center">
              <span className="text-sm font-medium text-gray-500 mr-4">Quản trị viên</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors"
              >
                Đăng Xuất
              </button>
            </div>
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Mở menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white">
            <div className="pt-2 pb-3 space-y-1 px-4 border-b border-gray-100">
              <button
                onClick={() => { onMenuChange?.('products'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${activeMenu === 'products' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Quản Lý Sản Phẩm
              </button>
              <button
                onClick={() => { onMenuChange?.('settings'); setIsMobileMenuOpen(false); }}
                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${activeMenu === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Cấu Hình Web
              </button>
            </div>
            <div className="pt-2 pb-3 space-y-1 px-4">
              <div className="block px-3 py-2 text-base font-medium text-gray-500">
                Quản trị viên
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Đăng Xuất
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block flex-shrink-0">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => onMenuChange?.('products')}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeMenu === 'products' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50 font-medium'
              }`}
            >
              Quản Lý Sản Phẩm
            </button>
            <button
              onClick={() => onMenuChange?.('settings')}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                activeMenu === 'settings' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50 font-medium'
              }`}
            >
              Cấu Hình Web
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
