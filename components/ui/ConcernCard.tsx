interface Props {
  icon: string
  title: string
  subtitle: string
  selected: boolean
  isPositive?: boolean
  onClick: () => void
}

export default function ConcernCard({ icon, title, subtitle, selected, isPositive, onClick }: Props) {
  const borderColor = selected
    ? isPositive
      ? 'var(--amber)'
      : 'var(--coral)'
    : 'var(--border)'
  const bgColor = selected
    ? isPositive
      ? 'var(--amber-light)'
      : 'var(--coral-light)'
    : 'var(--surface)'

  return (
    <button
      onClick={onClick}
      className="rounded-xl border p-4 text-left flex gap-3 transition-all duration-150 cursor-pointer w-full"
      style={{ borderColor, backgroundColor: bgColor }}
    >
      <span className="text-xl leading-none mt-0.5">{icon}</span>
      <div>
        <div className="font-medium text-sm text-ink">{title}</div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {subtitle}
        </div>
      </div>
    </button>
  )
}
