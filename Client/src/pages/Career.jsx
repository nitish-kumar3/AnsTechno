// import PageHeader from '../components/ui/PageHeader'
// import WhyJoin from '../components/sections/WhyJoin'
// import OpeningsSection from '../components/sections/OpeningsSection'

// export default function Career() {
//   return (
//     <>
//       <PageHeader
//         badge="Careers"
//         title="Build your future"
//         highlight="with us"
//         text="Jobs for skilled people and free internships for those who want to learn. Pick an opening, see the details and apply in one minute."
//       />
//       <WhyJoin />
//       <OpeningsSection />
//     </>
//   )
// }




import PageHeader from '../components/ui/PageHeader'
import WhyJoin from '../components/sections/WhyJoin'
import OpeningsSection from '../components/sections/OpeningsSection'
import { useLanguage } from '../hooks/useLanguage'

export default function Career() {
  const { t } = useLanguage()

  return (
    <>
      <PageHeader
        badge={t('career.badge')}
        title={t('career.title')}
        highlight={t('career.highlight')}
        text={t('career.text')}
      />
      <WhyJoin />
      <OpeningsSection />
    </>
  )
}