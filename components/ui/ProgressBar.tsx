interface Props {
  step: number
  total: number
}

export default function ProgressBar({ step, total }: Props) {
  const pct = Math.round((step / total) * 100)
  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}
