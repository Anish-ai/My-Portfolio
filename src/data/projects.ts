import type { ProjectType } from "@/types";

export const projects: ProjectType[] = [
  {
    id: 1,
    title: "Facility Routing Engine",
    skills: ["Next.js", "React 19", "TypeScript", "Zustand", "Canvas API", "A*/Dijkstra", "Vercel"],
    links: {
      github: "https://github.com/Anish-ai/facility-routing-engine",
      live: "https://evacu-aid-routing-engine.vercel.app/"
    },
    description:
      "An indoor navigation system modeled as a weighted graph, implementing A* and Dijkstra algorithms for optimal pathfinding. Features emergency-aware routing for fire, medical, security, smoke, and hazmat scenarios with dynamic rerouting around hazardous zones. Includes constraint-based routing rules such as fire-safe routing, emergency-zone avoidance, and stair preference over lifts during fire scenarios.",
    thumbnail: "/stack/facility-routing.png",
  },
  {
    id: 2,
    title: "OneIITP",
    skills: ["React Native", "Firebase", "Microsoft Azure", "Expo", "Vercel"],
    links: {
      live: "https://oneattend.vercel.app/",
      playstore: "https://play.google.com/store/apps/details?id=com.oneiitp.app",
      appstore: "https://apps.apple.com/in/app/oneiitp/id6742688561"
    },
    description:
      "Official IIT Patna app with 2,000+ active users, streamlining campus activities. Features include QR-based anti-proxy attendance, Azure authentication, Google Sheets API for real-time bus schedules, class timetable, marketplace, events, and emergency contacts. Impact: 15K+ Firebase reads, 1,500+ downloads, and widespread adoption.",
    thumbnail: "/stack/oneiitp.png",
  },
  {
    id: 3,
    title: "Mock Interview AI",
    skills: ["Next.js", "Tailwind CSS", "TypeScript", "Gemini API", "Murf AI", "WebRTC", "face-api.js"],
    links: {
      github: "https://github.com/Anish-ai/AI-Interviewer",
      live: "https://mockinterviewai.vercel.app/"
    },
    description:
      "Mock Interview AI is an advanced browser-based platform that simulates realistic interviews using voice-based interaction, facial expression tracking, and dynamic and detailed feedback to help students improve communication skills and confidence.",
    thumbnail: "/stack/mockinterview.png",
  },
  {
    id: 4,
    title: "WinRegi",
    skills: ["Python", "PyQt", "SQLite", "Windows API", "Registry", "NLP", "Machine Learning"],
    links: {
      github: "https://github.com/Anish-ai/WinRegi/",
    },
    description:
      "AI-powered Windows control center that applies settings and registry tweaks via natural language queries. Features Windows API integration, secure registry modifications, PowerShell automation, and SQLite-based persistent user preferences. Impact: Enhanced Windows settings navigation, improving accessibility and productivity.",
    thumbnail: "/stack/winregi.png",
  },
  {
    id: 5,
    title: "CollabNest",
    skills: ["Next.js", "TypeScript", "Prisma", "Firebase", "Node.js", "PostgreSQL", "WebSockets", "Tailwind CSS"],
    links: {
      github: "https://github.com/username/collabnest",
    },
    description:
      "A platform for IIT Patna students to share ideas and form teams. Features skill-based project matching, real-time messaging via WebSockets, Firebase OAuth authentication with role-based access, and an admin dashboard for project moderation.",
    thumbnail: "/stack/collabnest.png",
    status: "In Progress"
  },
  {
    id: 6,
    title: "VaultX",
    skills: ["Next.js", "Node.js", "Express.js", "PostgreSQL", "Prisma", "Tailwind CSS", "JWT", "Nodemailer"],
    links: {
      live: "https://cyber-insec-casseopeia.vercel.app/",
    },
    description:
      "A secure digital banking platform with MFA, asset transfers, investment management, and loan applications. Features JWT authentication, OTP verification, and real-time notifications. Built with Next.js, Express.js, and PostgreSQL for scalability and security.",
    thumbnail: "/stack/vaultx.png",
  }
];