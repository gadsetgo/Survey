'use client'

import { useEffect, useState } from 'react'
import { useSoftwareSurveyStore } from '@/lib/software-store'
import { buildSoftwareFallbackResults } from '@/lib/software-fallback'

interface Props {
  dark?: boolean
  onDone: () => void
}

const STEPS = [
  'Reading your engineering profile...',
  'Querying 2027 skill projections...',
  'Running gap analysis...',
  'Building your skill map...',
]

export default function SoftwareProcessing({ dark = false, onDone }: Props) {
  const [activeStep, setActiveStep] = useState(0)
  const [doneSteps, setDoneSteps] = useState<number[]>([])
  const store = useSoftwareSurveyStore()
  const setResults = useSoftwareSurveyStore((s) => s.setResults)

  const fg    = dark ? '#fdf8f0' : '#1a1410'
  const bg    = dark ? '#1a1410' : '#fdf8f0'
  const muted = dark ? 'rgba(253,248,240,0.55)' : 'rgba(26,20,16,0.55)'

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
    const t4 = setTimeout(() => {
      setDoneSteps([0, 1, 2, 3])
      setResults(buildSoftwareFallbackResults(store))
      onDone()
    }, 3200)

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{
      background: bg, color: fg, minHeight: '100vh',
      fontFamily: "'DM Sans', sans-serif",
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '0 24px',
    }}>
      <div style={{ position: 'relative', marginBottom: 40 }}>
        <div className="animate-orb" style={{ width: 96, height: 96, borderRadius: '50%', border: `2px solid ${dark ? '#1a4d44' : '#1d7a6b'}` }} />
        <div className="animate-orb" style={{ position: 'absolute', inset: 12, borderRadius: '50%', border: `2px solid ${dark ? '#3d2e6e' : '#5c4db1'}`, animationDelay: '0.3s' }} />
      </div>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, textAlign: 'center', marginBottom: 32, letterSpacing: '-0.02em' }}>
        {STEPS[activeStep]}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
        {STEPS.map((step, i) => {
          const isDone   = doneSteps.includes(i)
          const isActive = activeStep === i && !isDone
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                background: isDone ? '#3d6b4f' : isActive ? '#1d7a6b' : 'transparent',
                border: isDone || isActive ? 'none' : `1.5px solid ${muted}`,
                color: isDone || isActive ? '#fdf8f0' : muted,
                transition: 'all 0.3s',
              }}>
                {isDone ? '✓' : i + 1}
              </span>
              <span style={{ fontSize: 13, transition: 'color 0.3s', color: isDone ? '#3d6b4f' : isActive ? fg : muted }}>
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
