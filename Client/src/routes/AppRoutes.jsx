// import { Routes, Route } from 'react-router-dom'
// import Layout from '../components/layout/Layout'
// import Discover from '../pages/Discover'
// import Services from '../pages/Services'
// import Career from '../pages/Career'
// import Portfolio from '../pages/Portfolio'
// import OurStory from '../pages/OurStory'
// import LetsConnect from '../pages/LetsConnect'
// import NotFound from '../pages/NotFound'

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route element={<Layout />}>
//         <Route index element={<Discover />} />
//         <Route path="services" element={<Services />} />
//         <Route path="career" element={<Career />} />
//         <Route path="portfolio" element={<Portfolio />} />
//         <Route path="our-story" element={<OurStory />} />
//         <Route path="lets-connect" element={<LetsConnect />} />
//         <Route path="*" element={<NotFound />} />
//       </Route>
//     </Routes>
//   )
// }



import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import AdminLayout from '../components/admin/AdminLayout'
import AdminRoot from './AdminRoot'
import AdminRoute from './AdminRoute'
import Discover from '../pages/Discover'
import Services from '../pages/Services'
import Career from '../pages/Career'
import Portfolio from '../pages/Portfolio'
import OurStory from '../pages/OurStory'
import LetsConnect from '../pages/LetsConnect'
import NotFound from '../pages/NotFound'
import AdminLogin from '../pages/admin/AdminLogin'
import Dashboard from '../pages/admin/Dashboard'
import AdminPlaceholder from '../pages/admin/AdminPlaceholder'
import AdminAnalytics from '../pages/admin/AdminAnalytics'
import AdminServices from '../pages/admin/AdminServices'
import AdminProjects from '../pages/admin/AdminProjects'
import AdminOpenings from '../pages/admin/AdminOpenings'
import AdminTestimonials from '../pages/admin/AdminTestimonials'
import AdminApplications from '../pages/admin/AdminApplications'
import AdminInquiries from '../pages/admin/AdminInquiries'
import AdminSettings from '../pages/admin/AdminSettings'
import CostEstimator from '../pages/CostEstimator'
import BusinessQuiz from '../pages/BusinessQuiz'
import VerifyCertificate from '../pages/VerifyCertificate'
import AdminCertificates from '../pages/admin/AdminCertificates'



export default function AppRoutes() {
  return (
    <Routes>
      {/* Public website */}
      <Route element={<Layout />}>
        <Route index element={<Discover />} />
        <Route path="services" element={<Services />} />
        <Route path="career" element={<Career />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="our-story" element={<OurStory />} />
        <Route path="lets-connect" element={<LetsConnect />} />
        <Route path="estimate" element={<CostEstimator />} />
        <Route path="online-check" element={<BusinessQuiz />} />
        <Route path="verify" element={<VerifyCertificate />} />
        <Route path="verify/:certId" element={<VerifyCertificate />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin panel */}
      <Route path="admin" element={<AdminRoot />}>
        <Route path="login" element={<AdminLogin />} />

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            {/* <Route path="services" element={<AdminPlaceholder title="Services" />} /> */}
            <Route path="services" element={<AdminServices />} />
            {/* <Route path="projects" element={<AdminPlaceholder title="Projects" />} /> */}
            <Route path="projects" element={<AdminProjects />} />
            {/* <Route path="testimonials" element={<AdminPlaceholder title="Testimonials" />} /> */}
            <Route path="testimonials" element={<AdminTestimonials />} />
            {/* <Route path="openings" element={<AdminPlaceholder title="Job Openings" />} /> */}
            <Route path="openings" element={<AdminOpenings />} />
            {/* <Route path="applications" element={<AdminPlaceholder title="Applications" />} />
            <Route path="inquiries" element={<AdminPlaceholder title="Inquiries" />} />
            <Route path="settings" element={<AdminPlaceholder title="Settings" />} /> */}
            <Route path="applications" element={<AdminApplications />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}