'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import type { Skills, SkillKey } from '@/lib/types'

const SKILL_LABELS: Record<SkillKey, string> = {
  pipelines:    'Pipelines',
  sql:          'SQL',
  python:       'Python',
  cloud:        'Cloud',
  ai_tools:     'AI/LLM',
  modeling:     'Modeling',
  governance:   'Governance',
  dq:           'Quality',
  metadata:     'Metadata',
  bi_delivery:  'BI',
  compliance:   'Compliance',
  domain:       'Domain',
  stakeholders: 'Stake.',
  framing:      'Framing',
  storytelling: 'Story.',
  strategic:    'Strategic',
}

interface Props {
  current: Skills
  demand: Skills
}

export default function SpiderChart({ current, demand }: Props) {
  const data = (Object.keys(SKILL_LABELS) as SkillKey[]).map((key) => ({
    skill: SKILL_LABELS[key],
    current: current[key],
    demand: demand[key],
  }))

  return (
    <ResponsiveContainer width="100%" minWidth={280} aspect={1.2}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="rgba(26,20,16,0.14)" />
        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: 'rgba(26,20,16,0.55)' }} />
        <Radar name="Your level" dataKey="current" stroke="#1d7a6b" fill="#1d7a6b" fillOpacity={0.25} strokeWidth={2} />
        <Radar name="2027 demand" dataKey="demand" stroke="#e88c2a" fill="transparent" strokeWidth={2} strokeDasharray="4 2" />
      </RadarChart>
    </ResponsiveContainer>
  )
}
