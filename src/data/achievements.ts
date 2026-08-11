export type AchievementType = {
  id: number
  title: string
  metric: string
  metricLabel: string
  category: "cp" | "hackathon" | "program"
  description: string
  link?: string
  linkLabel?: string
  certificateLink?: string
}

export const achievements: AchievementType[] = [
  {
    id: 1,
    title: "Candidate Master on Codeforces",
    metric: "1963",
    metricLabel: "Rating",
    category: "cp",
    description: "Candidate Master rank on Codeforces competitive programming platform.",
    link: "https://codeforces.com/profile/cheese_maggi",
    linkLabel: "Profile",
  },
  {
    id: 2,
    title: "Meta Hacker Cup 2025",
    metric: "#186",
    metricLabel: "Global Rank",
    category: "cp",
    description: "Ranked 186th globally, progressed to Round 3.",
    certificateLink: "https://drive.google.com/file/d/14OZcPHRjqvtgOpI7pboTJxbBovcPLYi3/view?usp=sharing",
  },
  {
    id: 3,
    title: "4 Star on CodeChef",
    metric: "1839",
    metricLabel: "Rating",
    category: "cp",
    description: "4-Star rated competitive programmer on CodeChef.",
    link: "https://www.codechef.com/users/choco_bar",
    linkLabel: "Profile",
  },
  {
    id: 4,
    title: "Google Big Code Challenge 2026",
    metric: "R2",
    metricLabel: "Round",
    category: "cp",
    description: "Reached Round 2 in The Big Code Challenge by Google.",
  },
  {
    id: 5,
    title: "Summer of Bitcoin 2025",
    metric: "SoB",
    metricLabel: "Selected",
    category: "program",
    description: "Selected for Summer of Bitcoin 2025; contributed to ZeusLN Wallet.",
  },
  {
    id: 6,
    title: "NK Securities Research Hackathon",
    metric: "#6",
    metricLabel: "Rank / 6000+",
    category: "hackathon",
    description: "Volatility Curve Prediction (Financial Time-Series). Secured 6th rank among 6,000+ submissions in a highly competitive quantitative finance and algorithmic problem-solving hackathon.",
    certificateLink: "https://drive.google.com/file/d/1Ow9GYPtyau1mIbVy9Oe04C-RBqGo7q0d/view?usp=sharing",
  },
  {
    id: 7,
    title: "Flipkart Grid 8.0",
    metric: "Semi",
    metricLabel: "Finalist",
    category: "hackathon",
    description: "Semifinalist in Flipkart Grid 8.0 hackathon in 2026.",
  },
  {
    id: 8,
    title: "Amazon ML Summer School 2026",
    metric: "Selected",
    metricLabel: "Program",
    category: "program",
    description: "Selected for the prestigious Amazon ML Summer School 2026.",
  },
]
