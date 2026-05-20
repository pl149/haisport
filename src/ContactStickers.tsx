
export default function ContactStickers() {
  return (
    <div className="floating-contact-container">
      <a href="tel:0967566358" className="floating-btn phone-btn">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      </a>
      <a
        href="https://www.facebook.com/gioan.hai.2025"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn fb-btn"
      >
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.923 1.488 5.518 3.824 7.237v3.504l3.486-1.905c.854.237 1.761.364 2.69.364 5.523 0 10-4.145 10-9.259S17.523 2 12 2zm1.096 12.361l-2.775-2.966-5.412 2.966 5.962-6.335 2.832 2.966 5.35-2.966-5.957 6.335z" />
        </svg>
      </a>
    </div>
  );
}
