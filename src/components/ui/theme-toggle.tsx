"use client"

import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Cloud, Star } from "lucide-react"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10 bg-muted/20 rounded-xl" />
  }

  const isDark = theme === "dark"

  return (
    <motion.button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-background/30 backdrop-blur-md border border-border/50 overflow-hidden group hover:border-cyan-500/50 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        {/* Dynamic Background Glow */}
        <motion.div 
            className={`absolute inset-0 opacity-20 blur-xl transition-colors duration-500 ${isDark ? "bg-violet-600" : "bg-amber-400"}`}
        />

        {/* Tech Corners (Holographic feel) */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500/0 group-hover:border-cyan-500/50 transition-all duration-300" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500/0 group-hover:border-cyan-500/50 transition-all duration-300" />

        {/* Icon Swap Animation */}
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={isDark ? "dark" : "light"}
                initial={{ y: -20, opacity: 0, rotate: -45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 45 }}
                transition={{ duration: 0.3, ease: "backOut" }}
                className="relative z-10"
            >
                {isDark ? (
                    <div className="relative">
                        <Moon size={20} className="text-violet-400 fill-violet-400/20" />
                        <motion.div 
                            className="absolute -top-1 -right-1"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                           <Star size={8} className="text-cyan-400 fill-cyan-400" />
                        </motion.div>
                    </div>
                ) : (
                    <div className="relative">
                        <Sun size={20} className="text-amber-500 fill-amber-500/20" />
                         {/* Cloud accent for day */}
                         <motion.div 
                            className="absolute -bottom-1 -left-1 opacity-50"
                            animate={{ x: [0, 2, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Cloud size={8} className="text-sky-400 fill-sky-400" />
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>

        {/* Scan line effect (Very subtle) */}
        <motion.div
             className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none"
             animate={{ top: ["-100%", "100%"] }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
        />
    </motion.button>
  )
}
