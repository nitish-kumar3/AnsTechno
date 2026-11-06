import { Star } from 'lucide-react'

// onChange diya to click karke rating chun sakte hain, nahi to sirf dikhata hai
export default function RatingStars({ value, onChange, size = 16 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const star = (
          <Star
            size={size}
            className={n <= value ? 'fill-brand-400 text-brand-400' : 'text-white/25'}
          />
        )

        if (!onChange) return <span key={n}>{star}</span>

        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`${n} star`}
            className="transition hover:scale-110"
          >
            {star}
          </button>
        )
      })}
    </div>
  )
}