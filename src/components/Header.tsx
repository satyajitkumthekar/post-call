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
          <div className="flex flex-col leading-tight">
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: '1.15rem',
                letterSpacing: '0.18em',
                lineHeight: 1.1,
              }}
            >
              <span style={{ color: '#F0EDE8' }}>SUPERHUMAN</span>
              <span style={{ color: '#C9A84C' }}> LAB</span>
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.18)',
                lineHeight: 1,
                marginTop: '2px',
              }}
            >
              Call Confirmed
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
