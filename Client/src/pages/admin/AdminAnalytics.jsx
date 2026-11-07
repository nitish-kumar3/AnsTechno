import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Percent, Target, Users } from 'lucide-react'
import api from '../../services/api'
import Panel from '../../components/admin/Panel'
import MetricCard from '../../components/admin/MetricCard'
import Delta from '../../components/admin/Delta'
import LineChart from '../../components/admin/LineChart'
import DonutChart from '../../components/admin/DonutChart'
import BarList from '../../components/admin/BarList'

const ranges = [7, 30, 90]

// Pages ke achhe naam
const pageNames = {
  '/': 'Home (Discover)',
  '/services': 'Services',
  '/career': 'Career',
  '/portfolio': 'Portfolio',
  '/our-story': 'Our Story',
  '/lets-connect': "Let's Connect",
  '/blog': 'Blog',
  '/talent': 'Hire Talent',
  '/digital-dukaan': 'Digital Dukaan',
}
const prettyPage = (path) => pageNames[path] || path

export default function AdminAnalytics() {
  const [days, setDays] = useState(30)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')

    api
      .get(`/admin/analytics?days=${days}`)
      .then(({ data }) => {
        if (!ignore) setData(data)
      })
      .catch((err) => {
        if (!ignore) setError(err.response?.data?.message || 'Could not load analytics')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [days])

  const s = data?.summary

  return (
    <div className="space-y-6">
      {/* Header + range */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="mt-1 text-sm text-white/50">
            Kitne log aaye, kya dekha aur kisme interest dikhaya.
          </p>
        </div>

        <div className="inline-flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setDays(r)}
              className="relative rounded-full px-4 py-1.5 text-sm font-medium"
            >
              {days === r && (
                <motion.span
                  layoutId="range-pill"
                  className="absolute inset-0 rounded-full bg-brand-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${days === r ? 'text-black' : 'text-white/70'}`}>
                {r} days
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {!data && !error && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-3xl bg-white/5" />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-3xl bg-white/5" />
        </div>
      )}

      {data && (
        <div className={`space-y-6 transition-opacity ${loading ? 'opacity-50' : ''}`}>
          {/* 4 bade numbers */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              index={0}
              icon={Users}
              label="Visitors"
              value={s.visitors}
              badge={<Delta current={s.visitors} previous={s.prevVisitors} />}
              hint={`Last ${days} days`}
              tone="brand"
            />
            <MetricCard
              index={1}
              icon={Eye}
              label="Page views"
              value={s.views}
              badge={<Delta current={s.views} previous={s.prevViews} />}
              hint="Total pages opened"
              tone="cyan"
            />
            <MetricCard
              index={2}
              icon={Target}
              label="Leads"
              value={s.applications + s.inquiries}
              hint={`${s.applications} applications · ${s.inquiries} messages`}
              tone="amber"
            />
            <MetricCard
              index={3}
              icon={Percent}
              label="Conversion rate"
              value={s.conversion}
              suffix="%"
              decimals={1}
              hint="Visitors who became leads"
              tone="violet"
            />
          </div>

          {/* Traffic graph */}
          <Panel
            title="Traffic"
            subtitle={`Daily visitors and page views, last ${days} days`}
            action={
              <div className="flex items-center gap-4 text-xs text-white/60">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Page views
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-500" /> Visitors
                </span>
              </div>
            }
          >
            <LineChart key={days} data={data.traffic} />
          </Panel>

          {/* Pages, devices, sources */}
          <div className="grid gap-6 xl:grid-cols-3">
            <Panel title="Top pages" subtitle="Sabse zyada dekhe gaye">
              <BarList items={data.topPages} format={prettyPage} empty="Abhi koi page view nahi" />
            </Panel>
            <Panel title="Devices" subtitle="Log kis par dekh rahe hain">
              <DonutChart items={data.devices} centerLabel="Views" />
            </Panel>
            <Panel title="Traffic sources" subtitle="Log kahan se aaye">
              <BarList items={data.referrers} tone="cyan" empty="Abhi koi data nahi" />
            </Panel>
          </div>

          {/* Leads */}
          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Services people ask about" subtitle="Contact messages service ke hisaab se">
              <BarList
                items={data.inquiriesByService}
                tone="cyan"
                empty="Abhi tak kisi service ke liye message nahi aaya"
              />
            </Panel>
            <Panel title="Jobs and internships applied for" subtitle="Kis opening pe kitni applications">
              <BarList
                items={data.applicationsByOpening}
                empty="Abhi tak koi application nahi aayi"
              />
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Application pipeline" subtitle="Applications abhi kis stage me hain">
              <BarList items={data.pipeline} tone="amber" empty="Abhi tak koi application nahi aayi" />
            </Panel>
            <Panel title="Application type" subtitle="Job, internship ya general">
              <DonutChart items={data.applicationsByType} centerLabel="Applications" />
            </Panel>
          </div>

          <p className="text-center text-xs text-white/40">
            Visitors anonymous gine jate hain. IP address ya personal data save nahi hota.
          </p>
        </div>
      )}
    </div>
  )
}