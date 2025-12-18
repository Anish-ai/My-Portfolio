"use client"

import { useState, useCallback, type MouseEvent } from "react"
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion"
import { skills, type SkillType } from "@/data/skills"
import Image from "next/image"

// --- HEXAGON COMPONENT ---

const HexSkill = ({ 
    skill, 
    onClick, 
    isActive
}: { 
    skill: SkillType; 
    onClick: (skill: SkillType) => void;
    isActive: boolean;
}) => {
    // Random breath duration for organic feel
    const randomDuration = 3 + Math.random() * 2
    const randomDelay = Math.random() * 2

    return (
        <motion.div
            layoutId={`hex-${skill.name}`}
            className="relative w-24 h-28 md:w-32 md:h-36 -ml-[14px] md:-ml-[19px] mb-[-24px] md:mb-[-32px] first:ml-0 cursor-pointer group z-10 hover:z-20 transition-all duration-300"
            onClick={() => onClick(skill)}
            whileHover={{ scale: 1.1, zIndex: 30 }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
            {/* Hexagon Shape (Clip-path) */}
            <div 
                className={`
                    w-full h-full bg-card/40 backdrop-blur-md 
                    ${isActive ? 'bg-cyan-900/40 border-cyan-400' : 'border-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10'}
                    flex flex-col items-center justify-center p-2
                    transition-colors duration-300
                `}
                style={{ 
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
            >
                {/* Simulated Border Container (Outer Hex) */}
                <div 
                    className={`absolute inset-[1px] ${isActive ? 'bg-cyan-500/20' : 'bg-card/60'} flex flex-col items-center justify-center`}
                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                     {/* Icon */}
                    <div className="relative w-8 h-8 md:w-12 md:h-12 mb-2 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                        <Image 
                            src={skill.icon || "/placeholder.svg"} 
                            alt={skill.name} 
                            fill 
                            className="object-contain"
                        />
                    </div>
                    {/* Name */}
                    <span className="text-[9px] md:text-[10px] font-mono text-cyan-700/80 dark:text-cyan-500/70 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 uppercase tracking-tighter">
                        {skill.name}
                    </span>
                    {/* Bar */}
                    <div className="w-10 h-0.5 bg-secondary mt-1 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-cyan-500" 
                            style={{ width: `${skill.percentage}%` }} 
                        />
                    </div>
                </div>
            </div>

            {/* Glowing Border SVG (Real Border) with Breathing Animation */}
            <motion.svg 
                className="absolute inset-0 w-full h-full pointer-events-none stroke-current"
                viewBox="0 0 100 115" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                animate={{ 
                    opacity: isActive ? 1 : [0.1, 0.3, 0.1],
                    stroke: isActive ? "rgb(6,182,212)" : ["rgba(255,255,255,0.1)", "rgba(6,182,212,0.3)", "rgba(255,255,255,0.1)"] 
                }}
                transition={{ 
                    duration: randomDuration, 
                    delay: randomDelay, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
            >
                 <path d="M50 0.5L99.5 25.25V74.75L50 99.5L0.5 74.75V25.25L50 0.5Z" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
            </motion.svg>
            
        </motion.div>
    )
}

// --- MAIN COMPONENT ---

export default function Skills() {
  const [activeSkill, setActiveSkill] = useState<SkillType | null>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = useCallback(({ clientX, clientY }: MouseEvent) => {
    const { left, top } = (document.getElementById('skills') as HTMLElement)?.getBoundingClientRect() || { left: 0, top: 0 }
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }, [mouseX, mouseY])

  const sortedSkills = [...skills].sort((a, b) => b.percentage - a.percentage)

  return (
    <section 
        id="skills" 
        onMouseMove={handleMouseMove}
        className="relative min-h-screen py-20 w-full bg-background flex flex-col items-center justify-center overflow-hidden group/skills"
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
                    rgba(6, 182, 212, 0.15), 
                    transparent 80%
                )
            `
        }}
      />
      
      {/* Moving Scan Line */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
            className="w-full h-[50vh] bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"
            animate={{ top: ['-50%', '150%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-16 px-4">
            <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground via-cyan-500 to-muted-foreground font-mono tracking-tighter"
            >
                SYSTEM_MODULES
            </motion.h2>
            <div className="flex items-center justify-center gap-4 mt-2">
                <div className="h-[1px] w-12 bg-cyan-500/50" />
                <p className="text-cyan-700 dark:text-cyan-500 font-mono text-xs tracking-[0.3em]">HOLOGRAPHIC DATABASE</p>
                <div className="h-[1px] w-12 bg-cyan-500/50" />
            </div>
      </div>

      {/* THE HEX HIVE */}
      <div className="relative z-10 container mx-auto px-4 flex flex-wrap justify-center max-w-6xl pb-32">
        {sortedSkills.map((skill, i) => (
            <div key={skill.name} className={`${i % 2 === 0 ? 'mt-0' : 'mt-14 md:mt-[4.5rem]'} mx-1`} >
                <HexSkill 
                    skill={skill} 
                    onClick={setActiveSkill}
                    isActive={activeSkill?.name === skill.name}
                />
            </div>
        ))}
      </div>

      {/* TECH HUD OVERLAY (Centered Modal) */}
      <AnimatePresence>
        {activeSkill && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop - Click to close */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setActiveSkill(null)}
                    className="absolute inset-0 bg-background/60 backdrop-blur-sm cursor-pointer"
                />

                {/* Modal Card */}
                <motion.div 
                    layoutId={`hex-${activeSkill.name}`} 
                    className="relative w-full max-w-lg bg-card/95 border border-cyan-500/30 rounded-xl overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.2)]"
                    onClick={(e: MouseEvent) => e.stopPropagation()} // Prevent click from closing
                >
                    {/* Decorative Scan Line */}
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none"
                        initial={{ top: '-100%' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Header Bar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-cyan-600/10 dark:bg-cyan-500/10">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                             <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 tracking-widest">SYSTEM_ANALYSIS // {activeSkill.name.toUpperCase()}</span>
                        </div>
                        <button 
                            onClick={() => setActiveSkill(null)}
                            className="text-cyan-700/50 dark:text-cyan-500/50 hover:text-cyan-400 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="flex gap-6 items-start">
                             {/* Icon Container */}
                            <div className="relative w-20 h-20 shrink-0 bg-cyan-500/10 rounded-lg border border-cyan-500/20 flex items-center justify-center">
                                <Image 
                                    src={activeSkill.icon || "/placeholder.svg"} 
                                    alt={activeSkill.name} 
                                    fill 
                                    className="object-contain p-3"
                                />
                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500" />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-3xl font-bold text-foreground font-mono tracking-tighter">{activeSkill.name}</h3>
                                    <span className="text-xs font-mono text-muted-foreground/70">MODULE ID: SYS-{activeSkill.name.substring(0,3).toUpperCase()}-{activeSkill.percentage}</span>
                                </div>
                                
                                <p className="text-sm text-zinc-700 dark:text-muted-foreground leading-relaxed border-l-2 border-cyan-500/30 pl-3">
                                    {activeSkill.description || `High-performance execution of ${activeSkill.name} protocols.`}
                                </p>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="mt-8 space-y-2">
                            <div className="flex justify-between text-xs font-mono text-cyan-700 dark:text-cyan-500">
                                <span>PROFICIENCY_LEVEL</span>
                                <span>{activeSkill.percentage}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${activeSkill.percentage}%` }}
                                    transition={{ duration: 0.8, ease: "circOut" }}
                                    className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Tech Decor */}
                    <div className="h-6 bg-cyan-500/10 border-t border-cyan-500/20 flex items-center justify-between px-4">
                         <div className="flex gap-1">
                             {[...Array(5)].map((_, i) => (
                                 <div key={i} className="w-1 h-3 bg-cyan-500/20 skew-x-12" />
                             ))}
                         </div>
                         <span className="text-[10px] font-mono text-cyan-500/30">SECURE_CONNECTION_ESTABLISHED</span>
                    </div>

                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </section>
  )
}