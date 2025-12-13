"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { skills } from "@/data/skills"
import Image from "next/image"

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: 1200,
    height: 800
  })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Sort skills by percentage in decreasing order
  const sortedSkills = [...skills].sort((a, b) => b.percentage - a.percentage);

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Group skills by proficiency for the 3D carousel
  const groupedSkills = {
    Advanced: skills.filter((skill) => skill.proficiency === "Advanced"),
    Intermediate: skills.filter((skill) => skill.proficiency === "Intermediate"),
    Beginner: skills.filter((skill) => skill.proficiency === "Beginner"),
  }

  // Update window size when the window is resized
  useEffect(() => {
    // Set mounted state and initialize window size
    setIsMounted(true);
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle mouse movement to track cursor position
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  // Calculate radius and item size based on screen width
  const getResponsiveValues = () => {
    // Base values for different screen sizes
    if (windowSize.width < 640) { // Mobile
      return {
        radius: 180,
        itemSize: 20,
        carouselHeight: 220,
        iconSize: 40
      };
    } else if (windowSize.width < 768) { // Small tablet
      return {
        radius: 220,
        itemSize: 24,
        carouselHeight: 260,
        iconSize: 48
      };
    } else if (windowSize.width < 1024) { // Large tablet
      return {
        radius: 260,
        itemSize: 26,
        carouselHeight: 300,
        iconSize: 52
      };
    } else { // Desktop
      return {
        radius: 320,
        itemSize: 28,
        carouselHeight: 360,
        iconSize: 56
      };
    }
  };

  const { radius, itemSize, carouselHeight, iconSize } = getResponsiveValues();

  return (
    <section
      id="skills"
      className="py-10 md:py-20 relative overflow-hidden"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black -z-10"></div>

      {/* Enhanced background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-violet-600/20 rounded-full filter blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-fuchsia-600/20 rounded-full filter blur-[100px] -z-10"></div>
      <div className="absolute top-1/2 right-1/3 w-32 md:w-64 h-32 md:h-64 bg-blue-600/20 rounded-full filter blur-[80px] -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-8 md:mb-16"
      >
        <h2 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">
          My{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">Skills</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto px-4">
          These are the technologies and tools I work with to bring ideas to life.
        </p>
      </motion.div>

      <div className="container mx-auto px-4">
        {/* Responsive 3D Carousel for Advanced Skills */}
        <div className="mb-10 md:mb-20">
          <motion.h3
            className="text-lg md:text-xl font-bold mb-4 md:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Advanced Skills
          </motion.h3>

          {/* Dynamic height based on screen size */}
          <div className="relative h-60 sm:h-64 md:h-72 lg:h-80 perspective-1000 overflow-hidden" style={{ height: carouselHeight }}>
            {isMounted && (
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
                // Responsive radius
                const totalItems = groupedSkills.Advanced.length
                const angle = (index / totalItems) * Math.PI * 2
                const x = Math.sin(angle) * radius
                const z = Math.cos(angle) * radius

                // Calculate vertical offset for more dynamic appearance
                const verticalOffset = Math.sin(angle * 2) * 20

                return (
                  <motion.div
                    key={skill.name}
                    className="skill-item absolute flex flex-col items-center justify-center bg-gray-900/60 backdrop-blur-md rounded-xl p-2 sm:p-3 md:p-4 border border-gray-800 hover:border-violet-500 transition-all"
                    style={{
                      x,
                      y: verticalOffset,
                      z,
                      rotateY: -angle * (180 / Math.PI),
                      rotateX: Math.sin(angle) * 10,
                      width: `${itemSize}vw`,
                      maxWidth: "120px",
                      minWidth: "80px",
                      height: `${itemSize}vw`,
                      maxHeight: "120px",
                      minHeight: "80px"
                    }}
                    whileHover={{
                      scale: 1.2,
                      boxShadow: "0 0 25px rgba(138, 43, 226, 0.6)",
                      zIndex: 50,
                    }}
                    onHoverStart={() => setHoveredSkill(skill.name)}
                    onHoverEnd={() => setHoveredSkill(null)}
                  >
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-1 md:mb-2">
                      <Image
                        src={skill.icon || "/placeholder.svg"}
                        alt={skill.name}
                        width={iconSize}
                        height={iconSize}
                        className="object-contain"
                        onError={(e) => {
                          console.warn(`Failed to load icon for ${skill.name}`)
                          e.currentTarget.src = "/stack/fallback.svg"
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-center text-gray-300 line-clamp-1">{skill.name}</span>
                    {/* Add subtle percentage indicator */}
                    <div className="mt-1 w-full bg-gray-800/50 rounded-full h-1 overflow-hidden">
                      <div
                        className="h-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </motion.div>
                )
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Infinite scroll carousel for all skills - now responsive */}
        <motion.div className="relative overflow-hidden py-6 md:py-10 mb-8 md:mb-16" style={{ y, opacity }}>
          <div className="flex space-x-4 sm:space-x-8 md:space-x-16 animate-infinite-scroll">
            {[...skills, ...skills].map((skill, index) => (
              <motion.div
                key={`${skill.name}-${index}`}
                whileHover={{
                  scale: 1.2,
                  rotate: 10,
                  boxShadow: "0 0 25px rgba(138, 43, 226, 0.6)",
                  zIndex: 10,
                }}
                className="skill-item flex flex-col items-center justify-center w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 bg-gray-900/50 backdrop-blur-md rounded-xl p-2 sm:p-3 md:p-4 border border-gray-800 hover:border-violet-500 transition-all"
                onHoverStart={() => setHoveredSkill(skill.name)}
                onHoverEnd={() => setHoveredSkill(null)}
              >
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-1 md:mb-2">
                  <Image
                    src={skill.icon || "/placeholder.svg"}
                    alt={skill.name}
                    width={windowSize.width < 640 ? 32 : windowSize.width < 768 ? 40 : 48}
                    height={windowSize.width < 640 ? 32 : windowSize.width < 768 ? 40 : 48}
                    className="object-contain"
                    onError={(e) => {
                      console.warn(`Failed to load icon for ${skill.name}`)
                      e.currentTarget.src = "/stack/fallback.svg"
                    }}
                  />
                </div>
                <span className="text-xs text-center text-gray-300 line-clamp-1">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

{/* Compact Skill Cloud by Proficiency */}
        <div className="mt-8 md:mt-16 space-y-8 md:space-y-12">
          {(["Advanced", "Intermediate", "Beginner"] as const).map((level) => {
             const levelSkills = sortedSkills.filter(s => s.proficiency === level);
             if (levelSkills.length === 0) return null;

             return (
              <div key={level} className="text-center">
                <motion.h3 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="inline-block text-sm md:text-base font-semibold text-gray-400 mb-4 md:mb-6 px-4 py-1 border-b border-gray-800"
                >
                  {level}
                </motion.h3>
                
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
                  {levelSkills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      viewport={{ once: true }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(139, 92, 246, 0.1)",
                        borderColor: "rgba(139, 92, 246, 0.5)",
                        y: -5
                      }}
                      className="group relative flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-full cursor-pointer transition-colors"
                      onHoverStart={() => setHoveredSkill(skill.name)}
                      onHoverEnd={() => setHoveredSkill(null)}
                    >
                       <div className="relative w-4 h-4 md:w-5 md:h-5">
                        <Image
                          src={skill.icon || "/placeholder.svg"}
                          alt={skill.name}
                          fill
                          className="object-contain"
                          onError={(e) => {
                             e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
             )
          })}
        </div>

        {/* Skill detail popup - Now responsive and repositions to stay in viewport */}
        <AnimatePresence>
          {hoveredSkill && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="fixed bg-gray-900/90 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-violet-500 shadow-lg z-50"
              style={{
                // Dynamically calculate position to stay in viewport
                left: Math.min(mousePosition.x + 20, windowSize.width - 300) + "px",
                top: Math.min(mousePosition.y + 20, windowSize.height - 350) + "px",
                width: windowSize.width < 640 ? "80%" : "auto",
                maxWidth: "min(400px, calc(100vw - 40px))",
                maxHeight: "min(400px, calc(100vh - 40px))",
                overflow: "auto"
              }}
            >
              {(() => {
                const skill = skills.find((s) => s.name === hoveredSkill)
                if (!skill) return null

                return (
                  <div className="text-center">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4">
                      <Image
                        src={skill.icon || "/placeholder.svg"}
                        alt={skill.name}
                        width={windowSize.width < 640 ? 64 : 80}
                        height={windowSize.width < 640 ? 64 : 80}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
                      {skill.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
                      {skill.description || `${skill.proficiency} level of expertise in ${skill.name}`}
                    </p>
                    <div className="w-full bg-gray-800 rounded-full h-2 sm:h-3 mb-2">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.percentage}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
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