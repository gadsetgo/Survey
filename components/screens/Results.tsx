'use client'

import { useState } from 'react'
import { useSurveyStore } from '@/lib/store'
import SpiderChart from '@/components/ui/SpiderChart'
import MetricCard from '@/components/ui/MetricCard'
import RoadmapBand from '@/components/ui/RoadmapBand'
import SkillSlider from '@/components/ui/SkillSlider'
import type { SkillKey } from '@/lib/types'

interface Props {
  onRestart: () => void
}

const DESTINATION_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  best_fit:     { label: 'Best fit',        color: 'var(--sage)',   bg: '#e8f5ee' },
  stretch:      { label: 'Stretch',         color: '#2563eb',       bg: '#eff6ff' },
  long_horizon: { label: '2–3 yr horizon',  color: 'var(--amber)',  bg: 'var(--amber-light)' },
}

export default function Results({ onRestart }: Props) {
  const store = useSurveyStore()
  const results = store.results!
  const [skills, setSkills] = useState({ ...store.skills })

  const handleSkillChange = (key: SkillKey, value: number) => {
    setSkills((prev) => ({ ...prev, [key]: value }))
  }

  const gapCounts = Object.values(results.gap_analysis).reduce(
    (acc, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const profileParts = [
    store.selectedRoles[0],
    store.skillShape,
    store.seniority,
    store.yearsExperience,
    store.industry,
  ].filter(Boolean)

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 pt-16">
      {/* Profile badge */}
      <div
        className="rounded-full border px-4 py-2 text-xs font-medium mb-8 inline-block"
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
      >
        {profileParts.join(' · ')}
      </div>

      {/* Spider chart */}
      <div
        className="rounded-2xl border p-6 mb-6"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
      >
        <h2 className="font-syne font-bold mb-1" style={{ fontSize: '18px' }}>
          Your skill map
        </h2>
        <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
          Drag the sliders below to correct your skill levels — the chart
          updates live.
        </p>
        <SpiderChart current={skills} demand={results.demand_levels} />
      </div>

      {/* Adjustable sliders */}
      <div
        className="rounded-2xl border p-6 mb-6"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
      >
        <h3 className="font-semibold text-sm mb-4">Adjust your skill levels</h3>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {(Object.keys(skills) as SkillKey[]).map((key) => (
            <SkillSlider
              key={key}
              skillKey={key}
              label={key.replace(/_/g, ' ')}
              value={skills[key]}
              onChange={handleSkillChange}
            />
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <MetricCard
          icon="✅"
          label="Aligned"
          count={gapCounts['aligned'] || 0}
          color="var(--sage)"
          bgColor="#e8f5ee"
        />
        <MetricCard
          icon="🔴"
          label="Urgent gaps"
          count={gapCounts['urgent_gap'] || 0}
          color="var(--coral)"
          bgColor="var(--coral-light)"
        />
        <MetricCard
          icon="🟡"
          label="At risk"
          count={gapCounts['at_risk'] || 0}
          color="var(--amber)"
          bgColor="var(--amber-light)"
        />
      </div>

      {/* Role destinations */}
      <div className="mb-6">
        <h3 className="font-syne font-bold mb-3" style={{ fontSize: '16px' }}>
          Where you could go
        </h3>
        <div className="space-y-3">
          {results.role_destinations.map((dest) => {
            const style = DESTINATION_STYLES[dest.type]
            return (
              <div
                key={dest.type}
                className="rounded-xl border p-4"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-sm text-ink">{dest.title}</span>
                  <span
                    className="text-xs rounded-full px-2.5 py-0.5 font-medium flex-shrink-0"
                    style={{ backgroundColor: style.bg, color: style.color }}
                  >
                    {style.label}
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>{dest.rationale}</p>
                <div className="flex flex-wrap gap-1.5">
                  {dest.key_skills.map((sk) => (
                    <span
                      key={sk}
                      className="text-xs rounded-full px-2.5 py-0.5 border"
                      style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Roadmap */}
      <div className="mb-6">
        <h3 className="font-syne font-bold mb-4" style={{ fontSize: '16px' }}>
          Your learning roadmap
        </h3>
        <RoadmapBand band="90 days" label="Quick wins" color="var(--teal)" steps={results.roadmap.quick_wins} />
        <RoadmapBand band="6 months" label="Core builds" color="var(--violet)" steps={results.roadmap.core_builds} />
        <RoadmapBand band="12–18 months" label="Role pivot enablers" color="var(--coral)" steps={results.roadmap.pivot_enablers} />
      </div>

      {/* Skills to protect */}
      {results.skills_to_protect.length > 0 && (
        <div
          className="rounded-xl border p-4 mb-8"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
        >
          <h3 className="font-semibold text-sm mb-2 text-ink">
            Don&apos;t neglect these
          </h3>
          <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
            They&apos;re your competitive foundation.
          </p>
          <div className="flex flex-wrap gap-2">
            {results.skills_to_protect.map((sk) => (
              <span
                key={sk}
                className="text-xs rounded-full px-3 py-1 font-medium"
                style={{ backgroundColor: '#e8f5ee', color: 'var(--sage)' }}
              >
                {sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onRestart}
          className="rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-amber-light cursor-pointer"
          style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
        >
          Start over
        </button>
      </div>
    </div>
  )
}
