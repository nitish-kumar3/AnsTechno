// import { useEffect, useState } from 'react'
// import { Link, NavLink } from 'react-router-dom'
// import { AnimatePresence, motion } from 'framer-motion'
// import { ArrowUpRight, Menu, X } from 'lucide-react'

// const links = [
//   { name: 'Discover', to: '/' },
//   { name: 'Services', to: '/services' },
//   { name: 'Career', to: '/career' },
//   { name: 'Portfolio', to: '/portfolio' },
//   { name: 'Our Story', to: '/our-story' },
//   { name: "Let's Connect", to: '/lets-connect' },
// ]

// export default function Navbar() {
//   const [scrolled, setScrolled] = useState(false)
//   const [open, setOpen] = useState(false)

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20)
//     onScroll()
//     window.addEventListener('scroll', onScroll, { passive: true })
//     return () => window.removeEventListener('scroll', onScroll)
//   }, [])

//   return (
//     <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
//       <div className="relative w-full max-w-5xl">
//         <nav
//           className={`flex items-center justify-between rounded-full border py-2 pl-5 pr-2 transition-all duration-300 ${
//             scrolled || open
//               ? 'border-white/10 bg-ink/70 shadow-[0_8px_40px_-12px_rgba(25,195,154,0.25)] backdrop-blur-xl'
//               : 'border-transparent bg-transparent'
//           }`}
//         >
//           {/* Logo: baad me image lagani ho to span ki jagah <img src={logo} className="h-9" /> */}
//           <Link
//             to="/"
//             onClick={() => setOpen(false)}
//             className="flex items-center gap-2.5"
//           >
//             <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand-300 to-brand-600 text-lg font-bold text-black">
//               A
//             </span>
//             <span className="text-lg font-bold tracking-tight">Anstech</span>
//           </Link>

//           {/* Desktop links */}
//           <ul className="hidden items-center gap-1 lg:flex">
//             {links.map((l) => (
//               <li key={l.to}>
//                 <NavLink
//                   to={l.to}
//                   end={l.to === '/'}
//                   className={({ isActive }) =>
//                     `relative block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
//                       isActive ? 'text-white' : 'text-white/60 hover:text-white'
//                     }`
//                   }
//                 >
//                   {({ isActive }) => (
//                     <>
//                       {isActive && (
//                         <motion.span
//                           layoutId="nav-pill"
//                           className="absolute inset-0 rounded-full bg-white/10"
//                           transition={{ type: 'spring', stiffness: 380, damping: 30 }}
//                         />
//                       )}
//                       <span className="relative z-10">{l.name}</span>
//                     </>
//                   )}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>

//           {/* Desktop CTA */}
//           <div className="hidden lg:block">
//             <Link
//               to="/lets-connect"
//               className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300"
//             >
//               Start a Project
//               <ArrowUpRight
//                 size={16}
//                 className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
//               />
//             </Link>
//           </div>

//           {/* Mobile toggle */}
//           <button
//             onClick={() => setOpen((o) => !o)}
//             aria-label="Toggle menu"
//             className="rounded-full border border-white/10 bg-white/5 p-2.5 lg:hidden"
//           >
//             {open ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </nav>

//         {/* Mobile menu */}
//         <AnimatePresence>
//           {open && (
//             <motion.div
//               initial={{ opacity: 0, y: -10, scale: 0.98 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: -10, scale: 0.98 }}
//               transition={{ duration: 0.2 }}
//               className="absolute inset-x-0 top-full mt-2 rounded-3xl border border-white/10 bg-ink/90 p-3 backdrop-blur-xl lg:hidden"
//             >
//               {links.map((l) => (
//                 <NavLink
//                   key={l.to}
//                   to={l.to}
//                   end={l.to === '/'}
//                   onClick={() => setOpen(false)}
//                   className={({ isActive }) =>
//                     `block rounded-2xl px-4 py-3 text-base font-medium ${
//                       isActive
//                         ? 'bg-white/10 text-white'
//                         : 'text-white/70 hover:bg-white/5'
//                     }`
//                   }
//                 >
//                   {l.name}
//                 </NavLink>
//               ))}
//               <Link
//                 to="/lets-connect"
//                 onClick={() => setOpen(false)}
//                 className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-base font-semibold text-black"
//               >
//                 Start a Project <ArrowUpRight size={18} />
//               </Link>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </header>
//   )
// }








