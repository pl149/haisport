import { useState, useEffect } from 'react';

const homeImages = [
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&q=80',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80'
];

export default function HomeSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % homeImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
