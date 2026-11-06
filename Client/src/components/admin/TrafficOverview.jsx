import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import api from '../../services/api'
import Panel from './Panel'
import LineChart from './LineChart'
import Delta from './Delta'

export default function TrafficOverview() {
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    api
      .get('/admin/analytics?days=7')
      .then(({ data }) => setData(data))
      .catch(() => setFailed(true))
  }, [])

  if (failed) return null
  if (!data) return <div className="h-80 animate-pulse rounded-3xl bg-white/5" />

  const s = data.summary

  return (
    <Panel
      title="Website traffic"
      subtitle="Last 7 days"
      action={
        <Link
          to="/admin/analytics"
          className="flex items-center gap-1 text-sm text-brand-300 transition hover:gap-2"
        >
          Full analytics <ArrowRight size={14} />
        </Link>
      }
    >
      <div className="flex flex-wrap gap-x-10 gap-y-4">
        <div>
          <p className="text-3xl font-bold">{s.visitors}</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-white/50">
            Visitors <Delta current={s.visitors} previous={s.prevVisitors} />
          </p>
        </div>
        <div>
          <p className="text-3xl font-bold">{s.views}</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-white/50">
            Page views <Delta current={s.views} previous={s.prevViews} />
          </p>
        </div>
        <div>
          <p className="text-3xl font-bold">{s.applications + s.inquiries}</p>
          <p className="mt-1 text-sm text-white/50">Leads</p>
        </div>
      </div>

      <div className="mt-5">
        <LineChart data={data.traffic} />
      </div>
    </Panel>
  )
}