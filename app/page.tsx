'use client'

import { useState } from 'react'
import ScreenTransition from '@/components/layout/ScreenTransition'
import Landing from '@/components/screens/Landing'
import RoleSelection from '@/components/screens/RoleSelection'
import CareerShape from '@/components/screens/CareerShape'
import SkillsRating from '@/components/screens/SkillsRating'
import Processing from '@/components/screens/Processing'
import Results from '@/components/screens/Results'
import { useSurveyStore } from '@/lib/store'

export type Screen = 0 | 1 | 2 | 3 | 4 | 5

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(0)
  const [dark, setDark] = useState(false)
  const results = useSurveyStore((s) => s.results)

  const goTo = (screen: Screen) => setCurrentScreen(screen)
  const next = () => setCurrentScreen((s) => Math.min(s + 1, 5) as Screen)

  return (
    <main
      style={{
        minHeight: '100vh',
        background: dark ? '#1a1410' : '#fdf8f0',
        transition: 'background 0.3s ease',
      }}
    >
      <ScreenTransition screenKey={currentScreen}>
        {currentScreen === 0 && (
          <Landing dark={dark} onStart={() => goTo(1)} onToggleDark={() => setDark((d) => !d)} />
        )}
        {currentScreen === 1 && (
          <RoleSelection dark={dark} onNext={next} onBack={() => goTo(0)} />
        )}
        {currentScreen === 2 && (
          <CareerShape dark={dark} onNext={next} onBack={() => goTo(1)} />
        )}
        {currentScreen === 3 && (
          <SkillsRating dark={dark} onNext={() => goTo(4)} onBack={() => goTo(2)} />
        )}
        {currentScreen === 4 && (
          <Processing dark={dark} onDone={() => goTo(5)} />
        )}
        {currentScreen === 5 && results && (
          <Results dark={dark} onRestart={() => goTo(0)} />
        )}
      </ScreenTransition>
    </main>
  )
}
