"use client"

import { motion } from "framer-motion"
import { achievements } from "@/data/achievements"
import { ExternalLink, Award, Trophy, Code2, Bitcoin } from "lucide-react"

const categoryConfig: Record<string, { accent: string; icon: typeof Trophy; label: string }> = {
  cp: { accent: "text-cyan-400 border-cyan-400/40 bg-cyan-400/10", icon: Code2, label: "COMPETITIVE PROGRAMMING" },
  hackathon: { accent: "text-amber-400 border-amber-400/40 bg-amber-400/10", icon: Trophy, label: "HACKATHON" },
  program: { accent: "text-violet-400 border-violet-400/40 bg-violet-400/10", icon: Bitcoin, label: "OPEN SOURCE" },
}

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="relative py-20 w-full flex flex-col items-center"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-[length:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-transparent z-0" />

      {/* Header */}
      <div className="relative z-10 text-center mb-12 px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-muted-foreground font-mono tracking-tighter"
        >
          ACHIEVEMENT_REGISTRY
        </motion.h2>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-[1px] w-12 bg-primary/50" />
          <p className="text-secondary-foreground dark:text-primary font-mono text-xs tracking-[0.3em]">COMPETITIVE ACCOLADES</p>
          <div className="h-[1px] w-12 bg-primary/50" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="relative z-10 container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((item, index) => {
            const config = categoryConfig[item.category]
            const Icon = config.icon

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ scale: 1.015 }}
                className="group relative bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/40 rounded-lg overflow-hidden transition-all duration-300"
              >
                {/* Left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${config.accent.split(' ')[1]} transition-all group-hover:w-[4px]`} />

                {/* Corner accents */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/30 rounded-tr-lg" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/30 rounded-br-lg" />

                <div className="flex items-start gap-4 p-5 pl-6">
                  {/* Metric Block */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-lg border ${config.accent} flex items-center justify-center`}>
                      <span className="text-[10px] md:text-lg font-black font-mono leading-tight text-center px-2 py-0.5 break-words whitespace-normal">
                        {item.metric}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-muted-foreground mt-1.5 tracking-widest uppercase text-center leading-tight">
                      {item.metricLabel}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-sm border ${config.accent}`}>
                        <Icon className="w-2.5 h-2.5" />
                        <span className="text-[8px] font-mono tracking-widest uppercase">{config.label}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-foreground tracking-tight mb-1 group-hover:text-primary transition-colors leading-tight">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-zinc-600 dark:text-muted-foreground/70 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Links */}
                    {(item.link || item.certificateLink) && (
                      <div className="flex items-center gap-3 mt-3">
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] font-mono text-primary hover:text-primary/80 transition-colors tracking-wider uppercase"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {item.linkLabel || "View"}
                          </a>
                        )}
                        {item.certificateLink && (
                          <a
                            href={item.certificateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] font-mono text-primary hover:text-primary/80 transition-colors tracking-wider uppercase"
                          >
                            <Award className="w-3 h-3" />
                            Certificate
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:via-primary/50 transition-all" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
