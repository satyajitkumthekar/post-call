export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center px-6 md:px-10"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(10, 10, 11, 0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-5 h-5 rounded-full flex-shrink-0"
            style={{
              border: '1px solid #C9A84C',
              boxShadow: '0 0 8px rgba(201,168,76,0.2)',
            }}
          />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: '1.15rem',
              letterSpacing: '0.18em',
            }}
          >
            <span style={{ color: '#F0EDE8' }}>SUPERHUMAN</span>
            <span style={{ color: '#C9A84C' }}> LAB</span>
          </span>
        </div>

        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase"
          style={{
            border: '1px solid rgba(201,168,76,0.3)',
            color: '#C9A84C',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full pulse-dot"
            style={{ backgroundColor: '#4ade80' }}
          />
          Your Call is Confirmed
        </div>
      </div>
    </header>
  );
}
