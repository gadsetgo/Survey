interface Props {
  glyph: string
  title: string
  subtitle: string
  selected: boolean
  onClick: () => void
}

export default function ShapeCard({ glyph, title, subtitle, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border p-5 flex flex-col items-center gap-2 transition-all duration-150 cursor-pointer"
      style={{
        borderColor: selected ? 'var(--violet)' : 'var(--border)',
        backgroundColor: selected ? 'var(--violet-light)' : 'var(--surface)',
      }}
    >
      <span
        className="text-2xl font-bold font-syne"
        style={{ color: selected ? 'var(--violet)' : 'var(--muted)' }}
      >
        {glyph}
      </span>
      <span className="font-semibold text-sm text-ink">{title}</span>
      <span className="text-xs text-center" style={{ color: 'var(--muted)' }}>
        {subtitle}
      </span>
    </button>
  )
}
