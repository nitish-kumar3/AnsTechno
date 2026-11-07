import { Megaphone } from 'lucide-react'
import ManagePage from '../../components/admin/ManagePage'
import AnnouncementForm from '../../components/admin/AnnouncementForm'

const fmt = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

// Abhi chal rahi hai, shuru hogi, ya khatam ho gayi
function statusOf(a) {
  const now = Date.now()
  if (!a.isActive) return 'Hidden'
  if (a.expiresAt && new Date(a.expiresAt).getTime() < now) return 'Expired'
  if (a.startsAt && new Date(a.startsAt).getTime() > now) return 'Scheduled'
  return 'Live'
}

export default function AdminAnnouncements() {
  return (
    <ManagePage
      title="Announcements"
      subtitle="Site ke sabse upar ki patti. Tareekh khatam hote hi apne aap hat jati hai."
      noun="Announcement"
      addLabel="Add announcement"
      listUrl="/announcements/admin/all"
      baseUrl="/announcements"
      nameOf={(a) => a.text}
      searchText={(a) => `${a.text} ${a.textHi}`}
      emptyHint="Offer, naya batch ya koi khabar hai to 'Add announcement' se daalo."
      row={(a) => ({
        icon: Megaphone,
        title: a.text,
        subtitle: [
          statusOf(a),
          a.startsAt && `from ${fmt(a.startsAt)}`,
          a.expiresAt && `till ${fmt(a.expiresAt)}`,
        ]
          .filter(Boolean)
          .join(' · '),
      })}
      Form={AnnouncementForm}
    />
  )
}