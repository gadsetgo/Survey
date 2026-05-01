interface Props {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}

export default function OptionCard({ selected, onClick, children, className = '' }: Props) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-all duration-150 cursor-pointer w-full ${className}`}
      style={{
        borderColor: selected ? 'var(--amber)' : 'var(--border)',
        backgroundColor: selected ? 'var(--amber-light)' : 'var(--surface)',
      }}
    >
      {children}
    </button>
  )
}
