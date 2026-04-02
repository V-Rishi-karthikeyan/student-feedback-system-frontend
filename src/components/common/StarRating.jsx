import { Star } from 'lucide-react'

export default function StarRating({ value, onChange, readOnly = false, size = 20 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          className={`transition-all duration-150 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star
            size={size}
            className={star <= value ? 'fill-gold-400 text-gold-400' : 'text-canvas-300 fill-canvas-100'}
          />
        </button>
      ))}
    </div>
  )
}
