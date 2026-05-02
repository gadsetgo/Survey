'use client'

import { useSurveyStore } from '@/lib/store'

interface Props {
  dark?: boolean
  onNext: () => void
  onBack: () => void
}

const mkT = (dark: boolean) => dark
  ? { bg: '#1a1410', fg: '#fdf8f0', muted: 'rgba(253,248,240,0.55)', rule: 'rgba(253,248,240,0.14)' }
  : { bg: '#fdf8f0', fg: '#1a1410', muted: 'rgba(26,20,16,0.55)',    rule: 'rgba(26,20,16,0.14)'    }

const CATEGORIES = [
  {
    id: 'DE', color: '#1d7a6b', label: 'ENGINEERING', title: 'Engineering & Infrastructure',
    roles: [
      { id: 'data-engineer',      label: 'Data Engineer' },
      { id: 'analytics-engineer', label: 'Analytics Engineer', overlap: 'AN' },
      { id: 'data-architect',     label: 'Data Architect' },
      { id: 'dataops',            label: 'DataOps Engineer' },
      { id: 'cloud-data',         label: 'Cloud Data Engineer' },
      { id: 'platform-admin',     label: 'Data Platform Admin' },
    ],
  },
  {
    id: 'AN', color: '#d95f3b', label: 'ANALYTICS', title: 'Analytics & BI',
    roles: [
      { id: 'bi-dev',           label: 'BI Developer / Analyst' },
      { id: 'data-analyst',     label: 'Data Analyst' },
      { id: 'product-analyst',  label: 'Product Analyst' },
      { id: 'mktg-analyst',     label: 'Marketing Analyst' },
      { id: 'fin-analyst',      label: 'Financial Data Analyst', overlap: 'GV' },
    ],
  },
  {
    id: 'DS', color: '#5c4db1', label: 'SCIENCE', title: 'Data Science & AI/ML',
    roles: [
      { id: 'data-scientist', label: 'Data Scientist' },
      { id: 'ml-engineer',    label: 'ML Engineer', overlap: 'DE' },
      { id: 'ai-llm',         label: 'AI / LLM Engineer', overlap: 'DE' },
      { id: 'nlp',            label: 'NLP Engineer' },
      { id: 'research',       label: 'Research Scientist' },
    ],
  },
  {
    id: 'GV', color: '#e88c2a', label: 'GOVERNANCE', title: 'Governance & Strategy',
    roles: [
      { id: 'gov-mgr',  label: 'Data Governance Manager' },
      { id: 'steward',  label: 'Data Steward' },
      { id: 'cdo',      label: 'Chief Data Officer' },
      { id: 'data-pm',  label: 'Data Product Manager', overlap: 'AN' },
      { id: 'metadata', label: 'Metadata / Catalog Analyst' },
    ],
  },
]

