"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Github, ExternalLink, ChevronDown, Lock, Unlock, AppWindow, Smartphone } from "lucide-react";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { Link as ScrollLink } from "react-scroll";

export default function Projects() {
  const [activeProject, setActiveProject] = useState(0);
  const [viewedProjects, setViewedProjects] = useState<Set<number>>(new Set([0]));
  const [allProjectsViewed, setAllProjectsViewed] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  // Add this alongside your other useState declarations
  const [imageLoaded, setImageLoaded] = useState(Array(projects.length).fill(false));

  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const projectsContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imagesRef,
    offset: ["start end", "end start"],
  });

  // Get skill icon by name
  const getSkillIcon = useCallback((skillName: string) => {
    const foundSkill = skills.find(skill => skill.name === skillName);
    return foundSkill?.icon || null;
  }, []);

  // Handle scroll within the projects section
  const handleProjectScroll = useCallback(
    (direction: "up" | "down") => {
      if (isScrolling) return;

      setIsScrolling(true);

      let nextProject = activeProject;
      if (direction === "down") {
        nextProject = Math.min(activeProject + 1, projects.length - 1);
      } else {
        nextProject = Math.max(activeProject - 1, 0);
      }

      if (nextProject !== activeProject) {
        setActiveProject(nextProject);

        // Mark this project as viewed
        setViewedProjects(prev => {
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
    },
    [activeProject, isScrolling]
  );

  // Observe project scroll changes
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      // Only use this for initialization
      if (activeProject === 0 && value > 0) {
        // Mark this project as viewed
        setViewedProjects(prev => {
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
      const isInView =
        rect && rect.top <= 100 && rect.bottom >= window.innerHeight / 2;

      if (isInView) {
        // If in projects section
        if (scrollLocked) {
          e.preventDefault();

          if (e.deltaY > 0) {
            // Scrolling down
            if (activeProject < projects.length - 1) {
              handleProjectScroll("down");
            } else if (allProjectsViewed) {
              // All projects viewed and at last project, allow scrolling to next section
              return;
            }
          } else if (e.deltaY < 0) {
            // Scrolling up
            handleProjectScroll("up");
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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="inline-block"
        >
          <span className="px-3 py-1 text-xs font-medium bg-violet-500/10 text-violet-300 rounded-full mb-3 inline-block">
            PORTFOLIO
          </span>
        </motion.div>

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
                  className="project-card h-full w-full relative rounded-xl overflow-hidden ring-1 ring-violet-500/50 shadow-lg shadow-violet-500/10"
                  initial={{ opacity: 0, x: 100, rotateY: 10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    rotateY: isHovering ? 5 : 0,
                    boxShadow: isHovering ? "0 20px 25px -5px rgba(139, 92, 246, 0.1), 0 10px 10px -5px rgba(139, 92, 246, 0.04)" : "0 10px 15px -3px rgba(139, 92, 246, 0.05), 0 4px 6px -2px rgba(139, 92, 246, 0.02)"
                  }}
                  exit={{ opacity: 0, x: -100, rotateY: -10 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.25, 1, 0.5, 1],
                    rotateY: {
                      duration: 0.3,
                      ease: "easeOut"
                    }
                  }}
                  onHoverStart={() => setIsHovering(true)}
                  onHoverEnd={() => setIsHovering(false)}
                >
                  <div className="relative h-full w-full">
                    {!imageLoaded[activeProject] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 z-10 overflow-hidden">
                        <div className="flex flex-col items-center gap-4">
                          {/* Pulsing dots */}
                          <div className="flex gap-2">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="h-3 w-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                style={{
                                  animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
                                }}
                              ></div>
                            ))}
                          </div>

                          {/* Animated progress bar */}
                          <div className="w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                              style={{
                                animation: "loadingProgress 2s ease-in-out infinite"
                              }}
                            ></div>
                          </div>

                          {/* Project name preview */}
                          <p className="text-sm text-gray-300 font-medium">
                            Loading <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
                              {projects[activeProject].title}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                    <Image
                      src={projects[activeProject].thumbnail || "/placeholder.svg"}
                      alt={projects[activeProject].title}
                      fill
                      className={`object-cover transition-transform duration-700 ${imageLoaded[activeProject] ? 'opacity-100' : 'opacity-0'}`}
                      style={{
                        objectFit: "cover",
                        transform: isHovering ? "scale(1.03)" : "scale(1)"
                      }}
                      onLoadingComplete={() => {
                        const newLoaded = [...imageLoaded];
                        newLoaded[activeProject] = true;
                        setImageLoaded(newLoaded);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  </div>
                  {/* Status indicator */}
                  {projects[activeProject].status && (
                    <motion.div
                      className="absolute top-4 left-4 bg-amber-500/90 text-black text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse"></span>
                      {projects[activeProject].status}
                    </motion.div>
                  )}

                  {/* Viewed indicator */}
                  {viewedProjects.has(activeProject) && (
                    <motion.div
                      className="absolute top-4 right-4 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="inline-block h-2 w-2 rounded-full bg-white"></span>
                      Viewed
                    </motion.div>
                  )}

                  {/* Title overlay at bottom */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-2">{projects[activeProject].title}</h3>

                    {/* Key skills preview */}
                    <div className="flex flex-wrap gap-2">
                      {projects[activeProject].skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-white/10 backdrop-blur-md text-xs text-white px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                      {projects[activeProject].skills.length > 3 && (
                        <span className="bg-white/10 backdrop-blur-md text-xs text-white px-2 py-1 rounded-full">
                          +{projects[activeProject].skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </motion.div>
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
                className="bg-gray-900/50 backdrop-blur-md p-8 rounded-xl border border-gray-800 hover:border-violet-500/50 transition-all duration-500 group"
                style={{
                  boxShadow: "0 0 30px rgba(139, 92, 246, 0.08)"
                }}
              >
                {/* Mobile image (visible only on mobile) */}
                <div className="relative h-48 w-full rounded-lg overflow-hidden mb-6 md:hidden">
                  <Image
                    src={projects[activeProject].thumbnail || "/placeholder.svg"}
                    alt={projects[activeProject].title}
                    fill
                    className="object-cover"
                  />

                  {/* Status indicator for mobile */}
                  {projects[activeProject].status && (
                    <div className="absolute top-4 left-4 bg-amber-500/90 text-black text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse"></span>
                      {projects[activeProject].status}
                    </div>
                  )}

                  {/* Viewed indicator for mobile */}
                  {viewedProjects.has(activeProject) && (
                    <div className="absolute top-4 right-4 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-white"></span>
                      Viewed
                    </div>
                  )}
                </div>

                <motion.div
                  className="inline-block mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-xs font-medium bg-violet-500/10 text-violet-300 px-3 py-1 rounded-full">
                    PROJECT {activeProject + 1}/{projects.length}
                  </span>
                </motion.div>

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

                <motion.h4
                  className="text-sm font-medium text-gray-400 mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                >
                  Technologies Used
                </motion.h4>

                <motion.div
                  className="flex flex-wrap gap-3 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {projects[activeProject].skills.map((skill, index) => {
                    const skillIcon = getSkillIcon(skill);

                    return (
                      <motion.span
                        key={index}
                        className="px-3 py-1 bg-gray-800/80 rounded-full text-sm text-gray-300 hover:bg-violet-900/50 hover:text-white transition-all flex items-center gap-2 group"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(124, 58, 237, 0.2)",
                          boxShadow: "0 0 10px rgba(124, 58, 237, 0.2)"
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                      >
                        {skillIcon && (
                          <div className="h-4 w-4 relative">
                            <Image
                              src={skillIcon}
                              alt={skill}
                              width={16}
                              height={16}
                              className="object-contain"
                            />
                          </div>
                        )}
                        {skill}
                      </motion.span>
                    );
                  })}
                </motion.div>

                <motion.h4
                  className="text-sm font-medium text-gray-400 mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                >
                  Project Links
                </motion.h4>

                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  {projects[activeProject].links.github && (
                    <motion.a
                      href={projects[activeProject].links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(138, 43, 226, 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-sm rounded-lg hover:bg-gray-700 transition-all"
                      data-cursor-text="GitHub"
                    >
                      <Github size={16} />
                      <span>GitHub</span>
                    </motion.a>
                  )}

                  {projects[activeProject].links.live && (
                    <motion.a
                      href={projects[activeProject].links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(236, 72, 153, 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all"
                      data-cursor-text="Live Demo"
                    >
                      <ExternalLink size={16} />
                      <span>Live Link</span>
                    </motion.a>
                  )}

                  {projects[activeProject].links.appstore && (
                    <motion.a
                      href={projects[activeProject].links.appstore}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(0, 122, 255, 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-800 text-gray-200 rounded-lg hover:bg-blue-900/40 hover:text-white transition-all"
                      data-cursor-text="App Store"
                    >
                      <AppWindow size={16} />
                      <span>App Store</span>
                    </motion.a>
                  )}

                  {projects[activeProject].links.playstore && (
                    <motion.a
                      href={projects[activeProject].links.playstore}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(0, 176, 116, 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-green-800 text-gray-200 rounded-lg hover:bg-green-900/40 hover:text-white transition-all"
                      data-cursor-text="Play Store"
                    >
                      <Smartphone size={16} />
                      <span>Play Store</span>
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
                          setViewedProjects(prev => {
                            const newSet = new Set(prev);
                            newSet.add(index);
                            return newSet;
                          });
                        }
                      }}
                      className={`w-3 h-3 rounded-full transition-all ${index === activeProject
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
                    <p className="flex items-center justify-center gap-1">
                      <span>Scroll down to see next project</span>
                      <ChevronDown className="animate-bounce h-4 w-4 opacity-70" />
                    </p>
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
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 0 25px rgba(138, 43, 226, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full font-medium group transition-all duration-300"
                data-cursor-text="Continue"
              >
                Continue to Skills
                <ChevronDown className="transition-transform group-hover:translate-y-1" />
              </motion.button>
            </ScrollLink>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll lock indicator - only shows when scroll is locked */}
      <AnimatePresence>
        {scrollLocked && (
          <motion.div
            className="fixed bottom-8 inset-x-0 mx-auto w-max bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-full text-sm text-gray-300 flex items-center gap-2 z-50 shadow-lg"
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
  );
}