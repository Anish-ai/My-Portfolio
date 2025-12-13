"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Typed from "typed.js"
import Image from "next/image"
import { personalInfo } from "@/data/personal-info"
import { ChevronDown } from "lucide-react"
import { Link as ScrollLink } from "react-scroll"

// Interactive Particle component that reacts to mouse position
const Particle = ({
  index,
  mousePosition,
  strength = 100,
}: {
  index: number
  mousePosition: { x: number; y: number }
  strength?: number
}) => {
  // Generate random values for each particle
  const delay = Math.random() * 2 // Random start delay
  const size = Math.random() * 4 + 2
  const duration = Math.random() * 15 + 10
  const initialX = Math.random() * 100
  const initialY = Math.random() * 100

  // Multiply intensity by strength prop
  const intensity = (Math.random() * 0.15 + 0.05) * strength

  // Calculate mouse influence with strength
  const mouseInfluenceX = mousePosition.x * intensity * 50
  const mouseInfluenceY = mousePosition.y * intensity * 50

  // Set different colors based on index for variety
  const colors = [
    "rgba(139, 92, 246, 0.4)", // violet-500 with opacity
    "rgba(192, 132, 252, 0.4)", // violet-400 with opacity
    "rgba(217, 70, 239, 0.4)", // fuchsia-500 with opacity
    "rgba(232, 121, 249, 0.4)", // fuchsia-400 with opacity
  ]

  const color = colors[index % colors.length]
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        filter: "blur(1px)",
        left: `${initialX}%`,
        top: `${initialY}%`,
      }}
      animate={{
        x: [
          initialX + mouseInfluenceX * 0.5,
          initialX + Math.random() * 40 - 20 + mouseInfluenceX,
          initialX + Math.random() * 40 - 20 + mouseInfluenceX * 0.8,
          initialX + mouseInfluenceX * 0.5,
        ],
        y: [
          initialY + mouseInfluenceY * 0.5,
          initialY + Math.random() * 40 - 20 + mouseInfluenceY,
          initialY + Math.random() * 40 - 20 + mouseInfluenceY * 0.8,
          initialY + mouseInfluenceY * 0.5,
        ],
        opacity: [0.7, 1, 0.8, 0.6, 0.7],
        scale: [1, 1.2, 1.4, 1.1, 1],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  )
}

