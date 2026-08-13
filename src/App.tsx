import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Stars from './components/Stars'
import ScrollReveal from './components/ScrollReveal'
import ScrollClaw from './components/ScrollClaw'
import { useActiveSection } from './hooks/useActiveSection'

function App() {
  const activeSection = useActiveSection()

  return (
    <div className="pixel-app relative isolate min-h-screen overflow-hidden text-slate-100 antialiased">
      <Stars />
      <Navbar activeSection={activeSection} />
      <ScrollClaw />
      <main className="relative z-10">
        <Hero />
        <ScrollReveal>
          <About />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <Projects />
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <Contact />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  )
}

export default App
