"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Github, ExternalLink, Smartphone, X } from "lucide-react";
import { projects } from "@/data/projects";

import ProjectTunnel from "./project-tunnel";


export default function Projects() {
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);
  
  // Get active project data
  const activeProject = activeProjectIndex !== null ? projects[activeProjectIndex] : null;

  const handleCloseModal = () => setActiveProjectIndex(null);

  return (
    <section id="projects" className="relative min-h-screen bg-black">
      {/* 3D Tunnel Container */}
      <div className="relative z-10">
         <ProjectTunnel onSelect={setActiveProjectIndex} />
      </div>

      {/* Header Overlay (Floating top left) */}
      <div className="absolute top-10 left-4 md:left-10 z-20 pointer-events-none">
         <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
         >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">
              PROJECTS <span className="text-cyan-500">.LOG</span>
            </h2>
            <p className="text-cyan-500/60 font-mono text-sm max-w-md">
               {"// SCROLL TO NAVIGATE HYPERSPACE"}
               <br/>
               {"// CLICK DATA CARD TO ACCESS FILES"}
            </p>
         </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 bg-black/90 backdrop-blur-md"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateX: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] flex flex-col md:flex-row bg-gray-900 border border-gray-800 overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.15)] group"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)" // Tech cut corner
              }}
              onClick={(e) => e.stopPropagation()}
            >
               {/* Holographic Border Overlay */}
               <div className="absolute inset-0 border border-cyan-500/20 pointer-events-none z-20" />
               <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-xl pointer-events-none z-20" />
               <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-xl pointer-events-none z-20" />
               
               {/* Close Button - Tech Style */}
               <button 
                  onClick={handleCloseModal}
                  className="absolute top-6 right-6 z-50 group/close"
               >
                  <div className="relative p-2 bg-black/50 border border-red-500/30 hover:border-red-500 text-red-500/70 hover:text-red-500 transition-all rounded-sm uppercase text-[10px] font-mono tracking-widest flex items-center gap-2">
                     <span className="hidden md:block group-hover/close:opacity-100 opacity-60">Terminate</span>
                     <X size={16} />
                  </div>
               </button>

               {/* Left: Visuals & Scanner */}
               <div className="md:w-3/5 relative h-[40vh] md:h-auto bg-black overflow-hidden border-r border-gray-800">
                  <Image 
                      src={activeProject.thumbnail || "/placeholder.svg"} 
                      alt={activeProject.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  {/* Grid Overlay */}
                  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />
                  
                  {/* Scanning Animation */}
                  <motion.div 
                     className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent z-10"
                     animate={{ top: ["-100%", "100%"] }}
                     transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Status Badge */}
                   <div className="absolute bottom-6 left-6 z-20">
                      <div className="flex items-center gap-3 mb-2">
                         {activeProject.status && (
                            <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[10px] font-mono tracking-wider uppercase flex items-center gap-2">
                               <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                               STATUS: {activeProject.status}
                            </div>
                         )}
                         <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-[10px] font-mono tracking-wider uppercase">
                            ID: PRJ-{activeProjectIndex !== null ? activeProjectIndex.toString().padStart(3, '0') : '000'}
                         </div>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase glitch-text">
                        {activeProject.title}
                      </h3>
                   </div>
               </div>

               {/* Right: Data & Controls */}
               <div className="md:w-2/5 p-6 md:p-10 bg-gray-900/50 backdrop-blur-sm flex flex-col h-full overflow-hidden">
                  
                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto pr-2 space-y-8 scrollbar-hide">
                      {/* Tech Stack */}
                      <div>
                         <h4 className="flex items-center gap-2 text-cyan-500/60 text-[10px] font-mono uppercase tracking-widest mb-4">
                            <span className="w-2 h-2 bg-cyan-500/40" />
                            System Modules
                         </h4>
                         <div className="flex flex-wrap gap-2">
                           {activeProject.skills.map((skill) => (
                              <div key={skill} className="group/tag relative px-3 py-1.5 bg-gray-800 border border-gray-700 hover:border-cyan-500/50 transition-colors">
                                 <div className="absolute inset-0 bg-cyan-500/5 scale-x-0 group-hover/tag:scale-x-100 transition-transform origin-left" />
                                 <span className="relative text-xs text-gray-300 font-mono group-hover/tag:text-cyan-300">
                                    {skill}
                                 </span>
                              </div>
                           ))}
                         </div>
                      </div>

                      {/* Description */}
                      <div>
                         <h4 className="flex items-center gap-2 text-cyan-500/60 text-[10px] font-mono uppercase tracking-widest mb-4">
                            <span className="w-2 h-2 bg-cyan-500/40" />
                            Mission Brief
                         </h4>
                         <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light border-l-2 border-gray-800 pl-4">
                            {activeProject.description}
                         </p>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 mt-auto">
                         <div className="grid gap-3">
                            {activeProject.links.live && (
                               <a href={activeProject.links.live} target="_blank" rel="noreferrer" 
                                  className="relative group p-4 bg-cyan-900/20 border border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-500/80 transition-all flex items-center justify-between overflow-hidden"
                               >
                                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                                  <span className="relative flex items-center gap-3 text-cyan-400 font-mono text-sm tracking-wider uppercase">
                                     <ExternalLink size={16} />
                                     Initialize Demo
                                  </span>
                                  <div className="relative w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_cyan]" />
                               </a>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                               {activeProject.links.github && (
                                  <a href={activeProject.links.github} target="_blank" rel="noreferrer" 
                                     className="flex items-center justify-center gap-2 p-3 bg-gray-800 border border-gray-700 hover:border-gray-500 hover:bg-gray-700 transition-all text-xs text-gray-300 font-mono uppercase tracking-wide"
                                  >
                                     <Github size={14} />
                                     Source Code
                                  </a>
                               )}
                               {activeProject.links.playstore && (
                                  <a href={activeProject.links.playstore} target="_blank" rel="noreferrer" 
                                     className="flex items-center justify-center gap-2 p-3 bg-green-900/10 border border-green-900/30 hover:border-green-500/50 transition-all text-xs text-green-400 font-mono uppercase tracking-wide"
                                  >
                                     <Smartphone size={14} />
                                     Play Store
                                  </a>
                               )}
                            </div>
                         </div>
                      </div>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}