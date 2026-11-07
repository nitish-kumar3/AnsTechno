import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

// Number 0 se ginta hua aata hai (jab screen par dikhe)
export default function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref}>
      {new Intl.NumberFormat('en-IN').format(val)}
      {suffix}
    </span>
  )
}