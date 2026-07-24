"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Plane } from "@react-three/drei"
import * as THREE from "three"
import { socialLinks } from "@/data/social-links"
import { personalInfo } from "@/data/personal-info"
import { useColor } from "@/context/color-context"
import { THEME_COLORS } from "@/lib/constants"

// --- 3D GRID COMPONENT ---

const MovingGrid = () => {
    const gridRef = useRef<THREE.Mesh>(null)
    const { colorTheme } = useColor()
    const themeColors = THEME_COLORS[colorTheme] || THEME_COLORS.cyber
    
    useFrame((state) => {
        if (gridRef.current) {
            // Move grid towards camera to simulate movement
            gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2
        }
    })

    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -10]}>
             <Plane args={[60, 60, 40, 40]} ref={gridRef}>
                <meshStandardMaterial 
                    wireframe 
                    color={themeColors.primary} 
                    emissive={themeColors.primary}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.15}
                />
             </Plane>
             {/* Second grid for depth/interference pattern */}
             <Plane args={[60, 60, 20, 20]} position={[0, 0, -0.1]} rotation={[0, 0, 0.5]}>
                <meshBasicMaterial 
                    wireframe 
                    color={themeColors.accent} 
                    transparent 
                    opacity={0.05} 
                />
             </Plane>
        </group>
    )
}

// --- MAGNETIC BUTTON COMPONENT ---

const MagneticIcon = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null)
    const position = { x: useMotionValue(0), y: useMotionValue(0) }
    
    const smoothPos = {
        x: useSpring(position.x, { stiffness: 150, damping: 15, mass: 0.1 }),
        y: useSpring(position.y, { stiffness: 150, damping: 15, mass: 0.1 })
    }

    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e
        const { height, width, left, top } = ref.current?.getBoundingClientRect() || { height: 0, width: 0, left: 0, top: 0 }
        const middleX = clientX - (left + width / 2)
        const middleY = clientY - (top + height / 2)
        position.x.set(middleX * 0.5) // Strength of pull
        position.y.set(middleY * 0.5)
    }

    const reset = () => {
        position.x.set(0)
        position.y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ x: smoothPos.x, y: smoothPos.y }}
            className="relative z-10"
        >
            {children}
        </motion.div>
    )
}

import GlitchText from "@/components/ui/glitch-text"

// --- MAIN FOOTER ---

export default function Footer() {
    return (
        <footer id="footer" className="relative w-full bg-background pt-20 pb-10">
            {/* 3D BACKGROUND CANVAS */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 1, 0]} fov={75} />
                    <fog attach="fog" args={['#000000', 5, 20]} />
                    <ambientLight intensity={0.5} />
                    <MovingGrid />
                </Canvas>
                {/* Fade out at top */}
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent h-40" />
            </div>

            <div className="container relative z-10 mx-auto px-4">
                
                {/* GLASS DASHBOARD PANEL */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-card/40 backdrop-blur-xl border border-border/30 rounded-2xl p-8 md:p-12 mb-12 shadow-[0_0_50px_var(--primary)] shadow-primary/10 relative overflow-hidden"
                >
                    {/* Panel Decor */}
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                         <div className="flex gap-1 mb-1 justify-end">
                             <div className="w-8 h-1 bg-primary" />
                             <div className="w-2 h-1 bg-primary" />
                         </div>
                         <div className="text-[10px] font-mono text-primary text-right">SYS_READY</div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                        {/* BRAND / INFO */}
                        <div className="lg:col-span-5 space-y-6">
                            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-muted-foreground tracking-tighter">
                                {personalInfo.name.toUpperCase()}
                            </h2>
                            <p className="text-zinc-600 dark:text-muted-foreground leading-relaxed max-w-sm font-light">
                                {personalInfo.footerBio}
                            </p>
                            
                            {/* Status Indicators */}
                            <div className="flex gap-4 pt-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-foreground/5 rounded-full border border-foreground/5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-mono text-zinc-600 dark:text-muted-foreground">AVAILABLE FOR WORK</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-foreground/5 rounded-full border border-foreground/5">
                                    <span className="text-[10px] font-mono text-muted-foreground">V.2.0.4.RELEASE</span>
                                </div>
                            </div>
                        </div>

                        {/* NAVIGATION LINKS */}
                        <div className="lg:col-span-4 flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-widest border-b border-border/30 pb-2 w-max">Coordinates</h3>
                            <GlitchText text="Home Base" href="#hero" />
                            <GlitchText text="Merit Log" href="#achievements" />
                            <GlitchText text="Mission Log" href="#experience" />
                            <GlitchText text="Project Logs" href="#projects" />
                            <GlitchText text="Skill Database" href="#skills" />
                        </div>

                        {/* SOCIALS & ACTION */}
                        <div className="lg:col-span-3 flex flex-col gap-6 items-start lg:items-end">
                            <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-widest border-b border-border/30 pb-2 w-max text-right">Comms Link</h3>
                            
                            <div className="flex gap-4">
                                {socialLinks.map((link) => (
                                    <MagneticIcon key={link.name}>
                                        <a 
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 flex items-center justify-center bg-foreground/5 hover:bg-primary/20 border border-foreground/10 hover:border-primary/50 rounded-lg text-zinc-600 dark:text-muted-foreground hover:text-primary transition-all duration-300 backdrop-blur-sm"
                                        >
                                            <link.icon size={18} />
                                        </a>
                                    </MagneticIcon>
                                ))}
                            </div>

                            <button 
                                onClick={() => window.location.href = `mailto:${personalInfo.email}`}
                                className="group relative px-6 py-3 bg-foreground text-background font-bold font-mono text-sm tracking-wider uppercase hover:bg-primary transition-colors clip-path-polygon"
                                style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
                            >
                                <span className="relative z-10">Initialize Contact</span>
                                <div className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left -z-0 mix-blend-multiply" />
                            </button>
                        </div>

                    </div>
                </motion.div>

                {/* BOTTOM BAR */}
                <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-zinc-500 dark:text-muted-foreground/60 border-t border-border/20 pt-8">
                    <div>
                        © {new Date().getFullYear()} {personalInfo.name.toUpperCase()} {"// ALL RIGHTS RESERVED"}
                    </div>
                    <div className="flex gap-4 mt-2 md:mt-0">
                         <span>SECURE PROTOCOL</span>
                         <span>ENCRYPTED</span>
                    </div>
                </div>

            </div>
        </footer>
    )
}