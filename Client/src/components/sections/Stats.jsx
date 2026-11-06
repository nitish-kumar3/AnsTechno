// import { useEffect, useRef, useState } from 'react'
// import { animate, motion, useInView } from 'framer-motion'
// import Container from '../ui/Container'
// import { services } from '../../data/services'
// import { projects } from '../../data/projects'
// import { openings } from '../../data/careers'

// const stats = [
//   { value: services.length, suffix: '', label: 'Digital services' },
//   { value: projects.length, suffix: '+', label: 'Projects built' },
//   {
//     value: openings.filter((o) => o.type === 'Internship').length,
//     suffix: '',
//     label: 'Free internship tracks',
//   },
//   { value: 24, suffix: 'h', label: 'Average reply time' },
// ]

// function Counter({ to, suffix }) {
//   const ref = useRef(null)
//   const inView = useInView(ref, { once: true, margin: '-50px' })
//   const [val, setVal] = useState(0)

//   useEffect(() => {
//     if (!inView) return
//     const controls = animate(0, to, {
//       duration: 1.6,
//       ease: 'easeOut',
//       onUpdate: (v) => setVal(Math.round(v)),
//     })
//     return () => controls.stop()
//   }, [inView, to])

//   return (
//     <span ref={ref}>
//       {val}
//       {suffix}
//     </span>
//   )
// }

// export default function Stats() {
//   return (
//     <section className="relative py-10">
//       <Container>
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4"
//         >
//           {stats.map((s) => (
//             <div key={s.label} className="bg-[#070b09] p-6 text-center sm:p-8">
//               <p className="text-gradient text-4xl font-bold sm:text-5xl">
//                 <Counter to={s.value} suffix={s.suffix} />
//               </p>
//               <p className="mt-2 text-sm text-white/55">{s.label}</p>
//             </div>
//           ))}
//         </motion.div>
//       </Container>
//     </section>
//   )
// }


import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import Container from '../ui/Container'
import { useOpenings, useProjects, useServices } from '../../hooks/useContent'

function Counter({ to, suffix }) {
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
      {val}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const { data: services } = useServices()
  const { data: projects } = useProjects()
  const { data: openings } = useOpenings()

  // Numbers ab database se aate hain
  const stats = [
    { value: (services || []).length, suffix: '', label: 'Digital services' },
    { value: (projects || []).length, suffix: '+', label: 'Projects built' },
    {
      value: (openings || []).filter((o) => o.type === 'Internship').length,
      suffix: '',
      label: 'Free internship tracks',
    },
    { value: 24, suffix: 'h', label: 'Average reply time' },
  ]

  return (
    <section className="relative py-10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-[#070b09] p-6 text-center sm:p-8">
              <p className="text-gradient text-4xl font-bold sm:text-5xl">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-white/55">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}