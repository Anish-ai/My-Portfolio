"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useColor } from "@/context/color-context"
import { cn } from "@/lib/utils"

const themes = [
  { name: "cyber", color: "bg-cyan-500", label: "Cyber" },
  { name: "crimson", color: "bg-red-500", label: "Crimson" },
  { name: "emerald", color: "bg-emerald-500", label: "Emerald" },
  { name: "amber", color: "bg-amber-500", label: "Amber" },
  { name: "royal", color: "bg-blue-600", label: "Royal" },
] as const

export default function ThemePalette() {
  const { colorTheme, setColorTheme } = useColor()

  return (
    <div className="flex items-center gap-2 p-1 bg-background/50 backdrop-blur-sm border border-border/50 rounded-full">
      {themes.map((theme) => {
        const isActive = colorTheme === theme.name
        
        return (
          <button
            key={theme.name}
            onClick={() => setColorTheme(theme.name)}
            className="relative group flex items-center justify-center w-6 h-6 rounded-full transition-all focus:outline-none"
            aria-label={`Switch to ${theme.label} theme`}
          >
            {/* Active Indicator Ring */}
            {isActive && (
              <motion.div
                layoutId="active-theme-ring"
                className="absolute inset-[-4px] border border-primary/50 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            {/* Color Swatch */}
            <motion.div
                className={cn(
                    "w-3 h-3 rounded-full cursor-pointer shadow-sm relative z-10",
                    theme.color
                )}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                    scale: isActive ? 1.2 : 1
                }}
            />
            
            {/* Tooltip on Hover */}
            <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-card border border-border px-2 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap z-20">
                {theme.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