export default function RoleSelection({ dark = false, onNext, onBack }: Props) {
  const T = mkT(dark)
  const { selectedRoles, toggleRole } = useSurveyStore()
  const selected = new Set(selectedRoles)

  const toggle = (id: string) => toggleRole(id)
  const canContinue = selected.size > 0

  return (
    <div style={{ background: T.bg, color: T.fg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px' }}>

        {/* Nav */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 14px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: T.fg, padding: 0, lineHeight: 1 }}>←</button>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.muted }}>STEP 01 / 04</span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.muted }}>{selected.size} SELECTED</span>
        </header>

        {/* Progress */}
        <div style={{ height: 2, background: T.rule, marginBottom: 24 }}>
          <div style={{ height: '100%', background: T.fg, width: '25%', transition: 'width 0.3s' }} />
        </div>

        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: T.muted, marginBottom: 14 }}>YOUR ROLE</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 56, lineHeight: 0.9, letterSpacing: '-0.04em', margin: '0 0 16px' }}>
            Where do<br />you <em style={{ fontStyle: 'italic', fontWeight: 700 }}>actually</em><br />work?
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, color: T.muted }}>
            Pick every role you&apos;ve held or operate close to. Overlaps are real — select more than one if it fits.
          </p>
        </div>

        {/* Category legend pills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', border: `1px solid ${T.rule}`, borderRadius: 999 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12, color: cat.color }}>{cat.id}</span>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: T.fg }}>{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Venn diagrams */}
        <div style={{ marginBottom: 8 }}>
          <VennPair
            leftColor="#1d7a6b" leftCode="DE" leftLabel="ENGINEERING"
            rightColor="#5c4db1" rightCode="DS" rightLabel="SCIENCE"
            leftSkills={['Pipelines', 'dbt', 'Cloud']}
            rightSkills={['Stats', 'Modeling', 'NLP']}
            overlapSkills={['Python', 'ML Ops', 'LLMs']}
            T={T}
          />
          <VennPair
            leftColor="#d95f3b" leftCode="AN" leftLabel="ANALYTICS"
            rightColor="#e88c2a" rightCode="GV" rightLabel="GOVERNANCE"
            leftSkills={['SQL', 'BI', 'Funnels']}
            rightSkills={['Policy', 'DAMA', 'Compliance']}
            overlapSkills={['Metadata', 'Quality', 'Lineage']}
            T={T}
          />
          <div style={{ textAlign: 'center', fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', color: T.muted, marginTop: 4 }}>
            ↑ SKILLS OVERLAP — PICK MORE THAN ONE ROLE
          </div>
        </div>

        {/* Role groups */}
        <div style={{ paddingBottom: 120, marginTop: 16 }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ width: 18, height: 4, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: cat.color }}>{cat.id}</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', color: T.fg }}>{cat.title}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cat.roles.map((role) => {
                  const isSelected = selected.has(role.id)
                  return (
                    <button
                      key={role.id}
                      onClick={() => toggle(role.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 16px', border: `1px solid ${isSelected ? cat.color : T.rule}`,
                        borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                        fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                        background: isSelected ? cat.color : 'transparent',
                        color: isSelected ? '#fdf8f0' : T.fg,
                      }}
                    >
                      <span style={{
                        width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                        border: `1.5px solid ${isSelected ? '#fdf8f0' : T.rule}`,
                        background: isSelected ? '#fdf8f0' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isSelected && <span style={{ fontSize: 12, fontWeight: 800, color: cat.color }}>✓</span>}
                      </span>
                      <span style={{ flex: 1 }}>{role.label}</span>
                      {role.overlap && (
                        <span style={{
                          fontSize: 9, fontWeight: 600, letterSpacing: '0.12em',
                          border: `1px solid ${isSelected ? 'rgba(253,248,240,0.35)' : T.rule}`,
                          borderRadius: 999, padding: '3px 8px',
                          color: isSelected ? '#fdf8f0' : T.muted,
                        }}>
                          +{role.overlap}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sticky footer */}
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480, padding: '16px 24px 24px',
          background: T.bg, borderTop: `1px solid ${T.rule}`,
        }}>
          <button
            onClick={onNext}
            disabled={!canContinue}
            style={{
              width: '100%', padding: '18px 24px', border: 'none', borderRadius: 999,
              cursor: canContinue ? 'pointer' : 'not-allowed',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 16, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
              background: T.fg, color: T.bg, opacity: canContinue ? 1 : 0.35,
            }}
          >
            Continue
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700 }}>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function VennPair({
  leftColor, leftCode, leftLabel, rightColor, rightCode, rightLabel,
  leftSkills, rightSkills, overlapSkills, T,
}: {
  leftColor: string; leftCode: string; leftLabel: string;
  rightColor: string; rightCode: string; rightLabel: string;
  leftSkills: string[]; rightSkills: string[]; overlapSkills: string[];
  T: ReturnType<typeof mkT>
}) {
  const W = 327, H = 200
  const cy = 100, r = 88
  const cxL = 108, cxR = 219

  const pillW = 62, pillH = 20, gapY = 7
  const totalH = (n: number) => n * pillH + (n - 1) * gapY
  const startY = (n: number) => cy - totalH(n) / 2

  const leftPillX = (yMid: number) => {
    const dy = yMid - cy
    const hw = Math.sqrt(Math.max(0, r * r - dy * dy))
    return Math.max(cxL - hw + 5, cxL - pillW - 4)
  }
  const rightPillX = (yMid: number) => {
    const dy = yMid - cy
    const hw = Math.sqrt(Math.max(0, r * r - dy * dy))
    return Math.min(cxR + hw - pillW - 5, cxR + 4)
  }

  const oPillW = 44, oPillH = 16, oGap = 3
  const oTotal = overlapSkills.length * oPillH + (overlapSkills.length - 1) * oGap
  const oStartY = cy - oTotal / 2

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: leftColor }}>{leftCode}</span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: T.muted }}>×</span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: rightColor }}>{rightCode}</span>
        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', color: T.muted, marginLeft: 4 }}>
          {leftLabel} × {rightLabel}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <circle cx={cxL} cy={cy} r={r} fill={leftColor} fillOpacity="0.85" />
        <circle cx={cxR} cy={cy} r={r} fill={rightColor} fillOpacity="0.85" />
        <defs>
          <clipPath id={`clip-${leftCode}-${rightCode}`}>
            <circle cx={cxL} cy={cy} r={r} />
          </clipPath>
        </defs>
        <circle cx={cxR} cy={cy} r={r} fill="#1a1410" fillOpacity="0.32" clipPath={`url(#clip-${leftCode}-${rightCode})`} />

        {leftSkills.map((s, i) => {
          const py = startY(leftSkills.length) + i * (pillH + gapY)
          const px = leftPillX(py + pillH / 2)
          return (
            <g key={`l${i}`}>
              <rect x={px} y={py} width={pillW} height={pillH} rx={10} fill="rgba(253,248,240,0.22)" />
              <text x={px + pillW / 2} y={py + pillH / 2 + 4} fontFamily="'DM Sans'" fontWeight="600" fontSize="10" fill="#fdf8f0" textAnchor="middle">{s}</text>
            </g>
          )
        })}

        {rightSkills.map((s, i) => {
          const py = startY(rightSkills.length) + i * (pillH + gapY)
          const px = rightPillX(py + pillH / 2)
          return (
            <g key={`r${i}`}>
              <rect x={px} y={py} width={pillW} height={pillH} rx={10} fill="rgba(253,248,240,0.22)" />
              <text x={px + pillW / 2} y={py + pillH / 2 + 4} fontFamily="'DM Sans'" fontWeight="600" fontSize="10" fill="#fdf8f0" textAnchor="middle">{s}</text>
            </g>
          )
        })}

        {overlapSkills.map((s, i) => {
          const px = (W - oPillW) / 2
          const py = oStartY + i * (oPillH + oGap)
          return (
            <g key={`o${i}`}>
              <rect x={px} y={py} width={oPillW} height={oPillH} rx={10} fill="#fdf8f0" />
              <text x={px + oPillW / 2} y={py + oPillH / 2 + 3} fontFamily="'Syne'" fontWeight="800" fontSize="8.5" fill="#1a1410" textAnchor="middle">{s}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
