// import PageHeader from '../components/ui/PageHeader'
// import ServicesGrid from '../components/sections/ServicesGrid'
// import ProcessSteps from '../components/sections/ProcessSteps'
// import LearnEarn from '../components/sections/LearnEarn'
// import CTA from '../components/sections/CTA'

// export default function Services() {
//   return (
//     <>
//       <PageHeader
//         badge="Our Services"
//         title="Everything you need to"
//         highlight="grow digitally"
//         text="From websites and software to ads and AI automation: one team, one roof. Pick a service to see exactly what you get."
//       />
//       <ServicesGrid />
//       <ProcessSteps />
//       <LearnEarn />
//       <CTA />
//     </>
//   )
// }


import PageHeader from '../components/ui/PageHeader'
import ServicesGrid from '../components/sections/ServicesGrid'
import ProcessSteps from '../components/sections/ProcessSteps'
import LearnEarn from '../components/sections/LearnEarn'
import CTA from '../components/sections/CTA'
import { useLanguage } from '../hooks/useLanguage'

export default function Services() {
  const { t } = useLanguage()

  return (
    <>
      <PageHeader
        badge={t('services.badge')}
        title={t('services.title')}
        highlight={t('services.highlight')}
        text={t('services.text')}
      />
      <ServicesGrid />
      <ProcessSteps />
      <LearnEarn />
      <CTA />
    </>
  )
}