export default function Hero() {
  const typedEl = useRef<HTMLSpanElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [normalizedMousePosition, setNormalizedMousePosition] = useState({ x: 0, y: 0 })
  const profileImageRef = useRef(null)
  const [attractionStrength] = useState(1)
  const [isMounted, setIsMounted] = useState(false)

  // Handle mouse movement for interactive particles
  const handleMouseMove = (e: MouseEvent) => {
    // Store actual mouse position for the mouse follower
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    })

    // Calculate normalized mouse position relative to the center of the screen
    // Values will range roughly from -1 to 1 in both axes
    const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2
    const normalizedY = (e.clientY / window.innerHeight - 0.5) * 2

    setNormalizedMousePosition({
      x: normalizedX,
      y: normalizedY,
    })
  }

  const handleEmailClick = () => {
    // Check if email exists in personalInfo
    if (personalInfo.email) {
      window.location.href = "http://mailto:aniskum59431@gmail.com/"
    } else {
      // Fallback to a default email or show an alert
      console.error("Email address is missing in personalInfo")
      alert("Contact email is not available. Please check the console for more information.")

      // Alternative: You could set a default email
      // window.location.href = "mailto:your-default-email@example.com";
    }
  }

  useEffect(() => {
    // Set mounted to true after first render on client
    setIsMounted(true)

    if (typedEl.current) {
      const typed = new Typed(typedEl.current, {
        strings: personalInfo.roles,
        typeSpeed: 50,
        backSpeed: 50,
        backDelay: 1000,
        loop: true,
      })

      return () => {
        typed.destroy()
      }
    }

    // Add mouse move event listener
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleDownloadResume = () => {
    // Replace this path with the actual path to your resume file
    window.open("/resume.pdf", "_blank")
  }

  // Generate particle array
  const particles = Array.from({ length: 80 }, (_, index) => (
    <Particle
      key={index}
      index={index}
      mousePosition={normalizedMousePosition}
      strength={attractionStrength * (index % 2 ? 0.8 : 1.2)} // Vary strength
    />
  ))

  // Interactive particle that follows the mouse
  const mouseParticle = (
    <motion.div
      className="fixed w-20 h-20 rounded-full pointer-events-none z-0"
      style={{
        background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(217, 70, 239, 0.1) 50%, transparent 70%)",
        x: mousePosition.x - 40,
        y: mousePosition.y - 40,
      }}
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  )

  // Log personalInfo to help debug
  useEffect(() => {
    console.log("Personal Info:", personalInfo)
    if (!personalInfo.email) {
      console.warn("Warning: personalInfo.email is not defined")
    }
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Particles background - only render on client to avoid hydration errors */}
      {isMounted && (
        <div className="absolute inset-0 z-0">
          {particles}
          {mouseParticle}
        </div>
      )}

      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br opacity-10 z-0"
        style={{
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 100%", "100% 0%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left md:w-1/2"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Hi, I&apos;m{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
                {personalInfo.name}
              </span>
            </motion.h1>

            <motion.h2
              className="text-2xl md:text-3xl mb-6 text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              I&apos;m a <span ref={typedEl}></span>
            </motion.h2>

            <motion.p
              className="text-gray-400 mb-8 max-w-lg mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {personalInfo.bio}
            </motion.p>

            <motion.div
              className="flex gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(138, 43, 226, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-full font-medium relative overflow-hidden group"
                onClick={handleDownloadResume}
              >
                <span className="relative z-10">Download Resume</span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-700 z-0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Sparkle effect on hover */}
                <motion.span
                  className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.2) 0%, transparent 50%)",
                  }}
                  animate={{
                    "--x": ["20%", "80%", "30%", "70%", "20%"],
                    "--y": ["30%", "70%", "60%", "20%", "30%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(138, 43, 226, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border border-violet-500 rounded-full font-medium hover:bg-violet-500/10 transition-colors relative overflow-hidden group"
                onClick={handleEmailClick}
              >
                <span className="relative z-10">Contact Me</span>
                <motion.span
                  className="absolute inset-0 bg-violet-500/20 z-0"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Pulse effect on hover */}
                <motion.span
                  className="absolute inset-0 rounded-full opacity-0 z-0 group-hover:opacity-100"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(139, 92, 246, 0)",
                      "0 0 0 10px rgba(139, 92, 246, 0.1)",
                      "0 0 0 20px rgba(139, 92, 246, 0)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeOut",
                  }}
                />
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 flex justify-center"
            style={{
              perspective: "1000px",
              transform: isMounted ? `translate(${normalizedMousePosition.x * -10}px, ${normalizedMousePosition.y * -10}px)` : "translate(0px, 0px)",
              transition: "transform 0.1s ease-out",
            }}
          >
            <div ref={profileImageRef} className="relative w-64 h-64 md:w-80 md:h-80 perspective-1000">
              {/* Animated orbit particles */}
              <motion.div
                className="absolute w-full h-full rounded-full z-10"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  transform: isMounted ? `translate(
                    ${normalizedMousePosition.x * -20}px, 
                    ${normalizedMousePosition.y * -20}px
                  ) rotate3d(
                    ${normalizedMousePosition.y * 0.5}, 
                    ${normalizedMousePosition.x * 0.5}, 
                    0, 
                    ${Math.abs(normalizedMousePosition.x) * 10}deg
                  )` : "translate(0px, 0px)",
                  transition: "transform 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67)",
                }}
              >
                {isMounted && Array.from({ length: 120 }).map((_, index) => (
                  <motion.div
                    key={`orbit-particle-${index}`}
                    className="absolute w-3 h-3 rounded-full bg-violet-400"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${index * 120}deg) translateX(${40 + index * 5}px) translateY(-50%)`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      delay: index * 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>

              {/* Second orbit */}
              <motion.div
                className="absolute w-full h-full rounded-full z-10"
                animate={{
                  rotate: [360, 0],
                }}
                transition={{
                  duration: 25,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                {isMounted && Array.from({ length: 40 }).map((_, index) => (
                  <motion.div
                    key={`orbit-particle-2-${index}`}
                    className="absolute w-2 h-2 rounded-full bg-fuchsia-400"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${index * 90}deg) translateX(${50 + index * 3}px) translateY(-50%)`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 4,
                      delay: index * 0.7,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>

              {/* Animated glow effect */}
              <motion.div
                className="absolute -inset-2 rounded-full opacity-70 z-0"
                style={{
                  background:
                    "radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(217, 70, 239, 0.3) 50%, transparent 70%)",
                  filter: "blur(10px)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Animated border light effect */}
              <motion.div
                className="absolute inset-0 rounded-full z-0"
                style={{
                  border: "2px solid rgba(139, 92, 246, 0.3)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 10px 3px rgba(139, 92, 246, 0.3)",
                    "0 0 20px 6px rgba(139, 92, 246, 0.5)",
                    "0 0 10px 3px rgba(139, 92, 246, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Main profile image container with mouse-following effect */}
              <motion.div
                className="relative w-full h-full transition-all duration-500 preserve-3d"
                animate={{
                  rotateY: [0, 10, 0, -10, 0],
                  rotateX: [0, 10, 0, -10, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 10,
                  ease: "easeInOut",
                }}
                style={{
                  // Additional tilt based on mouse position
                  rotateY: isMounted ? normalizedMousePosition.x * 15 : 0,
                  rotateX: isMounted ? normalizedMousePosition.y * -15 : 0,
                  transition: "transform 0.1s ease-out",
                }}
                whileHover={{
                  scale: 1.05,
                }}
              >
                <div className="absolute inset-0 backface-hidden">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-violet-500 p-1 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                    {/* Shimmer effect over the image */}
                    <motion.div
                      className="absolute inset-0 z-10 opacity-0"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        transform: "skewX(-20deg)",
                      }}
                      animate={{
                        x: ["-100%", "200%"],
                        opacity: [0, 0.3, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 5,
                        ease: "easeInOut",
                      }}
                    />

                    <Image
                      src={personalInfo.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      width={400}
                      height={400}
                      className="rounded-full object-cover"
                      // Add pulse animation to the image on hover
                      style={{
                        transform: isMounted ? `scale(${1 + Math.abs(normalizedMousePosition.x * 0.03)})` : "scale(1)",
                        transition: "transform 0.3s ease-out",
                      }}
                    />
                  </div>
                </div>

                {/* Floating particles around the profile image */}
                {isMounted && Array.from({ length: 50 }).map((_, index) => {
                  const angle = index * 72 + normalizedMousePosition.x * 20
                  const radius = 50 + index * 3
                  const x = Math.cos((angle * Math.PI) / 180) * radius
                  const y = Math.sin((angle * Math.PI) / 180) * radius

                  return (
                    <motion.div
                      key={`float-particle-${index}`}
                      className="absolute w-2 h-2 rounded-full bg-violet-300"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `translateX(${x}px) translateY(${y}px)`,
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2 + index * 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  )
                })}
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <ScrollLink
            to="projects"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="flex flex-col items-center cursor-pointer group"
          >
            <span className="text-sm text-gray-400 mb-2 group-hover:text-violet-400 transition-colors">
              Scroll Down
            </span>
            <motion.div
              animate={{
                y: [0, 5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="text-violet-400 group-hover:text-fuchsia-400 transition-colors" />
            </motion.div>
          </ScrollLink>
        </motion.div>
      </div>
    </section>
  )
}

