"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")
  const [cursorText, setCursorText] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
      if (!isVisible) setIsVisible(true)
    }

    const mouseLeave = () => setIsVisible(false)
    const mouseEnter = () => setIsVisible(true)
    const mouseDown = () => setIsClicking(true)
    const mouseUp = () => setIsClicking(false)

    window.addEventListener("mousemove", mouseMove)
    document.addEventListener("mouseleave", mouseLeave)
    document.addEventListener("mouseenter", mouseEnter)
    document.addEventListener("mousedown", mouseDown)
    document.addEventListener("mouseup", mouseUp)

    // Add event listeners for interactive elements
    const handleButtonEnter = (e: Event) => {
      setCursorVariant("button")
      const target = e.target as HTMLElement
      setCursorText(target.getAttribute("data-cursor-text") || "Click")
    }

    const handleLinkEnter = () => {
      setCursorVariant("link")
      setCursorText("")
    }

    const handleProjectEnter = () => {
      setCursorVariant("project")
      setCursorText("View")
    }

    const handleSkillEnter = () => {
      setCursorVariant("skill")
      setCursorText("")
    }

    const handleImageEnter = () => {
      setCursorVariant("image")
      setCursorText("Zoom")
    }

    const handleInputEnter = () => {
      setCursorVariant("input")
      setCursorText("")
    }

    const handleMouseLeave = () => {
      setCursorVariant("default")
      setCursorText("")
    }

    // Apply listeners to different element types
    const buttons = document.querySelectorAll('button, [role="button"]')
    const links = document.querySelectorAll("a")
    const projects = document.querySelectorAll(".project-card")
    const skills = document.querySelectorAll(".skill-item")
    const images = document.querySelectorAll("img, .image-container")
    const inputs = document.querySelectorAll("input, textarea, [contenteditable]")

    buttons.forEach((el) => {
      el.addEventListener("mouseenter", handleButtonEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    links.forEach((el) => {
      el.addEventListener("mouseenter", handleLinkEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    projects.forEach((el) => {
      el.addEventListener("mouseenter", handleProjectEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    skills.forEach((el) => {
      el.addEventListener("mouseenter", handleSkillEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    images.forEach((el) => {
      el.addEventListener("mouseenter", handleImageEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    inputs.forEach((el) => {
      el.addEventListener("mouseenter", handleInputEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      window.removeEventListener("mousemove", mouseMove)
      document.removeEventListener("mouseleave", mouseLeave)
      document.removeEventListener("mouseenter", mouseEnter)
      document.removeEventListener("mousedown", mouseDown)
      document.removeEventListener("mouseup", mouseUp)

      buttons.forEach((el) => {
        el.removeEventListener("mouseenter", handleButtonEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })

      links.forEach((el) => {
        el.removeEventListener("mouseenter", handleLinkEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })

      projects.forEach((el) => {
        el.removeEventListener("mouseenter", handleProjectEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })

      skills.forEach((el) => {
        el.removeEventListener("mouseenter", handleSkillEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })

      images.forEach((el) => {
        el.removeEventListener("mouseenter", handleImageEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })

      inputs.forEach((el) => {
        el.removeEventListener("mouseenter", handleInputEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [isVisible])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(255, 255, 255, 0)",
      border: "1.5px solid rgba(138, 43, 226, 0.5)",
      scale: isClicking ? 0.8 : 1,
      transition: {
        type: "spring",
        mass: 0.3,
        stiffness: 800,
        damping: 30,
      },
    },
    button: {
      x: mousePosition.x - 30,
      y: mousePosition.y - 30,
      height: 60,
      width: 60,
      backgroundColor: "rgba(138, 43, 226, 0.1)",
      border: "1.5px solid rgba(138, 43, 226, 0.8)",
      scale: isClicking ? 0.85 : 1,
      transition: {
        type: "spring",
        mass: 0.3,
        stiffness: 800,
        damping: 30,
      },
    },
    link: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      height: 40,
      width: 40,
      backgroundColor: "rgba(236, 72, 153, 0.1)",
      border: "1.5px solid rgba(236, 72, 153, 0.8)",
      scale: isClicking ? 0.9 : 1,
      transition: {
        type: "spring",
        mass: 0.3,
        stiffness: 800,
        damping: 30,
      },
    },
    project: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      height: 80,
      width: 80,
      backgroundColor: "rgba(138, 43, 226, 0.05)",
      border: "1.5px solid rgba(138, 43, 226, 0.8)",
      scale: isClicking ? 0.8 : 1,
      transition: {
        type: "spring",
        mass: 0.3,
        stiffness: 800,
        damping: 30,
      },
    },
    skill: {
      x: mousePosition.x - 25,
      y: mousePosition.y - 25,
      height: 50,
      width: 50,
      backgroundColor: "rgba(236, 72, 153, 0.05)",
      border: "1.5px solid rgba(236, 72, 153, 0.8)",
      scale: isClicking ? 0.9 : 1,
      transition: {
        type: "spring",
        mass: 0.3,
        stiffness: 800,
        damping: 30,
      },
    },
    image: {
      x: mousePosition.x - 35,
      y: mousePosition.y - 35,
      height: 70,
      width: 70,
      backgroundColor: "rgba(59, 130, 246, 0.05)",
      border: "1.5px solid rgba(59, 130, 246, 0.8)",
      scale: isClicking ? 0.85 : 1,
      transition: {
        type: "spring",
        mass: 0.3,
        stiffness: 800,
        damping: 30,
      },
    },
    input: {
      x: mousePosition.x - 15,
      y: mousePosition.y - 15,
      height: 30,
      width: 30,
      backgroundColor: "rgba(34, 211, 238, 0.05)",
      border: "1.5px solid rgba(34, 211, 238, 0.8)",
      scale: isClicking ? 0.8 : 1,
      transition: {
        type: "spring",
        mass: 0.3,
        stiffness: 800,
        damping: 30,
      },
    },
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]" // Increased z-index
        variants={variants}
        animate={cursorVariant}
        style={{ 
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s ease"
        }}
      >
        {cursorVariant !== "default" && (
          <motion.div 
            className="absolute inset-0 rounded-full bg-white"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.05, 0.08, 0.05]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {cursorText && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] font-medium tracking-wide uppercase text-xs hidden md:flex items-center justify-center" // Increased z-index
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
            scale: isClicking ? 0.9 : 1,
            opacity: 1,
          }}
          transition={{
            type: "spring",
            mass: 0.3,
            stiffness: 800,
            damping: 30,
          }}
          style={{ 
            opacity: isVisible ? 1 : 0,
            color: cursorVariant === "button" || cursorVariant === "project" ? "rgba(138, 43, 226, 0.9)" :
                  cursorVariant === "link" || cursorVariant === "skill" ? "rgba(236, 72, 153, 0.9)" :
                  cursorVariant === "image" ? "rgba(59, 130, 246, 0.9)" :
                  "rgba(34, 211, 238, 0.9)",
            fontWeight: 600
          }}
        >
          {cursorText}
        </motion.div>
      )}

      {/* Optional trail effect with transparency */}
      {isVisible && cursorVariant !== "default" && (
        <motion.div
          className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]" // Slightly lower z-index than cursor
          animate={{
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            scale: 0.5,
          }}
          transition={{
            type: "tween",
            duration: 0.5,
            ease: "easeOut",
          }}
          style={{
            height: 32,
            width: 32,
            opacity: 0.2,
            backgroundColor: 
              cursorVariant === "button" || cursorVariant === "project" ? "rgba(138, 43, 226, 0.2)" :
              cursorVariant === "link" || cursorVariant === "skill" ? "rgba(236, 72, 153, 0.2)" :
              cursorVariant === "image" ? "rgba(59, 130, 246, 0.2)" :
              "rgba(34, 211, 238, 0.2)",
          }}
        />
      )}
    </>
  )
}