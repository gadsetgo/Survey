'use client'

import { useSurveyStore } from '@/lib/store'
import type { SkillKey } from '@/lib/types'

interface Props {
  dark?: boolean
  onNext: () => void
  onBack: () => void
}

const mkT = (dark: boolean) => dark
  ? { bg: '#1a1410', fg: '#fdf8f0', muted: 'rgba(253,248,240,0.55)', rule: 'rgba(253,248,240,0.14)' }
  : { bg: '#fdf8f0', fg: '#1a1410', muted: 'rgba(26,20,16,0.55)',    rule: 'rgba(26,20,16,0.14)'    }

const GROUPS = [
  {
    color: '#1d7a6b', code: 'TC', title: 'Technical',
    sub: 'What you can build & operate',
    skills: [
      { key: 'pipelines' as SkillKey, label: 'Data pipelines / ETL' },
      { key: 'sql'       as SkillKey, label: 'SQL & query fluency' },
      { key: 'python'    as SkillKey, label: 'Python / scripting' },
      { key: 'cloud'     as SkillKey, label: 'Cloud platforms' },
      { key: 'ai_tools'  as SkillKey, label: 'AI / LLM tools' },
      { key: 'modeling'  as SkillKey, label: 'Data modeling' },
    ],
  },
  {
    color: '#e88c2a', code: 'DM', title: 'Domain',
    sub: 'What you understand about the work',
    skills: [
      { key: 'governance'  as SkillKey, label: 'Governance & policy' },
      { key: 'dq'          as SkillKey, label: 'Data quality frameworks' },
      { key: 'metadata'    as SkillKey, label: 'Metadata & cataloging' },
      { key: 'bi_delivery' as SkillKey, label: 'Analytics & BI delivery' },
      { key: 'compliance'  as SkillKey, label: 'Regulatory fluency' },
      { key: 'domain'      as SkillKey, label: 'Business domain knowledge' },
    ],
  },
  {
    color: '#5c4db1', code: 'SF', title: 'Soft & Cross-functional',
    sub: 'How you work with people',
    skills: [
      { key: 'stakeholders' as SkillKey, label: 'Stakeholder communication' },
      { key: 'framing'      as SkillKey, label: 'Business problem framing' },
      { key: 'storytelling' as SkillKey, label: 'Executive storytelling' },
      { key: 'strategic'    as SkillKey, label: 'Strategic thinking' },
    ],
  },
]

const CONCERNS = [
  { id: 'automation', icon: '🤖', title: 'My role is at risk',       sub: 'AI is taking over my tasks' },
  { id: 'ai-skills',  icon: '📉', title: 'Falling behind on AI',     sub: 'Peers are upskilling faster' },
  { id: 'ceiling',    icon: '🏔️', title: 'Hit a ceiling',            sub: 'My niche is narrowing' },
  { id: 'pivot',      icon: '🧭', title: 'Want to pivot',            sub: 'Need a path to a new role' },
  { id: 'ahead',      icon: '🚀', title: 'Stay ahead',               sub: 'Proactive, not crisis mode' },
]

const BADGE: Record<number, string> = { 0: 'NOVICE', 1: 'NOVICE', 2: 'LEARNING', 3: 'CAPABLE', 4: 'STRONG', 5: 'EXPERT' }

export default function SkillsRating({ dark = false, onNext, onBack }: Props) {
  const T = mkT(dark)
  const { skills, concerns, setSkill, toggleConcern } = useSurveyStore()

  return (
    <div style={{ background: T.bg, color: T.fg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px' }}>

        {/* Nav */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 14px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: T.fg, padding: 0, lineHeight: 1 }}>←</button>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.muted }}>STEP 03 / 04</span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.muted }}>RATE YOURSELF</span>
        </header>

        {/* Progress */}
        <div style={{ height: 2, background: T.rule, marginBottom: 24 }}>
          <div style={{ height: '100%', background: T.fg, width: '75%', transition: 'width 0.3s' }} />
        </div>

        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: T.muted, marginBottom: 14 }}>YOUR LEVELS</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 56, lineHeight: 0.9, letterSpacing: '-0.04em', margin: '0 0 16px' }}>
            Where do<br />you <em style={{ fontStyle: 'italic', fontWeight: 700 }}>shine</em>?
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: T.muted, margin: 0 }}>
            Honest beats aspirational. 0 = never touched it, 5 = could teach a workshop tomorrow.
          </p>
        </div>

        {/* 00 What's driving this */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: T.muted }}>00</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.16em', color: T.fg }}>WHAT&apos;S DRIVING THIS</span>
            <span style={{ flex: 1, height: 1, background: T.rule }} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: T.muted, marginBottom: 10 }}>Pick all that apply</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {CONCERNS.map((c) => {
              const active = concerns.includes(c.id)
              return (
                <button
                  key={c.id}
                  onClick={() => toggleConcern(c.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 4,
                    padding: '14px 12px', border: `1px solid ${active ? T.fg : T.rule}`,
                    borderRadius: 8, cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
                    background: active ? T.fg : 'transparent', color: active ? T.bg : T.fg,
                  }}
                >
                  <span style={{ fontSize: 22, marginBottom: 4 }}>{c.icon}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>{c.title}</span>
                  <span style={{ fontSize: 11, lineHeight: 1.35, color: active ? (dark ? 'rgba(26,20,16,0.7)' : 'rgba(253,248,240,0.7)') : T.muted }}>{c.sub}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Skill groups */}
        {GROUPS.map((g, i) => (
          <div key={g.code} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: T.muted }}>0{i + 1}</span>
              <span style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 11,
                color: '#fdf8f0', background: g.color, padding: '4px 8px', borderRadius: 4, letterSpacing: '0.06em',
              }}>{g.code}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', color: T.fg }}>{g.title}</span>
                <span style={{ fontSize: 11, color: T.muted }}>{g.sub}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {g.skills.map((s) => {
                const val = skills[s.key]
                const badge = BADGE[val]
                const badgeActive = val >= 4
                return (
                  <div key={s.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: T.fg }}>{s.label}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 600, letterSpacing: '0.14em',
                        padding: '3px 8px', border: `1px solid ${badgeActive ? g.color : T.muted}`,
                        borderRadius: 999,
                        color: badgeActive ? '#fdf8f0' : T.fg,
                        background: badgeActive ? g.color : 'transparent',
                      }}>
                        {badge}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
                      {[0, 1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setSkill(s.key, n)}
                          aria-label={`Set ${s.label} to ${n}`}
                          style={{
                            height: 36, border: `1.5px solid ${n <= val ? g.color : T.rule}`,
                            borderRadius: 6, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: n <= val ? g.color : 'transparent',
                          }}
                        >
                          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: n <= val ? '#fdf8f0' : T.muted }}>
                            {n}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* spacer for sticky footer */}
        <div style={{ height: 80 }} />

        {/* Sticky footer */}
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480, padding: '16px 24px 24px',
          background: T.bg, borderTop: `1px solid ${T.rule}`,
        }}>
          <button
            onClick={onNext}
            style={{
              width: '100%', padding: '18px 24px', border: 'none', borderRadius: 999,
              cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 16, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
              background: T.fg, color: T.bg,
            }}
          >
            See my map
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700 }}>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
