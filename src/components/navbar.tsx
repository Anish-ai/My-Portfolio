"use client"

import { useState } from "react"
import { Link as ScrollLink } from "react-scroll"
import { Menu, X } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import ThreeLogo from "./ui/three-logo"
import MagneticButton from "./ui/magnetic-button"
import GlitchText from "./ui/glitch-text"

const navItems = [
  { name: "Home", to: "hero" },
  { name: "Projects", to: "projects" },
  { name: "Skills", to: "skills" },
  { name: "Contact", to: "footer" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { scrollY } = useScroll()
  
  // Enhanced smooth glassmorphism transitions
  const backgroundColor = useTransform(scrollY, [0, 100], ["rgba(0, 0, 0, 0)", "rgba(3, 7, 18, 0.6)"])
  const backdropBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"])
  const borderColor = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0)", "rgba(6, 182, 212, 0.2)"]) // Cyan border

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor,
        backdropFilter: backdropBlur,
        borderBottom: "1px solid",
        borderColor,
      }}
    >
        {/* Scanning Line Effect at bottom of nav */}
        <motion.div 
            className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ opacity: useTransform(scrollY, [0, 50], [0, 0.5]) }}
        />

      <div className="container mx-auto px-4 py-2 flex justify-between items-center relative z-20">
        {/* 3D Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <ThreeLogo />
          <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block font-mono">
                ANISH.DEV
              </span>
              <span className="text-[9px] text-cyan-500 font-mono tracking-widest hidden sm:block">SYSTEM_ONLINE</span>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-1">
          {navItems.map((item, index) => (
            <MagneticButton key={item.name}>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <ScrollLink
                        to={item.to}
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={800}
                        className="relative px-4 py-2 group block cursor-pointer"
                    >
                        {/* Target Lock Brackets (Active/Hover) */}
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-cyan-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 font-mono text-xs">
                            [
                        </span>
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-cyan-500 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 font-mono text-xs">
                            ]
                        </span>

                        <GlitchText 
                            text={item.name} 
                            className="text-gray-300 group-hover:text-white px-2"
                        />
                    </ScrollLink>
                </motion.div>
            </MagneticButton>
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <MagneticButton>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white transition-colors p-2"
                aria-label="Toggle Menu"
            >
                {isOpen ? <X className="text-cyan-400" size={24} /> : <Menu size={24} />}
            </button>
          </MagneticButton>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "100vh" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden fixed inset-0 top-[60px] bg-black/95 backdrop-blur-xl border-t border-cyan-500/20 overflow-hidden z-40"
        >
          {/* Tech decoration mobile */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

          <div className="flex flex-col items-center justify-center h-full space-y-8 pb-32 relative z-50">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                 <ScrollLink
                  to={item.to}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={800}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-mono tracking-tighter text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors block py-2"
                >
                   <GlitchText text={`< ${item.name} />`} className="inline-block" />
                </ScrollLink>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}