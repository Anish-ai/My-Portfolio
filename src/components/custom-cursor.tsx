"use client"

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for the outer ring
  // mass: 0.1 makes it very light and responsive
  // stiffness: 300 makes it snap effectively
  // damping: 25 prevents oscillation
  const springConfig = { damping: 25, stiffness: 300, mass: 0.1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const [cursorVariant, setCursorVariant] = useState("default");
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Function to smoothly track mouse movement without re-renders
    const mouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      if (!isVisible) setIsVisible(true);
    }

    const mouseLeave = () => setIsVisible(false);
    const mouseEnter = () => setIsVisible(true);
    const mouseDown = () => setIsClicking(true);
    const mouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseleave", mouseLeave);
    document.addEventListener("mouseenter", mouseEnter);
    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);

    // Event handlers for interactive elements
    const handleButtonEnter = (e: Event) => {
      setCursorVariant("button");
      const target = e.target as HTMLElement;
      setCursorText(target.getAttribute("data-cursor-text") || "Click");
    };

    const handleLinkEnter = () => {
      setCursorVariant("link");
      setCursorText("");
    };

    const handleProjectEnter = () => {
      setCursorVariant("project");
      setCursorText("View");
    };

    const handleSkillEnter = () => {
      setCursorVariant("skill");
      setCursorText("");
    };

    const handleImageEnter = () => {
      setCursorVariant("image");
      setCursorText("Zoom");
    };

    const handleInputEnter = () => {
      setCursorVariant("input");
      setCursorText("");
    };

    const handleMouseLeave = () => {
      setCursorVariant("default");
      setCursorText("");
    };

    // Apply listeners to different element types
    const buttons = document.querySelectorAll('button, [role="button"]');
    const links = document.querySelectorAll("a");
    const projects = document.querySelectorAll(".project-card");
    const skills = document.querySelectorAll(".skill-item");
    const images = document.querySelectorAll("img, .image-container");
    const inputs = document.querySelectorAll("input, textarea, [contenteditable]");

    buttons.forEach((el) => {
      el.addEventListener("mouseenter", handleButtonEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    links.forEach((el) => {
      el.addEventListener("mouseenter", handleLinkEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    projects.forEach((el) => {
      el.addEventListener("mouseenter", handleProjectEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    skills.forEach((el) => {
      el.addEventListener("mouseenter", handleSkillEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    images.forEach((el) => {
      el.addEventListener("mouseenter", handleImageEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    inputs.forEach((el) => {
      el.addEventListener("mouseenter", handleInputEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseleave", mouseLeave);
      document.removeEventListener("mouseenter", mouseEnter);
      document.removeEventListener("mousedown", mouseDown);
      document.removeEventListener("mouseup", mouseUp);

      buttons.forEach((el) => {
        el.removeEventListener("mouseenter", handleButtonEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });

      links.forEach((el) => {
        el.removeEventListener("mouseenter", handleLinkEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });

      projects.forEach((el) => {
        el.removeEventListener("mouseenter", handleProjectEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });

      skills.forEach((el) => {
        el.removeEventListener("mouseenter", handleSkillEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });

      images.forEach((el) => {
        el.removeEventListener("mouseenter", handleImageEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });

      inputs.forEach((el) => {
        el.removeEventListener("mouseenter", handleInputEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [isVisible, mouseX, mouseY]);

  // Enhanced cursor variants - Position is now handled by styles using motion values
  const variants = {
    default: {
      height: 24,
      width: 24,
      backgroundColor: "rgba(14, 165, 233, 0.2)",  // Bright ocean blue with transparency
      border: "2px solid rgba(14, 165, 233, 0.8)", // Solid border for visibility
      scale: isClicking ? 0.8 : 1,
    },
    button: {
      height: 60,
      width: 60,
      backgroundColor: "rgba(139, 92, 246, 0.15)", // Vivid purple
      border: "2px solid rgba(139, 92, 246, 0.9)",
      scale: isClicking ? 0.85 : 1,
    },
    link: {
      height: 40,
      width: 40,
      backgroundColor: "rgba(217, 70, 239, 0.15)", // Magenta pink
      border: "2px solid rgba(217, 70, 239, 0.9)",
      scale: isClicking ? 0.9 : 1,
    },
    project: {
      height: 80,
      width: 80,
      backgroundColor: "rgba(139, 92, 246, 0.12)",
      border: "2px solid rgba(139, 92, 246, 0.9)",
      scale: isClicking ? 0.8 : 1,
    },
    skill: {
      height: 50,
      width: 50,
      backgroundColor: "rgba(217, 70, 239, 0.12)",
      border: "2px solid rgba(217, 70, 239, 0.9)",
      scale: isClicking ? 0.9 : 1,
    },
    image: {
      height: 70,
      width: 70,
      backgroundColor: "rgba(14, 165, 233, 0.12)",
      border: "2px solid rgba(14, 165, 233, 0.9)",
      scale: isClicking ? 0.85 : 1,
    },
    input: {
      height: 30,
      width: 30,
      backgroundColor: "rgba(249, 115, 22, 0.12)", // Bright orange
      border: "2px solid rgba(249, 115, 22, 0.9)",
      scale: isClicking ? 0.8 : 1,
    },
  };

  // Add a CSS style to hide the default cursor
  useEffect(() => {
    document.body.style.cursor = "none";
    
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      {/* Outer Ring - Follows with spring physics */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ 
          x: springX, 
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          className="rounded-full shadow-md backdrop-blur-[1px]"
          variants={variants}
          animate={cursorVariant}
          transition={{
            type: "spring",
            mass: 0.1,
            stiffness: 900,
            damping: 25,
            ease: "linear"
          }}
          style={{
             display: "flex",
             alignItems: "center",
             justifyContent: "center"
          }}
        >
          {cursorVariant !== "default" && (
            <motion.div 
              className="absolute inset-0 rounded-full bg-white"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.15, 0.1]
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Inner Dot - Instant 1:1 tracking */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{ 
          x: mouseX, 
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
            className="rounded-full"
            animate={{
              scale: isClicking ? 0.8 : 1,
            }}
            transition={{
              type: "tween",
              ease: "linear",
              duration: 0.08
            }}
            style={{ 
              height: 4,
              width: 4,
              backgroundColor: 
                cursorVariant === "button" || cursorVariant === "project" ? "rgba(139, 92, 246, 1)" :
                cursorVariant === "link" || cursorVariant === "skill" ? "rgba(217, 70, 239, 1)" :
                cursorVariant === "image" ? "rgba(14, 165, 233, 1)" :
                cursorVariant === "input" ? "rgba(249, 115, 22, 1)" :
                "rgba(14, 165, 233, 1)",
              boxShadow: "0 0 5px rgba(255, 255, 255, 0.7)"
            }}
        />
      </motion.div>

      {/* Text label - Follows spring physics */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ 
            x: springX, 
            y: springY,
            // Offset text slightly to not overlap with center of cursor
            translateX: "20px", 
            translateY: "20px",
            opacity: isVisible ? 1 : 0,
        }}
      >
        {cursorText && (
          <motion.div
            className="font-medium tracking-wider uppercase text-xs hidden md:flex"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ 
              color: 
                cursorVariant === "button" || cursorVariant === "project" ? "rgba(139, 92, 246, 1)" :
                cursorVariant === "link" || cursorVariant === "skill" ? "rgba(217, 70, 239, 1)" :
                cursorVariant === "image" ? "rgba(14, 165, 233, 1)" :
                "rgba(249, 115, 22, 1)",
              fontWeight: 600,
              textShadow: "0px 0px 2px rgba(255, 255, 255, 0.7)"
            }}
          >
            {cursorText}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}