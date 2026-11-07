import { useCallback, useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ExternalLink, Menu } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { useNoIndex } from '../../hooks/useNoIndex'
import ThemeToggle from '../ui/ThemeToggle'
import AdminSidebar from './AdminSidebar'

// Topbar me page ka naam
const titles = {
  '/admin': 'Dashboard',
  '/admin/services': 'Services',
  '/admin/projects': 'Projects',
  '/admin/testimonials': 'Testimonials',
  '/admin/openings': 'Job openings',
  '/admin/applications': 'Applications',
  '/admin/inquiries': 'Inquiries',
  '/admin/settings': 'Settings',
  '/admin/analytics': 'Analytics',
  '/admin/certificates': 'Certificates',
  '/admin/impact': 'Impact numbers',
  '/admin/stories': 'Success stories',
  '/admin/credentials': 'Credentials',
  '/admin/posts': 'Blog posts',
  '/admin/talent': 'Talent wall',
  '/admin/shops': 'Digital Dukaan',
  '/admin/announcements': 'Announcements',
}

export default function AdminLayout() {
  useNoIndex()
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState(null)
  const [statsError, setStatsError] = useState('')

  // Dashboard ke numbers backend se lao
  const loadStats = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/stats')
      setStats(data)
      setStatsError('')
    } catch (err) {
      setStatsError(err.response?.data?.message || 'Could not load dashboard data')
    }
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return (
    <div className="relative isolate min-h-screen bg-ink text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[700px] bg-[radial-gradient(ellipse_at_center,rgba(25,195,154,0.12),transparent_65%)]" />
      </div>

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        counts={stats?.counts}
      />

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-ink/70 px-4 py-3 backdrop-blur-xl sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-lg font-semibold">{titles[pathname] || 'Admin'}</h1>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              View website <ExternalLink size={14} />
            </Link>
            <ThemeToggle />
            <span className="grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-600 font-bold text-black">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        {/* Page ka content (stats sab pages ko mil jati hai) */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet context={{ stats, statsError, reloadStats: loadStats }} />
        </main>
      </div>
    </div>
  )
}