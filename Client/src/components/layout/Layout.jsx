// import { useEffect } from 'react'
// import { Outlet, useLocation } from 'react-router-dom'
// import Navbar from './Navbar'
// import Footer from './Footer'

// function ScrollToTop() {
//   const { pathname } = useLocation()
//   useEffect(() => {
//     window.scrollTo(0, 0)
//   }, [pathname])
//   return null
// }

// export default function Layout() {
//   return (
//     <div className="min-h-screen bg-ink text-white">
//       <ScrollToTop />
//       <Navbar />
//       <main>
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   )
// }


import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { usePageTracking } from '../../hooks/usePageTracking'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingContact from '../ui/FloatingContact'
import ChatWidget from '../chat/ChatWidget'
import AnnouncementBar from './AnnouncementBar'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function Layout() {
  usePageTracking()

  return (
    <div className="min-h-screen bg-ink text-white">
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
      <ChatWidget />
    </div>
  )
}