import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  Briefcase,
  ExternalLink,
  FolderOpen,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  Users,
  Award,
  BookOpen,
  ShieldCheck,
  Trophy,
  FileText,
  Store,
  GraduationCap,
  Megaphone,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function AdminSidebar({ open, onClose, counts }) {
  const { user, logout } = useAuth()

  // Sidebar ke sections. badge = naye items ki ginti
  const groups = [
    {
      label: 'Overview',
      // items: [{ name: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true }],
      items: [
        { name: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
        { name: 'Analytics', to: '/admin/analytics', icon: Activity },
      ],      
    },
    {
      label: 'Website content',
      items: [
        { name: 'Services', to: '/admin/services', icon: Layers },
        { name: 'Projects', to: '/admin/projects', icon: FolderOpen },
        { name: 'Testimonials', to: '/admin/testimonials', icon: Star },
        { name: 'Blog posts', to: '/admin/posts', icon: FileText },
        { name: 'Impact numbers', to: '/admin/impact', icon: Trophy },
        { name: 'Success stories', to: '/admin/stories', icon: BookOpen },
        { name: 'Credentials', to: '/admin/credentials', icon: ShieldCheck },
        { name: 'Digital Dukaan', to: '/admin/shops', icon: Store },
        { name: 'Announcements', to: '/admin/announcements', icon: Megaphone },
      ],
    },
    {
      label: 'Careers',
      items: [
        { name: 'Job openings', to: '/admin/openings', icon: Briefcase },
        { name: 'Certificates', to: '/admin/certificates', icon: Award },
        { name: 'Talent wall', to: '/admin/talent', icon: GraduationCap },
        {
          name: 'Applications',
          to: '/admin/applications',
          icon: Users,
          badge: counts?.newApplications,
        },
      ],
    },
    {
      label: 'Inbox',
      items: [
        {
          name: 'Inquiries',
          to: '/admin/inquiries',
          icon: Inbox,
          badge: counts?.newInquiries,
        },
      ],
    },
    {
      label: 'Site',
      items: [{ name: 'Settings', to: '/admin/settings', icon: Settings }],
    },
  ]

  return (
    <>
      {/* Mobile par peeche ka dhundhla parda */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-ink/90 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <Link to="/admin" onClick={onClose} className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand-300 to-brand-600 text-lg font-bold text-black">
              A
            </span>
            <span className="text-lg font-bold tracking-tight">Anstechno</span>
          </Link>
          <span className="ml-1 rounded-full border border-brand-500/30 bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-brand-300">
            Admin
          </span>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-[11px] font-semibold uppercase tracking-widest text-white/40">
                {group.label}
              </p>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive ? 'text-white' : 'text-white/60 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="side-pill"
                            className="absolute inset-0 rounded-xl border border-brand-500/25 bg-brand-500/15 shadow-[0_0_24px_-6px_rgba(25,195,154,0.5)]"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <item.icon
                          size={18}
                          className={`relative z-10 ${isActive ? 'text-brand-400' : ''}`}
                        />
                        <span className="relative z-10 flex-1">{item.name}</span>
                        {item.badge > 0 && (
                          <span className="relative z-10 rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-bold text-black">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Neeche: website link + user + logout */}
        <div className="space-y-3 border-t border-white/10 p-4">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            View website <ExternalLink size={15} />
          </Link>

          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-600 font-bold text-black">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-white/50">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              aria-label="Logout"
              title="Logout"
              className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-red-500/15 hover:text-red-500"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}