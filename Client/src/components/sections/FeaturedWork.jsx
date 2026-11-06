// import { useCallback, useState } from 'react'
// import { AnimatePresence } from 'framer-motion'
// import { ArrowRight } from 'lucide-react'
// import Container from '../ui/Container'
// import SectionHeading from '../ui/SectionHeading'
// import Button from '../ui/Button'
// import ProjectCard from '../cards/ProjectCard'
// import ProjectModal from '../cards/ProjectModal'
// import { projects } from '../../data/projects'

// const featuredIds = ['course-selling-website', 'chat-app', 'spam-detector']

// export default function FeaturedWork() {
//   const [selected, setSelected] = useState(null)
//   const close = useCallback(() => setSelected(null), [])

//   const list = featuredIds
//     .map((id) => projects.find((p) => p.id === id))
//     .filter(Boolean)

//   return (
//     <section className="relative py-24">
//       <Container>
//         <SectionHeading
//           eyebrow="Featured work"
//           title="Projects we are"
//           highlight="proud of"
//           text="A few of the products we have built, from full-stack web apps to machine learning."
//         />

//         <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {list.map((p, i) => (
//             <ProjectCard key={p.id} project={p} index={i} onOpen={setSelected} />
//           ))}
//         </div>

//         <div className="mt-12 text-center">
//           <Button to="/portfolio" variant="secondary">
//             View all projects <ArrowRight size={16} className="text-brand-400" />
//           </Button>
//         </div>
//       </Container>

//       <AnimatePresence>
//         {selected && (
//           <ProjectModal key={selected.id} project={selected} onClose={close} />
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
import ProjectCard from '../cards/ProjectCard'
import ProjectModal from '../cards/ProjectModal'
import { useProjects } from '../../hooks/useContent'

export default function FeaturedWork() {
  const { data, loading, error, reload } = useProjects()
  const [selected, setSelected] = useState(null)
  const close = useCallback(() => setSelected(null), [])

  // Pehle 3 projects (kaun se pehle aayein wo admin me Order se tay hota hai)
  const list = (data || []).slice(0, 3)

  return (
    <section className="relative py-24">
      <Container>
        <SectionHeading
          eyebrow="Featured work"
          title="Projects we are"
          highlight="proud of"
          text="A few of the products we have built, from full-stack web apps to machine learning."
        />

        <div className="mt-14">
          <DataState
            loading={loading}
            error={error}
            onRetry={reload}
            count={3}
            isEmpty={list.length === 0}
            emptyText="Projects jald hi yahan dikhenge."
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} onOpen={setSelected} />
              ))}
            </div>
          </DataState>
        </div>

        <div className="mt-12 text-center">
          <Button to="/portfolio" variant="secondary">
            View all projects <ArrowRight size={16} className="text-brand-400" />
          </Button>
        </div>
      </Container>

      <AnimatePresence>
        {selected && (
          <ProjectModal key={selected.id} project={selected} onClose={close} />
        )}
      </AnimatePresence>
    </section>
  )
}