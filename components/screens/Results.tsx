'use client'

import { useState } from 'react'
import { useSurveyStore } from '@/lib/store'
import type { SkillKey, Skills, SurveyState, ApiResponse } from '@/lib/types'
import { resolveUrl } from '@/lib/resource-urls'
import FeedbackBar from '@/components/FeedbackBar'

interface Props {
  dark?: boolean
  onRestart: () => void
}

const mkT = (dark: boolean) => dark
  ? { bg: '#1a1410', fg: '#fdf8f0', muted: 'rgba(253,248,240,0.55)', rule: 'rgba(253,248,240,0.14)', surface: '#221a14' }
  : { bg: '#fdf8f0', fg: '#1a1410', muted: 'rgba(26,20,16,0.55)',    rule: 'rgba(26,20,16,0.14)',    surface: '#f6efe2'  }

// 16 skill labels for spider axes
const SKILL_LABELS: Record<SkillKey, string> = {
  pipelines: 'Pipelines', sql: 'Query', python: 'Python', cloud: 'Cloud',
  ai_tools: 'AI/LLM', modeling: 'Modeling',
  governance: 'Govern.', dq: 'Quality', metadata: 'Metadata',
  bi_delivery: 'BI', compliance: 'Compliance', domain: 'Domain',
  stakeholders: 'Stake.', framing: 'Framing', storytelling: 'Story.', strategic: 'Strategic',
}

const SKILL_KEYS = Object.keys(SKILL_LABELS) as SkillKey[]

const CATEGORY_COLORS: Record<SkillKey, string> = {
  pipelines: '#1d7a6b', sql: '#1d7a6b', python: '#1d7a6b', cloud: '#1d7a6b', ai_tools: '#1d7a6b', modeling: '#1d7a6b',
  governance: '#e88c2a', dq: '#e88c2a', metadata: '#e88c2a', bi_delivery: '#e88c2a', compliance: '#e88c2a', domain: '#e88c2a',
  stakeholders: '#5c4db1', framing: '#5c4db1', storytelling: '#5c4db1', strategic: '#5c4db1',
}

const CONCERN_LABELS: Record<string, string> = {
  automation:  'ROLE AT RISK',
  'ai-skills': 'FALLING BEHIND ON AI',
  ceiling:     'HIT A CEILING',
  pivot:       'WANT TO PIVOT',
  ahead:       'STAYING AHEAD',
}

const DEST_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  best_fit:     { label: 'BEST FIT',     color: '#3d6b4f', bg: '#e4f0e8' },
  stretch:      { label: 'STRETCH',      color: '#2563eb', bg: '#eff6ff' },
  long_horizon: { label: '2–3 YR',       color: '#e88c2a', bg: '#fdf0d5' },
}


