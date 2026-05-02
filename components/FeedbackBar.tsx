'use client'

import { useState } from 'react'

interface Props {
  dark?: boolean
  surveyType?: 'data' | 'software'
}

const mkT = (dark: boolean) => dark
  ? { bg: '#221a14', fg: '#fdf8f0', muted: 'rgba(253,248,240,0.55)', rule: 'rgba(253,248,240,0.14)', input: '#2e2218' }
  : { bg: '#f6efe2', fg: '#1a1410', muted: 'rgba(26,20,16,0.55)',    rule: 'rgba(26,20,16,0.14)',    input: '#fdf8f0'  }

export default function FeedbackBar({ dark = false, surveyType }: Props) {
  const T = mkT(dark)
  const [helpful, setHelpful] = useState<'yes' | 'no' | null>(null)
  const [email, setEmail] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')

  const handleSubmit = async () => {
    if (status !== 'idle') return
    setStatus('sending')
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, helpful, suggestion, survey_type: surveyType }),
      })
      setStatus('done')
    } catch {
      setStatus('done')
    }
  }

  return (
    <div className="no-print" style={{ borderTop: `1px solid ${T.rule}`, paddingTop: 24, marginBottom: 32 }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: T.muted, marginBottom: 16 }}>
        WAS THIS USEFUL?
      </div>

      {status === 'done' ? (
        <div style={{
          padding: '18px 20px', borderRadius: 12, background: T.bg, border: `1px solid ${T.rule}`,
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.muted, textAlign: 'center',
        }}>
          Thanks — we&apos;ll notify you when new data lands 🙌
        </div>
      ) : (
        <>
          {/* Helpful vote */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {(['yes', 'no'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setHelpful(v)}
                style={{
                  padding: '10px 20px', borderRadius: 999, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                  border: `1px solid ${helpful === v ? T.fg : T.rule}`,
                  background: helpful === v ? T.fg : 'transparent',
                  color: helpful === v ? (dark ? '#1a1410' : '#fdf8f0') : T.fg,
                  transition: 'all 0.15s',
                }}
              >
                {v === 'yes' ? '👍 Yes' : '👎 Not really'}
              </button>
            ))}
          </div>

          {/* Email subscribe */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: T.muted, marginBottom: 8 }}>
              GET 2027 UPDATES
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1, padding: '12px 14px', border: `1px solid ${T.rule}`, borderRadius: 8,
                  background: T.input, color: T.fg, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={status === 'sending'}
                style={{
                  padding: '12px 18px', border: 'none', borderRadius: 8, cursor: 'pointer',
                  background: T.fg, color: dark ? '#1a1410' : '#fdf8f0',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                  opacity: status === 'sending' ? 0.5 : 1,
                  flexShrink: 0,
                }}
              >
                Subscribe →
              </button>
            </div>
          </div>

          {/* Suggestion */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: T.muted, marginBottom: 8 }}>
              SUGGEST A FUTURE SURVEY
            </div>
            <textarea
              placeholder="What should we survey next? (e.g. product management skills, climate tech, web3...)"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '12px 14px', border: `1px solid ${T.rule}`, borderRadius: 8,
                background: T.input, color: T.fg, fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                outline: 'none', resize: 'vertical', boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={status === 'sending'}
              style={{
                marginTop: 8, padding: '12px 20px', border: `1px solid ${T.rule}`, borderRadius: 8,
                background: 'transparent', color: T.fg, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                opacity: status === 'sending' ? 0.5 : 1,
              }}
            >
              Send suggestion
            </button>
          </div>
        </>
      )}
    </div>
  )
}
