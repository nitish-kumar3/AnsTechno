// import { Link } from 'react-router-dom'
// import { Mail, MapPin } from 'lucide-react'
// import Container from '../ui/Container'
// // import { contact } from '../../data/contact'
// import { useSettings } from '../../hooks/useContent'

// const quickLinks = [
//   { name: 'Discover', to: '/' },
//   { name: 'Services', to: '/services' },
//   { name: 'Career', to: '/career' },
//   { name: 'Portfolio', to: '/portfolio' },
//   { name: 'Our Story', to: '/our-story' },
//   { name: "Let's Connect", to: '/lets-connect' },
// ]

// const serviceLinks = [
//   'Frontend & Backend Development',
//   'Full-stack Development',
//   'AI & Automation',
//   'Facebook & Instagram Ads',
//   'Digital Marketing',
// ]

// export default function Footer() {
//     const contact = useSettings()

//   return (
//     <footer className="relative border-t border-white/10 bg-[#040605]">
//       <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-500/60 to-transparent" />

//       <Container className="py-14">
//         <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
//           <div>
//             <Link to="/" className="flex items-center gap-2.5">
//               <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand-300 to-brand-600 text-lg font-bold text-black">
//                 A
//               </span>
//               <span className="text-lg font-bold tracking-tight">Anstechno</span>
//             </Link>
//             <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
//               A digital agency and software company that builds, teaches and
//               digitalizes, helping businesses and learners grow.
//             </p>
//           </div>

//           <div>
//             <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
//               Quick links
//             </h4>
//             <ul className="mt-4 space-y-2.5">
//               {quickLinks.map((l) => (
//                 <li key={l.to}>
//                   <Link
//                     to={l.to}
//                     className="text-sm text-white/65 transition hover:text-brand-300"
//                   >
//                     {l.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
//               Services
//             </h4>
//             <ul className="mt-4 space-y-2.5">
//               {serviceLinks.map((s) => (
//                 <li key={s}>
//                   <Link
//                     to="/services"
//                     className="text-sm text-white/65 transition hover:text-brand-300"
//                   >
//                     {s}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
//               Contact
//             </h4>
//             <ul className="mt-4 space-y-3 text-sm text-white/65">
//               {contact.email && (
//                 <li className="flex items-start gap-2">
//                   <Mail size={16} className="mt-0.5 shrink-0 text-brand-400" />
//                   <a
//                     href={`mailto:${contact.email}`}
//                     className="break-all transition hover:text-brand-300"
//                   >
//                     {contact.email}
//                   </a>
//                 </li>
//               )}
//               {contact.address && (
//                 <li className="flex items-start gap-2">
//                   <MapPin size={16} className="mt-0.5 shrink-0 text-brand-400" />
//                   {contact.address}
//                 </li>
//               )}
//             </ul>
//           </div>
//         </div>

//         <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/40 sm:flex-row">
//           <p>© {new Date().getFullYear()} Anstechno. All rights reserved.</p>
//           <p>Built with MERN stack</p>
//         </div>
//       </Container>
//     </footer>
//   )
// }






import { Link } from 'react-router-dom'
import { Mail, MapPin } from 'lucide-react'
import Container from '../ui/Container'
import { useSettings } from '../../hooks/useContent'
import { useLanguage } from '../../hooks/useLanguage'

const quickLinks = [
  { key: 'nav.discover', to: '/' },
  { key: 'nav.services', to: '/services' },
  { key: 'nav.career', to: '/career' },
  { key: 'nav.portfolio', to: '/portfolio' },
  { key: 'nav.story', to: '/our-story' },
  { key: 'nav.connect', to: '/lets-connect' },
  { key: 'nav.verify', to: '/verify' },
  { key: 'nav.blog', to: '/blog' },
  { key: 'nav.talent', to: '/talent' },
  { key: 'nav.dukaan', to: '/digital-dukaan' },
  { key: 'nav.freeTools', to: '/free-tools' },
]

const serviceKeys = ['footer.s1', 'footer.s2', 'footer.s3', 'footer.s4', 'footer.s5']

export default function Footer() {
  const contact = useSettings()
  const { t } = useLanguage()

  return (
    <footer className="relative border-t border-white/10 bg-[#040605]">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-500/60 to-transparent" />

      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand-300 to-brand-600 text-lg font-bold text-black">
                A
              </span>
              <span className="text-lg font-bold tracking-tight">Anstechno</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              {t('footer.about')}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
              {t('footer.quick')}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-white/65 transition hover:text-brand-300"
                  >
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
              {t('footer.services')}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {serviceKeys.map((k) => (
                <li key={k}>
                  <Link
                    to="/services"
                    className="text-sm text-white/65 transition hover:text-brand-300"
                  >
                    {t(k)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
              {t('footer.contact')}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              {contact.email && (
                <li className="flex items-start gap-2">
                  <Mail size={16} className="mt-0.5 shrink-0 text-brand-400" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="break-all transition hover:text-brand-300"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-brand-400" />
                  {contact.address}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Anstechno. {t('footer.rights')}
          </p>
          <p>{t('footer.built')}</p>
        </div>
      </Container>
    </footer>
  )
}