// import { useEffect, useState } from 'react'
// import { Link, NavLink } from 'react-router-dom'
// import { AnimatePresence, motion } from 'framer-motion'
// import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
// import { useTheme } from '../../hooks/useTheme'

// const links = [
//   { name: 'Discover', to: '/' },
//   { name: 'Services', to: '/services' },
//   { name: 'Career', to: '/career' },
//   { name: 'Portfolio', to: '/portfolio' },
//   { name: 'Our Story', to: '/our-story' },
//   { name: "Let's Connect", to: '/lets-connect' },
// ]

// function ThemeToggle() {
//   const { theme, toggleTheme } = useTheme()
//   const isDark = theme === 'dark'

//   return (
//     <button
//       onClick={toggleTheme}
//       aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
//       title={isDark ? 'Light mode' : 'Dark mode'}
//       className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
//     >
//       <AnimatePresence mode="wait" initial={false}>
//         <motion.span
//           key={theme}
//           initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
//           animate={{ rotate: 0, opacity: 1, scale: 1 }}
//           exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
//           transition={{ duration: 0.2 }}
//           className="grid place-items-center"
//         >
//           {isDark ? <Sun size={18} /> : <Moon size={18} />}
//         </motion.span>
//       </AnimatePresence>
//     </button>
//   )
// }

// export default function Navbar() {
//   const [scrolled, setScrolled] = useState(false)
//   const [open, setOpen] = useState(false)

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20)
//     onScroll()
//     window.addEventListener('scroll', onScroll, { passive: true })
//     return () => window.removeEventListener('scroll', onScroll)
//   }, [])

//   return (
//     <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
//       <div className="relative w-full max-w-5xl">
//         <nav
//           className={`flex items-center justify-between rounded-full border py-2 pl-5 pr-2 transition-all duration-300 ${
//             scrolled || open
//               ? 'border-white/10 bg-ink/70 shadow-[0_8px_40px_-12px_rgba(25,195,154,0.25)] backdrop-blur-xl'
//               : 'border-transparent bg-transparent'
//           }`}
//         >
//           {/* Logo: baad me image lagani ho to span ki jagah <img src={logo} className="h-9" /> */}
//           <Link
//             to="/"
//             onClick={() => setOpen(false)}
//             className="flex items-center gap-2.5"
//           >
//             <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand-300 to-brand-600 text-lg font-bold text-black">
//               A
//             </span>
//             <span className="text-lg font-bold tracking-tight">Anstech</span>
//           </Link>

//           {/* Desktop links */}
//           <ul className="hidden items-center gap-1 lg:flex">
//             {links.map((l) => (
//               <li key={l.to}>
//                 <NavLink
//                   to={l.to}
//                   end={l.to === '/'}
//                   className={({ isActive }) =>
//                     `relative block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
//                       isActive ? 'text-white' : 'text-white/60 hover:text-white'
//                     }`
//                   }
//                 >
//                   {({ isActive }) => (
//                     <>
//                       {isActive && (
//                         <motion.span
//                           layoutId="nav-pill"
//                           className="absolute inset-0 rounded-full bg-white/10"
//                           transition={{ type: 'spring', stiffness: 380, damping: 30 }}
//                         />
//                       )}
//                       <span className="relative z-10">{l.name}</span>
//                     </>
//                   )}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>

