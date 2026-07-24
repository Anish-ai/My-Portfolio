import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import Achievements from "@/components/achievements"
import Projects from "@/components/projects"
import Experience from "@/components/experience"
import Skills from "@/components/skills"
import Footer from "@/components/footer"
import CustomCursor from "@/components/custom-cursor"
import GlobalSpotlight from "@/components/global-spotlight"
import SmoothScroll from "@/components/smooth-scroll"

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-background text-foreground overflow-hidden">
        <CustomCursor />
        <GlobalSpotlight />
        <Navbar />
        <Hero />
        <Achievements />
        <Experience />
        <Projects />
        <Skills />
        <Footer />
      </main>
    </SmoothScroll>
  )
}

