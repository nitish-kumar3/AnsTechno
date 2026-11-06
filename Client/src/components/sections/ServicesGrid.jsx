// import { useCallback, useState } from 'react'
// import { AnimatePresence, motion } from 'framer-motion'
// import Container from '../ui/Container'
// import ServiceCard from '../cards/ServiceCard'
// import ServiceModal from '../cards/ServiceModal'
// import { categories, services } from '../../data/services'

// export default function ServicesGrid() {
//   const [active, setActive] = useState('All')
//   const [selected, setSelected] = useState(null)
//   const close = useCallback(() => setSelected(null), [])

//   const list =
//     active === 'All' ? services : services.filter((s) => s.category === active)

//   return (
//     <section className="relative pb-24">
//       <Container>
//         <div className="flex justify-center">
//           <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
//             {categories.map((c) => (
//               <button
//                 key={c}
//                 onClick={() => setActive(c)}
//                 className="relative rounded-full px-5 py-2 text-sm font-medium"
//               >
//                 {active === c && (
//                   <motion.span
//                     layoutId="service-filter"
//                     className="absolute inset-0 rounded-full bg-brand-500"
//                     transition={{ type: 'spring', stiffness: 380, damping: 30 }}
//                   />
//                 )}
//                 <span
//                   className={`relative z-10 transition-colors ${
//                     active === c ? 'text-black' : 'text-white/70'
//                   }`}
//                 >
//                   {c}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div
//           key={active}
//           className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
//         >
//           {list.map((s, i) => (
//             <ServiceCard key={s.id} service={s} index={i} onOpen={setSelected} />
//           ))}
//         </div>
//       </Container>

//       <AnimatePresence>
//         {selected && (
//           <ServiceModal key={selected.id} service={selected} onClose={close} />
//         )}
//       </AnimatePresence>
//     </section>
//   )
// }



import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Container from '../ui/Container'
import DataState from '../ui/DataState'
import ServiceCard from '../cards/ServiceCard'
import ServiceModal from '../cards/ServiceModal'
import { useServices } from '../../hooks/useContent'

export default function ServicesGrid() {
  const { data, loading, error, reload } = useServices()
  const services = data || []

  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState(null)
  const close = useCallback(() => setSelected(null), [])

  // Categories services se hi banti hain
  const categories = ['All', ...new Set(services.map((s) => s.category))]
  const current = categories.includes(active) ? active : 'All'
  const list =
    current === 'All' ? services : services.filter((s) => s.category === current)

  return (
    <section className="relative pb-24">
      <Container>
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className="relative rounded-full px-5 py-2 text-sm font-medium"
              >
                {current === c && (
                  <motion.span
                    layoutId="service-filter"
                    className="absolute inset-0 rounded-full bg-brand-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors ${
                    current === c ? 'text-black' : 'text-white/70'
                  }`}
                >
                  {c}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <DataState
            loading={loading}
            error={error}
            onRetry={reload}
            isEmpty={list.length === 0}
            emptyText="Services jald hi yahan dikhengi."
          >
            <div key={current} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} onOpen={setSelected} />
              ))}
            </div>
          </DataState>
        </div>
      </Container>

      <AnimatePresence>
        {selected && (
          <ServiceModal key={selected.id} service={selected} onClose={close} />
        )}
      </AnimatePresence>
    </section>
  )
}