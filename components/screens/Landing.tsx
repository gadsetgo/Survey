'use client'

interface Props {
  dark?: boolean
  onStart: () => void
  onToggleDark: () => void
}

const light = {
  bg: '#fdf8f0', fg: '#1a1410',
  muted: 'rgba(26,20,16,0.55)', rule: 'rgba(26,20,16,0.14)',
  amber: '#e88c2a', coral: '#d95f3b',
}
const dark_ = {
  bg: '#1a1410', fg: '#fdf8f0',
  muted: 'rgba(253,248,240,0.55)', rule: 'rgba(253,248,240,0.14)',
  amber: '#e88c2a', coral: '#d95f3b',
}

export default function Landing({ dark = false, onStart, onToggleDark }: Props) {
  const T = dark ? dark_ : light

  return (
    <div style={{ background: T.bg, color: T.fg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px' }}>

        {/* Nav */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: T.amber, display: 'block' }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: '0.06em' }}>
              COMPASS
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: T.muted }}>
              NO. <span style={{ color: T.fg, fontWeight: 700 }}>001</span>
            </span>
            <button
              onClick={onToggleDark}
              style={{
                background: 'transparent', border: `1px solid ${T.rule}`,
                borderRadius: 999, padding: '4px 10px', cursor: 'pointer',
                fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: T.muted,
              }}
            >
              {dark ? 'LIGHT' : 'DARK'}
            </button>
          </div>
        </header>

        {/* Poster pillars */}
        <div style={{ position: 'relative', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 300 }}>
            <Pillar color="#1d7a6b" code="DE" label="ENGINEERING" height={210} />
            <Pillar color="#d95f3b" code="AN" label="ANALYTICS"   height={260} />
            <Pillar color="#5c4db1" code="DS" label="SCIENCE"     height={195} />
            <Pillar color="#e88c2a" code="GV" label="GOVERNANCE"  height={240} />
          </div>
          {/* Headline overlaid */}
          <div style={{ position: 'absolute', inset: 0, padding: '20px 12px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: '#fdf8f0', marginBottom: 12, mixBlendMode: 'difference' as const }}>
              THE 2027 SKILL INDEX
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 72,
              lineHeight: 0.87, letterSpacing: '-0.04em', margin: 0,
              color: '#fdf8f0', mixBlendMode: 'difference' as const,
            }}>
              Don&apos;t<br />get<br /><em style={{ fontStyle: 'italic', fontWeight: 700 }}>left<br />behind.</em>
            </h1>
          </div>
        </div>

        {/* Sub-bar */}
        <div style={{
          background: T.fg, color: T.bg,
          padding: '14px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderRadius: '0 0 4px 4px', marginBottom: 24,
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.22em' }}>MAP · MEASURE · MOVE</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 600 }}>↓</span>
        </div>

        {/* Lede */}
        <p style={{ fontSize: 16, lineHeight: 1.45, marginBottom: 28, color: T.fg }}>
          A skill navigator for data &amp; analytics professionals.
          See where you sit against AI-validated 2027 demand —
          and where to grow next.
        </p>

        {/* CTA block */}
        <div style={{ background: T.coral, borderRadius: 8, padding: '14px', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px 14px', color: '#fdf8f0' }}>
            {['12 MIN', 'FREE', 'NO SIGN-UP'].map((s) => (
              <span key={s} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em' }}>{s}</span>
            ))}
          </div>
          <button
            onClick={onStart}
            style={{
              width: '100%', padding: '18px 22px', border: 'none', borderRadius: 999,
              cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 16, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
              background: T.bg, color: T.fg,
            }}
          >
            Start your map
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700 }}>→</span>
          </button>
        </div>

        {/* Trust block */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0', borderTop: `1px solid ${T.rule}` }}>
          <TrustItem num="20+" lbl={'YEARS BEHIND\nTHE METHOD'} T={T} />
          <div style={{ width: 1, height: 36, background: T.rule }} />
          <TrustItem num="×AI" lbl={'CROSS-VALIDATED\nFORECASTS'} T={T} />
          <div style={{ width: 1, height: 36, background: T.rule }} />
          <TrustItem num="20" lbl={'ROLES IN THE\nINDEX'} T={T} />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 0 32px', fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', color: T.muted }}>
          <span>EST. 2026</span>
          <span style={{ flex: 1, height: 1, background: T.rule }} />
          <span>v2.4</span>
        </div>
      </div>
    </div>
  )
}

function Pillar({ color, code, label, height }: { color: string; code: string; label: string; height: number }) {
  return (
    <div style={{
      flex: 1, background: color, height, borderRadius: '4px 4px 0 0',
      color: '#fdf8f0', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', padding: '10px 6px',
    }}>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: '-0.01em', textAlign: 'center' }}>
        {code}
      </span>
      <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 9, fontWeight: 500, letterSpacing: '0.18em', alignSelf: 'center' }}>
        {label}
      </span>
    </div>
  )
}

function TrustItem({ num, lbl, T }: { num: string; lbl: string; T: typeof light }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: T.fg }}>
        {num}
      </span>
      <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', lineHeight: 1.3, color: T.muted, whiteSpace: 'pre-line' }}>
        {lbl}
      </span>
    </div>
  )
}
