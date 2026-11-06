import { Link, useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, Inbox, Layers, Plus, Users } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import timeAgo from '../../utils/timeAgo'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'
import ActivityChart from '../../components/admin/ActivityChart'
import TrafficOverview from '../../components/admin/TrafficOverview'

// Recent list ka dibba (title + "View all" + andar ka content)
function Panel({ title, to, children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {to && (
          <Link
            to={to}
            className="flex items-center gap-1 text-sm text-brand-300 transition hover:gap-2"
          >
            View all <ArrowRight size={14} />
          </Link>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </motion.section>
  )
}

export default function Dashboard() {
  const { stats, statsError, reloadStats } = useOutletContext()
  const { user } = useAuth()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'Admin'
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  // Data load hone tak skeleton
  if (!stats && !statsError) {
    return (
      <div className="space-y-6">
        <div className="h-16 w-72 animate-pulse rounded-2xl bg-white/5" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-3xl bg-white/5" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-3xl bg-white/5" />
      </div>
    )
  }

  // Error aaya
  if (statsError) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <p className="font-semibold text-red-500">{statsError}</p>
        <p className="mt-2 text-sm text-white/60">Backend chal raha hai ya nahi check karo.</p>
        <button
          onClick={reloadStats}
          className="mt-5 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black"
        >
          Try again
        </button>
      </div>
    )
  }

  const c = stats.counts

  return (
    <div className="space-y-6">
      {/* Greeting + quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm text-white/50">{today}</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            {greeting}, <span className="text-gradient">{firstName}</span>
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Add service', to: '/admin/services' },
            { name: 'Add project', to: '/admin/projects' },
            { name: 'Post a job', to: '/admin/openings' },
          ].map((a) => (
            <Link
              key={a.name}
              to={a.to}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-brand-500/40 hover:bg-brand-500/10"
            >
              <Plus size={15} className="text-brand-400" /> {a.name}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 4 bade cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          icon={Users}
          label="New applications"
          value={c.newApplications}
          hint={`${c.totalApplications} total`}
          to="/admin/applications"
          tone="brand"
        />
        <StatCard
          index={1}
          icon={Inbox}
          label="New messages"
          value={c.newInquiries}
          hint={`${c.totalInquiries} total`}
          to="/admin/inquiries"
          tone="cyan"
        />
        <StatCard
          index={2}
          icon={Briefcase}
          label="Open positions"
          value={c.openings}
          hint="Jobs and internships"
          to="/admin/openings"
          tone="amber"
        />
        <StatCard
          index={3}
          icon={Layers}
          label="Website content"
          value={c.services + c.projects}
          hint={`${c.services} services · ${c.projects} projects`}
          to="/admin/services"
          tone="violet"
        />
      </div>

      {/* Chart */}
      <TrafficOverview />
      <Panel title="Last 14 days">
        <ActivityChart data={stats.activity} />
      </Panel>

      {/* Recent lists */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Recent applications" to="/admin/applications">
          {stats.recentApplications.length === 0 ? (
            <p className="py-6 text-center text-sm text-white/50">
              Abhi koi application nahi aayi.
            </p>
          ) : (
            <ul className="space-y-1">
              {stats.recentApplications.map((a) => (
                <li
                  key={a._id}
                  className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-white/5"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-600 font-bold text-black">
                    {a.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{a.name}</p>
                    <p className="truncate text-xs text-white/50">{a.openingTitle}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge value={a.stage} />
                    <p className="mt-1 text-[11px] text-white/40">{timeAgo(a.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent messages" to="/admin/inquiries">
          {stats.recentInquiries.length === 0 ? (
            <p className="py-6 text-center text-sm text-white/50">
              Abhi koi message nahi aaya.
            </p>
          ) : (
            <ul className="space-y-1">
              {stats.recentInquiries.map((q) => (
                <li
                  key={q._id}
                  className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-white/5"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-cyan-400 to-cyan-600 font-bold text-black">
                    {q.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{q.name}</p>
                    <p className="truncate text-xs text-white/50">{q.message}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge value={q.status} />
                    <p className="mt-1 text-[11px] text-white/40">{timeAgo(q.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  )
}