export default function Results({ dark = false, onRestart }: Props) {
  const T = mkT(dark)
  const store = useSurveyStore()
  const results = store.results!
  const userCats = store.selectedCategories
  const [skills, setSkills] = useState<Skills>({ ...store.skills })
  const [showPrompt, setShowPrompt] = useState(false)
  const aiPrompt = showPrompt ? buildAIPrompt(store, results) : ''

  const handleSkill = (key: SkillKey, val: number) =>
    setSkills((prev) => ({ ...prev, [key]: val }))

  // Top 3 urgent gaps
  const gaps = SKILL_KEYS
    .map((k) => ({ key: k, delta: results.demand_levels[k] - skills[k] }))
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3)
    .filter((g) => g.delta > 0)

  const gapCount = Object.values(results.gap_analysis).filter((v) => v === 'urgent_gap').length
  const atRisk   = Object.values(results.gap_analysis).filter((v) => v === 'at_risk').length
  const aligned  = Object.values(results.gap_analysis).filter((v) => v === 'aligned').length

  const profileParts = [
    store.selectedRoles[0],
    store.skillShape ? { i: 'I-shape', t: 'T-shape', comb: 'Comb-shape', gen: 'Generalist' }[store.skillShape] : null,
    store.seniority,
    store.yearsExperience ? `${store.yearsExperience} yrs` : null,
    store.industry,
  ].filter(Boolean) as string[]

  return (
    <div style={{ background: T.bg, color: T.fg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px' }}>

        {/* Nav */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 14px' }}>
          <button onClick={onRestart} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: T.fg, padding: 0, lineHeight: 1 }}>←</button>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.muted }}>YOUR MAP · 04 / 04</span>
          <span style={{ width: 60 }} />
        </header>

        {/* Hero */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: T.muted, marginBottom: 14 }}>
            YOUR PROFILE · {profileParts.join(' · ')}
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 56, lineHeight: 0.9, letterSpacing: '-0.04em', margin: '0 0 14px' }}>
            You&apos;re a<br />
            <em style={{ fontStyle: 'italic', color: '#d95f3b' }}>
              {store.skillShape === 'comb' ? 'comb-shape.' : store.skillShape === 'i' ? 'specialist.' : store.skillShape === 't' ? 'T-shape.' : 'generalist.'}
            </em>
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: T.muted, margin: 0 }}>
            {gapCount > 0
              ? `${gapCount} urgent gap${gapCount > 1 ? 's' : ''} to close before 2027. ${aligned} skill${aligned !== 1 ? 's' : ''} already aligned.`
              : `Strong alignment overall. ${aligned} skill${aligned !== 1 ? 's' : ''} match 2027 demand.`}
          </p>
          {store.concerns.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
              {store.concerns.map((c) => (
                <span key={c} style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
                  padding: '4px 10px', borderRadius: 999,
                  border: `1px solid ${T.rule}`, color: T.muted,
                }}>
                  {CONCERN_LABELS[c] ?? c.toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Spider chart */}
        <div style={{ background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 12, padding: '18px 16px 16px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: T.fg }}>Current vs 2027 demand</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: T.muted }}>16 SKILLS</span>
          </div>
          <SpiderChart current={skills} demand={results.demand_levels} T={T} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 8 }}>
            <LegendItem color="#1d7a6b" label="Current" />
            <LegendItem color="#e88c2a" label="2027 demand" dashed />
          </div>
        </div>

        {/* Gap metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 28 }}>
          <MetricPill icon="✅" count={aligned}  label="ALIGNED"   color="#3d6b4f" bg="#e4f0e8" />
          <MetricPill icon="🔴" count={gapCount} label="URGENT"    color="#d95f3b" bg="#fdeee9" />
          <MetricPill icon="🟡" count={atRisk}   label="AT RISK"   color="#e88c2a" bg="#fdf0d5" />
        </div>

        {/* Section 01 — Biggest gaps */}
        {gaps.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <SectionHeader num="01" label="BIGGEST GAPS" T={T} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {gaps.map((g, i) => (
                <div key={g.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: T.muted, width: 18 }}>
                    0{i + 1}
                  </span>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.fg }}>{SKILL_LABELS[g.key]}</span>
                    <div style={{ height: 8, borderRadius: 4, background: T.rule, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', inset: '0 auto 0 0', width: `${results.demand_levels[g.key] * 20}%`, height: '100%', background: '#e88c2a', opacity: 0.35 }} />
                      <div style={{ position: 'absolute', inset: '0 auto 0 0', width: `${skills[g.key] * 20}%`, height: '100%', background: CATEGORY_COLORS[g.key] }} />
                    </div>
                  </div>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: '#d95f3b', width: 28, textAlign: 'right' }}>
                    +{g.delta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 02 — Role destinations */}
        <div style={{ marginBottom: 28 }}>
          <SectionHeader num="02" label="ROLE DESTINATIONS" T={T} />
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: T.muted, marginBottom: 10 }}>
            Hybrid futures — roles your shape opens up
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.role_destinations.map((dest) => {
              const style = DEST_STYLE[dest.type] || DEST_STYLE.best_fit
              return (
                <div key={dest.type} style={{ padding: '14px 16px', border: `1px solid ${T.rule}`, borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', color: T.fg }}>
                        {dest.title}
                      </div>
                      <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{dest.rationale}</div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', padding: '3px 8px', borderRadius: 999, background: style.bg, color: style.color, flexShrink: 0, marginLeft: 10 }}>
                      {style.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section 03 — Resources from roadmap */}
        <div style={{ marginBottom: 28 }}>
          <SectionHeader num="03" label="SUGGESTED RESOURCES" T={T} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.roadmap.quick_wins.slice(0, 3).map((step, i) => {
              const resourceName = step.resources[0]
              const url = resourceName ? resolveUrl(resourceName) : undefined
              return (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: '1px solid #1d7a6b', borderRadius: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: T.muted, marginBottom: 2 }}>
                        {resourceName ?? 'QUICK WIN'}
                      </div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em', color: T.fg }}>
                        {step.title}
                      </div>
                    </div>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: '#1d7a6b' }}>↗</span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* AI Roadmap block */}
        <div className="no-print" style={{ background: '#5c4db1', borderRadius: 12, padding: '20px', marginBottom: 24, color: '#fdf8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em' }}>AI ROADMAP</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em' }}>NEW</span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 40, lineHeight: 0.92, letterSpacing: '-0.035em', marginBottom: 12 }}>
            Build my<br /><em style={{ fontStyle: 'italic', fontWeight: 700 }}>custom</em><br />12-month plan.
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.45, margin: '0 0 18px', opacity: 0.85 }}>
            Generates a tailored prompt to feed into any AI assistant —
            tuned to your shape, gaps, and chosen destinations.
          </p>
          <button
            onClick={() => setShowPrompt((v) => !v)}
            style={{
              width: '100%', padding: '16px 20px', border: 'none', borderRadius: 999,
              background: '#fdf8f0', color: '#1a1410', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 15, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {showPrompt ? 'Hide prompt' : 'Generate AI prompt'}
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700 }}>{showPrompt ? '↑' : '→'}</span>
          </button>
          {showPrompt && (
            <div style={{ marginTop: 16 }}>
              <pre style={{
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12, lineHeight: 1.6,
                background: 'rgba(253,248,240,0.10)', borderRadius: 8, padding: '14px 16px',
                color: '#fdf8f0', margin: '0 0 12px', maxHeight: 320, overflowY: 'auto',
                fontFamily: "'DM Sans', sans-serif",
              }}>{aiPrompt}</pre>
              <button
                onClick={() => navigator.clipboard?.writeText(aiPrompt)}
                style={{
                  width: '100%', padding: '12px', border: '1px solid rgba(253,248,240,0.3)', borderRadius: 8,
                  background: 'transparent', color: '#fdf8f0', cursor: 'pointer',
                  fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                  marginBottom: 10,
                }}
              >
                Copy prompt ↗
              </button>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(253,248,240,0.6)', marginBottom: 8 }}>
                PASTE INTO AN AI ASSISTANT
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  { label: 'Claude', href: 'https://claude.ai/new' },
                  { label: 'ChatGPT', href: 'https://chatgpt.com/' },
                  { label: 'Gemini', href: 'https://gemini.google.com/' },
                  { label: 'Search it', href: `https://www.google.com/search?q=${encodeURIComponent('12 month data career roadmap ' + (store.selectedRoles[0] ?? ''))}` },
                ].map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
                    display: 'block', padding: '10px', borderRadius: 8, textAlign: 'center',
                    background: 'rgba(253,248,240,0.12)', color: '#fdf8f0', textDecoration: 'none',
                    fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {label} ↗
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action row */}
        <div className="no-print" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 32 }}>
          <button
            onClick={onRestart}
            style={{
              padding: '16px', border: 'none', borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
              background: T.fg, color: T.bg,
            }}
          >
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16 }}>↺</span>
            <span>Start over</span>
          </button>
          <button
            onClick={() => window.print()}
            style={{
              padding: '16px', borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
              background: 'transparent', color: T.fg,
              border: `1px solid ${T.rule}`,
            }}
          >
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16 }}>⎙</span>
            <span>Print results</span>
          </button>
        </div>

        {/* Skills to protect */}
        {results.skills_to_protect.length > 0 && (
          <div style={{ borderTop: `1px solid ${T.rule}`, paddingTop: 24, marginBottom: 32 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: T.muted, marginBottom: 8 }}>DON&apos;T NEGLECT THESE</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: T.fg, marginBottom: 12 }}>
              Your competitive foundation
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {results.skills_to_protect.map((sk) => (
                <span key={sk} style={{
                  fontSize: 12, fontWeight: 500, padding: '6px 12px', borderRadius: 999,
                  border: '1px solid #1d7a6b', color: '#1d7a6b', background: 'transparent',
                }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        <FeedbackBar dark={dark} surveyType="data" />

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 8, fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', color: T.muted }}>
          <span>EST. 2026</span>
          <span style={{ flex: 1, height: 1, background: T.rule }} />
          <span>v2.4</span>
        </div>
        <div style={{ paddingBottom: 32, textAlign: 'center' }}>
          <a
            href="/research-report.html"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 11, fontWeight: 500, color: T.muted, textDecoration: 'underline', letterSpacing: '0.06em' }}
          >
            How we calculated your demand scores →
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Spider chart (SVG, 16 axes) ──────────────────────────────────────────────
function SpiderChart({ current, demand, T }: { current: Skills; demand: Skills; T: ReturnType<typeof mkT> }) {
  const cx = 160, cy = 160, R = 120, N = 16
  const angles = Array.from({ length: N }, (_, i) => (Math.PI * 2 * i) / N - Math.PI / 2)
  const pt = (i: number, v: number): [number, number] => [cx + Math.cos(angles[i]) * R * v, cy + Math.sin(angles[i]) * R * v]
  const polyOf = (vals: number[]) => vals.map((v, i) => pt(i, v).join(',')).join(' ')

  const curVals = SKILL_KEYS.map((k) => current[k] / 5)
  const demVals = SKILL_KEYS.map((k) => demand[k] / 5)

  return (
    <svg viewBox="0 0 320 320" width="100%" style={{ display: 'block' }}>
      {/* Rings */}
      {[0.25, 0.5, 0.75, 1].map((r, ri) => (
        <polygon key={ri}
          points={Array.from({ length: N }, (_, k) => pt(k, r).join(',')).join(' ')}
          fill="none" stroke={T.rule} strokeWidth="1" />
      ))}
      {/* Spokes */}
      {SKILL_KEYS.map((k, i) => {
        const [x, y] = pt(i, 1)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={CATEGORY_COLORS[k]} strokeOpacity="0.25" strokeWidth="1" />
      })}
      {/* 2027 demand (dashed amber) */}
      <polygon points={polyOf(demVals)} fill="rgba(232,140,42,0.10)" stroke="#e88c2a" strokeWidth="1.5" strokeDasharray="4 4" />
      {/* Current (teal) */}
      <polygon points={polyOf(curVals)} fill="rgba(29,122,107,0.22)" stroke="#1d7a6b" strokeWidth="2" />
      {/* Dots */}
      {curVals.map((v, i) => {
        const [x, y] = pt(i, v)
        return <circle key={i} cx={x} cy={y} r="3.5" fill="#1d7a6b" stroke={T.surface} strokeWidth="1.5" />
      })}
      {/* Labels */}
      {SKILL_KEYS.map((k, i) => {
        const [x, y] = pt(i, 1.22)
        return (
          <text key={i} x={x} y={y + 3} textAnchor="middle"
            fontFamily="'DM Sans'" fontSize="9" fontWeight="600" letterSpacing="0.5"
            fill={CATEGORY_COLORS[k]}>
            {SKILL_LABELS[k].toUpperCase()}
          </text>
        )
      })}
    </svg>
  )
}

function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 22, height: 2, background: dashed ? 'transparent' : color, borderTop: dashed ? `2px dashed ${color}` : 'none', display: 'block' }} />
      <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{label}</span>
    </div>
  )
}

