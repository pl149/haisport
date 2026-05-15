import { useState, useEffect } from 'react';
import './AboutSection.css';

// PHẦN 3: TƯ DUY ADMIN & CẤU TRÚC DỮ LIỆU
// Thời gian chuyển ảnh (ms) được đặt ở biến riêng biệt dễ tùy chỉnh
export const aboutConfig = {
  slideshowInterval: 3000, 
};

// Dữ liệu nội dung Giới thiệu & Thành tích
export const aboutData = {
  ownerPhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=800&q=80',
  ownerName: 'Hải Sport - Founder',
  experience: 'Với hơn 10 năm đam mê và hoạt động trong lĩnh vực thể thao, chúng tôi hiểu rõ từng nhu cầu của người chơi từ phong trào đến chuyên nghiệp. Khởi nguồn từ tình yêu mãnh liệt với quả bóng tròn, Hải Sport đã phát triển thành điểm đến tin cậy của cộng đồng yêu thể thao.',
  achievements: [
    'Phục vụ hơn 50,000+ khách hàng trên toàn quốc.',
    'Nhà tài trợ chính cho 20+ giải đấu thể thao cộng đồng.',
    'Đối tác uy tín của các thương hiệu hàng đầu: Nike, Adidas, Yonex...',
    'Đạt danh hiệu "Cửa hàng xuất sắc" năm 2023.'
  ],
  slideshowImages: [
    'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200&q=80',
    'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=1200&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
    'https://images.unsplash.com/photo-1628891435222-06592e071720?w=1200&q=80'
  ]
};

export default function AboutSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Logic slideshow tự động
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % aboutData.slideshowImages.length);
    }, aboutConfig.slideshowInterval);
    
    // Clear interval khi component unmount để tối ưu hiệu năng (cleanup)
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="about-section glass">
      {/* Cột Trái: Thông tin bản thân */}
      <div className="about-left">
        <div className="owner-photo-wrapper">
          <img src={aboutData.ownerPhoto} alt="Chủ shop Hải Sport" className="owner-photo" />
        </div>
        <div className="owner-info">
          <h2>{aboutData.ownerName}</h2>
          <p className="experience">{aboutData.experience}</p>
          <ul className="achievements">
            {aboutData.achievements.map((item, index) => (
              <li key={index}>
                <span className="icon-star">⭐</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cột Phải: Slideshow thành tích/công việc */}
      <div className="about-right">
        <div className="slideshow-container">
          {aboutData.slideshowImages.map((img, index) => (
            <div 
              key={index} 
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="slide-dots">
            {aboutData.slideshowImages.map((_, index) => (
              <button 
                key={index} 
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
