import type { RoadmapStep } from '@/lib/types'

interface Props {
  band: string
  label: string
  color: string
  steps: RoadmapStep[]
}

export default function RoadmapBand({ band, label, color, steps }: Props) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1"
          style={{ backgroundColor: color + '22', color }}
        >
          {band}
        </span>
        <span className="text-sm" style={{ color: 'var(--muted)' }}>
          {label}
        </span>
      </div>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className="rounded-xl border p-4 flex gap-3"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <span
              className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5"
              style={{ backgroundColor: color }}
            >
              {i + 1}
            </span>
            <div>
              <div className="font-semibold text-sm text-ink">{step.title}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                {step.detail}
              </div>
              {step.resources.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {step.resources.map((r, ri) => (
                    <span
                      key={ri}
                      className="text-xs rounded-full px-2.5 py-0.5 border"
                      style={{
                        borderColor: 'var(--border)',
                        color: 'var(--muted)',
                      }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
