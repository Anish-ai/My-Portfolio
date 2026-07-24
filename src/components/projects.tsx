"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Image from "next/image"
import { projects } from "@/data/projects"
import { Github, ExternalLink, Smartphone } from "lucide-react"
import type { ProjectType } from "@/types"

// ─── TYPING HOOK ─────────────────────────────────────────
function useTypewriter(text: string, speed = 30, startTyping = false) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!startTyping) { setDisplayed(""); setDone(false); return }
    setDisplayed(""); setDone(false)
    let i = 0
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++ }
      else { setDone(true); clearInterval(iv) }
    }, speed)
    return () => clearInterval(iv)
  }, [text, speed, startTyping])

  return { displayed, done }
}

// ─── PROGRESS BAR COMPONENT ─────────────────────────────
function BootProgressBar({ start, onDone }: { start: boolean; onDone: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!start) return
    setProgress(0)
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 15 + 5
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(onDone, 200) }
      setProgress(Math.min(100, Math.floor(p)))
    }, 120)
    return () => clearInterval(iv)
  }, [start, onDone])

  const filled = Math.floor(progress / 4)
  const bar = "█".repeat(filled) + "░".repeat(25 - filled)

  return (
    <div className="text-xs font-mono">
      <span className="text-primary/60">[{bar}]</span>
      <span className="text-primary ml-2">{progress}%</span>
    </div>
  )
}

// ─── FILE ENTRY ──────────────────────────────────────────
function FileEntry({ project, index, isSelected, onSelect, animDelay }: {
  project: ProjectType; index: number; isSelected: boolean
  onSelect: () => void; animDelay: number
}) {
  const slug = project.title.toLowerCase().replace(/\s+/g, "-")
  const dates = ["Mar 2026", "Jan 2026", "Dec 2025", "Nov 2025", "Oct 2025", "Sep 2025"]
  const sizes = ["4.2K", "8.1K", "3.7K", "5.6K", "6.9K", "4.8K"]

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: animDelay, duration: 0.12 }}
      onClick={onSelect}
      className={`flex items-center gap-1 px-2 py-[3px] cursor-pointer rounded-sm transition-colors font-mono text-[13px] ${
        isSelected ? "bg-primary/20 text-primary" : "text-green-400 hover:bg-primary/10 hover:text-primary"
      }`}
    >
      <span className="text-muted-foreground/40 w-[90px] shrink-0 text-[11px] hidden sm:inline">drwxr-xr-x</span>
      <span className="text-cyan-400 w-[44px] shrink-0 text-[11px] hidden sm:inline">anish</span>
      <span className="text-amber-400/60 w-[38px] shrink-0 text-[11px] hidden sm:inline">{sizes[index] || "4K"}</span>
      <span className="text-muted-foreground/50 w-[68px] shrink-0 text-[11px]">{dates[index] || "2025"}</span>
      <span className="font-bold">{slug}/</span>
      {project.status && (
        <span className="ml-2 text-[8px] text-amber-500 border border-amber-500/30 px-1 rounded-sm uppercase tracking-wider">{project.status}</span>
      )}
    </motion.div>
  )
}

