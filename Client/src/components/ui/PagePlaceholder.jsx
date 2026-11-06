import Container from './Container'

export default function PagePlaceholder({ title, text }) {
  return (
    <section className="flex min-h-screen items-center pt-28">
      <Container>
        <p className="text-sm font-medium uppercase tracking-widest text-brand-400">
          Coming soon
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-6xl">{title}</h1>
        <p className="mt-4 max-w-xl text-white/60">{text}</p>
      </Container>
    </section>
  )
}