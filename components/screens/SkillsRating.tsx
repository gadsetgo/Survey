'use client'

import { useSurveyStore } from '@/lib/store'
import SkillSlider from '@/components/ui/SkillSlider'
import ConcernCard from '@/components/ui/ConcernCard'
import type { SkillKey } from '@/lib/types'

interface Props {
  onNext: () => void
}

const TECHNICAL: { key: SkillKey; label: string }[] = [
  { key: 'data_pipelines',  label: 'Data pipelines / ETL' },
  { key: 'sql_fluency',     label: 'SQL & query fluency' },
  { key: 'python',          label: 'Python / scripting' },
  { key: 'cloud_platforms', label: 'Cloud platforms' },
  { key: 'ai_llm_tools',    label: 'AI / LLM tools' },
  { key: 'data_modeling',   label: 'Data modeling' },
]

const DOMAIN: { key: SkillKey; label: string }[] = [
  { key: 'data_governance', label: 'Data governance / policy' },
  { key: 'data_quality',    label: 'Data quality frameworks' },
  { key: 'analytics_bi',   label: 'Analytics & BI delivery' },
  { key: 'regulatory',      label: 'Regulatory / compliance' },
]

const SOFT: { key: SkillKey; label: string }[] = [
  { key: 'stakeholder_comms', label: 'Stakeholder communication' },
  { key: 'business_domain',   label: 'Business domain fluency' },
  { key: 'problem_framing',   label: 'Problem framing' },
  { key: 'mentoring',         label: 'Mentoring / team building' },
  { key: 'change_management', label: 'Change management' },
  { key: 'product_thinking',  label: 'Product thinking' },
]

const CONCERNS = [
  { icon: '🤖', title: 'My role is at risk from automation', subtitle: 'AI agents are taking over tasks I do today', isPositive: false },
  { icon: '📉', title: "I'm falling behind on AI skills", subtitle: "Peers are upskilling faster and I don't know where to start", isPositive: false },
  { icon: '🏔️', title: "I've hit a ceiling in my specialization", subtitle: 'My niche is narrowing and I need to broaden my profile', isPositive: false },
  { icon: '🧭', title: 'I want to pivot to a different role', subtitle: "I know roughly where I want to go — just not how to get there", isPositive: false },
  { icon: '🚀', title: "I'm doing well — I want to stay ahead", subtitle: 'Proactive upskilling, not crisis mode', isPositive: true },
]

export default function SkillsRating({ onNext }: Props) {
  const { skills, concerns, setSkill, toggleConcern } = useSurveyStore()

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 pt-24">
      <h2 className="font-syne font-bold mb-1" style={{ fontSize: '20px' }}>
        Rate yourself honestly
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
        0 = never used it · 3 = solid working level · 5 = you could teach it.
        You can adjust after.
      </p>

      {/* Technical */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--teal)' }}>
          Technical
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {TECHNICAL.map((s) => (
            <SkillSlider key={s.key} skillKey={s.key} label={s.label} value={skills[s.key]} onChange={setSkill} />
          ))}
        </div>
      </div>

      {/* Domain */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--coral)' }}>
          Domain &amp; Functional
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {DOMAIN.map((s) => (
            <SkillSlider key={s.key} skillKey={s.key} label={s.label} value={skills[s.key]} onChange={setSkill} />
          ))}
        </div>
      </div>

      {/* Soft */}
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--violet)' }}>
          Soft Skills &amp; Cross-functional
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {SOFT.map((s) => (
            <SkillSlider key={s.key} skillKey={s.key} label={s.label} value={skills[s.key]} onChange={setSkill} />
          ))}
        </div>
      </div>

      {/* Concerns */}
      <div className="mb-10">
        <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>
          What&apos;s on your mind?
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>
          Pick everything that fits.
        </p>
        <div className="space-y-2">
          {CONCERNS.map((c) => (
            <ConcernCard
              key={c.title}
              {...c}
              selected={concerns.includes(c.title)}
              onClick={() => toggleConcern(c.title)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--ink)' }}
        >
          Build my skill map ✦
        </button>
      </div>
    </div>
  )
}
