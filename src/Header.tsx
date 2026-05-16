
interface HeaderProps {
  activeCategory: string;
  onCategoryClick: (category: string) => void;
}

export default function Header({ activeCategory, onCategoryClick }: HeaderProps) {
  return (
    <header className="header glass">
      <div className="logo">
        <span className="brand-text">HẢI<br/>SPORT</span>
      </div>
      <div className="category-banners">
        {['Trang Chủ', 'Giới thiệu', 'Bóng đá', 'Cầu lông', 'Bóng chuyền', 'Pickleball', 'Khác'].map(cat => (
          <button
            key={cat}
            className={`banner-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </header>
  );
}
