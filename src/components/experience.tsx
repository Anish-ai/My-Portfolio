"use client"

import { useState, useCallback, type MouseEvent } from "react"
import { motion, useMotionValue, useMotionTemplate, AnimatePresence } from "framer-motion"
import { experiences } from "@/data/experience"
import { Briefcase, MapPin, Calendar, ChevronRight, Terminal } from "lucide-react"
import { useColor } from "@/context/color-context"
import { THEME_COLORS } from "@/lib/constants"

export default function Experience() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const { colorTheme } = useColor()
  const themeColors = THEME_COLORS[colorTheme] || THEME_COLORS.cyber

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const handleMouseMove = useCallback(({ clientX, clientY }: MouseEvent) => {
    const el = document.getElementById('experience')
    if (!el) return
    const { left, top } = el.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }, [mouseX, mouseY])

  return (
    <section
      id="experience"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen py-20 w-full bg-background flex flex-col items-center justify-center overflow-hidden group/exp"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-[length:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-0" />

      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover/exp:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${hexToRgba(themeColors.primary, 0.1)},
              transparent 80%
            )
          `
        }}
      />

      {/* Scanning Line */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="w-full h-[50vh] bg-gradient-to-b from-transparent via-primary/5 to-transparent"
          animate={{ top: ['-50%', '150%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-16 px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-muted-foreground font-mono tracking-tighter"
        >
          MISSION_LOG
        </motion.h2>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-[1px] w-12 bg-primary/50" />
          <p className="text-secondary-foreground dark:text-primary font-mono text-xs tracking-[0.3em]">FIELD OPERATIONS</p>
          <div className="h-[1px] w-12 bg-primary/50" />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 container mx-auto px-4 max-w-4xl">

        {/* Vertical Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent md:-translate-x-[0.5px]" />

        {experiences.map((exp, index) => {
          const isExpanded = expandedId === exp.id
          const isEven = index % 2 === 0

          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative flex items-start mb-12 md:mb-16 ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex-row`}
            >
              {/* Timeline Node */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20">
                <div className="relative">
                  {/* Pulse ring */}
                  {exp.current && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  {/* Node dot */}
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    exp.current
                      ? 'bg-primary border-primary shadow-[0_0_12px_var(--primary)]'
                      : 'bg-background border-primary/50'
                  }`} />
                </div>
              </div>

              {/* Card */}
              <div className={`w-full md:w-[calc(50%-2rem)] ${
                isEven ? 'md:pr-0 md:mr-auto' : 'md:pl-0 md:ml-auto'
              } pl-14 md:pl-0`}>
                <motion.div
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                  whileHover={{ scale: 1.01 }}
                  className="relative group/card cursor-pointer bg-card/40 backdrop-blur-md border border-border/50 hover:border-primary/40 rounded-lg overflow-hidden transition-colors duration-300"
                >
                  {/* Card scan line on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity"
                    animate={{ top: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/60 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/60 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/60 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/60 rounded-br-lg" />

                  {/* Header */}
                  <div className="p-5 md:p-6">
                    {/* Status + Period */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {exp.current && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded-sm">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-mono text-green-600 dark:text-green-400 tracking-widest uppercase">Active</span>
                          </div>
                        )}
                        <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-sm">
                          <span className="text-[9px] font-mono text-primary tracking-wider uppercase">
                            OP-{exp.id.toString().padStart(3, '0')}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4 text-primary/50" />
                      </motion.div>
                    </div>

                    {/* Company & Role */}
                    <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight mb-1 group-hover/card:text-primary transition-colors">
                      {exp.company}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-primary/80 font-mono mb-3">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{exp.role}</span>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-primary/60" />
                        <span>{exp.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-primary/60" />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Highlights */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-border/30">
                          {/* Terminal-style header */}
                          <div className="flex items-center gap-2 py-3 mb-3 border-b border-primary/10">
                            <Terminal className="w-3 h-3 text-primary/60" />
                            <span className="text-[10px] font-mono text-primary/60 tracking-widest uppercase">
                              Operation Details
                            </span>
                          </div>

                          <ul className="space-y-3">
                            {exp.highlights.map((highlight, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-start gap-3 text-sm text-zinc-700 dark:text-muted-foreground leading-relaxed"
                              >
                                <span className="mt-1.5 w-1.5 h-1.5 bg-primary/60 rounded-full shrink-0" />
                                <span>{highlight}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom accent bar */}
                  <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover/card:via-primary/60 transition-all" />
                </motion.div>
              </div>
            </motion.div>
          )
        })}

        {/* Timeline end node */}
        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 bottom-0">
          <div className="w-2 h-2 bg-primary/30 rounded-full" />
        </div>
      </div>

      {/* Bottom instruction */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 mt-8 text-[10px] font-mono text-primary/40 tracking-widest uppercase"
      >
        {"// CLICK CARDS TO EXPAND OPERATION DETAILS"}
      </motion.p>
    </section>
  )
}
