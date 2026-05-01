'use client'

import { useState } from 'react'
import ScreenTransition from '@/components/layout/ScreenTransition'
import ProgressBar from '@/components/ui/ProgressBar'
import Landing from '@/components/screens/Landing'
import RoleSelection from '@/components/screens/RoleSelection'
import CareerShape from '@/components/screens/CareerShape'
import SkillsRating from '@/components/screens/SkillsRating'
import Processing from '@/components/screens/Processing'
import Results from '@/components/screens/Results'
import { useSurveyStore } from '@/lib/store'

export type Screen = 0 | 1 | 2 | 3 | 4 | 5

const TOTAL_STEPS = 3

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(0)
  const results = useSurveyStore((s) => s.results)

  const goTo = (screen: Screen) => setCurrentScreen(screen)
  const next = () => setCurrentScreen((s) => Math.min(s + 1, 5) as Screen)

  const step = currentScreen >= 1 && currentScreen <= 3 ? currentScreen : null

  return (
    <main className="min-h-screen bg-paper">
      {step !== null && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <ProgressBar step={step} total={TOTAL_STEPS} />
        </div>
      )}

      <ScreenTransition screenKey={currentScreen}>
        {currentScreen === 0 && <Landing onStart={() => goTo(1)} />}
        {currentScreen === 1 && <RoleSelection onNext={next} />}
        {currentScreen === 2 && <CareerShape onNext={next} />}
        {currentScreen === 3 && <SkillsRating onNext={() => goTo(4)} />}
        {currentScreen === 4 && <Processing onDone={() => goTo(5)} />}
        {currentScreen === 5 && results && <Results onRestart={() => goTo(0)} />}
      </ScreenTransition>
    </main>
  )
}
