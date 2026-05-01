'use client'

import type { SkillKey } from '@/lib/types'

const BADGE_LABELS: Record<number, string> = {
  0: 'none',
  1: 'beginner',
  2: 'familiar',
  3: 'solid',
  4: 'strong',
  5: 'expert',
}

interface Props {
  skillKey: SkillKey
  label: string
  value: number
  onChange: (key: SkillKey, value: number) => void
}

export default function SkillSlider({ skillKey, label, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-4 py-2 min-h-[44px]">
      <span className="text-sm text-ink w-44 flex-shrink-0">{label}</span>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(skillKey, parseInt(e.target.value, 10))}
        className="flex-1"
        style={{
          background: `linear-gradient(to right, var(--amber) 0%, var(--amber) ${(value / 5) * 100}%, var(--border) ${(value / 5) * 100}%, var(--border) 100%)`,
        }}
      />
      <span
        className="text-xs font-medium rounded-full px-2.5 py-0.5 w-16 text-center flex-shrink-0"
        style={{
          backgroundColor: value === 0 ? 'var(--border)' : 'var(--amber-light)',
          color: value === 0 ? 'var(--muted)' : 'var(--amber-dark)',
        }}
      >
        {BADGE_LABELS[value]}
      </span>
    </div>
  )
}
