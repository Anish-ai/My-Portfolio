"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useColor } from "@/context/color-context"
import { THEME_COLORS } from "@/lib/constants"

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function GlobalSpotlight() {
  const rawX = useMotionValue(-1000)
  const rawY = useMotionValue(-1000)
  const [visible, setVisible] = useState(false)
  const { colorTheme } = useColor()
  const themeColors = THEME_COLORS[colorTheme] || THEME_COLORS.cyber

  const x = useSpring(rawX, { stiffness: 150, damping: 25 })
  const y = useSpring(rawY, { stiffness: 150, damping: 25 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      if (!visible) setVisible(true)
    }
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", onEnter)
    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mouseenter", onEnter)
    }
  }, [rawX, rawY, visible])

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        width: 800,
        height: 800,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${hexToRgba(themeColors.primary, 0.12)} 0%, ${hexToRgba(themeColors.primary, 0.04)} 35%, transparent 70%)`,
        opacity: visible ? 1 : 0,
        zIndex: 2,
      }}
    />
  )
}
