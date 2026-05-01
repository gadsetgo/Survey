'use client'

import { useSurveyStore } from '@/lib/store'
import OptionCard from '@/components/ui/OptionCard'
import ShapeCard from '@/components/ui/ShapeCard'

interface Props {
  onNext: () => void
}

const SENIORITY = [
  { emoji: '🔧', title: 'Individual contributor', subtitle: 'IC · analyst · engineer', fullWidth: false },
  { emoji: '⚡', title: 'Senior IC / specialist', subtitle: 'Deep expertise · cross-team influence', fullWidth: false },
  { emoji: '🧭', title: 'Lead / team manager', subtitle: 'Manages people or workstream', fullWidth: false },
  { emoji: '🏗️', title: 'Director / Head of', subtitle: 'Multi-team · stakeholders', fullWidth: false },
  { emoji: '🎯', title: 'VP / C-suite (CDO, CTO, CAO)', subtitle: 'Enterprise-wide strategy', fullWidth: true },
]

const YEARS = ['0–3 yrs', '4–8 yrs', '9–15 yrs', '15+ yrs']

const SHAPES = [
  { glyph: 'I', title: 'Deep specialist', subtitle: 'One strong vertical' },
  { glyph: 'T', title: 'T-shaped', subtitle: 'One deep + broad base' },
  { glyph: '⌖', title: 'Comb-shaped', subtitle: 'Multiple deep areas' },
]

const LEADERSHIP = [
  'People management',
  'Stakeholder management',
  'Strategy & roadmap',
  'Executive reporting',
  'Budget ownership',
  'Vendor management',
]

export default function CareerShape({ onNext }: Props) {
  const {
    seniority, yearsExperience, skillShape, leadershipActivities,
    setSeniority, setYearsExperience, setSkillShape, toggleLeadershipActivity,
  } = useSurveyStore()

  const canContinue = !!seniority && !!yearsExperience && !!skillShape

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 pt-24">
      <h2 className="font-syne font-bold mb-1" style={{ fontSize: '20px' }}>
        Your career shape
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
        Not what you know — how you operate.
      </p>

      {/* Seniority */}
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
          Seniority
        </div>
        <div className="grid grid-cols-2 gap-2">
          {SENIORITY.map((s) => (
            <OptionCard
              key={s.title}
              selected={seniority === s.title}
              onClick={() => setSeniority(s.title)}
              className={s.fullWidth ? 'col-span-2' : ''}
            >
              <span className="text-lg">{s.emoji}</span>
              <div className="font-semibold text-sm text-ink mt-1">{s.title}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.subtitle}</div>
            </OptionCard>
          ))}
        </div>
      </div>

      {/* Years */}
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
          Years in data
        </div>
        <div className="flex flex-wrap gap-2">
          {YEARS.map((y) => (
            <button
              key={y}
              onClick={() => setYearsExperience(y)}
              className="rounded-full border px-4 py-1.5 text-sm transition-all duration-150 cursor-pointer"
              style={{
                borderColor: yearsExperience === y ? 'var(--amber)' : 'var(--border)',
                backgroundColor: yearsExperience === y ? 'var(--amber-light)' : 'transparent',
                color: yearsExperience === y ? 'var(--amber-dark)' : 'var(--ink)',
              }}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Skill shape */}
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
          Skill shape
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SHAPES.map((sh) => (
            <ShapeCard
              key={sh.glyph}
              {...sh}
              selected={skillShape === sh.title}
              onClick={() => setSkillShape(sh.title)}
            />
          ))}
        </div>
      </div>

      {/* Leadership */}
      <div className="mb-10">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
          Leadership activities (select all that apply)
        </div>
        <div className="flex flex-wrap gap-2">
          {LEADERSHIP.map((act) => (
            <button
              key={act}
              onClick={() => toggleLeadershipActivity(act)}
              className="rounded-full border px-3 py-1.5 text-sm transition-all duration-150 cursor-pointer"
              style={{
                borderColor: leadershipActivities.includes(act) ? 'var(--amber)' : 'var(--border)',
                backgroundColor: leadershipActivities.includes(act) ? 'var(--amber-light)' : 'transparent',
                color: leadershipActivities.includes(act) ? 'var(--amber-dark)' : 'var(--ink)',
              }}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white"
          style={{
            backgroundColor: 'var(--ink)',
            opacity: canContinue ? 1 : 0.35,
            cursor: canContinue ? 'pointer' : 'not-allowed',
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
