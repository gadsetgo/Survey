'use client'

import { useSurveyStore } from '@/lib/store'
import RolePill from '@/components/ui/RolePill'

interface Props {
  onNext: () => void
}

const CATEGORIES = [
  {
    id: 'de',
    label: 'Data Engineering & Infrastructure',
    color: '#1d7a6b',
    bgColor: '#e0f4f0',
    roles: [
      'Data engineer',
      'Analytics engineer',
      'Data architect',
      'DataOps engineer',
      'Cloud data engineer',
    ],
  },
  {
    id: 'bi',
    label: 'Analytics & Business Intelligence',
    color: '#d95f3b',
    bgColor: '#fdeee9',
    roles: [
      'BI developer / analyst',
      'Data analyst',
      'Product analyst',
      'Marketing analyst',
      'Financial data analyst',
    ],
  },
  {
    id: 'ds',
    label: 'Data Science & AI/ML',
    color: '#5c4db1',
    bgColor: '#eeeafb',
    roles: [
      'Data scientist',
      'ML engineer',
      'AI / LLM engineer',
      'NLP engineer',
      'Research scientist',
    ],
  },
  {
    id: 'dg',
    label: 'Data Governance & Strategy',
    color: '#e88c2a',
    bgColor: '#fdf0d5',
    roles: [
      'Data governance manager',
      'Data steward',
      'Chief data officer',
      'Data product manager',
      'Metadata / catalog analyst',
    ],
  },
]

const INDUSTRIES = [
  'Financial services',
  'Insurance',
  'Healthcare',
  'Tech / SaaS',
  'Retail / e-commerce',
  'Manufacturing',
  'Consulting',
  'Public sector',
]

export default function RoleSelection({ onNext }: Props) {
  const { selectedRoles, industry, toggleRole, setIndustry } = useSurveyStore()

  const selectedCategoryIds = CATEGORIES.filter((cat) =>
    cat.roles.some((r) => selectedRoles.includes(r))
  ).map((c) => c.id)

  const isMultiDomain = selectedCategoryIds.length >= 2
  const canContinue = selectedRoles.length > 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 pt-24">
      <h2
        className="font-syne font-bold mb-1"
        style={{ fontSize: '20px' }}
      >
        What&apos;s your role?
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
        Pick everything that fits — you can wear more than one hat.
      </p>

      {/* Role categories */}
      <div className="space-y-5 mb-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.id}>
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: cat.color }}
            >
              {cat.label}
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.roles.map((role) => (
                <RolePill
                  key={role}
                  label={role}
                  selected={selectedRoles.includes(role)}
                  color={cat.color}
                  bgColor={cat.bgColor}
                  onClick={() => toggleRole(role)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Multi-domain notice */}
      {isMultiDomain && (
        <div
          className="rounded-xl p-4 mb-6 text-sm animate-fade-up"
          style={{
            backgroundColor: 'var(--violet-light)',
            color: 'var(--violet)',
          }}
        >
          <strong>Nice — you&apos;re a multi-domain pro.</strong> Selecting roles across
          categories maps you as comb-shaped. We&apos;ll treat that as the strategic
          asset it is.
        </div>
      )}

      {/* Industry selector */}
      <div className="mb-8">
        <div
          className="text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: 'var(--muted)' }}
        >
          Industry (optional)
        </div>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustry(industry === ind ? null : ind)}
              className="rounded-full border px-3 py-1.5 text-sm transition-all duration-150 cursor-pointer"
              style={{
                borderColor: industry === ind ? 'var(--amber)' : 'var(--border)',
                backgroundColor: industry === ind ? 'var(--amber-light)' : 'transparent',
                color: industry === ind ? 'var(--amber-dark)' : 'var(--ink)',
              }}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: 'var(--muted)' }}>
          {selectedRoles.length > 0
            ? `${selectedRoles.length} role${selectedRoles.length > 1 ? 's' : ''} selected`
            : 'Select at least 1 role'}
        </span>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity"
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
