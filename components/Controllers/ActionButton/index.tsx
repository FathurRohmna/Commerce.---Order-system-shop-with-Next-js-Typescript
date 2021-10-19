interface Props {
  color: string
  children: React.ReactNode
  onClick: () => void
}

export default function ActionButton(props: Props) {
  const { type, children, onClick } = props

  return (
    <button
      className={`relative inline-flex items-center mx-1 px-1 py-1 rounded-md border font-medium ${type == 'normal' ? 'border-yellow-500 text-yellow-500' : 'border-red-600 text-red-600'} bg-white text-sm`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}