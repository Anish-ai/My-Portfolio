import { Github, Linkedin, Instagram, Mail} from "lucide-react"
import type { SocialLinkType } from "@/types"

export const socialLinks: SocialLinkType[] = [
  {
    name: "GitHub",
    url: "https://github.com/Anish-ai",
    icon: Github,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/anish-kumar-71779326a/",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/light.anish",
    icon: Instagram,
  },
  {
    name: "Email",
    url: "mailto:aniskum59431@gmail.com",
    icon: Mail,
  }
]

