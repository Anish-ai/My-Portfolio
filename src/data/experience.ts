import type { ExperienceType } from "@/types"

export const experiences: ExperienceType[] = [
  {
    id: 1,
    company: "Optum Global Solutions (UHG)",
    role: "Software Engineering Intern",
    location: "Bengaluru, India",
    period: "June 2026 – Present",
    current: true,
    highlights: [
      "Building the Production Update Database Tool using Java, Python, and TypeScript on Azure and Kubernetes, scaling to support over 1,000 internal teams with automated SQL, PL/SQL, Oracle, and T-SQL query execution.",
      "Optimized system performance to efficiently parse 5,000+ complex queries in under 0.3 seconds, significantly accelerating internal database workflows.",
      "Engineered an offline data ingestion pipeline incorporating advanced drift and duplicate detection mechanisms, utilizing pgvector for embedding storage and MySQL for relational data.",
      "Architected an agentic Retrieval-Augmented Generation (RAG) and LLM pipeline mapping user queries through a SQL parser, feature extractor, and rules engine to surface actionable plain-language summaries and secure rollback scripts.",
    ],
  },
  {
    id: 2,
    company: "TLE Eliminators",
    role: "Post-Contest Discussion (PCD) Head",
    location: "Remote",
    period: "May 2026 – Present",
    current: true,
    highlights: [
      "Led post-contest discussions for a large competitive programming community, recording and publishing 15+ live video breakdowns of complex algorithmic problem solutions.",
      "Demonstrated strong technical communication and organizational skills by translating advanced problem-solving techniques and data structures into highly accessible educational content for diverse audiences.",
    ],
  },
]
