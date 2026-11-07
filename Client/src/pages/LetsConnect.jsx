// import PageHeader from '../components/ui/PageHeader'
// import Container from '../components/ui/Container'
// import ContactInfo from '../components/sections/ContactInfo'
// import ContactForm from '../components/forms/ContactForm'
// import MapSection from '../components/sections/MapSection'

// export default function LetsConnect() {
//   return (
//     <>
//       <PageHeader
//         badge="Let's Connect"
//         title="Let's start the"
//         highlight="conversation"
//         text="Whether you have a clear project in mind or you are just exploring ideas, we are here to listen. Tell us what you need and we will take it from there."
//       />

//       <section className="relative pb-20">
//         <Container>
//           <div className="grid gap-10 lg:grid-cols-5">
//             <div className="order-2 lg:order-1 lg:col-span-2">
//               <ContactInfo />
//             </div>
//             <div className="order-1 lg:order-2 lg:col-span-3">
//               <ContactForm />
//             </div>
//           </div>
//         </Container>
//       </section>

//       <MapSection />
//     </>
//   )
// }





import PageHeader from '../components/ui/PageHeader'
import Container from '../components/ui/Container'
import ContactInfo from '../components/sections/ContactInfo'
import ContactForm from '../components/forms/ContactForm'
import MapSection from '../components/sections/MapSection'
import { useLanguage } from '../hooks/useLanguage'

export default function LetsConnect() {
  const { t } = useLanguage()

  return (
    <>
      <PageHeader
        badge={t('connect.badge')}
        title={t('connect.title')}
        highlight={t('connect.highlight')}
        text={t('connect.text')}
      />

      <section className="relative pb-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="order-2 min-w-0 lg:order-1 lg:col-span-2">
              <ContactInfo />
            </div>
            <div className="order-1 min-w-0 lg:order-2 lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      <MapSection />
    </>
  )
}