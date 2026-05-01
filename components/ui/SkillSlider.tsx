'use client'

import type { SkillKey } from '@/lib/types'

const BADGE_LABELS: Record<number, string> = {
  0: 'none', 1: 'beginner', 2: 'familiar', 3: 'solid', 4: 'strong', 5: 'expert',
}

interface Props {
  skillKey: SkillKey
  label: string
  value: number
  onChange: (key: SkillKey, value: number) => void
}

export default function SkillSlider({ skillKey, label, value, onChange }: Props) {
  const pct = (value / 5) * 100
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', minHeight: 44 }}>
      <span style={{ fontSize: 13, flex: 1 }}>{label}</span>
      <input
        type="range" min={0} max={5} step={1} value={value}
        onChange={(e) => onChange(skillKey, parseInt(e.target.value, 10))}
        style={{
          flex: 2,
          background: `linear-gradient(to right, #e88c2a 0%, #e88c2a ${pct}%, #e8dcc8 ${pct}%, #e8dcc8 100%)`,
        }}
      />
      <span style={{
        fontSize: 11, fontWeight: 500, borderRadius: 999, padding: '2px 8px', width: 60, textAlign: 'center',
        background: value === 0 ? '#e8dcc8' : '#fdf0d5',
        color: value === 0 ? '#8a7d6a' : '#b06a10',
      }}>
        {BADGE_LABELS[value]}
      </span>
    </div>
  )
}
