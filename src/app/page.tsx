import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Footer from "@/components/footer"
import CustomCursor from "@/components/custom-cursor"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white overflow-hidden">
      <CustomCursor />
      <Navbar />
      <Hero />
      <Projects />
      <Skills />
      <Footer />
    </main>
  )
}

