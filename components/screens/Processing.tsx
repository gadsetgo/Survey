'use client'

import { useEffect, useState } from 'react'
import { useSurveyStore } from '@/lib/store'

interface Props {
  onDone: () => void
}

const STEPS = [
  'Reading your role context...',
  'Querying 2027 skill projections...',
  'Running gap analysis...',
  'Building your spider chart...',
]

export default function Processing({ onDone }: Props) {
  const [activeStep, setActiveStep] = useState(0)
  const [doneSteps, setDoneSteps] = useState<number[]>([])
  const store = useSurveyStore()
  const setResults = useSurveyStore((s) => s.setResults)

  useEffect(() => {
    let step = 0

    const advance = () => {
      if (step < STEPS.length - 1) {
        setDoneSteps((prev) => [...prev, step])
        step++
        setActiveStep(step)
      }
    }

    const t1 = setTimeout(advance, 900)
    const t2 = setTimeout(advance, 1800)
    const t3 = setTimeout(advance, 2700)

    const doFetch = async () => {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selectedRoles: store.selectedRoles,
            selectedCategories: store.selectedCategories,
            industry: store.industry,
            seniority: store.seniority,
            yearsExperience: store.yearsExperience,
            skillShape: store.skillShape,
            leadershipActivities: store.leadershipActivities,
            skills: store.skills,
            concerns: store.concerns,
            results: null,
          }),
        })
        const data = await res.json()
        setDoneSteps([0, 1, 2, 3])
        setResults(data)
        setTimeout(onDone, 400)
      } catch (e) {
        console.error('API error:', e)
      }
    }

    doFetch()
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Pulsing orb */}
      <div className="relative mb-10">
        <div
          className="w-24 h-24 rounded-full border-2 animate-orb"
          style={{ borderColor: 'var(--amber)' }}
        />
        <div
          className="absolute inset-3 rounded-full border-2 animate-orb"
          style={{
            borderColor: 'var(--amber-mid)',
            animationDelay: '0.3s',
          }}
        />
      </div>

      {/* Cycling headline */}
      <h2 className="font-syne font-bold text-xl mb-8" style={{ color: 'var(--ink)' }}>
        {STEPS[activeStep]}
      </h2>

      {/* Step tracker */}
      <div className="space-y-2 w-full max-w-xs text-left">
        {STEPS.map((step, i) => {
          const isDone = doneSteps.includes(i)
          const isActive = activeStep === i && !isDone
          return (
            <div key={i} className="flex items-center gap-3">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-colors duration-300"
                style={{
                  backgroundColor: isDone
                    ? 'var(--sage)'
                    : isActive
                    ? 'var(--amber)'
                    : 'var(--border)',
                  color: isDone || isActive ? 'white' : 'var(--muted)',
                }}
              >
                {isDone ? '✓' : i + 1}
              </span>
              <span
                className="text-sm transition-colors duration-300"
                style={{
                  color: isDone
                    ? 'var(--sage)'
                    : isActive
                    ? 'var(--ink)'
                    : 'var(--muted)',
                }}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