// ─── README REVEAL ───────────────────────────────────────
function ReadmeReveal({ project }: { project: ProjectType }) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(t)
  }, [])

  if (!showContent) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-2 text-sm font-mono">
      <div className="text-primary/30 text-xs">{"───────────────────────────────────────────"}</div>
      <div className="text-primary font-bold text-base flex items-center gap-2">
        <span className="text-primary/40">#</span> {project.title}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground/50">STATUS:</span>
          {project.status ? (
            <span className="text-amber-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />{project.status.toUpperCase()}</span>
          ) : (
            <span className="text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full" />DEPLOYED</span>
          )}
        </div>
      </div>
      <div className="flex items-start gap-1.5 text-xs">
        <span className="text-muted-foreground/50 shrink-0">STACK:</span>
        <span className="text-cyan-300">{project.skills.join(" · ")}</span>
      </div>
      <div className="text-muted-foreground/60 leading-relaxed border-l-2 border-primary/20 pl-3 text-xs">{project.description}</div>
      <div className="flex items-center gap-4 pt-1">
        {project.links.live && <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">[↗ LIVE]</a>}
        {project.links.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">[↗ GITHUB]</a>}
        {project.links.playstore && <a href={project.links.playstore} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">[↗ PLAY STORE]</a>}
      </div>
    </motion.div>
  )
}

// ─── COMMAND HISTORY ENTRY ───────────────────────────────
function CatCommandEntry({ project, isTyping }: { project: ProjectType; isTyping: boolean }) {
  const slug = project.title.toLowerCase().replace(/\s+/g, "-")
  const cmd = `cat ${slug}/README.md`
  const typed = useTypewriter(cmd, 22, true)

  return (
    <div className="border-t border-white/5 pt-3 mt-3">
      <div className="text-white/90 text-sm font-mono">
        <span className="text-green-400">anish</span>
        <span className="text-muted-foreground/50">@</span>
        <span className="text-cyan-400">portfolio</span>
        <span className="text-muted-foreground/50">:</span>
        <span className="text-blue-400">~/projects</span>
        <span className="text-white/90"> $ </span>
        <span>{typed.displayed}</span>
        {!typed.done && <span className="animate-pulse text-primary">▋</span>}
      </div>
      {typed.done && <ReadmeReveal project={project} />}
    </div>
  )
}

// ─── ASCII BANNER ────────────────────────────────────────
const ASCII_BANNER = `
 ╔══════════════════════════════════════╗
 ║   █▀█ █▀█ █▀█ ░░█ █▀▀ █▀▀ ▀█▀ █▀  ║
 ║   █▀▀ █▀▄ █▄█ █▄█ ██▄ █▄▄ ░█░ ▄█  ║
 ║   ─────────────────────────────────  ║
 ║   v2.0  //  6 MODULES REGISTERED    ║
 ╚══════════════════════════════════════╝`

// ─── PROMPT LINE ─────────────────────────────────────────
function PromptLine({ showCursor = true }: { showCursor?: boolean }) {
  return (
    <span className="text-sm font-mono">
      <span className="text-green-400">anish</span>
      <span className="text-muted-foreground/50">@</span>
      <span className="text-cyan-400">portfolio</span>
      <span className="text-muted-foreground/50">:</span>
      <span className="text-blue-400">~/projects</span>
      <span className="text-white/90"> $ </span>
      {showCursor && <span className="animate-pulse text-primary">▋</span>}
    </span>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const [phase, setPhase] = useState(0)
  // 0=idle 1=ascii 2=progress 3=lsTyping 4=listing 5=ready
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  // Boot phases
  const [progressDone, setProgressDone] = useState(false)
  const lsCmd = useTypewriter("ls -la --color=auto", 25, phase >= 3)

  useEffect(() => { if (isInView && phase === 0) setPhase(1) }, [isInView, phase])

  // ASCII shown → start progress
  useEffect(() => {
    if (phase === 1) { const t = setTimeout(() => setPhase(2), 600); return () => clearTimeout(t) }
  }, [phase])

  // Progress done → ls command
  useEffect(() => {
    if (progressDone && phase === 2) setPhase(3)
  }, [progressDone, phase])

  // ls done → show listing
  useEffect(() => {
    if (lsCmd.done && phase === 3) { const t = setTimeout(() => setPhase(4), 150); return () => clearTimeout(t) }
  }, [lsCmd.done, phase])

  // Listing appeared → ready
  useEffect(() => {
    if (phase === 4) { const t = setTimeout(() => setPhase(5), projects.length * 80 + 200); return () => clearTimeout(t) }
  }, [phase])

  const handleSelect = useCallback((index: number) => {
    setSelectedProject(index)
  }, [])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" })
    }
  })

  const selectedData = selectedProject !== null ? projects[selectedProject] : null

  return (
    <section ref={sectionRef} id="projects" className="relative py-20 w-full flex flex-col items-center">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-[length:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-transparent z-0" />

      {/* Header */}
      <div className="relative z-10 text-center mb-12 px-4">
        <motion.h2 initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-muted-foreground font-mono tracking-tighter">
          PROJECT_FILES
        </motion.h2>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-[1px] w-12 bg-primary/50" />
          <p className="text-secondary-foreground dark:text-primary font-mono text-xs tracking-[0.3em]">SYSTEM DIRECTORY</p>
          <div className="h-[1px] w-12 bg-primary/50" />
        </div>
      </div>

      {/* Terminal + Preview */}
      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-0 rounded-xl overflow-hidden border border-border/50 shadow-[0_0_60px_hsl(var(--primary)/0.08)]">

          {/* ═══ TERMINAL ═══ */}
          <div className="lg:w-[58%] flex flex-col bg-[#0a0a0f] min-h-[450px] lg:min-h-[540px] relative">
            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-30 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />
            {/* CRT Vignette */}
            <div className="absolute inset-0 pointer-events-none z-30 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.4)_100%)]" />

            {/* Title Bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a2e] border-b border-white/5 z-40 relative">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors" />
              </div>
              <span className="ml-3 text-[11px] font-mono text-white/40">bash — anish@portfolio:~/projects — 80×24</span>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-[9px] font-mono text-green-400/50 flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-400 rounded-full" />CONNECTED
                </span>
              </div>
            </div>

            {/* Terminal Content */}
            <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto font-mono text-sm leading-relaxed scrollbar-hide relative z-10">

              {/* ASCII Banner */}
              {phase >= 1 && (
                <motion.pre
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-primary/70 text-[10px] leading-tight mb-2 select-none"
                >
                  {ASCII_BANNER}
                </motion.pre>
              )}

              {/* Progress Bar */}
              {phase >= 2 && (
                <div className="mb-2">
                  <div className="text-yellow-500/70 text-xs mb-1">Loading modules...</div>
                  <BootProgressBar start={phase >= 2} onDone={() => setProgressDone(true)} />
                  {progressDone && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400/80 text-xs mt-1">
                      ✓ {projects.length} project modules initialized
                    </motion.div>
                  )}
                </div>
              )}

              {/* LS Command */}
              {phase >= 3 && (
                <div className="text-white/90 mt-3 mb-2 text-sm">
                  <PromptLine showCursor={false} />
                  <span>{lsCmd.displayed}</span>
                  {!lsCmd.done && <span className="animate-pulse text-primary">▋</span>}
                </div>
              )}

              {/* Directory Listing */}
              {phase >= 4 && (
                <div className="mb-1">
                  <div className="text-muted-foreground/30 text-[11px] mb-1">total {projects.length} · sorted by date (newest first)</div>
                  {projects.map((project, i) => (
                    <FileEntry key={project.id} project={project} index={i}
                      isSelected={selectedProject === i} onSelect={() => handleSelect(i)}
                      animDelay={i * 0.07} />
                  ))}
                </div>
              )}

              {/* Command History — cat commands with typing */}
              {selectedProject !== null && (
                <CatCommandEntry
                  key={selectedProject}
                  project={projects[selectedProject]}
                  isTyping
                />
              )}

              {/* Idle Prompt */}
              {phase >= 5 && selectedProject === null && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                  <PromptLine />
                  <div className="text-muted-foreground/20 text-[10px] mt-1 ml-1">↑ click a project entry above</div>
                </motion.div>
              )}
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#1a1a2e] border-t border-white/5 text-[10px] font-mono text-white/30 z-40 relative">
              <span>UTF-8 | BASH 5.2</span>
              <span>{selectedProject !== null ? "1 active cmd" : "0 cmds"} · {projects.length} entries</span>
              <span>{selectedProject !== null ? `📂 ${projects[selectedProject].title.toLowerCase().replace(/\s+/g, "-")}/` : "~/projects/"}</span>
            </div>
          </div>

          {/* ═══ PREVIEW PANEL ═══ */}
          <div className="lg:w-[42%] bg-card/50 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-border/30 flex flex-col">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/30 bg-card/30">
              <div className={`w-2 h-2 rounded-full ${selectedData ? "bg-green-400 animate-pulse" : "bg-primary/30"}`} />
              <span className="text-[11px] font-mono text-primary/60 tracking-widest uppercase">
                {selectedData ? "File Preview" : "Awaiting Selection"}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {selectedData ? (
                <motion.div key={selectedData.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="flex-1 flex flex-col overflow-hidden">
                  {/* Screenshot */}
                  <div className="relative h-48 lg:h-56 overflow-hidden">
                    <Image src={selectedData.thumbnail || "/placeholder.svg"} alt={selectedData.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    <motion.div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent pointer-events-none"
                      animate={{ top: ["-100%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                  </div>
                  {/* Details */}
                  <div className="flex-1 p-5 space-y-4 overflow-y-auto scrollbar-hide">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {selectedData.status ? (
                          <span className="flex items-center gap-1 text-[9px] font-mono text-amber-400 border border-amber-400/30 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                            <span className="w-1 h-1 bg-amber-400 rounded-full animate-pulse" />{selectedData.status}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[9px] font-mono text-green-400 border border-green-400/30 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                            <span className="w-1 h-1 bg-green-400 rounded-full" />Deployed
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-primary/50 border border-primary/20 px-1.5 py-0.5 rounded-sm">
                          PRJ-{selectedData.id.toString().padStart(3, "0")}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground tracking-tight">{selectedData.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedData.skills.map((skill) => (
                        <span key={skill} className="px-2 py-0.5 text-[10px] font-mono bg-primary/10 border border-primary/20 text-primary rounded-sm">{skill}</span>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      {selectedData.links.live && (
                        <a href={selectedData.links.live} target="_blank" rel="noopener noreferrer"
                          className="group flex items-center justify-between p-3 bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary/60 rounded-md transition-all">
                          <span className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider">
                            <ExternalLink className="w-3.5 h-3.5" />Launch Demo
                          </span>
                          <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]" />
                        </a>
                      )}
                      <div className="flex gap-2">
                        {selectedData.links.github && (
                          <a href={selectedData.links.github} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-secondary/50 border border-border/50 hover:border-foreground/30 rounded-md transition-all text-[10px] font-mono text-muted-foreground hover:text-foreground uppercase tracking-wider">
                            <Github className="w-3.5 h-3.5" />Source
                          </a>
                        )}
                        {selectedData.links.playstore && (
                          <a href={selectedData.links.playstore} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-green-500/10 border border-green-500/20 hover:border-green-500/50 rounded-md transition-all text-[10px] font-mono text-green-600 dark:text-green-400 uppercase tracking-wider">
                            <Smartphone className="w-3.5 h-3.5" />Play Store
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full border border-dashed border-primary/20 flex items-center justify-center mb-4">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
                      className="text-2xl font-mono text-primary/40">{">_"}</motion.span>
                  </div>
                  <p className="text-sm font-mono text-muted-foreground/50 mb-1">No file selected</p>
                  <p className="text-xs font-mono text-primary/30">Click a project in the terminal</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="relative z-10 mt-6 text-[10px] font-mono text-primary/40 tracking-widest uppercase">
        {"// CLICK ENTRIES IN TERMINAL TO INSPECT FILES"}
      </motion.p>
    </section>
  )
}