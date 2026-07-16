"use client"

import { useState, useCallback, type MouseEvent } from "react"
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion"
import { skills, type SkillType } from "@/data/skills"
import Image from "next/image"
import { useColor } from "@/context/color-context"
import { THEME_COLORS } from "@/lib/constants"
import { X } from "lucide-react"

// --- CATEGORY MAPPING ---
const CATEGORIES: Record<string, string[]> = {
  "All": [],
  "Languages": ["C++", "Python", "JavaScript", "TypeScript"],
  "Frontend": ["React", "Next.js", "Tailwind CSS", "Expo"],
  "Backend": ["Node.js", "PostgreSQL", "MySQL", "MongoDB", "Firebase", "Prisma"],
  "AI / ML": ["TensorFlow", "PyTorch"],
  "Cloud & DevOps": ["AWS", "GCP", "Docker", "Git", "GitHub", "Vercel", "Postman"],
  "Other": ["Figma", "Linux", "Bitcoin"],
}

// --- CIRCULAR PROGRESS RING ---
const ProgressRing = ({ percentage, size = 48, strokeWidth = 3, isActive = false }: {
  percentage: number
  size?: number
  strokeWidth?: number
  isActive?: boolean
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-border/30"
      />
      {/* Progress arc */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        whileInView={{ strokeDashoffset: offset }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
        className={isActive ? "text-primary drop-shadow-[0_0_6px_hsl(var(--primary))]" : "text-primary/70"}
      />
    </svg>
  )
}

// --- SKILL CARD ---
const SkillCard = ({ skill, onClick, isActive, index }: {
  skill: SkillType
  onClick: (skill: SkillType) => void
  isActive: boolean
  index: number
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      onClick={() => onClick(skill)}
      className={`
        relative group/card cursor-pointer rounded-lg overflow-hidden
        bg-card/30 backdrop-blur-sm border transition-all duration-300
        ${isActive
          ? 'border-primary/60 shadow-[0_0_20px_hsl(var(--primary)/0.15)]'
          : 'border-border/30 hover:border-primary/40 hover:shadow-[0_0_15px_hsl(var(--primary)/0.08)]'
        }
      `}
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative p-4 flex items-center gap-4">
        {/* Icon + Ring */}
        <div className="relative shrink-0">
          <ProgressRing percentage={skill.percentage} isActive={isActive} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-6 h-6">
              <Image
                src={skill.icon || "/placeholder.svg"}
                alt={skill.name}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-foreground font-mono tracking-tight truncate group-hover/card:text-primary transition-colors">
              {skill.name}
            </h3>
            <span className="text-xs font-mono text-primary tabular-nums shrink-0">
              {skill.percentage}%
            </span>
          </div>
          {/* Proficiency badge */}
          <span className={`text-[10px] font-mono tracking-wider uppercase ${
            skill.proficiency === 'Advanced'
              ? 'text-green-600 dark:text-green-400'
              : skill.proficiency === 'Intermediate'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-muted-foreground'
          }`}>
            {skill.proficiency}
          </span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover/card:via-primary/50 transition-all" />
    </motion.div>
  )
}

// --- MAIN COMPONENT ---

export default function Skills() {
  const [activeSkill, setActiveSkill] = useState<SkillType | null>(null)
  const [activeCategory, setActiveCategory] = useState("All")

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = useCallback(({ clientX, clientY }: MouseEvent) => {
    const { left, top } = (document.getElementById('skills') as HTMLElement)?.getBoundingClientRect() || { left: 0, top: 0 }
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }, [mouseX, mouseY])

  const filteredSkills = activeCategory === "All"
    ? skills
    : skills.filter(s => CATEGORIES[activeCategory]?.includes(s.name))

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const { colorTheme } = useColor()
  const themeColors = THEME_COLORS[colorTheme] || THEME_COLORS.cyber

  return (
    <section
      id="skills"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen py-20 w-full bg-background flex flex-col items-center overflow-hidden group/skills"
    >

      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-[length:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-0" />

      {/* SPOTLIGHT EFFECT */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover/skills:opacity-100 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${hexToRgba(themeColors.primary, 0.12)},
              transparent 80%
            )
          `
        }}
      />

      {/* Moving Scan Line */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="w-full h-[50vh] bg-gradient-to-b from-transparent via-primary/5 to-transparent"
          animate={{ top: ['-50%', '150%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-10 px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-muted-foreground font-mono tracking-tighter"
        >
          SYSTEM_MODULES
        </motion.h2>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-[1px] w-12 bg-primary/50" />
          <p className="text-secondary-foreground dark:text-primary font-mono text-xs tracking-[0.3em]">TECH ARSENAL</p>
          <div className="h-[1px] w-12 bg-primary/50" />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="relative z-10 mb-10 px-4">
        <div className="flex flex-wrap justify-center gap-2">
          {Object.keys(CATEGORIES).map((category) => {
            const isActive = activeCategory === category
            const count = category === "All" ? skills.length : CATEGORIES[category].length
            return (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  relative px-4 py-2 rounded-md text-xs font-mono tracking-wider uppercase transition-all duration-300 border
                  ${isActive
                    ? 'bg-primary/15 border-primary/50 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.15)]'
                    : 'bg-card/30 border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30'
                  }
                `}
              >
                <span className="relative z-10">{category}</span>
                <span className={`ml-2 text-[10px] ${isActive ? 'text-primary/70' : 'text-muted-foreground/50'}`}>
                  [{count}]
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Skill Grid */}
      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, i) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                onClick={setActiveSkill}
                isActive={activeSkill?.name === skill.name}
                index={i}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* SKILL DETAIL MODAL */}
      <AnimatePresence>
        {activeSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSkill(null)}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-card/95 border border-primary/30 rounded-xl overflow-hidden shadow-[0_0_80px_hsl(var(--primary)/0.15)]"
              onClick={(e: MouseEvent) => e.stopPropagation()}
            >
              {/* Decorative Scan Line */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"
                initial={{ top: '-100%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              {/* Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-mono text-primary tracking-widest">
                    SYS_ANALYSIS // {activeSkill.name.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setActiveSkill(null)}
                  className="text-primary/50 hover:text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8">
                <div className="flex gap-6 items-start">
                  {/* Icon + Ring */}
                  <div className="relative shrink-0">
                    <ProgressRing percentage={activeSkill.percentage} size={80} strokeWidth={4} isActive />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-10 h-10">
                        <Image
                          src={activeSkill.icon || "/placeholder.svg"}
                          alt={activeSkill.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground font-mono tracking-tighter">
                        {activeSkill.name}
                      </h3>
                      <span className="text-xs font-mono text-muted-foreground/70">
                        MODULE ID: SYS-{activeSkill.name.substring(0, 3).toUpperCase()}-{activeSkill.percentage}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-700 dark:text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-3">
                      {activeSkill.description || `High-performance execution of ${activeSkill.name} protocols.`}
                    </p>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="mt-8 space-y-3">
                  <div className="flex justify-between text-xs font-mono text-primary">
                    <span>PROFICIENCY_LEVEL</span>
                    <span>{activeSkill.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeSkill.percentage}%` }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                      className="h-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground/60">
                    <span>CLASSIFICATION: {activeSkill.proficiency.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Footer Tech Decor */}
              <div className="h-6 bg-primary/10 border-t border-primary/20 flex items-center justify-between px-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 h-3 bg-primary/20 skew-x-12" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-primary/30">SECURE_CONNECTION_ESTABLISHED</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}