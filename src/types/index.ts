import type { LucideIcon } from "lucide-react"

export type ProjectType = {
  id: number
  title: string
  skills: string[]
  links: {
    live?: string
    github?: string
    playstore?: string
    appstore?: string
  }
  description: string
  thumbnail: string
  status?: string
}

export type SkillType = {
  name: string
  icon: string
  proficiency: "Beginner" | "Intermediate" | "Advanced"
  percentage: number
  description?: string
}

export type SocialLinkType = {
  name: string
  url: string
  icon: LucideIcon
}

export type ExperienceType = {
  id: number
  company: string
  role: string
  location: string
  period: string
  current?: boolean
  highlights: string[]
}

