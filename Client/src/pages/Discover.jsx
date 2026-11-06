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


export default function Discover() {
  return (
    <>
      <Hero />
      <Stats />
      <ServicesPreview />
      <ToolsTeaser />
      <TechStack />
      <FeaturedWork />
      <Process />
      <LearnEarn />
      <Testimonials />
      <CTA />
    </>
  )
}