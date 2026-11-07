// import PageHeader from '../components/ui/PageHeader'
// import MissionValues from '../components/sections/MissionValues'
// import OwnerSection from '../components/sections/OwnerSection'
// import Testimonials from '../components/sections/Testimonials'
// import CTA from '../components/sections/CTA'

// export default function OurStory() {
//   return (
//     <>
//       <PageHeader
//         badge="Our Story"
//         title="Technology with"
//         highlight="purpose and people"
//         text="Who we are, why we started and the person behind it all. A digital agency that wants to grow businesses and uplift learners together."
//       />
//       <MissionValues />
//       <OwnerSection />
//       <Testimonials />
//       <CTA
//         title="Let us write the next chapter of your"
//         highlight="business"
//         text="Whether you need a website, ads, automation or want to learn a skill, we are ready to help."
//       />
//     </>
//   )
// }



import PageHeader from '../components/ui/PageHeader'
import MissionValues from '../components/sections/MissionValues'
import OwnerSection from '../components/sections/OwnerSection'
import Testimonials from '../components/sections/Testimonials'
import CTA from '../components/sections/CTA'
import { useLanguage } from '../hooks/useLanguage'
import TrustSection from '../components/sections/TrustSection'
import SuccessStories from '../components/sections/SuccessStories'

export default function OurStory() {
  const { t } = useLanguage()

  return (
    <>
      <PageHeader
        badge={t('story.badge')}
        title={t('story.title')}
        highlight={t('story.highlight')}
        text={t('story.text')}
      />
      <MissionValues />
      <OwnerSection />
      <TrustSection />
      <Testimonials />
      <SuccessStories />
      <CTA
        title={t('story.ctaTitle')}
        highlight={t('story.ctaHighlight')}
        text={t('story.ctaText')}
      />
    </>
  )
}