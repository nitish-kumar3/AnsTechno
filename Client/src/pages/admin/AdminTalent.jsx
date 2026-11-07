import { GraduationCap } from 'lucide-react'
import ManagePage from '../../components/admin/ManagePage'
import TalentForm from '../../components/admin/TalentForm'

export default function AdminTalent() {
  return (
    <ManagePage
      title="Talent wall"
      subtitle="Trained learners ke public profiles (/talent page). Sirf sahmati wale learners ko daalo."
      noun="Talent"
      addLabel="Add learner"
      listUrl="/talent/admin/all"
      baseUrl="/talent"
      nameOf={(t) => t.name}
      searchText={(t) => `${t.name} ${t.headline} ${(t.skills || []).join(' ')}`}
      emptyHint="Jis learner ne sahmati di hai, 'Add learner' se uski profile daalo."
      row={(t) => ({
        icon: GraduationCap,
        image: t.photo,
        title: t.name,
        subtitle:
          [t.headline, t.location, t.openToWork ? 'Open to work' : 'Not available']
            .filter(Boolean)
            .join(' · '),
      })}
      Form={TalentForm}
    />
  )
}