import { Link } from 'react-router-dom'

const styles = {
  primary:
    'bg-white text-black hover:bg-brand-300 shadow-[0_0_30px_-5px_rgba(255,255,255,0.35)]',
  secondary:
    'bg-white/5 text-white border border-white/10 hover:bg-white/10 backdrop-blur',
}

export default function Button({
  to,
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${styles[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}