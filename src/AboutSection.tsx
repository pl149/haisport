import { useState, useEffect } from 'react';
import './AboutSection.css';
import { supabase } from './lib/supabase';

// PHẦN 3: TƯ DUY ADMIN & CẤU TRÚC DỮ LIỆU
// Thời gian chuyển ảnh (ms) được đặt ở biến riêng biệt dễ tùy chỉnh
export const aboutConfig = {
  slideshowInterval: 3000, 
};

// Dữ liệu nội dung Giới thiệu & Thành tích
export const aboutData = {
  ownerName: 'Hải Sport - Founder',
  achievements: [
    'Phục vụ hơn 50,000+ khách hàng trên toàn quốc.',
    'Nhà tài trợ chính cho 20+ giải đấu thể thao cộng đồng.',
    'Đối tác uy tín của các thương hiệu hàng đầu: Nike, Adidas, Yonex...',
    'Đạt danh hiệu "Cửa hàng xuất sắc" năm 2023.'
  ],
  defaultSlideshow: [
    'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200&q=80',
    'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=1200&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
    'https://images.unsplash.com/photo-1628891435222-06592e071720?w=1200&q=80'
  ],
  defaultOwnerPhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=800&q=80',
  defaultExperience: 'Với hơn 10 năm đam mê và hoạt động trong lĩnh vực thể thao, chúng tôi hiểu rõ từng nhu cầu của người chơi từ phong trào đến chuyên nghiệp. Khởi nguồn từ tình yêu mãnh liệt với quả bóng tròn, Hải Sport đã phát triển thành điểm đến tin cậy của cộng đồng yêu thể thao.'
};

export default function AboutSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [founderInfo, setFounderInfo] = useState({ image_url: '', content_text: '' });
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (error) throw error;

        if (data) {
          const slider = data
            .filter(s => s.section_key === 'about_slider' && s.image_url)
            .map(s => s.image_url as string);
          setSliderImages(slider);

          const founder = data.find(s => s.section_key === 'founder_info');
          if (founder) {
            setFounderInfo({
              image_url: founder.image_url || '',
              content_text: founder.content_text || ''
            });
          }
        }
      } catch (err) {
        console.error("Error fetching about data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const activeSliderImages = sliderImages.length > 0 ? sliderImages : aboutData.defaultSlideshow;

  useEffect(() => {
    // Logic slideshow tự động
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSliderImages.length);
    }, aboutConfig.slideshowInterval);
    
    // Clear interval khi component unmount để tối ưu hiệu năng (cleanup)
    return () => clearInterval(timer);
  }, [activeSliderImages.length]);

  return (
    <section className="about-section glass">
      {/* Cột Trái: Thông tin bản thân */}
      <div className="about-left">
        <div className="owner-photo-wrapper">
          <img 
            src={founderInfo.image_url || aboutData.defaultOwnerPhoto} 
            alt="Chủ shop Hải Sport" 
            className="owner-photo" 
          />
        </div>
        <div className="owner-info">
          <h2>{aboutData.ownerName}</h2>
          <p className="experience">{founderInfo.content_text || aboutData.defaultExperience}</p>
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
          {activeSliderImages.map((img, index) => (
            <div 
              key={index} 
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="slide-dots">
            {activeSliderImages.map((_, index) => (
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
