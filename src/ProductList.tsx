import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

interface ProductListProps {
  activeCategory: string;
  activeType: string | null;
  onTypeClick: (type: string) => void;
  onImageClick?: (urls: string[]) => void;
}

export default function ProductList({ activeCategory, activeType, onTypeClick, onImageClick }: ProductListProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isQuanAoOpen, setIsQuanAoOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Chỉ fetch tất cả sản phẩm, không filter loại trừ "bán chạy" hay "ưu đãi"
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        if (data) setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredProducts = products.filter(p => {
    // Chuyển đổi về chữ thường để so sánh chính xác do khác biệt viết hoa (Bóng đá vs Bóng Đá)
    const matchCategory = p.main_category?.toLowerCase() === activeCategory?.toLowerCase();
    const matchType = p.sub_category?.toLowerCase() === activeType?.toLowerCase();

    if (activeCategory && activeType) {
      return matchCategory && matchType;
    }
    if (activeCategory) {
      return matchCategory;
    }
    return true;
  });

  return (
    <div className="main-content">
      {/* Sidebar Trái */}
      <aside className={`sidebar sidebar-left ${activeCategory ? 'visible' : ''} ${activeCategory === 'Bóng đá' ? 'sidebar-bong-da' : ''}`}>
        <div className="sidebar-content glass">
          <h3
            onClick={() => setExpandedSection(prev => prev === 'Trang Phục' ? null : 'Trang Phục')}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}
          >
            Trang phục <span style={{ fontSize: '0.8rem' }}>{expandedSection === 'Trang Phục' ? '▲' : '▼'}</span>
          </h3>
          {expandedSection === 'Trang Phục' && (
            <ul className="type-menu">
              <li>
                <button
                  className={`type-btn ${activeType === 'Quần áo' ? 'active' : ''}`}
                  onClick={() => {
                    onTypeClick('Quần áo');
                    setIsQuanAoOpen(!isQuanAoOpen);
                  }}
                >
                  <span className="icon">👕</span> Quần áo
                </button>
                {activeCategory === 'Bóng đá' && isQuanAoOpen && (
                  <ul className="type-menu">
                    <li className="sub-menu-item">
                      <button
                        className={`type-btn ${activeType === 'CLB' ? 'active' : ''}`}
                        onClick={() => onTypeClick('CLB')}
                      >
                        <span className="icon">🛡️</span> CLB
                      </button>
                    </li>
                    <li className="sub-menu-item">
                      <button
                        className={`type-btn ${activeType === 'Thiết Kế' ? 'active' : ''}`}
                        onClick={() => onTypeClick('Thiết Kế')}
                      >
                        <span className="icon">✨</span> Thiết Kế
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          )}

          <h3
            onClick={() => setExpandedSection(prev => prev === 'Thiết Bị' ? null : 'Thiết Bị')}
            style={{ marginTop: '2rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}
          >
            Thiết bị <span style={{ fontSize: '0.8rem' }}>{expandedSection === 'Thiết Bị' ? '▲' : '▼'}</span>
          </h3>
          {expandedSection === 'Thiết Bị' && (
            <ul className="type-menu">
              {activeCategory === 'Bóng đá' ? (
                <>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Giày' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Giày')}
                    >
                      <span className="icon">👟</span> Giày
                    </button>
                  </li>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Quả bóng' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Quả bóng')}
                    >
                      <span className="icon">⚽</span> Quả bóng
                    </button>
                  </li>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Phụ kiện' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Phụ kiện')}
                    >
                      <span className="icon">🛡️</span> Phụ kiện
                    </button>
                  </li>
                </>
              ) : activeCategory === 'Cầu lông' ? (
                <>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Giày' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Giày')}
                    >
                      <span className="icon">👟</span> Giày
                    </button>
                  </li>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Vợt' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Vợt')}
                    >
                      <span className="icon">🏸</span> Vợt
                    </button>
                  </li>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Phụ kiện' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Phụ kiện')}
                    >
                      <span className="icon">🛡️</span> Phụ kiện
                    </button>
                  </li>
                </>
              ) : activeCategory === 'Pickleball' ? (
                <>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Giày' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Giày')}
                    >
                      <span className="icon">👟</span> Giày
                    </button>
                  </li>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Vợt' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Vợt')}
                    >
                      <span className="icon">🏓</span> Vợt
                    </button>
                  </li>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Phụ kiện' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Phụ kiện')}
                    >
                      <span className="icon">🛡️</span> Phụ kiện
                    </button>
                  </li>
                </>
              ) : activeCategory === 'Bóng chuyền' ? (
                <>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Giày' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Giày')}
                    >
                      <span className="icon">👟</span> Giày
                    </button>
                  </li>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Quả bóng' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Quả bóng')}
                    >
                      <span className="icon">🏐</span> Quả bóng
                    </button>
                  </li>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Phụ kiện' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Phụ kiện')}
                    >
                      <span className="icon">🛡️</span> Phụ kiện
                    </button>
                  </li>
                </>
              ) : activeCategory === 'Khác' ? (
                <>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Giày' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Giày')}
                    >
                      <span className="icon">👟</span> Giày
                    </button>
                  </li>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Dụng cụ' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Dụng cụ')}
                    >
                      <span className="icon">⚽</span> Dụng cụ
                    </button>
                  </li>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Phụ kiện' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Phụ kiện')}
                    >
                      <span className="icon">🛡️</span> Phụ kiện
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Giày' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Giày')}
                    >
                      <span className="icon">👟</span> Giày
                    </button>
                  </li>
                  <li className="sub-menu-item">
                    <button
                      className={`type-btn ${activeType === 'Dụng cụ' ? 'active' : ''}`}
                      onClick={() => onTypeClick('Dụng cụ')}
                    >
                      <span className="icon">⚽</span> Dụng cụ
                    </button>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </aside>

      {/* Product Grid */}
      <main className={`product-section ${activeCategory ? 'with-sidebar' : ''}`}>
        <div className="section-header">
          <h2 className="section-title">
            {activeCategory
              ? `${activeCategory} ${activeType ? `/ ${activeType}` : ''}`
              : 'SẢN PHẨM NỔI BẬT'}
          </h2>
        </div>

        <div className="product-grid">
          {loading ? (
            <div className="empty-state text-gray-500 animate-pulse">Đang tải sản phẩm...</div>
          ) : filteredProducts.length > 0 ? filteredProducts.map(product => (
            <div key={product.id} className="product-card glass">
              <div className="image-wrapper" onClick={() => onImageClick && onImageClick(product.images && product.images.length > 0 ? product.images : [product.image_url || 'https://via.placeholder.com/500'])}>
                <img src={product.image_url || 'https://via.placeholder.com/500'} alt={product.name} />
              </div>
              <div className="product-info">
                <span className="product-cat">{product.main_category}</span>
                <h4 className="product-name">{product.name}</h4>
                <div className="price-row">
                  <div>
                    <span className="product-price">{formatPrice(product.price)}</span>
                    {product.original_price && <span className="old-price">{formatPrice(product.original_price)}</span>}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="empty-state">
              <p>Chưa có sản phẩm cho mục này.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
