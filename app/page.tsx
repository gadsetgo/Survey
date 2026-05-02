'use client'

import { useState } from 'react'
import ScreenTransition from '@/components/layout/ScreenTransition'
import Landing from '@/components/screens/Landing'
import RoleSelection from '@/components/screens/RoleSelection'
import CareerShape from '@/components/screens/CareerShape'
import SkillsRating from '@/components/screens/SkillsRating'
import Processing from '@/components/screens/Processing'
import Results from '@/components/screens/Results'
import SoftwareRoleSelection from '@/components/screens/SoftwareRoleSelection'
import SoftwareSkillsRating from '@/components/screens/SoftwareSkillsRating'
import SoftwareProcessing from '@/components/screens/SoftwareProcessing'
import SoftwareResults from '@/components/screens/SoftwareResults'
import { useSurveyStore } from '@/lib/store'
import { useSoftwareSurveyStore } from '@/lib/software-store'

export type Screen = 0 | 1 | 2 | 3 | 4 | 5

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(0)
  const [dark, setDark] = useState(false)
  const [surveyType, setSurveyType] = useState<'data' | 'software'>('data')

  const dataResults     = useSurveyStore((s) => s.results)
  const softwareResults = useSoftwareSurveyStore((s) => s.results)

  const goTo = (screen: Screen) => setCurrentScreen(screen)
  const next = () => setCurrentScreen((s) => Math.min(s + 1, 5) as Screen)

  const startData = () => { setSurveyType('data'); goTo(1) }
  const startSoftware = () => { setSurveyType('software'); goTo(1) }
  const restart = () => { goTo(0) }

  return (
    <main style={{ minHeight: '100vh', background: dark ? '#1a1410' : '#fdf8f0', transition: 'background 0.3s ease' }}>
      <ScreenTransition screenKey={currentScreen}>

        {currentScreen === 0 && (
          <Landing
            dark={dark}
            onStart={startData}
            onStartSoftware={startSoftware}
            onToggleDark={() => setDark((d) => !d)}
          />
        )}

        {/* ── Data survey ─────────────────────────────── */}
        {surveyType === 'data' && currentScreen === 1 && (
          <RoleSelection dark={dark} onNext={next} onBack={() => goTo(0)} />
        )}
        {surveyType === 'data' && currentScreen === 2 && (
          <CareerShape dark={dark} onNext={next} onBack={() => goTo(1)} />
        )}
        {surveyType === 'data' && currentScreen === 3 && (
          <SkillsRating dark={dark} onNext={() => goTo(4)} onBack={() => goTo(2)} />
        )}
        {surveyType === 'data' && currentScreen === 4 && (
          <Processing dark={dark} onDone={() => goTo(5)} />
        )}
        {surveyType === 'data' && currentScreen === 5 && dataResults && (
          <Results dark={dark} onRestart={restart} />
        )}

        {/* ── Software survey (3 steps: Roles → Skills → Results) ── */}
        {surveyType === 'software' && currentScreen === 1 && (
          <SoftwareRoleSelection dark={dark} onNext={() => goTo(3)} onBack={() => goTo(0)} />
        )}
        {surveyType === 'software' && currentScreen === 3 && (
          <SoftwareSkillsRating dark={dark} onNext={() => goTo(4)} onBack={() => goTo(1)} />
        )}
        {surveyType === 'software' && currentScreen === 4 && (
          <SoftwareProcessing dark={dark} onDone={() => goTo(5)} />
        )}
        {surveyType === 'software' && currentScreen === 5 && softwareResults && (
          <SoftwareResults dark={dark} onRestart={restart} />
        )}

      </ScreenTransition>
    </main>
  )
}
