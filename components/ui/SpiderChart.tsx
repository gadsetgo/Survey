'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { Skills, SkillKey } from '@/lib/types'

const SKILL_LABELS: Record<SkillKey, string> = {
  data_pipelines:   'Pipelines',
  sql_fluency:      'SQL',
  python:           'Python',
  cloud_platforms:  'Cloud',
  ai_llm_tools:     'AI/LLM',
  data_modeling:    'Modeling',
  data_governance:  'Governance',
  data_quality:     'Data Quality',
  analytics_bi:     'Analytics/BI',
  regulatory:       'Regulatory',
  stakeholder_comms:'Stakeholders',
  business_domain:  'Biz Domain',
  problem_framing:  'Problem Framing',
  mentoring:        'Mentoring',
  change_management:'Change Mgmt',
  product_thinking: 'Product',
}

interface Props {
  current: Skills
  demand: Skills
  highlightedKey?: SkillKey | null
}

export default function SpiderChart({ current, demand, highlightedKey }: Props) {
  const data = (Object.keys(SKILL_LABELS) as SkillKey[]).map((key) => ({
    skill: SKILL_LABELS[key],
    key,
    current: current[key],
    demand: demand[key],
  }))

  return (
    <ResponsiveContainer width="100%" minWidth={280} aspect={1.2}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fontSize: 11, fill: 'var(--muted)' }}
        />
        <Radar
          name="Your level"
          dataKey="current"
          stroke="var(--amber)"
          fill="var(--amber)"
          fillOpacity={0.35}
          strokeWidth={2}
        />
        <Radar
          name="2027 demand"
          dataKey="demand"
          stroke="var(--ink)"
          fill="transparent"
          strokeWidth={2}
          strokeDasharray="4 2"
        />
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          formatter={(value) => (
            <span style={{ color: 'var(--muted)' }}>{value}</span>
          )}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
