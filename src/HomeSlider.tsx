import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function HomeSlider() {
  const [homeImages, setHomeImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80'
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchHomeSliders = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('section_key', 'home_slider');

        if (!error && data && data.length > 0) {
          // Map mảng dữ liệu lấy về để trích xuất ra danh sách các link image_url
          const urls = data.map((item: any) => item.image_url).filter(Boolean);
          if (urls.length > 0) {
            setHomeImages(urls);
          }
        }
      } catch (err) {
        console.error('Lỗi khi fetch banner trang chủ:', err);
      }
    };
    fetchHomeSliders();
  }, []);

  useEffect(() => {
    if (homeImages.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % homeImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [homeImages.length]);

  const scrollToBestSellers = () => {
    document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="home-slider-container">
      {homeImages.map((img, index) => (
        <div
          key={index}
          className={`home-slide ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      <div className="home-slider-content">
        <h1 className="hero-title">CHÀO MỪNG ĐẾN VỚI HẢI SPORT</h1>
        <p className="hero-subtitle">Khám phá bộ sưu tập thể thao mới nhất</p>
        <button className="hero-btn" onClick={scrollToBestSellers}>
          Xem Sản Phẩm Bán Chạy
        </button>
      </div>
    </section>
  );
}
