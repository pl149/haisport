import { useEffect, useState } from 'react';
import HomeSlider from './HomeSlider';
import { supabase } from './lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string;
  main_category: string;
}

interface HomeViewProps {
  onImageClick?: (url: string) => void;
}

export default function HomeView({ onImageClick }: HomeViewProps) {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch best sellers: is_best_seller = true, limit 8
        const { data: bestSellersData } = await supabase
          .from('products')
          .select('*')
          .eq('is_best_seller', true)
          .order('id', { ascending: false })
          .limit(8);
          
        if (bestSellersData) {
          setBestSellers(bestSellersData);
        }

        // Fetch promo products: original_price not null and > price
        const { data: promoDataRaw } = await supabase
          .from('products')
          .select('*')
          .not('original_price', 'is', null)
          .order('id', { ascending: false });
          
        if (promoDataRaw) {
          const validPromos = promoDataRaw.filter(p => p.original_price && p.original_price > p.price).slice(0, 8);
          setPromoProducts(validPromos);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="home-view">
      <HomeSlider />
      
      <section id="best-sellers" className="home-section">
        <h2 className="section-title">SẢN PHẨM BÁN CHẠY</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">Đang tải sản phẩm...</div>
        ) : (
          <div className="product-grid">
            {bestSellers.map(product => (
              <div key={product.id} className="product-card glass">
                <div className="image-wrapper" onClick={() => onImageClick && onImageClick(product.image_url || 'https://via.placeholder.com/500')}>
                  <img src={product.image_url || 'https://via.placeholder.com/500'} alt={product.name} />
                </div>
                <div className="product-info">
                  <span className="product-cat">{product.main_category}</span>
                  <h4 className="product-name">{product.name}</h4>
                  <div className="price-row">
                    <span className="product-price">{formatPrice(product.price)}</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="old-price">{formatPrice(product.original_price)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {bestSellers.length === 0 && <div className="col-span-full text-center text-gray-500 py-4">Chưa có sản phẩm bán chạy.</div>}
          </div>
        )}
      </section>

      <section id="promo-products" className="home-section">
        <h2 className="section-title">SẢN PHẨM ƯU ĐÃI</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">Đang tải sản phẩm...</div>
        ) : (
          <div className="product-grid">
            {promoProducts.map(product => (
              <div key={product.id} className="product-card glass">
                <div className="image-wrapper" onClick={() => onImageClick && onImageClick(product.image_url || 'https://via.placeholder.com/500')}>
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
            ))}
            {promoProducts.length === 0 && <div className="col-span-full text-center text-gray-500 py-4">Chưa có sản phẩm ưu đãi.</div>}
          </div>
        )}
      </section>
    </div>
  );
}
