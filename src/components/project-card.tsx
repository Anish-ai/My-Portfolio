"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Github, ExternalLink, Smartphone, Apple } from "lucide-react"
import type { ProjectType } from "@/types"
import { useState } from "react"
import { useColor } from "@/context/color-context"
import { THEME_COLORS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function ProjectCard({ project }: { project: ProjectType }) {
  const [isHovered, setIsHovered] = useState(false);
  const { colorTheme } = useColor()
  const themeColors = THEME_COLORS[colorTheme] || THEME_COLORS.cyber

  // Animation variants for the skill icons
  const skillVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      }
    })
  };

  // Button hover animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.15,
      transition: { 
        type: "spring" as const, 
        stiffness: 500, 
        damping: 10 
      }
    },
    tap: { scale: 0.9 }
  };

  return (
    <motion.div
      className="relative w-full h-96 bg-black rounded-xl overflow-hidden border border-gray-800 hover:border-primary transition-all group"
      whileHover={{
        scale: 1.05,
        rotate: 2,
        boxShadow: `0 0 30px ${themeColors.primary}80`, // 50% opacity
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="w-full h-full"
        initial={false}
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={project.thumbnail || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover"
        />
      </motion.div>

      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 flex flex-col justify-end"
        initial={{ opacity: 0.9 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="flex justify-between items-start"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h3 
            className="text-2xl font-bold text-white mb-2"
            initial={false}
            animate={isHovered ? { 
              textShadow: `0 0 8px ${themeColors.primary}CC`,
              color: "#f3f4f6"
            } : {}}
          >
            {project.title}
          </motion.h3>
          {project.status && (
            <motion.span 
              className="text-xs px-2 py-1 rounded-full bg-primary text-secondary-foreground"
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: themeColors.accent 
              }}
              whileTap={{ scale: 0.95 }}
            >
              {project.status}
            </motion.span>
          )}
        </motion.div>
        
        <motion.p 
          className="text-gray-300 mb-4 line-clamp-3"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {project.description}
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {project.skills.map((skill, index) => (
            <motion.div 
              key={index} 
              className="relative group/skill"
              variants={skillVariants}
              initial="hidden"
              animate={isHovered ? "visible" : "hidden"}
              custom={index}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={`/stack/${skill.toLowerCase().replace(/\./g, "")}.svg`}
                  alt={skill}
                  width={24}
                  height={24}
                  onError={(e) => {
                    e.currentTarget.src = "/stack/fallback.svg"
                  }}
                />
              </motion.div>
              <motion.span 
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/skill:opacity-100 transition-opacity whitespace-nowrap"
                initial={{ opacity: 0, y: 5 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {skill}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="flex gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {project.links.github && (
            <motion.a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              title="GitHub Repository"
            >
              <Github size={20} />
            </motion.a>
          )}
          {project.links.live && (
            <motion.a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className={cn("p-2 rounded-full transition-colors", "bg-primary text-secondary-foreground hover:bg-primary/90")}
              title="Live Demo"
            >
              <ExternalLink size={20} />
            </motion.a>
          )}
          {project.links.playstore && (
            <motion.a
              href={project.links.playstore}
              target="_blank"
              rel="noopener noreferrer"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="p-2 bg-green-600 rounded-full hover:bg-green-500 transition-colors"
              title="Google Play Store"
            >
              <Smartphone size={20} />
            </motion.a>
          )}
          {project.links.appstore && (
            <motion.a
              href={project.links.appstore}
              target="_blank"
              rel="noopener noreferrer"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="p-2 bg-blue-600 rounded-full hover:bg-blue-500 transition-colors"
              title="Apple App Store"
            >
              <Apple size={20} />
            </motion.a>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}