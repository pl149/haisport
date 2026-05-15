import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Header';

import AboutSection from './AboutSection';
import ProductList from './ProductList';
import ContactStickers from './ContactStickers';
import HomeView from './HomeView';

import AdminLogin from './admin/AdminLogin';
import ProtectedRoute from './admin/ProtectedRoute';
import AdminDashboard from './admin/AdminDashboard';

function ShopApp() {
  const [activeCategory, setActiveCategory] = useState<string>('Trang Chủ');
  const [activeType, setActiveType] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    if (activeCategory === category) {
      if (category !== 'Trang Chủ') {
        setActiveCategory('Trang Chủ');
      }
    } else {
      setActiveCategory(category);
    }
    setActiveType(null); // reset type khi đổi mục
  };

  const handleTypeClick = (type: string) => {
    setActiveType(type === activeType ? null : type);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory, activeType]);

  return (
    <div className="app-container">
      <Header
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />

      {activeCategory === 'Giới thiệu' ? (
        <AboutSection />
      ) : activeCategory === 'Trang Chủ' ? (
        <HomeView onImageClick={setSelectedImage} />
      ) : (
        <ProductList
          activeCategory={activeCategory}
          activeType={activeType}
          onTypeClick={handleTypeClick}
          onImageClick={setSelectedImage}
        />
      )}

      <ContactStickers />

      {/* Image Full Size Modal */}
      {selectedImage && (
        <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
          <button className="image-modal-close" onClick={() => setSelectedImage(null)}>&times;</button>
          <img src={selectedImage} alt="Full size" className="image-modal-content" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<ShopApp />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
