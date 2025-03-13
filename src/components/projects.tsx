"use client"

import { useEffect, useRef, useState, useCallback } from "react" // Added useCallback import
import { motion, useScroll, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Github, ExternalLink, ChevronDown, Lock, Unlock } from "lucide-react"
import { projects } from "@/data/projects"
import { Link as ScrollLink } from "react-scroll"

export default function Projects() {
  const [activeProject, setActiveProject] = useState(0)
  const [viewedProjects, setViewedProjects] = useState<Set<number>>(new Set([0]))
  const [allProjectsViewed, setAllProjectsViewed] = useState(false)
  const [scrollLocked, setScrollLocked] = useState(true)
  const [isScrolling, setIsScrolling] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const projectsContainerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: imagesRef,
    offset: ["start end", "end start"],
  })

  // Handle scroll within the projects section - converted to useCallback
  const handleProjectScroll = useCallback((direction: 'up' | 'down') => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    
    let nextProject = activeProject;
    if (direction === 'down') {
      nextProject = Math.min(activeProject + 1, projects.length - 1);
    } else {
      nextProject = Math.max(activeProject - 1, 0);
    }
    
    if (nextProject !== activeProject) {
      setActiveProject(nextProject);
      
      // Mark this project as viewed
      setViewedProjects((prev) => {
        const newSet = new Set(prev);
        newSet.add(nextProject);
        return newSet;
      });
      
      // Implement a debounce to prevent rapid scrolling
      setTimeout(() => {
        setIsScrolling(false);
      }, 800); // Adjust timing based on your animation duration
    } else {
      setIsScrolling(false);
    }
  }, [activeProject, isScrolling]);

  // Observe project scroll changes
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((value) => {
      // Only use this for initialization
      if (activeProject === 0 && value > 0) {
        // Mark this project as viewed
        setViewedProjects((prev) => {
          const newSet = new Set(prev);
          newSet.add(0);
          return newSet;
        });
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, activeProject]);

  // Check if all projects have been viewed
  useEffect(() => {
    if (viewedProjects.size === projects.length && !allProjectsViewed) {
      setAllProjectsViewed(true);
      setScrollLocked(false);
    }
  }, [viewedProjects, allProjectsViewed]);

  // Wheel event handler for project navigation
  useEffect(() => {
    if (!sectionRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      const isInView = rect && 
                      rect.top <= 100 && 
                      rect.bottom >= window.innerHeight / 2;
      
      if (isInView) {
        // If in projects section
        if (scrollLocked) {
          e.preventDefault();
          
          if (e.deltaY > 0) {
            // Scrolling down
            if (activeProject < projects.length - 1) {
              handleProjectScroll('down');
            } else if (allProjectsViewed) {
              // All projects viewed and at last project, allow scrolling to next section
              return;
            }
          } else if (e.deltaY < 0) {
            // Scrolling up
            handleProjectScroll('up');
          }
        } else if (rect && rect.top > 0 && e.deltaY < 0) {
          // When scrolling up from below and entering projects section
          e.preventDefault();
          setActiveProject(projects.length - 1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [scrollLocked, activeProject, allProjectsViewed, isScrolling, handleProjectScroll]);

  return (
    <section id="projects" className="py-20 relative overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950 -z-10"></div>

      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full filter blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full filter blur-[100px] -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          My{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
            Projects
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Scroll through my work and see how I bring ideas to life.</p>

        {/* Progress indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-md px-4 py-2 rounded-full">
            <span className="text-sm text-gray-400">
              {viewedProjects.size} of {projects.length} projects viewed
            </span>
            <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                initial={{ width: 0 }}
                animate={{ width: `${(viewedProjects.size / projects.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {scrollLocked ? (
              <Lock size={14} className="text-gray-400" />
            ) : (
              <Unlock size={14} className="text-green-400" />
            )}
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4" ref={containerRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative" ref={projectsContainerRef}>
          {/* Left column - Project images */}
          <div className="sticky top-24 h-[70vh] overflow-hidden hidden md:block">
            <div ref={imagesRef} className="relative h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject}
                  className="project-card h-full w-full relative rounded-xl overflow-hidden ring-2 ring-violet-500"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={projects[activeProject].thumbnail || "/placeholder.svg"}
                    alt={projects[activeProject].title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                  {/* Viewed indicator */}
                  {viewedProjects.has(activeProject) && (
                    <div className="absolute top-4 right-4 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full">
                      Viewed
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right column - Project details */}
          <div className="md:sticky top-24 h-[70vh] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900/50 backdrop-blur-md p-8 rounded-xl border border-gray-800 hover:border-violet-500/50 transition-colors group"
              >
                {/* Mobile image (visible only on mobile) */}
                <div className="relative h-48 w-full rounded-lg overflow-hidden mb-6 md:hidden">
                  <Image
                    src={projects[activeProject].thumbnail || "/placeholder.svg"}
                    alt={projects[activeProject].title}
                    fill
                    className="object-cover"
                  />

                  {/* Viewed indicator for mobile */}
                  {viewedProjects.has(activeProject) && (
                    <div className="absolute top-4 right-4 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full">
                      Viewed
                    </div>
                  )}
                </div>

                <motion.h3
                  className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {projects[activeProject].title}
                </motion.h3>

                <motion.p
                  className="text-gray-300 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {projects[activeProject].description}
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-3 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {projects[activeProject].skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 hover:bg-violet-900/50 hover:text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  {projects[activeProject].links.github && (
                    <motion.a
                      href={projects[activeProject].links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(138, 43, 226, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      data-cursor-text="GitHub"
                    >
                      <Github size={18} />
                      <span>GitHub</span>
                    </motion.a>
                  )}

                  {projects[activeProject].links.live && (
                    <motion.a
                      href={projects[activeProject].links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(236, 72, 153, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:from-violet-500 hover:to-fuchsia-500 transition-colors"
                      data-cursor-text="Live Demo"
                    >
                      <ExternalLink size={18} />
                      <span>Live Demo</span>
                    </motion.a>
                  )}
                </motion.div>

                {/* Project navigation indicators */}
                <div className="flex justify-center gap-2 mt-8">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isScrolling) {
                          setActiveProject(index);
                          setViewedProjects((prev) => {
                            const newSet = new Set(prev);
                            newSet.add(index);
                            return newSet;
                          });
                        }
                      }}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === activeProject
                          ? "bg-gradient-to-r from-violet-400 to-fuchsia-500 scale-125"
                          : viewedProjects.has(index)
                            ? "bg-green-500"
                            : "bg-gray-700"
                      }`}
                      aria-label={`View project ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Scroll guidance */}
                <motion.div 
                  className="mt-6 text-center text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {activeProject < projects.length - 1 ? (
                    <p>Scroll down to see next project</p>
                  ) : !allProjectsViewed ? (
                    <p>All projects viewed, continue scrolling</p>
                  ) : (
                    <p>Continue to next section</p>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Continue button - only shows when all projects are viewed */}
      <AnimatePresence>
        {allProjectsViewed && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ScrollLink to="skills" spy={true} smooth={true} offset={-70} duration={500}>
              <motion.button
                whileHover={{ scale: 1.05, y: -5, boxShadow: "0 0 20px rgba(138, 43, 226, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full font-medium group"
                data-cursor-text="Continue"
              >
                Continue to Skills
                <ChevronDown className="group-hover:animate-bounce" />
              </motion.button>
            </ScrollLink>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll lock indicator - only shows when scroll is locked */}
      <AnimatePresence>
        {scrollLocked && (
          <motion.div
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-full text-sm text-gray-300 flex items-center gap-2 z-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Lock size={14} className="text-violet-400" />
            Scroll through all projects to continue
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}