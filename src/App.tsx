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
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

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
        <HomeView onImageClick={setSelectedImages} />
      ) : (
        <ProductList
          activeCategory={activeCategory}
          activeType={activeType}
          onTypeClick={handleTypeClick}
          onImageClick={setSelectedImages}
        />
      )}

      <ContactStickers />

      {/* Image Full Size Modal */}
      {selectedImages && selectedImages.length > 0 && (
        <div className="image-modal-overlay" onClick={() => { setSelectedImages(null); setCurrentImageIndex(0); }}>
          <button className="image-modal-close" onClick={() => { setSelectedImages(null); setCurrentImageIndex(0); }}>&times;</button>
          
          {selectedImages.length > 1 && (
            <button 
              className="modal-nav-btn modal-prev-btn" 
              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev - 1 + selectedImages.length) % selectedImages.length); }}
            >
              &#10094;
            </button>
          )}

          <img src={selectedImages[currentImageIndex]} alt="Full size" className="image-modal-content" onClick={(e) => e.stopPropagation()} />

          {selectedImages.length > 1 && (
            <button 
              className="modal-nav-btn modal-next-btn" 
              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev + 1) % selectedImages.length); }}
            >
              &#10095;
            </button>
          )}
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
