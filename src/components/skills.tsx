"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { skills } from "@/data/skills"
import Image from "next/image"

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Group skills by proficiency for the 3D carousel
  const groupedSkills = {
    Advanced: skills.filter((skill) => skill.proficiency === "Advanced"),
    Intermediate: skills.filter((skill) => skill.proficiency === "Intermediate"),
    Beginner: skills.filter((skill) => skill.proficiency === "Beginner"),
  }

  // Handle mouse movement to track cursor position
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <section 
      id="skills" 
      className="py-20 relative overflow-hidden" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black -z-10"></div>

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full filter blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full filter blur-[100px] -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          My{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">Skills</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          These are the technologies and tools I work with to bring ideas to life.
        </p>
      </motion.div>

      <div className="container mx-auto px-4">
        {/* 3D Carousel for Advanced Skills */}
        <div className="mb-20">
          <motion.h3
            className="text-xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Advanced Skills
          </motion.h3>

          <div className="relative h-60 perspective-1000 overflow-hidden">
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                rotateY: [0, 360],
              }}
              transition={{
                duration: 30,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {groupedSkills.Advanced.map((skill, index) => {
                const angle = (index / groupedSkills.Advanced.length) * Math.PI * 2
                const radius = 150
                const x = Math.sin(angle) * radius
                const z = Math.cos(angle) * radius

                return (
                  <motion.div
                    key={skill.name}
                    className="skill-item absolute flex flex-col items-center justify-center w-24 h-24 bg-gray-900/50 backdrop-blur-md rounded-xl p-4 border border-gray-800 hover:border-violet-500 transition-all"
                    style={{
                      x,
                      z,
                      rotateY: -angle * (180 / Math.PI),
                    }}
                    whileHover={{
                      scale: 1.2,
                      boxShadow: "0 0 25px rgba(138, 43, 226, 0.6)",
                    }}
                    onHoverStart={() => setHoveredSkill(skill.name)}
                    onHoverEnd={() => setHoveredSkill(null)}
                  >
                    <div className="relative w-12 h-12 mb-2">
                      <Image
                        src={skill.icon || "/placeholder.svg"}
                        alt={skill.name}
                        width={48}
                        height={48}
                        className="object-contain"
                        onError={(e) => {
                          console.warn(`Failed to load icon for ${skill.name}`)
                          e.currentTarget.src = "/stack/fallback.svg"
                        }}
                      />
                    </div>
                    <span className="text-xs text-center text-gray-300">{skill.name}</span>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>

        {/* Infinite scroll carousel for all skills */}
        <motion.div className="relative overflow-hidden py-10 mb-16" style={{ y, opacity }}>
          <div className="flex space-x-16 animate-infinite-scroll">
            {[...skills, ...skills].map((skill, index) => (
              <motion.div
                key={`${skill.name}-${index}`}
                whileHover={{
                  scale: 1.2,
                  rotate: 10,
                  boxShadow: "0 0 25px rgba(138, 43, 226, 0.6)",
                  zIndex: 10,
                }}
                className="skill-item flex flex-col items-center justify-center w-24 h-24 bg-gray-900/50 backdrop-blur-md rounded-xl p-4 border border-gray-800 hover:border-violet-500 transition-all"
                onHoverStart={() => setHoveredSkill(skill.name)}
                onHoverEnd={() => setHoveredSkill(null)}
              >
                <div className="relative w-12 h-12 mb-2">
                  <Image
                    src={skill.icon || "/placeholder.svg"}
                    alt={skill.name}
                    width={48}
                    height={48}
                    className="object-contain"
                    onError={(e) => {
                      console.warn(`Failed to load icon for ${skill.name}`)
                      e.currentTarget.src = "/stack/fallback.svg"
                    }}
                  />
                </div>
                <span className="text-xs text-center text-gray-300">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills grid with percentage bars */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(138, 43, 226, 0.4)",
                zIndex: 10,
              }}
              className="skill-item flex flex-col p-4 bg-gray-900/50 backdrop-blur-md rounded-lg border border-gray-800 hover:border-violet-500 transition-all group"
              onHoverStart={() => setHoveredSkill(skill.name)}
              onHoverEnd={() => setHoveredSkill(null)}
            >
              <div className="flex items-center mb-3">
                <div className="relative w-10 h-10 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Image
                    src={skill.icon || "/placeholder.svg"}
                    alt={skill.name}
                    width={40}
                    height={40}
                    className="object-contain"
                    onError={(e) => {
                      console.warn(`Failed to load icon for ${skill.name}`)
                      e.currentTarget.src = "/stack/fallback.svg"
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{skill.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">{skill.proficiency}</p>
                    <p className="text-xs font-bold text-violet-400">{skill.percentage}%</p>
                  </div>
                </div>
              </div>

              <div className="mt-1 w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-2 rounded-full ${
                    skill.percentage > 80
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      : skill.percentage > 60
                        ? "bg-gradient-to-r from-violet-500 to-blue-500"
                        : "bg-gradient-to-r from-blue-500 to-cyan-500"
                  }`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percentage}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skill detail popup - Now follows cursor */}
        <AnimatePresence>
          {hoveredSkill && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="fixed bg-gray-900/90 backdrop-blur-md p-6 rounded-xl border border-violet-500 shadow-lg z-50 max-w-md w-full"
              style={{
                // Position popup based on cursor position with an offset
                left: `${mousePosition.x + 20}px`,
                top: `${mousePosition.y + 20}px`,
                // Ensure the popup doesn't go off-screen using CSS
                maxWidth: "min(400px, calc(100vw - 40px))", 
                transform: "translate(-5%, -5%)", // Slight offset so it's not directly under cursor
                // Ensure popup doesn't exceed screen boundaries
                maxHeight: "min(400px, calc(100vh - 40px))",
                overflow: "auto"
              }}
            >
              {(() => {
                const skill = skills.find((s) => s.name === hoveredSkill)
                if (!skill) return null

                return (
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <Image
                        src={skill.icon || "/placeholder.svg"}
                        alt={skill.name}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
                      {skill.name}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {skill.description || `${skill.proficiency} level of expertise in ${skill.name}`}
                    </p>
                    <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
                      <motion.div
                        className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.percentage}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Beginner</span>
                      <span className="font-bold text-violet-400">{skill.percentage}%</span>
                      <span className="text-gray-400">Expert</span>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}