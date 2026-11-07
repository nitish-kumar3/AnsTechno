import Hero from '../components/sections/Hero'
import Stats from '../components/sections/Stats'
import ServicesPreview from '../components/sections/ServicesPreview'
import TechStack from '../components/sections/TechStack'
import FeaturedWork from '../components/sections/FeaturedWork'
import Process from '../components/sections/Process'
import LearnEarn from '../components/sections/LearnEarn'
import Testimonials from '../components/sections/Testimonials'
import CTA from '../components/sections/CTA'
import ToolsTeaser from '../components/sections/ToolsTeaser'
import ImpactSection from '../components/sections/ImpactSection'
import SuccessStories from '../components/sections/SuccessStories'
import LatestPosts from '../components/sections/LatestPosts'
import LiveProof from '../components/sections/LiveProof'
import TalentTeaser from '../components/sections/TalentTeaser'

export default function Discover() {
  return (
    <>
      <Hero />
      <Stats />
      <LiveProof />
      <ServicesPreview />
      <ToolsTeaser />
      <TechStack />
      <FeaturedWork />
      <Process />
      <LearnEarn />
      <ImpactSection />
      <TalentTeaser />
      <Testimonials />
      <LatestPosts />
      <SuccessStories limit={3} />
      <CTA />
    </>
  )
}