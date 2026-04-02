export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-7 h-7 border-2', lg: 'w-11 h-11 border-2' }
  return (
    <div className={`${sizes[size]} border-navy-600 border-t-transparent rounded-full animate-spin ${className}`} />
  )
}
