'use client'

import { useSoftwareSurveyStore } from '@/lib/software-store'

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
    id: 'FE', color: '#1d7a6b', label: 'FRONTEND', title: 'Frontend & UI',
    roles: [
      { id: 'fe-dev',         label: 'Frontend Developer' },
      { id: 'ui-engineer',    label: 'UI / UX Engineer' },
      { id: 'react-dev',      label: 'React / Vue Developer' },
      { id: 'mobile-dev',     label: 'Mobile Developer' },
      { id: 'design-systems', label: 'Design Systems Engineer' },
    ],
  },
  {
    id: 'BE', color: '#d95f3b', label: 'BACKEND', title: 'Backend & APIs',
    roles: [
      { id: 'be-dev',         label: 'Backend Developer' },
      { id: 'api-engineer',   label: 'API Engineer' },
      { id: 'systems-eng',    label: 'Systems Engineer' },
      { id: 'data-eng-sw',    label: 'Data Engineer (SW)' },
      { id: 'microservices',  label: 'Microservices Engineer' },
    ],
  },
  {
    id: 'PE', color: '#5c4db1', label: 'PLATFORM', title: 'Platform & DevOps / SRE',
    roles: [
      { id: 'devops-eng',     label: 'DevOps Engineer' },
      { id: 'platform-sre',   label: 'Platform / SRE Engineer' },
      { id: 'cloud-eng',      label: 'Cloud Engineer' },
      { id: 'security-eng',   label: 'Security Engineer' },
      { id: 'platform-admin-sw', label: 'Platform Admin' },
    ],
  },
  {
    id: 'AR', color: '#e88c2a', label: 'ARCHITECT', title: 'Architecture & Leadership',
    roles: [
      { id: 'fullstack-dev',  label: 'Full-stack Developer' },
      { id: 'product-eng',    label: 'Product Engineer' },
      { id: 'staff-eng',      label: 'Staff / Principal Engineer' },
      { id: 'eng-manager',    label: 'Engineering Manager' },
      { id: 'vp-engineering', label: 'VP / Head of Engineering' },
      { id: 'cto',            label: 'CTO / Technical Co-founder' },
    ],
  },
  {
    id: 'ML', color: '#2d7dd2', label: 'AI / ML', title: 'AI & Machine Learning',
    roles: [
      { id: 'ml-engineer',     label: 'ML Engineer' },
      { id: 'llm-engineer',    label: 'LLM / GenAI Engineer' },
      { id: 'ai-researcher',   label: 'AI Researcher' },
      { id: 'mlops-engineer',  label: 'MLOps Engineer' },
      { id: 'ai-product-eng',  label: 'AI Product Engineer' },
    ],
  },
  {
    id: 'QA', color: '#6b4f8e', label: 'QUALITY', title: 'Quality & Test Engineering',
    roles: [
      { id: 'qa-engineer',     label: 'QA Engineer' },
      { id: 'sdet',            label: 'SDET / Automation Engineer' },
      { id: 'qa-lead',         label: 'QA Lead' },
      { id: 'perf-engineer',   label: 'Performance Test Engineer' },
      { id: 'ai-safety-tester',label: 'AI Safety Tester' },
    ],
  },
]

export default function SoftwareRoleSelection({ dark = false, onNext, onBack }: Props) {
  const T = mkT(dark)
  const { selectedRoles, toggleRole, setSelectedCategories } = useSoftwareSurveyStore()
  const selected = new Set(selectedRoles)

  const toggle = (id: string, catId: string) => {
    toggleRole(id)
    const newSelected = selected.has(id)
      ? [...selectedRoles].filter((r) => r !== id)
      : [...selectedRoles, id]
    const activeCats = CATEGORIES
      .filter((cat) => cat.roles.some((role) => newSelected.includes(role.id)))
      .map((cat) => cat.id)
    setSelectedCategories(activeCats)
  }

  const canContinue = selected.size > 0

  return (
    <div style={{ background: T.bg, color: T.fg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px' }}>

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 14px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: T.fg, padding: 0, lineHeight: 1 }}>←</button>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.muted }}>STEP 01 / 03</span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.muted }}>{selected.size} SELECTED</span>
        </header>

        <div style={{ height: 2, background: T.rule, marginBottom: 24 }}>
          <div style={{ height: '100%', background: T.fg, width: '33%', transition: 'width 0.3s' }} />
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: T.muted, marginBottom: 14 }}>YOUR ROLE</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 48, lineHeight: 0.9, letterSpacing: '-0.04em', margin: '0 0 16px' }}>
            What kind<br />of engineer<br /><em style={{ fontStyle: 'italic', fontWeight: 700 }}>are you?</em>
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, color: T.muted }}>
            Pick every role you&apos;ve held or work close to. Many engineers span multiple tracks.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 24 }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', border: `1px solid ${T.rule}`, borderRadius: 999 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12, color: cat.color }}>{cat.id}</span>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: T.fg }}>{cat.label}</span>
            </div>
          ))}
        </div>

        <div style={{ paddingBottom: 120 }}>
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
                      onClick={() => toggle(role.id, cat.id)}
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
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

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
