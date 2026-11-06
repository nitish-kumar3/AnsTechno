// import { motion } from 'framer-motion'
// import { ArrowRight } from 'lucide-react'
// import Container from '../ui/Container'
// import Button from '../ui/Button'

// export default function CTA({
//   title = 'Have an idea? Let us turn it into',
//   highlight = 'reality',
//   text = 'Tell us what you need. We will get back to you quickly with the right plan for your business.',
// }) {
//   return (
//     <section className="relative pb-28 pt-12">
//       <Container>
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: '-80px' }}
//           transition={{ duration: 0.7 }}
//           className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-16 text-center sm:px-12"
//         >
//           <div className="bg-grid absolute inset-0 opacity-60" />
//           <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(25,195,154,0.25),transparent_70%)]" />

//           <div className="relative">
//             <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
//               {title} <span className="text-gradient">{highlight}</span>
//             </h2>
//             <p className="mx-auto mt-4 max-w-xl text-white/60">{text}</p>
//             <div className="mt-8 flex flex-wrap justify-center gap-3">
//               <Button to="/lets-connect">
//                 Start a Project <ArrowRight size={16} />
//               </Button>
//               <Button to="/portfolio" variant="secondary">
//                 See Our Work
//               </Button>
//             </div>
//           </div>
//         </motion.div>
//       </Container>
//     </section>
//   )
// }




import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import Button from '../ui/Button'
import { useLanguage } from '../../hooks/useLanguage'

export default function CTA({ title, highlight, text }) {
  const { t } = useLanguage()

  return (
    <section className="relative pb-28 pt-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-16 text-center sm:px-12"
        >
          <div className="bg-grid absolute inset-0 opacity-60" />
          <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(25,195,154,0.25),transparent_70%)]" />

          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {title || t('cta.title')}{' '}
              <span className="text-gradient">{highlight || t('cta.highlight')}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">{text || t('cta.text')}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button to="/lets-connect">
                {t('nav.startProject')} <ArrowRight size={16} />
              </Button>
              <Button to="/portfolio" variant="secondary">
                {t('cta.see')}
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}