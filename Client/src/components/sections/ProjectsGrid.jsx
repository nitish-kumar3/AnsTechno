// import { useCallback, useState } from 'react'
// import { AnimatePresence, motion } from 'framer-motion'
// import Container from '../ui/Container'
// import ProjectCard from '../cards/ProjectCard'
// import ProjectModal from '../cards/ProjectModal'
// import { projectCategories, projects } from '../../data/projects'

// export default function ProjectsGrid() {
//   const [active, setActive] = useState('All')
//   const [selected, setSelected] = useState(null)
//   const close = useCallback(() => setSelected(null), [])

//   const list =
//     active === 'All' ? projects : projects.filter((p) => p.category === active)

//   return (
//     <section className="relative pb-24">
//       <Container>
//         <div className="flex justify-center">
//           <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
//             {projectCategories.map((c) => (
//               <button
//                 key={c}
//                 onClick={() => setActive(c)}
//                 className="relative rounded-full px-5 py-2 text-sm font-medium"
//               >
//                 {active === c && (
//                   <motion.span
//                     layoutId="project-filter"
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

//         {list.length === 0 ? (
//           <p className="mt-16 text-center text-white/50">
//             Is category me abhi koi project nahi hai.
//           </p>
//         ) : (
//           <div
//             key={active}
//             className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
//           >
//             {list.map((p, i) => (
//               <ProjectCard key={p.id} project={p} index={i} onOpen={setSelected} />
//             ))}
//           </div>
//         )}
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
import { AnimatePresence, motion } from 'framer-motion'
import Container from '../ui/Container'
import DataState from '../ui/DataState'
import ProjectCard from '../cards/ProjectCard'
import ProjectModal from '../cards/ProjectModal'
import { useProjects } from '../../hooks/useContent'

export default function ProjectsGrid() {
  const { data, loading, error, reload } = useProjects()
  const projects = data || []

  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState(null)
  const close = useCallback(() => setSelected(null), [])

  const categories = ['All', ...new Set(projects.map((p) => p.category))]
  const current = categories.includes(active) ? active : 'All'
  const list =
    current === 'All' ? projects : projects.filter((p) => p.category === current)

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
                    layoutId="project-filter"
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
            emptyText="Projects jald hi yahan dikhenge."
          >
            <div key={current} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} onOpen={setSelected} />
              ))}
            </div>
          </DataState>
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