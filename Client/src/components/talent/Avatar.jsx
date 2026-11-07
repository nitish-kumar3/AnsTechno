import assetUrl from '../../utils/assetUrl'

// Photo ho to photo, nahi to naam ke pehle akshar
export default function Avatar({ talent, className = '' }) {
  const initials = talent.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  if (talent.photo) {
    return (
      <img
        src={assetUrl(talent.photo)}
        alt=""
        loading="lazy"
        className={`object-cover object-top ${className}`}
      />
    )
  }

  return (
    <div
      className={`grid place-items-center bg-linear-to-br from-brand-400 to-brand-600 font-bold text-black ${className}`}
    >
      {initials}
    </div>
  )
}