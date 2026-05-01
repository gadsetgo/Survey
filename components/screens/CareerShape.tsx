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

const SENIORITY = [
  { id: 'junior', title: 'Junior',          sub: 'Learning the ropes' },
  { id: 'mid',    title: 'Mid',             sub: 'Hands-on, autonomous' },
  { id: 'senior', title: 'Senior',          sub: 'Owns systems & decisions' },
  { id: 'lead',   title: 'Lead / Principal', sub: 'Sets direction' },
  { id: 'exec',   title: 'Executive',       sub: 'CDO / VP / Director' },
]

const YEARS = ['0-2', '3-5', '6-10', '10-15', '15+']

const SHAPES = [
  { id: 'i',    title: 'I-shape',    desc: 'Deep specialist in one area' },
  { id: 't',    title: 'T-shape',    desc: 'Deep in one, broad across' },
  { id: 'comb', title: 'Comb-shape', desc: 'Multiple deep + broad' },
  { id: 'gen',  title: 'Generalist', desc: 'Broad, balanced' },
]

const LEADERSHIP = [
  { id: 'mentoring',    label: 'Mentoring' },
  { id: 'stakeholders', label: 'Stakeholders' },
  { id: 'team-lead',    label: 'Team lead' },
  { id: 'p-and-l',      label: 'P&L responsibility' },
  { id: 'strategy',     label: 'Strategy setting' },
  { id: 'exec-comms',   label: 'Executive comms' },
  { id: 'cross-func',   label: 'Cross-functional' },
  { id: 'hiring',       label: 'Hiring' },
]

export default function CareerShape({ dark = false, onNext, onBack }: Props) {
  const T = mkT(dark)
  const {
    seniority, yearsExperience, skillShape, leadershipActivities,
    setSeniority, setYearsExperience, setSkillShape, toggleLeadershipActivity,
  } = useSurveyStore()

  const canContinue = !!seniority && !!yearsExperience && !!skillShape

  return (
    <div style={{ background: T.bg, color: T.fg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px' }}>

        {/* Nav */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 14px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: T.fg, padding: 0, lineHeight: 1 }}>←</button>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.muted }}>STEP 02 / 04</span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.muted }}>CAREER SHAPE</span>
        </header>

        {/* Progress */}
        <div style={{ height: 2, background: T.rule, marginBottom: 24 }}>
          <div style={{ height: '100%', background: T.fg, width: '50%', transition: 'width 0.3s' }} />
        </div>

        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: T.muted, marginBottom: 14 }}>YOUR SHAPE</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 56, lineHeight: 0.9, letterSpacing: '-0.04em', margin: '0 0 16px' }}>
            How <em style={{ fontStyle: 'italic' }}>deep</em><br />how <em style={{ fontStyle: 'italic' }}>wide</em>?
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: T.muted, margin: 0 }}>
            Tell us about your seniority, time in the field, and the shape your skills make.
          </p>
        </div>

        {/* 01 Seniority */}
        <SectionHeader num="01" label="SENIORITY" T={T} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
          {SENIORITY.map((s) => {
            const active = seniority === s.id
            return (
              <button
                key={s.id}
                onClick={() => setSeniority(s.id)}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 4,
                  padding: '14px 16px', border: `1px solid ${active ? T.fg : T.rule}`,
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
                  background: active ? T.fg : 'transparent', color: active ? T.bg : T.fg,
                }}
              >
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>{s.title}</span>
                <span style={{ fontSize: 12, color: active ? (dark ? 'rgba(26,20,16,0.7)' : 'rgba(253,248,240,0.7)') : T.muted }}>{s.sub}</span>
              </button>
            )
          })}
        </div>

        {/* 02 Years */}
        <SectionHeader num="02" label="YEARS IN DATA" T={T} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 32 }}>
          {YEARS.map((y) => {
            const active = yearsExperience === y
            return (
              <button
                key={y}
                onClick={() => setYearsExperience(y)}
                style={{
                  padding: '14px 4px', border: `1px solid ${active ? '#e88c2a' : T.rule}`,
                  borderRadius: 8, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em',
                  background: active ? '#e88c2a' : 'transparent', color: active ? '#fdf8f0' : T.fg,
                }}
              >
                {y}
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', opacity: 0.7 }}>yrs</span>
              </button>
            )
          })}
        </div>

        {/* 03 Skill shape */}
        <SectionHeader num="03" label="SKILL SHAPE" T={T} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 32 }}>
          {SHAPES.map((sh) => {
            const active = skillShape === sh.id
            return (
              <button
                key={sh.id}
                onClick={() => setSkillShape(sh.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6,
                  padding: '16px 14px', border: `1px solid ${active ? '#d95f3b' : T.rule}`,
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  background: active ? '#d95f3b' : 'transparent', color: active ? '#fdf8f0' : T.fg,
                }}
              >
                <ShapeGlyph id={sh.id} active={active} T={T} />
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', marginTop: 4 }}>{sh.title}</span>
                <span style={{ fontSize: 11, lineHeight: 1.4, color: active ? 'rgba(253,248,240,0.75)' : T.muted }}>{sh.desc}</span>
              </button>
            )
          })}
        </div>

        {/* 04 Leadership */}
        <SectionHeader num="04" label="LEADERSHIP & SCOPE" T={T} />
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: T.muted, marginBottom: 10 }}>Pick all that apply</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 120 }}>
          {LEADERSHIP.map((l) => {
            const active = leadershipActivities.includes(l.id)
            return (
              <button
                key={l.id}
                onClick={() => toggleLeadershipActivity(l.id)}
                style={{
                  padding: '10px 14px', border: `1px solid ${active ? '#5c4db1' : T.rule}`,
                  borderRadius: 999, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                  background: active ? '#5c4db1' : 'transparent', color: active ? '#fdf8f0' : T.fg,
                }}
              >
                {l.label}
              </button>
            )
          })}
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

function SectionHeader({ num, label, T }: { num: string; label: string; T: ReturnType<typeof mkT> }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: T.muted }}>{num}</span>
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.16em', color: T.fg }}>{label}</span>
      <span style={{ flex: 1, height: 1, background: T.rule }} />
    </div>
  )
}

function ShapeGlyph({ id, active, T }: { id: string; active: boolean; T: ReturnType<typeof mkT> }) {
  const stroke = active ? '#fdf8f0' : T.fg
  const sw = 4
  if (id === 'i') return (
    <svg viewBox="0 0 60 40" width="48" height="32"><line x1="30" y1="6" x2="30" y2="34" stroke={stroke} strokeWidth={sw} strokeLinecap="round" /></svg>
  )
  if (id === 't') return (
    <svg viewBox="0 0 60 40" width="48" height="32">
      <line x1="10" y1="10" x2="50" y2="10" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="30" y1="10" x2="30" y2="34" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
  if (id === 'comb') return (
    <svg viewBox="0 0 60 40" width="48" height="32">
      <line x1="8"  y1="10" x2="52" y2="10" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="14" y1="10" x2="14" y2="34" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="30" y1="10" x2="30" y2="34" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="46" y1="10" x2="46" y2="34" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
  return (
    <svg viewBox="0 0 60 40" width="48" height="32">
      <line x1="6" y1="10" x2="54" y2="10" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="6" y1="22" x2="54" y2="22" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
}
