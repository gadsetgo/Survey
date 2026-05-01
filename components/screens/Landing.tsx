interface Props {
  onStart: () => void
}

export default function Landing({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-lg w-full">
        {/* Animated pill */}
        <div
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium mb-8"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-blink"
            style={{ backgroundColor: 'var(--amber)' }}
          />
          data &amp; analytics · 2025–2027
        </div>

        {/* Headline */}
        <h1
          className="font-syne text-4xl font-extrabold leading-tight mb-4"
          style={{ fontSize: '28px' }}
        >
          Is your data career{' '}
          <span style={{ color: 'var(--amber)' }}>future-proof?</span>
        </h1>

        {/* Subtext */}
        <p className="text-sm leading-relaxed mb-8 max-w-sm mx-auto" style={{ color: 'var(--muted)' }}>
          The field is shifting fast. Take 3 minutes and we'll show you exactly
          where your skills stand — and what to build next.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            '20 data roles covered',
            'Spider chart + personalized roadmap',
            'Research-backed · 2025–2027',
            '3 min · no signup',
          ].map((badge) => (
            <span
              key={badge}
              className="rounded-full border px-3 py-1 text-xs"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--ink)' }}
        >
          Let&apos;s find out
          <span aria-hidden>→</span>
        </button>

        <p className="text-xs mt-4" style={{ color: 'var(--muted)' }}>
          3 min · no signup
        </p>
      </div>
    </div>
  )
}
