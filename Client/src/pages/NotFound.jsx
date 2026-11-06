import Container from '../components/ui/Container'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center pt-28">
      <Container>
        <p className="text-sm font-medium uppercase tracking-widest text-brand-400">404</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-6xl">Page not found</h1>
        <p className="mt-4 max-w-xl text-white/60">
          Ye page exist nahi karta ya hata diya gaya hai.
        </p>
        <Button to="/" className="mt-8">Back to Home</Button>
      </Container>
    </section>
  )
}