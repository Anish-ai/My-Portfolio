"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, useSpring, useTransform, useMotionValue, MotionValue, AnimatePresence } from "framer-motion"
import Typed from "typed.js"
import Image from "next/image"
import { personalInfo } from "@/data/personal-info"
import { Crosshair, Cpu, Wifi, Activity, Smartphone, Github } from "lucide-react"
import { Link as ScrollLink } from "react-scroll"
import FloatingShapes from "./ui/floating-shapes"
import MagneticButton from "./ui/magnetic-button"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

// Robust DisplayValue component that updates text directly via ref
const DisplayValue = ({ value }: { value: MotionValue<number> }) => {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // 1. Set initial value immediately on mount
    if (ref.current) {
      ref.current.textContent = value.get().toFixed(0)
    }

    // 2. Subscribe to changes manually (most robust method)
    const unsubscribe = value.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toFixed(0)
      }
    })

    // 3. Cleanup listener on unmount
    return () => unsubscribe()
  }, [value])

  // Render a placeholder span
  return <span ref={ref} className="tabular-nums" />
}

const SystemMonitor = ({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) => {
    const [stats, setStats] = useState({
        fps: 60,
        memory: 40,
        latency: 24,
        uptime: 0,
        packets: 1024,
        netSpeed: 2400
    })

    useEffect(() => {
        let frameCount = 0
        let lastTime = performance.now()
        let rafId: number

        // FPS Counter
        const calcFps = () => {
            const now = performance.now()
            frameCount++
            if (now - lastTime >= 1000) {
                setStats(prev => ({
                    ...prev,
                    fps: frameCount,
                    // Simulate fluctuating memory/latency
                    memory: Math.min(100, Math.max(20, prev.memory + (Math.random() - 0.5) * 5)),
                    latency: Math.max(10, prev.latency + (Math.floor(Math.random() * 5) - 2)),
                    packets: prev.packets + Math.floor(Math.random() * 50),
                    netSpeed: Math.max(100, prev.netSpeed + (Math.random() - 0.5) * 500),
                    uptime: prev.uptime + 1
                }))
                frameCount = 0
                lastTime = now
            }
            rafId = requestAnimationFrame(calcFps)
        }
        rafId = requestAnimationFrame(calcFps)

        return () => cancelAnimationFrame(rafId)
    }, [])

    return (
        <div className="flex flex-col gap-1 tracking-wider transition-all duration-300">
            <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-bold text-green-700 dark:text-green-400">SYS.ONLINE</span>
                 </div>
                 <button 
                    onClick={onToggle}
                    className="text-[10px] text-cyan-700 dark:text-cyan-500 hover:text-black dark:hover:text-white cursor-pointer hover:bg-cyan-500/20 px-1 rounded transition-colors"
                 >
                    [{expanded ? "-" : "+"}]
                 </button>
            </div>
            
            <AnimatePresence>
            {expanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-2"
                >
                    <div className="grid grid-cols-[60px_1fr] gap-x-2 gap-y-1 text-[10px]">
                        <span className="text-cyan-800 dark:text-cyan-700">FPS</span>
                        <span className="text-cyan-600 dark:text-cyan-300">{stats.fps}</span>
                        
                        <span className="text-cyan-800 dark:text-cyan-700">MEM</span>
                        <span className="text-cyan-600 dark:text-cyan-300">{stats.memory.toFixed(1)}%</span>
                        
                        <span className="text-cyan-800 dark:text-cyan-700">PING</span>
                        <span className="text-cyan-600 dark:text-cyan-300">{stats.latency}ms</span>

                        <span className="text-cyan-800 dark:text-cyan-700">NET</span>
                        <span className="text-cyan-600 dark:text-cyan-300">{(stats.netSpeed / 1000).toFixed(1)} Gbps</span>

                        <span className="text-cyan-800 dark:text-cyan-700">PKTS</span>
                        <span className="text-cyan-600 dark:text-cyan-300">{stats.packets}</span>

                        <span className="text-cyan-800 dark:text-cyan-700">UPTIME</span>
                        <span className="text-cyan-600 dark:text-cyan-300">00:00:{stats.uptime.toString().padStart(2, '0')}</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-cyan-500/20 text-[8px] text-cyan-600 font-mono">
                        PID: {Math.random().toString(16).substr(2, 6).toUpperCase()}
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    )
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const typedEl = useRef<HTMLSpanElement>(null)
  const profileImageRef = useRef(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isMonitorExpanded, setIsMonitorExpanded] = useState(false)

  // 1. RAW Mouse Values (For the Text Display - Screen Coordinates)
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)

  // 2. CENTERED Mouse Values (For Animation Physics - Relative to Center)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for UI movement (Laggy effect)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  // Tech Rotations based on spring physics
  const rotateX = useTransform(springY, [-500, 500], [20, -20])
  const rotateY = useTransform(springX, [-500, 500], [-20, 20])
  
  // HUD Elements parallax
  const hudX = useTransform(springX, [-500, 500], [15, -15])
  const invHudX = useTransform(hudX, (x) => -x)

  // Mouse Handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // 1. Raw Screen Coordinates (For text display)
    rawMouseX.set(e.clientX)
    rawMouseY.set(e.clientY)

    // 2. Relative Coordinates (For animations)
    // We want 0,0 to be the center
    const x = e.clientX - window.innerWidth / 2
    const y = e.clientY - window.innerHeight / 2
    mouseX.set(x)
    mouseY.set(y)
  }, [rawMouseX, rawMouseY, mouseX, mouseY])

  // GSAP Animations
  useGSAP(() => {
    if (!isMounted) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".name-char", {
      y: 50, opacity: 0, rotateX: -90, stagger: 0.05, duration: 1,
    })
    .from(".hero-element", {
      y: 20, opacity: 0, stagger: 0.1, duration: 0.8,
    }, "-=0.5");
  }, { scope: containerRef, dependencies: [isMounted] })

  const handleEmailClick = () => {
    if (personalInfo.email) window.location.href = `mailto:${personalInfo.email}`
  }

  const handleDownloadResume = () => {
    window.open("/resume.pdf", "_blank")
  }

  useEffect(() => {
    setIsMounted(true)
    
    // Set initial position to center of screen to avoid "0" on load
    if (typeof window !== "undefined") {
      rawMouseX.set(window.innerWidth / 2)
      rawMouseY.set(window.innerHeight / 2)
      mouseX.set(0)
      mouseY.set(0)
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Init Typed.js (Keep your existing Typed code here)
    let typed: Typed;
    if (typedEl.current) {
      typed = new Typed(typedEl.current, {
        strings: personalInfo.roles,
        typeSpeed: 50, backSpeed: 50, backDelay: 1000, loop: true,
      })
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (typed) typed.destroy()
    }
  }, [handleMouseMove, mouseX, mouseY, rawMouseX, rawMouseY])

  return (
    <section id="hero" ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background/20">
        
      {/* 3D Floating Shapes Background */}
      {isMounted && <FloatingShapes />}

      {/* TECH HUD OVERLAY LAYER */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         {/* Grid Lines */}
         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-center" />
         
         {/* Moving Crosshairs following mouse (using spring for smoothness) */}
         <motion.div 
            className="absolute w-full h-[1px] bg-cyan-500/20"
            style={{ top: "50%", y: springY }}
         />
         <motion.div 
            className="absolute h-full w-[1px] bg-cyan-500/20"
            style={{ left: "50%", x: springX }}
         />
         

      </div>


      {/* FOREGROUND HUD LAYER (Z-30) - Renders ON TOP of content blur */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
         {isMounted && (
             <>
                 <motion.div 
                    className="absolute top-20 left-6 md:left-10 text-xs font-mono text-cyan-500/80 bg-background/40 backdrop-blur-md p-4 rounded border border-cyan-500/20 pointer-events-auto" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{ x: hudX }}
                 >
                    <SystemMonitor expanded={isMonitorExpanded} onToggle={() => setIsMonitorExpanded(!isMonitorExpanded)} />
                 </motion.div>
                 
                 <motion.div 
                    className="absolute bottom-20 right-6 md:right-10 text-xs font-mono text-violet-700 dark:text-violet-500/80 text-right pointer-events-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{ x: invHudX }}
                 >
                    <div className="flex flex-col gap-1 bg-background/40 backdrop-blur-md p-4 rounded border border-violet-500/30 dark:border-violet-500/20">
                        <div className="border-b border-violet-500/30 dark:border-violet-500/20 pb-1 mb-1 font-bold">TARGET_COORDS</div>
                        <div>X: <DisplayValue value={rawMouseX} /></div>
                        <div>Y: <DisplayValue value={rawMouseY} /></div>
                        <div className="mt-2 text-[10px] text-violet-600 dark:text-violet-400/60">
                            VECTOR: [{(Math.random() * 90).toFixed(2)}°, {(Math.random() * 90).toFixed(2)}°]
                        </div>
                    </div>
                 </motion.div>
             </>
         )}
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Content */}
          <div className="md:w-1/2 relative">
              <div className="backdrop-blur-sm bg-card/30 border border-border/50 p-5 rounded-2xl md:text-left text-center shadow-2xl relative overflow-hidden group max-w-xl mx-auto md:mx-0">
                {/* Tech Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 opacity-50" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-violet-500 opacity-50" />
                
                <h1 className="text-2xl md:text-5xl font-bold mb-3 hero-element">
                    <span className="block text-base md:text-lg mb-2 font-mono text-cyan-700/80 dark:text-cyan-400/80">&lt;Hello /&gt;</span>
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-1">
                        {personalInfo.name.split("").map((char, i) => (
                            <span key={i} className="name-char inline-block bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-500">
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </div>
                </h1>

                <h2 className="text-lg md:text-xl mb-3 text-foreground hero-element flex items-center gap-2 justify-center md:justify-start">
                    <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-500 animate-pulse" />
                    <span>I&apos;m a <span ref={typedEl}></span></span>
                </h2>

                {/* COLLABORATION HUB (CTA) - DETAILED & ATTENTION GRABBING */}
                <div className="hero-element mb-6 p-5 rounded-xl bg-gradient-to-br from-green-500/5 to-cyan-500/5 border border-green-500/20 backdrop-blur-md relative overflow-hidden group/cta max-w-xl mx-auto md:mx-0 shadow-lg hover:shadow-green-500/10 transition-all duration-500">
                    <div className="relative z-10 flex flex-col gap-4">
                        {/* Status Header */}
                        <div className="flex flex-col gap-2 border-b border-green-500/10 pb-3 mb-1">
                            <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <span className="relative flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    <span className="text-green-600 dark:text-green-400 font-mono text-xs font-bold tracking-wider">STATUS: AVAILABLE</span>
                                 </div>
                                 <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">ID: CONTRACT_OPEN</span>
                            </div>
                            <div className="text-[10px] md:text-xs text-zinc-500 dark:text-muted-foreground font-mono">
                                Building ideas to life: <span className="text-cyan-600 dark:text-cyan-400">Websites</span> | <span className="text-violet-600 dark:text-violet-400">Apps</span>
                            </div>
                        </div>
                        
                        {/* Action Rows */}
                        <div className="flex flex-col gap-3">
                            
                            {/* Row 1: Hire Me */}
                            <div className="flex items-center justify-between gap-4 group/item w-full">
                                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 group-hover/item:text-green-600 dark:group-hover/item:text-green-400 transition-colors text-left flex-1">
                                    Looking for a dedicated developer to join your team?
                                </span>
                                <a 
                                    href={`mailto:${personalInfo.email}`}
                                    className="w-28 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-green-500/30 hover:scale-105"
                                >
                                    <Wifi size={14} /> Hire Me
                                </a>
                            </div>

                            {/* Row 2: Call */}
                            {personalInfo.phone && (
                                <div className="flex items-center justify-between gap-4 group/item w-full">
                                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 group-hover/item:text-cyan-600 dark:group-hover/item:text-cyan-400 transition-colors text-left flex-1">
                                        Have a startup idea? Need technical execution?
                                    </span>
                                    <a 
                                        href={`tel:${personalInfo.phone}`}
                                        className="w-28 py-2 bg-background border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-600 dark:text-cyan-400 text-xs font-bold rounded flex items-center justify-center gap-2 transition-all hover:scale-105 hover:bg-cyan-500/5"
                                    >
                                        <Smartphone size={14} /> Call
                                    </a>
                                </div>
                            )}

                            {/* Row 3: Github */}
                            {personalInfo.github && (
                                <div className="flex items-center justify-between gap-4 group/item w-full">
                                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 group-hover/item:text-foreground transition-colors text-left flex-1">
                                        Want to verify my skills? Check out my works...
                                    </span>
                                    <a 
                                        href={personalInfo.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-28 py-2 bg-secondary border border-border hover:border-foreground/50 text-foreground text-xs font-bold rounded flex items-center justify-center gap-2 transition-all hover:scale-105"
                                    >
                                        <Github size={14} /> GitHub
                                    </a>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                <p className="text-zinc-700 dark:text-muted-foreground mb-7 max-w-lg mx-auto md:mx-0 hero-element leading-relaxed text-xs md:text-sm">
                    {personalInfo.bio}
                </p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start hero-element">
                    <MagneticButton>
                        <button
                            onClick={handleDownloadResume}
                            className="px-5 py-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-none clip-path-polygon font-bold text-white shadow-lg hover:shadow-violet-500/25 transition-all group relative overflow-hidden border-2 border-transparent hover:border-white/20 text-xs"
                            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
                        >
                            <span className="relative z-10 flex items-center gap-2"><Cpu size={14} /> Download CV</span>
                        </button>
                    </MagneticButton>

                    <MagneticButton>
                        <button
                            onClick={handleEmailClick}
                            className="px-5 py-1.5 bg-background/40 border border-cyan-500/50 text-cyan-600 dark:text-cyan-400 font-bold hover:bg-cyan-500/10 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] text-xs"
                            style={{ clipPath: "polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)" }}
                        >
                            <span className="flex items-center gap-2"><Wifi size={14} /> Contact</span>
                        </button>
                    </MagneticButton>
                </div>
             </div>
          </div>

          {/* Right Content - TECH 3D Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 flex justify-center perspective-1000"
            style={{
               rotateX: rotateX,
               rotateY: rotateY,
            }}
          >
            <div ref={profileImageRef} className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center">
               
               {/* Tech Reticle Ring */}
               <motion.div 
                className="absolute w-[130%] h-[130%] border border-cyan-500/20 rounded-full"
                animate={{ rotate: 180 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               >
                   <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-500 -translate-x-1/2 -translate-y-1/2 opacity-50" />
                   <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-cyan-500 -translate-x-1/2 translate-y-1/2 opacity-50" />
               </motion.div>

               {/* Inner Dashed Ring - Reacts to Mouse X */}
               <motion.div 
                className="absolute w-[110%] h-[110%] border-2 border-dashed border-violet-500/30 rounded-full"
                style={{ rotate: springX }}
               />

               {/* Target Brackets */}
               <div className="absolute -inset-4 border border-foreground/5 rounded-xl pointer-events-none">
                   <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
                   <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
                   <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
                   <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />
                   <div className="absolute top-1/2 left-0 -translate-x-3 w-2 h-2 bg-red-500 animate-pulse" />
               </div>

               {/* Main Profile Container */}
               <div className="w-full h-full hexagonal-mask relative z-10 bg-card border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.4)] overflow-hidden rounded-full">
                 <Image
                    src={personalInfo.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    fill
                    className="object-cover"
                 />
                 
                 {/* Scanner Line */}
                 <motion.div
                    className="absolute w-full h-[2px] bg-cyan-400 shadow-[0_0_10px_cyan]"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 />
                 
                 {/* Digital Glitch Overlay */}
                 <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30 mix-blend-overlay" />
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-400 bg-background/80 px-2 rounded">
                    TRACKING ACTIVE
                 </div>
               </div>

            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-20 flex flex-col items-center gap-1"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-[10px] font-mono text-cyan-500/50 tracking-widest">SCROLL</span>
          <ScrollLink to="projects" smooth={true} duration={500} offset={-70}>
            <Crosshair className="text-cyan-500 w-6 h-6 animate-[spin_10s_linear_infinite]" />
          </ScrollLink>
        </motion.div>
      </div>
    </section>
  )
}