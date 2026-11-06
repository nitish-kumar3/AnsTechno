import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

export default function AnimatedNumber({ value, format = (n) => n }) {
  const [shown, setShown] = useState(value)
  const previous = useRef(value)

  useEffect(() => {
    const controls = animate(previous.current, value, {
      duration: 0.6,
      ease: 'easeOut',
      onUpdate: (v) => setShown(v),
    })
    previous.current = value
    return () => controls.stop()
  }, [value])

  return <>{format(Math.round(shown))}</>
}