// import { useCallback, useState } from 'react'
// import { AnimatePresence, motion } from 'framer-motion'
// import { Send } from 'lucide-react'
// import Container from '../ui/Container'
// import JobCard from '../cards/JobCard'
// import InternshipCard from '../cards/InternshipCard'
// import OpeningModal from '../cards/OpeningModal'
// import { openingTypes, openings } from '../../data/careers'

// const general = {
//   id: 'general',
//   type: 'General',
//   title: 'General Application',
// }

// export default function OpeningsSection() {
//   const [active, setActive] = useState('All')
//   const [modal, setModal] = useState(null)

//   const open = useCallback(
//     (opening, view = 'details') => setModal({ opening, view }),
//     []
//   )
//   const close = useCallback(() => setModal(null), [])

//   const jobs = openings.filter((o) => o.type === 'Job')
//   const interns = openings.filter((o) => o.type === 'Internship')
//   const showJobs = active !== 'Internships' && jobs.length > 0
//   const showInterns = active !== 'Jobs' && interns.length > 0

//   return (
//     <section id="openings" className="relative pb-24">
//       <Container>
//         <div className="flex justify-center">
//           <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
//             {openingTypes.map((t) => (
//               <button
//                 key={t}
//                 onClick={() => setActive(t)}
//                 className="relative rounded-full px-5 py-2 text-sm font-medium"
//               >
//                 {active === t && (
//                   <motion.span
//                     layoutId="career-filter"
//                     className="absolute inset-0 rounded-full bg-brand-500"
//                     transition={{ type: 'spring', stiffness: 380, damping: 30 }}
//                   />
//                 )}
//                 <span
//                   className={`relative z-10 transition-colors ${
//                     active === t ? 'text-black' : 'text-white/70'
//                   }`}
//                 >
//                   {t}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div key={active}>
//           {showJobs && (
//             <div className="mt-14">
//               <h3 className="flex items-center gap-3 text-2xl font-bold">
//                 Open Jobs
//                 <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
//                   {jobs.length}
//                 </span>
//               </h3>
//               <div className="mt-6 space-y-4">
//                 {jobs.map((j, i) => (
//                   <JobCard key={j.id} job={j} index={i} onOpen={open} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {showInterns && (
//             <div className="mt-16">
//               <h3 className="flex items-center gap-3 text-2xl font-bold">
//                 Internships
//                 <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-medium text-brand-300">
//                   {interns.length}
//                 </span>
//               </h3>
//               <p className="mt-2 max-w-2xl text-sm text-white/55">
//                 Free internships with a small guidance fee. Perfect for students
//                 and beginners, no experience needed.
//               </p>
//               <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                 {interns.map((it, i) => (
//                   <InternshipCard key={it.id} item={it} index={i} onOpen={open} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {!showJobs && !showInterns && (
//             <p className="mt-16 text-center text-white/50">
//               Abhi koi opening nahi hai. Neeche se general application bhej do.
//             </p>
//           )}
//         </div>

//         {/* General application */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="relative mt-20 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12"
//         >
//           <div className="absolute left-1/2 top-0 h-48 w-[500px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(25,195,154,0.2),transparent_70%)]" />
//           <div className="relative">
//             <h3 className="text-2xl font-bold sm:text-3xl">
//               Do not see a role for you?
//             </h3>
//             <p className="mx-auto mt-3 max-w-lg text-white/60">
//               Send us a general application. We will reach out when something
//               fits your skills.
//             </p>
//             <button
//               onClick={() => open(general, 'form')}
//               className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
//             >
//               Send General Application <Send size={16} />
//             </button>
//           </div>
//         </motion.div>
//       </Container>

//       <AnimatePresence>
//         {modal && (
//           <OpeningModal
//             key={modal.opening.id}
//             opening={modal.opening}
//             startView={modal.view}
//             onClose={close}
//           />
//         )}
//       </AnimatePresence>
//     </section>
//   )
// }


import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send } from 'lucide-react'
import Container from '../ui/Container'
import DataState from '../ui/DataState'
import JobCard from '../cards/JobCard'
import InternshipCard from '../cards/InternshipCard'
import OpeningModal from '../cards/OpeningModal'
import { useOpenings } from '../../hooks/useContent'

const openingTypes = ['All', 'Jobs', 'Internships']

// Koi opening na mile tab bhi general application bheji ja sakti hai
const general = {
  id: 'general',
  type: 'General',
  title: 'General Application',
}

export default function OpeningsSection() {
  const { data, loading, error, reload } = useOpenings()
  const openings = data || []

  const [active, setActive] = useState('All')
  const [modal, setModal] = useState(null)

  const open = useCallback(
    (opening, view = 'details') => setModal({ opening, view }),
    []
  )
  const close = useCallback(() => setModal(null), [])

  const jobs = openings.filter((o) => o.type === 'Job')
  const interns = openings.filter((o) => o.type === 'Internship')
  const showJobs = active !== 'Internships' && jobs.length > 0
  const showInterns = active !== 'Jobs' && interns.length > 0

  return (
    <section id="openings" className="relative pb-24">
      <Container>
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
            {openingTypes.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className="relative rounded-full px-5 py-2 text-sm font-medium"
              >
                {active === t && (
                  <motion.span
                    layoutId="career-filter"
                    className="absolute inset-0 rounded-full bg-brand-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors ${
                    active === t ? 'text-black' : 'text-white/70'
                  }`}
                >
                  {t}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <DataState
            loading={loading}
            error={error}
            onRetry={reload}
            count={3}
            cols=""
            height="h-40"
          >
            <div key={active}>
              {showJobs && (
                <div>
                  <h3 className="flex items-center gap-3 text-2xl font-bold">
                    Open Jobs
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                      {jobs.length}
                    </span>
                  </h3>
                  <div className="mt-6 space-y-4">
                    {jobs.map((j, i) => (
                      <JobCard key={j.id} job={j} index={i} onOpen={open} />
                    ))}
                  </div>
                </div>
              )}

              {showInterns && (
                <div className={showJobs ? 'mt-16' : ''}>
                  <h3 className="flex items-center gap-3 text-2xl font-bold">
                    Internships
                    <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-medium text-brand-300">
                      {interns.length}
                    </span>
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm text-white/55">
                    Free internships with a small guidance fee. Perfect for students
                    and beginners, no experience needed.
                  </p>
                  <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {interns.map((it, i) => (
                      <InternshipCard key={it.id} item={it} index={i} onOpen={open} />
                    ))}
                  </div>
                </div>
              )}

              {!showJobs && !showInterns && (
                <p className="py-10 text-center text-white/50">
                  Abhi koi opening nahi hai. Neeche se general application bhej do.
                </p>
              )}
            </div>
          </DataState>
        </div>

        {/* General application */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mt-20 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12"
        >
          <div className="absolute left-1/2 top-0 h-48 w-[500px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(25,195,154,0.2),transparent_70%)]" />
          <div className="relative">
            <h3 className="text-2xl font-bold sm:text-3xl">
              Do not see a role for you?
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-white/60">
              Send us a general application. We will reach out when something
              fits your skills.
            </p>
            <button
              onClick={() => open(general, 'form')}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300"
            >
              Send General Application <Send size={16} />
            </button>
          </div>
        </motion.div>
      </Container>

      <AnimatePresence>
        {modal && (
          <OpeningModal
            key={modal.opening.id}
            opening={modal.opening}
            startView={modal.view}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </section>
  )
}