function MetricPill({ icon, count, label, color, bg }: { icon: string; count: number; label: string; color: string; bg: string }) {
  return (
    <div style={{ background: bg, borderRadius: 8, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-0.03em', color }}>{count}</span>
      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color }}>{label}</span>
    </div>
  )
}

function SectionHeader({ num, label, T }: { num: string; label: string; T: ReturnType<typeof mkT> }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: T.muted }}>{num}</span>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.16em', color: T.fg }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: T.rule }} />
    </div>
  )
}

const LEVEL_DESC = ['no exposure', 'beginner', 'some experience', 'proficient', 'advanced', 'expert']

function buildAIPrompt(store: SurveyState, results: ApiResponse): string {
  const concerns = store.concerns.join(', ') || 'none specified'

  const urgentGaps = SKILL_KEYS.filter((k) => results.gap_analysis[k] === 'urgent_gap')
  const atRiskKeys = SKILL_KEYS.filter((k) => results.gap_analysis[k] === 'at_risk')
  const alignedKeys = SKILL_KEYS.filter((k) => results.gap_analysis[k] === 'aligned')

  const formatSkill = (k: SkillKey) => {
    const cur = store.skills[k], dem = results.demand_levels[k]
    const gap = dem - cur
    return `  - ${SKILL_LABELS[k]}: currently ${cur}/5 (${LEVEL_DESC[cur]}) → need ${dem}/5 (${LEVEL_DESC[dem]})${gap > 0 ? ` — gap: +${gap}` : ' — at target'}`
  }

  const urgentBlock = urgentGaps.length
    ? urgentGaps.map(formatSkill).join('\n')
    : '  (none)'
  const atRiskBlock = atRiskKeys.length
    ? atRiskKeys.map(formatSkill).join('\n')
    : '  (none)'
  const alignedBlock = alignedKeys.length
    ? alignedKeys.map(formatSkill).join('\n')
    : '  (none)'

  return `You are a senior data career advisor using 2025–2027 labour market research (WEF Future of Jobs 2025, LinkedIn Economic Graph, Stanford HAI AI Index 2026, Gartner Data & Analytics Forecasts 2025).

My profile:
- Current role(s): ${store.selectedRoles.join(', ') || 'data professional'}
- Skill shape: ${store.skillShape ?? 'not specified'}
- Seniority: ${store.seniority ?? 'not specified'}
- Years experience: ${store.yearsExperience ?? 'not specified'}
- Target destination (12 months): ${results.role_destinations[0]?.title ?? 'not specified'}
- Stretch goal (2–3 years): ${results.role_destinations[1]?.title ?? 'not specified'}
- What I'm concerned about: ${concerns}

My skill inventory (scale 1–5: 1=beginner, 3=proficient, 5=expert):

URGENT GAPS — close these before 2027:
${urgentBlock}

AT RISK — need maintenance or moderate uplift:
${atRiskBlock}

ALREADY ALIGNED — protect and leverage these:
${alignedBlock}

IMPORTANT CALIBRATION: When recommending learning resources or plans for any skill, always match the content difficulty to my CURRENT level for that skill. If I am already at level 4 on a skill and only need level 5, do NOT recommend beginner resources — assume I have the foundations and focus on advanced techniques, edge cases, or real-world application. Only recommend foundational content for skills where I am at level 1–2.

Task: Build me a personalised 12-month skill development roadmap grounded in the research above.

Requirements:
1. Month-by-month plan (or quarterly) — what to learn and what to build each period, calibrated to my existing level per skill
2. For each gap skill, recommend 2 specific resources (books, courses, or practice sites) appropriate to my current level — include URLs where possible
3. Identify which gaps AI tools can close faster — and how to use them effectively given my current proficiency
4. Flag which skills are AI-resistant and why they remain high-value per the research
5. Suggest 2–3 portfolio projects that signal these skills to a hiring manager
6. Assume 5–8 hours/week available; be realistic about what's achievable

Cite data sources (WEF, LinkedIn, Gartner, etc.) where relevant. Output as structured markdown.`
}
