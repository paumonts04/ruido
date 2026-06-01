const items = ['Noise', 'Jungle', 'Techno', 'Drum & Bass', 'Eventos en vivo', 'Underground', 'Barcelona']

export default function Ticker() {
  const repeated = [...items, ...items, ...items, ...items]

  return (
    <div className="bg-[#FF5C00] overflow-hidden py-2.5">
      <div
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          width: 'max-content',
          animation: 'ticker 20s linear infinite',
        }}
      >
        {repeated.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              letterSpacing: '0.2em',
              color: '#080808',
              textTransform: 'uppercase',
              padding: '0 24px',
            }}>
              {item}
            </span>
            <span style={{ color: '#080808', opacity: 0.4, fontSize: 14 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}