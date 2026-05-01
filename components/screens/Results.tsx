'use client'

import { useState } from 'react'
import { useSurveyStore } from '@/lib/store'
import type { SkillKey, Skills, SurveyState, ApiResponse } from '@/lib/types'

interface Props {
  dark?: boolean
  onRestart: () => void
}

const mkT = (dark: boolean) => dark
  ? { bg: '#1a1410', fg: '#fdf8f0', muted: 'rgba(253,248,240,0.55)', rule: 'rgba(253,248,240,0.14)', surface: '#221a14' }
  : { bg: '#fdf8f0', fg: '#1a1410', muted: 'rgba(26,20,16,0.55)',    rule: 'rgba(26,20,16,0.14)',    surface: '#f6efe2'  }

// 16 skill labels for spider axes
const SKILL_LABELS: Record<SkillKey, string> = {
  pipelines: 'Pipelines', sql: 'SQL', python: 'Python', cloud: 'Cloud',
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

const DEST_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  best_fit:     { label: 'BEST FIT',     color: '#3d6b4f', bg: '#e4f0e8' },
  stretch:      { label: 'STRETCH',      color: '#2563eb', bg: '#eff6ff' },
  long_horizon: { label: '2–3 YR',       color: '#e88c2a', bg: '#fdf0d5' },
}

const CAT_COLORS: Record<string, string> = {
  DE: '#1d7a6b', AN: '#d95f3b', DS: '#5c4db1', GV: '#e88c2a',
}

export default function Results({ dark = false, onRestart }: Props) {
  const T = mkT(dark)
  const store = useSurveyStore()
  const results = store.results!
  const [skills, setSkills] = useState<Skills>({ ...store.skills })

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
          <button style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', padding: '6px 10px', border: `1px solid ${T.rule}`, borderRadius: 999, background: 'transparent', color: T.fg, cursor: 'pointer' }}>
            SHARE ↗
          </button>
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
              const cats = dest.categories || []
              return (
                <div key={dest.type} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: `1px solid ${T.rule}`, borderRadius: 8 }}>
                  {/* Mini venn */}
                  <svg viewBox="0 0 56 32" width="56" height="32" style={{ flexShrink: 0 }}>
                    <circle cx="20" cy="16" r="13" fill={CAT_COLORS[cats[0]] || '#1d7a6b'} fillOpacity="0.7" />
                    <circle cx="36" cy="16" r="13" fill={CAT_COLORS[cats[1]] || '#e88c2a'} fillOpacity="0.7" />
                  </svg>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: T.muted, marginBottom: 2 }}>
                      {cats.join(' × ')}
                    </div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', color: T.fg }}>
                      {dest.title}
                    </div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{dest.rationale}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', padding: '3px 8px', borderRadius: 999, background: style.bg, color: style.color }}>
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
            {results.roadmap.quick_wins.slice(0, 3).map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: `1px solid ${T.rule}`, borderRadius: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: T.muted, marginBottom: 2 }}>
                    {step.resources[0] ? 'RESOURCE' : 'QUICK WIN'}
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em', color: T.fg }}>
                    {step.title}
                  </div>
                </div>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: T.fg }}>↗</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Roadmap block */}
        <div style={{ background: '#5c4db1', borderRadius: 12, padding: '20px', marginBottom: 24, color: '#fdf8f0' }}>
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
            onClick={() => {
              const prompt = buildAIPrompt(store, results)
              navigator.clipboard?.writeText(prompt)
              alert('Prompt copied to clipboard! Paste it into Claude, ChatGPT, or any AI assistant.')
            }}
            style={{
              width: '100%', padding: '16px 20px', border: 'none', borderRadius: 999,
              background: '#fdf8f0', color: '#1a1410', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 15, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Generate AI prompt
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700 }}>→</span>
          </button>
        </div>

        {/* Share row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 32 }}>
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
            style={{
              padding: '16px', borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
              background: 'transparent', color: T.fg,
              border: `1px solid ${T.rule}`,
            }}
          >
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16 }}>✉</span>
            <span>Email me</span>
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
                  background: '#e4f0e8', color: '#3d6b4f',
                }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 32, fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', color: T.muted }}>
          <span>EST. 2026</span>
          <span style={{ flex: 1, height: 1, background: T.rule }} />
          <span>v2.4</span>
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

function buildAIPrompt(store: SurveyState, results: ApiResponse): string {
  const topGaps = Object.entries(results.gap_analysis)
    .filter(([, v]) => v === 'urgent_gap')
    .map(([k]) => k)
    .join(', ')

  return `I am a ${store.selectedRoles.join(', ')} with ${store.yearsExperience} years of experience, ${store.seniority} level, ${store.skillShape}-shaped profile.

My top skill gaps against 2027 demand are: ${topGaps || 'none identified'}.
Skills to protect: ${results.skills_to_protect.join(', ')}.
Target role destinations: ${results.role_destinations.map((d) => d.title).join(', ')}.

Please build me a detailed 12-month learning roadmap structured around:
- Quick wins (first 90 days): specific courses, projects, or credentials
- Core skill builds (months 3–6): depth work on my biggest gaps
- Role transition enablers (months 6–12): what gets me to my stretch destination

Format as a week-by-week or month-by-month plan with concrete resources (courses, books, communities). Be specific about time investment per week.`
}
