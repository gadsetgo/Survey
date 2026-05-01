interface Props {
  icon: string
  label: string
  count: number
  color: string
  bgColor: string
}

export default function MetricCard({ icon, label, count, color, bgColor }: Props) {
  return (
    <div
      className="rounded-xl border p-4 flex flex-col items-center gap-1 text-center"
      style={{ borderColor: color, backgroundColor: bgColor }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-3xl font-bold font-syne" style={{ color }}>
        {count}
      </span>
      <span className="text-xs font-medium uppercase tracking-wider" style={{ color }}>
        {label}
      </span>
    </div>
  )
}
