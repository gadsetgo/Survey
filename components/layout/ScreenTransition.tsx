'use client'

import { useEffect, useState } from 'react'

interface Props {
  screenKey: number
  children: React.ReactNode
}

export default function ScreenTransition({ screenKey, children }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [screenKey])

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}
    >
      {children}
    </div>
  )
}