//           {/* Desktop: theme toggle + CTA */}
//           <div className="hidden items-center gap-2 lg:flex">
//             <ThemeToggle />
//             <Link
//               to="/lets-connect"
//               className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300"
//             >
//               Start a Project
//               <ArrowUpRight
//                 size={16}
//                 className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
//               />
//             </Link>
//           </div>

//           {/* Mobile: theme toggle + menu button */}
//           <div className="flex items-center gap-2 lg:hidden">
//             <ThemeToggle />
//             <button
//               onClick={() => setOpen((o) => !o)}
//               aria-label="Toggle menu"
//               className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5"
//             >
//               {open ? <X size={20} /> : <Menu size={20} />}
//             </button>
//           </div>
//         </nav>

//         {/* Mobile menu */}
//         <AnimatePresence>
//           {open && (
//             <motion.div
//               initial={{ opacity: 0, y: -10, scale: 0.98 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: -10, scale: 0.98 }}
//               transition={{ duration: 0.2 }}
//               className="absolute inset-x-0 top-full mt-2 rounded-3xl border border-white/10 bg-ink/90 p-3 backdrop-blur-xl lg:hidden"
//             >
//               {links.map((l) => (
//                 <NavLink
//                   key={l.to}
//                   to={l.to}
//                   end={l.to === '/'}
//                   onClick={() => setOpen(false)}
//                   className={({ isActive }) =>
//                     `block rounded-2xl px-4 py-3 text-base font-medium ${
//                       isActive
//                         ? 'bg-white/10 text-white'
//                         : 'text-white/70 hover:bg-white/5'
//                     }`
//                   }
//                 >
//                   {l.name}
//                 </NavLink>
//               ))}
//               <Link
//                 to="/lets-connect"
//                 onClick={() => setOpen(false)}
//                 className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-base font-semibold text-black"
//               >
//                 Start a Project <ArrowUpRight size={18} />
//               </Link>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </header>
//   )
// }






import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import ThemeToggle from '../ui/ThemeToggle'
import LanguageToggle from '../ui/LanguageToggle'

const links = [
  { key: 'nav.discover', to: '/' },
  { key: 'nav.services', to: '/services' },
  { key: 'nav.career', to: '/career' },
  { key: 'nav.portfolio', to: '/portfolio' },
  { key: 'nav.story', to: '/our-story' },
  { key: 'nav.connect', to: '/lets-connect' },
]

export default function Navbar() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="relative w-full max-w-5xl">
        <nav
          className={`flex items-center justify-between rounded-full border py-2 pl-5 pr-2 transition-all duration-300 ${
            scrolled || open
              ? 'border-white/10 bg-ink/70 shadow-[0_8px_40px_-12px_rgba(25,195,154,0.25)] backdrop-blur-xl'
              : 'border-transparent bg-transparent'
          }`}
        >
          {/* Logo: baad me image lagani ho to span ki jagah <img src={logo} className="h-9" /> */}
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand-300 to-brand-600 text-lg font-bold text-black">
              A
            </span>
            <span className="text-lg font-bold tracking-tight">Anstechno</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `relative block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-white/60 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-white/10"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{t(l.key)}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop: language + theme + CTA */}
          <div className="hidden items-center gap-2 md:flex">
            <LanguageToggle id="desktop" />
            <ThemeToggle />
            <Link
              to="/lets-connect"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-brand-300"
            >
              {t('nav.startProject')}
              <ArrowUpRight
                size={16}
                className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Mobile: language + theme + menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle id="mobile" />
            <ThemeToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full mt-2 rounded-3xl border border-white/10 bg-ink/90 p-3 backdrop-blur-xl md:hidden"
            >
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-base font-medium ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5'
                    }`
                  }
                >
                  {t(l.key)}
                </NavLink>
              ))}
              <Link
                to="/lets-connect"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-base font-semibold text-black"
              >
                {t('nav.startProject')} <ArrowUpRight size={18} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}