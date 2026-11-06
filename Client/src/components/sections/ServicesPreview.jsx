// import { useCallback, useState } from 'react'
// import { AnimatePresence } from 'framer-motion'
// import { ArrowRight } from 'lucide-react'
// import Container from '../ui/Container'
// import SectionHeading from '../ui/SectionHeading'
// import Button from '../ui/Button'
// import ServiceCard from '../cards/ServiceCard'
// import ServiceModal from '../cards/ServiceModal'
// import { services } from '../../data/services'

// const featuredIds = [
//   'full-stack-development',
//   'frontend-development',
//   'ai-automation',
//   'facebook-ads',
//   'digital-marketing',
//   'wordpress-cms',
// ]

// export default function ServicesPreview() {
//   const [selected, setSelected] = useState(null)
//   const close = useCallback(() => setSelected(null), [])

//   const list = featuredIds
//     .map((id) => services.find((s) => s.id === id))
//     .filter(Boolean)

//   return (
//     <section className="relative py-24">
//       <Container>
//         <SectionHeading
//           eyebrow="What we do"
//           title="Services built to help you"
//           highlight="grow"
//           text="From websites and software to ads and AI automation, everything your business needs in one place."
//         />

//         <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {list.map((s, i) => (
//             <ServiceCard key={s.id} service={s} index={i} onOpen={setSelected} />
//           ))}
//         </div>

//         <div className="mt-12 text-center">
//           <Button to="/services">
//             View all services <ArrowRight size={16} />
//           </Button>
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
import { AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'
import DataState from '../ui/DataState'
import ServiceCard from '../cards/ServiceCard'
import ServiceModal from '../cards/ServiceModal'
import { useServices } from '../../hooks/useContent'

export default function ServicesPreview() {
  const { data, loading, error, reload } = useServices()
  const [selected, setSelected] = useState(null)
  const close = useCallback(() => setSelected(null), [])

  // Pehli 6 services (kaun si pehle aayein wo admin me Order se tay hota hai)
  const list = (data || []).slice(0, 6)

  return (
    <section className="relative py-24">
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title="Services built to help you"
          highlight="grow"
          text="From websites and software to ads and AI automation, everything your business needs in one place."
        />

        <div className="mt-14">
          <DataState
            loading={loading}
            error={error}
            onRetry={reload}
            isEmpty={list.length === 0}
            emptyText="Services jald hi yahan dikhengi."
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} onOpen={setSelected} />
              ))}
            </div>
          </DataState>
        </div>

        <div className="mt-12 text-center">
          <Button to="/services">
            View all services <ArrowRight size={16} />
          </Button>
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