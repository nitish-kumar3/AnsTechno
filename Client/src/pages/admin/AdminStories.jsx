import { Trophy } from 'lucide-react'
import ManagePage from '../../components/admin/ManagePage'
import StoryForm from '../../components/admin/StoryForm'

export default function AdminStories() {
  return (
    <ManagePage
      title="Success stories"
      subtitle="Clients ki asli kahaniyan (Home aur Our Story par). Jab tak koi story nahi, section chhupa rahega."
      noun="Story"
      addLabel="Add story"
      listUrl="/stories/admin/all"
      baseUrl="/stories"
      nameOf={(s) => s.title}
      searchText={(s) => `${s.title} ${s.business} ${s.location}`}
      emptyHint="Asli client ki kahani (unki ijazat ke saath) 'Add story' se daalo."
      row={(s) => ({
        icon: Trophy,
        image: s.image,
        title: s.title,
        subtitle: [s.business, s.location].filter(Boolean).join(' · '),
      })}
      Form={StoryForm}
    />
  )
}