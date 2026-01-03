"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, useSpring, useTransform, useMotionValue, useMotionTemplate, MotionValue, AnimatePresence } from "framer-motion"
import Typed from "typed.js"
import Image from "next/image"
import { personalInfo } from "@/data/personal-info"
import { Crosshair, Activity, Github } from "lucide-react"
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



  // FPS Counter
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
                    className="text-[10px] text-primary/70 dark:text-primary/80 hover:text-black dark:hover:text-white cursor-pointer hover:bg-primary/20 px-1 rounded transition-colors"
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
                        <span className="text-primary/80">FPS</span>
                        <span className="text-primary">{stats.fps}</span>
                        
                        <span className="text-primary/80">MEM</span>
                        <span className="text-primary">{stats.memory.toFixed(1)}%</span>
                        
                        <span className="text-primary/80">PING</span>
                        <span className="text-primary">{stats.latency}ms</span>

                        <span className="text-primary/80">NET</span>
                        <span className="text-primary">{(stats.netSpeed / 1000).toFixed(1)} Gbps</span>

                        <span className="text-primary/80">PKTS</span>
                        <span className="text-primary">{stats.packets}</span>

                        <span className="text-primary/80">UPTIME</span>
                        <span className="text-primary">00:00:{stats.uptime.toString().padStart(2, '0')}</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-primary/20 text-[8px] text-primary font-mono">
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
  const collabHubRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isMonitorExpanded, setIsMonitorExpanded] = useState(false)

  /* Scramble Logic */
  const [displayText, setDisplayText] = useState(personalInfo.name)
  
  const scrambleText = useCallback(() => {
    const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let iteration = 0;
    const interval = setInterval(() => {
        setDisplayText(() => 
            personalInfo.name.split("").map((letter, index) => {
                if(index < iteration) {
                    return personalInfo.name[index];
                }
                return chars[Math.floor(Math.random() * chars.length)]
            }).join("")
        );
        
        if(iteration >= personalInfo.name.length){ 
            clearInterval(interval);
        }
        
        iteration += 1 / 3;
    }, 30);
  }, []);

  useEffect(() => {
    scrambleText();
  }, [scrambleText]);

  /* Tech Spotlight Logic */
  const imgX = useMotionValue(0);
  const imgY = useMotionValue(0);
  const maskSize = useSpring(0, { stiffness: 400, damping: 30 }); // Start at 0 (Closed hole = Full Grayscale)
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  
  // Mask Logic: Hole at cursor. 
  // transparent 0 -> transparent maskSize = Hole.
  // black maskSize + 20 -> black = Opaque Mask (Grayscale visible).
  const maskImage = useMotionTemplate`radial-gradient(circle at ${imgX}px ${imgY}px, transparent 0px, transparent ${maskSize}px, black ${maskSize}px)`; // Sharp edge for tech look

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      imgX.set(e.clientX - rect.left)
      imgY.set(e.clientY - rect.top)
      setIsHoveringImage(true)
      maskSize.set(100)
  }

  const handleImageMouseLeave = () => {
      setIsHoveringImage(false)
      maskSize.set(0)
  }

  // 1. RAW Mouse Values (For the Text Display - Screen Coordinates)

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

    // Animate name characters
    tl.from(".name-char", {
      y: 50, opacity: 0, rotateX: -90, stagger: 0.05, duration: 1,
    })
    // Animate hero elements (excluding collab hub)
    .from(".hero-element:not(.collab-hub)", {
      y: 20, opacity: 0, stagger: 0.1, duration: 0.8,
    }, "-=0.5")
    // Animate the collaboration hub with a special effect
    .fromTo(collabHubRef.current,
      {
        opacity: 0,
        y: 40,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
      }, "-=0.3")
    // Add a subtle glow animation to collab hub
    .fromTo(".collab-glow",
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
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
            className="absolute w-full h-[1px] bg-primary/20"
            style={{ top: "50%", y: springY }}
         />
         <motion.div 
            className="absolute h-full w-[1px] bg-primary/20"
            style={{ left: "50%", x: springX }}
         />
      </div>

      {/* FOREGROUND HUD LAYER (Z-30) - Renders ON TOP of content blur */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
         {isMounted && (
             <>
                 <motion.div 
                    className="absolute top-20 left-6 md:left-10 text-xs font-mono text-primary/80/80 bg-background/40 backdrop-blur-md p-4 rounded border border-primary/20 pointer-events-auto" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{ x: hudX }}
                 >
                    <SystemMonitor expanded={isMonitorExpanded} onToggle={() => setIsMonitorExpanded(!isMonitorExpanded)} />
                 </motion.div>
                 
                 <motion.div 
                    className="absolute bottom-20 right-6 md:right-10 text-xs font-mono text-primary text-right pointer-events-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{ x: invHudX }}
                 >
                    <div className="flex flex-col gap-1 bg-background/40 backdrop-blur-md p-4 rounded border border-primary/20">
                        <div className="border-b border-primary/20 pb-1 mb-1 font-bold text-primary">TARGET_COORDS</div>
                        <div>X: <DisplayValue value={rawMouseX} /></div>
                        <div>Y: <DisplayValue value={rawMouseY} /></div>
                        <div className="mt-2 text-[10px] text-primary/60">
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
              <div className="relative md:text-left text-center max-w-xl mx-auto md:mx-0">
                {/* Tech Corner Accents Removed for Frameless Look */}
                
                <h1 className="text-2xl md:text-5xl font-bold mb-3 hero-element">
                    <span className="block text-base md:text-lg mb-2 font-mono text-primary dark:text-primary/80">&lt;Hello /&gt;</span>
                    <div className="relative z-10">
                        <span 
                            className="text-4xl md:text-7xl font-black tracking-tighter text-foreground cursor-pointer hover:text-primary dark:hover:text-primary transition-colors duration-300"
                            onMouseEnter={scrambleText}
                        >
                            {displayText}
                        </span>
                    </div>
                </h1>

                <h2 className="text-lg md:text-xl mb-3 text-foreground hero-element flex items-center gap-2 justify-center md:justify-start">
                    <Activity className="w-5 h-5 text-primary dark:text-primary/80 animate-pulse" />
                    <span>I&apos;m a <span ref={typedEl}></span></span>
                </h2>

                {/* COMMAND STRIP (Minimalist CTA) */}
                <div className="hero-element mt-8 flex flex-col md:flex-row items-center gap-6">
                    <motion.div 
                        className="relative group/strip"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        {/* Animated Border Gradient - Static Glow instead of Spin */}
                        <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30 blur-sm group-hover/strip:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10 flex items-center gap-4 bg-background/80 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-full py-2 px-6 shadow-2xl min-w-[320px] justify-between">
                             
                             {/* Status Module */}
                             <div className="hidden md:flex items-center gap-2 pl-4 pr-3 border-r border-white/10">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] font-mono text-green-600 dark:text-green-400 font-bold tracking-widest">ONLINE</span>
                             </div>

                             {/* Actions Group */}
                             <div className="flex items-center gap-1">
                                
                                {/* HIRE ME */}
                                <MagneticButton>
                                    <button 
                                        onClick={handleEmailClick}
                                        className="relative group overflow-hidden px-4 py-2 rounded-full bg-accent/10 hover:bg-violet-600/20 text-accent dark:text-violet-400 text-xs font-bold transition-colors border border-accent/20"
                                    >
                                        <span className="relative z-10">HIRE_ME</span>
                                        <span className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    </button>
                                </MagneticButton>

                                {/* CALL */}
                                {personalInfo.phone && (
                                    <MagneticButton>
                                        <button 
                                            onClick={() => window.location.href = `tel:${personalInfo.phone}`}
                                            className="relative group overflow-hidden px-4 py-2 rounded-full hover:bg-primary/10 text-primary dark:text-primary text-xs font-bold transition-colors border border-transparent hover:border-primary/20"
                                        >
                                            <span className="relative z-10">CALL</span>
                                        </button>
                                    </MagneticButton>
                                )}

                                {/* CV */}
                                <MagneticButton>
                                    <button 
                                        onClick={handleDownloadResume}
                                        className="relative group overflow-hidden px-4 py-2 rounded-full hover:bg-accent/10 text-accent dark:text-fuchsia-400 text-xs font-bold transition-colors border border-transparent hover:border-fuchsia-500/20"
                                    >
                                        <span className="relative z-10">CV</span>
                                    </button>
                                </MagneticButton>

                                {/* GITHUB */}
                                {personalInfo.github && (
                                    <MagneticButton>
                                        <button 
                                            onClick={() => window.open(personalInfo.github, '_blank')}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground transition-colors"
                                        >
                                            <Github size={14} />
                                        </button>
                                    </MagneticButton>
                                )}
                             </div>
                        </div>
                    </motion.div>
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
                className="absolute w-[130%] h-[130%] border border-primary/20 rounded-full"
                animate={{ rotate: 180 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               >
                   <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary -translate-x-1/2 -translate-y-1/2 opacity-50" />
                   <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-primary -translate-x-1/2 translate-y-1/2 opacity-50" />
               </motion.div>

               {/* Inner Dashed Ring - Reacts to Mouse X */}

               {/* Inner Dashed Ring - Thicker & Wider Spacing (SVG) */}


               {/* Target Brackets */}
               <div className="absolute -inset-4 border border-foreground/5 rounded-xl pointer-events-none">
                   <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
                   <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary" />
                   <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary" />
                   <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />
                   <div className="absolute top-1/2 left-0 -translate-x-3 w-2 h-2 bg-primary animate-pulse" />
               </div>

               {/* Main Profile Container with Tech Reveal */}
               <div 
                  className="w-full h-full relative z-10 bg-card border-2 border-primary/50 shadow-[0_0_30px_var(--primary)] shadow-primary/40 overflow-hidden rounded-full group/profile cursor-crosshair"
                  onMouseMove={handleImageMouseMove}
                  onMouseLeave={handleImageMouseLeave}
               >
                   {/* Layer 1 (Bottom): Full Color Image (The Prize) */}
                  <div className="relative w-full h-full">
                    <Image
                        src={personalInfo.profileImage}
                        alt={personalInfo.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/profile:scale-110"
                        priority
                    />
                  </div>

                  {/* Layer 2 (Top): Grayscale Image (The Mask/Curtain) */}
                  {/* Visual: Grayscale + Dimmed. */}
                  {/* Mask: Hole (transparent) reveals Layer 1. Solid (black) keeps Layer 2 visible. */}
                  <motion.div 
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{ maskImage, WebkitMaskImage: maskImage }}
                  >
                        {/* The Grayscale Image itself */}
                       <div className="relative w-full h-full grayscale brightness-75 contrast-125">
                            <Image
                                src={personalInfo.profileImage}
                                alt="Locked"
                                fill
                                className="object-cover transition-transform duration-500 group-hover/profile:scale-110" // Sync transform
                                priority
                            />
                       </div>

                      {/* Grid Pattern Overlay on the Grayscale layer */}
                      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-40 mix-blend-overlay" />
                      
                      {/* Flex center for LOCKED text when hole is closed (or nearly closed) */}

                  </motion.div>

                  {/* Layer 3: Scanner UI (Follows mouse) */}
                  {isHoveringImage && (
                    <motion.div 
                        className="absolute w-20 h-20 border border-primary/80 rounded-full z-30 pointer-events-none shadow-[0_0_15px_var(--primary)] shadow-primary/50"
                        style={{ x: imgX, y: imgY, left: -40, top: -40 }} // Center the 80px circle on mouse
                    >
                         {/* Crosshair lines */}
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/50" />
                        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-primary/50" />
                    </motion.div>
                  )}
                  
                  {/* Scanner Line */}
                  <motion.div
                     className="absolute w-full h-[2px] bg-primary shadow-[0_0_10px_var(--primary)] opacity-0 group-hover/profile:opacity-100"
                     animate={{ top: ["0%", "100%", "0%"] }}
                     transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
               </div>  
                 {/* Digital Glitch Overlay */}
                 <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30 mix-blend-overlay" />
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-primary bg-background/80 px-2 rounded">
                    TRACKING ACTIVE
                 </div>

            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-20 flex flex-col items-center gap-1"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-[10px] font-mono text-primary/50 tracking-widest">SCROLL</span>
          <ScrollLink to="projects" smooth={true} duration={500} offset={-70}>
            <Crosshair className="text-primary w-6 h-6 animate-[spin_10s_linear_infinite]" />
          </ScrollLink>
        </motion.div>
      </div>
    </section>
  )
}