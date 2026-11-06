// import PageHeader from '../components/ui/PageHeader'
// import ProjectsGrid from '../components/sections/ProjectsGrid'
// import CTA from '../components/sections/CTA'

// export default function Portfolio() {
//   return (
//     <>
//       <PageHeader
//         badge="Our Portfolio"
//         title="Projects that show"
//         highlight="what we can build"
//         text="Real products built with the MERN stack and machine learning. Click any project to see its features and tech stack."
//       />
//       <ProjectsGrid />
//       <CTA
//         title="Want a project like these? Let us build"
//         highlight="yours"
//         text="Tell us your idea and we will plan, design and launch it for you."
//       />
//     </>
//   )
// }


import PageHeader from '../components/ui/PageHeader'
import ProjectsGrid from '../components/sections/ProjectsGrid'
import CTA from '../components/sections/CTA'
import { useLanguage } from '../hooks/useLanguage'

export default function Portfolio() {
  const { t } = useLanguage()

  return (
    <>
      <PageHeader
        badge={t('portfolio.badge')}
        title={t('portfolio.title')}
        highlight={t('portfolio.highlight')}
        text={t('portfolio.text')}
      />
      <ProjectsGrid />
      <CTA
        title={t('portfolio.ctaTitle')}
        highlight={t('portfolio.ctaHighlight')}
        text={t('portfolio.ctaText')}
      />
    </>
  )
}