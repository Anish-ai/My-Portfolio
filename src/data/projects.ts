import type { ProjectType } from "@/types";

export const projects: ProjectType[] = [
  {
    id: 1,
    title: "OneIITP",
    skills: ["React Native", "Firebase", "Microsoft Azure", "Expo", "Vercel"],
    links: {
      live: "https://oneattend.vercel.app/",
      github: "https://github.com/username/oneiitp",
      playstore: "https://play.google.com/store/apps/details?id=com.oneiitp.app",
      appstore: "https://apps.apple.com/in/app/oneiitp/id6742688561"
    },
    description:
      "Official IIT Patna app with 2,000+ active users, streamlining campus activities. Features include QR-based anti-proxy attendance, Azure authentication, Google Sheets API for real-time bus schedules, class timetable, marketplace, events, and emergency contacts. Impact: 15K+ Firebase reads, 1,500+ downloads, and widespread adoption.",
    thumbnail: "/stack/oneiitp.png",
  },
  {
    id: 2,
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
    id: 3,
    title: "CollabNest",
    skills: ["Next.js", "TypeScript", "Prisma", "Firebase", "Node.js", "PostgreSQL", "WebSockets", "Tailwind CSS"],
    links: {
      live: "#",
      github: "https://github.com/username/collabnest",
    },
    description:
      "A platform for IIT Patna students to share ideas and form teams. Features skill-based project matching, real-time messaging via WebSockets, Firebase OAuth authentication with role-based access, and an admin dashboard for project moderation.",
    thumbnail: "/stack/collabnest.png",
    status: "In Progress"
  },
  {
    id: 4,
    title: "VaultX",
    skills: ["Next.js", "Node.js", "Express.js", "PostgreSQL", "Prisma", "Tailwind CSS", "JWT", "Nodemailer"],
    links: {
      live: "https://cyber-insec-casseopeia.vercel.app/",
    },
    description:
      "A secure digital banking platform with MFA, asset transfers, investment management, and loan applications. Features JWT authentication, OTP verification, and real-time notifications. Built with Next.js, Express.js, and PostgreSQL for scalability and security.",
    thumbnail: "/stack/vaultx.png",
  },
  {
    id: 5,
    title: "MessIITP",
    skills: ["React Native", "Expo", "JWT", "MySQL", "Node.js", "Chart.js", "Render", "phpMyAdmin"],
    links: {
      github: "https://github.com/username/messiitp",
      live: "#"
    },
    description:
      "Mess management app for IIT Patna with real-time meal updates, JWT-based role-based access, meal rating system with leaderboards (Chart.js), and local notifications for meal reminders. Enhances dining experience with user feedback and transparency.",
    thumbnail: "/stack/messiitp.png",
  }
];