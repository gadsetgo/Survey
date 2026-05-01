interface Props {
  label: string
  selected: boolean
  color: string
  bgColor: string
  onClick: () => void
}

export default function RolePill({ label, selected, color, bgColor, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer"
      style={{
        borderColor: selected ? color : 'var(--border)',
        backgroundColor: selected ? bgColor : 'transparent',
        color: selected ? color : 'var(--ink)',
      }}
    >
      {label}
    </button>
  )
}
