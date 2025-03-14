"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Function to smoothly track mouse movement
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
      if (!isVisible) setIsVisible(true);
    };

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
  }, [isVisible]);

  // Enhanced cursor variants with better visibility and colors
  const variants = {
    default: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      height: 24,
      width: 24,
      backgroundColor: "rgba(14, 165, 233, 0.2)",  // Bright ocean blue with transparency
      border: "2px solid rgba(14, 165, 233, 0.8)", // Solid border for visibility
      scale: isClicking ? 0.8 : 1,
      transition: {
        type: "spring",
        mass: 0.1,    // Reduced mass for faster response
        stiffness: 900, // Increased stiffness for better tracking
        damping: 25,   // Slightly reduced damping for more responsiveness
        ease: "linear" // Linear interpolation for smoother movement
      },
    },
    button: {
      x: mousePosition.x - 30,
      y: mousePosition.y - 30,
      height: 60,
      width: 60,
      backgroundColor: "rgba(139, 92, 246, 0.15)", // Vivid purple
      border: "2px solid rgba(139, 92, 246, 0.9)",
      scale: isClicking ? 0.85 : 1,
      transition: {
        type: "spring",
        mass: 0.1,
        stiffness: 900,
        damping: 25,
        ease: "linear"
      },
    },
    link: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      height: 40,
      width: 40,
      backgroundColor: "rgba(217, 70, 239, 0.15)", // Magenta pink
      border: "2px solid rgba(217, 70, 239, 0.9)",
      scale: isClicking ? 0.9 : 1,
      transition: {
        type: "spring",
        mass: 0.1,
        stiffness: 900,
        damping: 25,
        ease: "linear"
      },
    },
    project: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      height: 80,
      width: 80,
      backgroundColor: "rgba(139, 92, 246, 0.12)",
      border: "2px solid rgba(139, 92, 246, 0.9)",
      scale: isClicking ? 0.8 : 1,
      transition: {
        type: "spring",
        mass: 0.1,
        stiffness: 900,
        damping: 25,
        ease: "linear"
      },
    },
    skill: {
      x: mousePosition.x - 25,
      y: mousePosition.y - 25,
      height: 50,
      width: 50,
      backgroundColor: "rgba(217, 70, 239, 0.12)",
      border: "2px solid rgba(217, 70, 239, 0.9)",
      scale: isClicking ? 0.9 : 1,
      transition: {
        type: "spring",
        mass: 0.1,
        stiffness: 900,
        damping: 25,
        ease: "linear"
      },
    },
    image: {
      x: mousePosition.x - 35,
      y: mousePosition.y - 35,
      height: 70,
      width: 70,
      backgroundColor: "rgba(14, 165, 233, 0.12)",
      border: "2px solid rgba(14, 165, 233, 0.9)",
      scale: isClicking ? 0.85 : 1,
      transition: {
        type: "spring",
        mass: 0.1,
        stiffness: 900,
        damping: 25,
        ease: "linear"
      },
    },
    input: {
      x: mousePosition.x - 15,
      y: mousePosition.y - 15,
      height: 30,
      width: 30,
      backgroundColor: "rgba(249, 115, 22, 0.12)", // Bright orange
      border: "2px solid rgba(249, 115, 22, 0.9)",
      scale: isClicking ? 0.8 : 1,
      transition: {
        type: "spring",
        mass: 0.1,
        stiffness: 900,
        damping: 25,
        ease: "linear"
      },
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
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] shadow-md"
        variants={variants}
        animate={cursorVariant}
        style={{ 
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease",
          mixBlendMode: "normal"
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

      {/* Inner dot for precision */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[10000]"
        animate={{
          x: mousePosition.x - 2,
          y: mousePosition.y - 2,
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
          opacity: isVisible ? 1 : 0,
          boxShadow: "0 0 5px rgba(255, 255, 255, 0.7)"
        }}
      />

      {/* Text label */}
      {cursorText && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] font-medium tracking-wider uppercase text-xs md:flex items-center justify-center hidden"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
            scale: isClicking ? 0.9 : 1,
            opacity: 1,
          }}
          transition={{
            type: "spring",
            mass: 0.1,
            stiffness: 900,
            damping: 25
          }}
          style={{ 
            opacity: isVisible ? 1 : 0,
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

      {/* Improved trail effect */}
      {isVisible && cursorVariant !== "default" && (
        <>
          <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9997]"
            animate={{
              x: mousePosition.x - 10,
              y: mousePosition.y - 10,
              scale: 0.6,
            }}
            transition={{
              type: "tween",
              duration: 0.3,
              ease: "easeOut",
            }}
            style={{
              height: 20,
              width: 20,
              opacity: 0.3,
              backgroundColor: 
                cursorVariant === "button" || cursorVariant === "project" ? "rgba(139, 92, 246, 0.3)" :
                cursorVariant === "link" || cursorVariant === "skill" ? "rgba(217, 70, 239, 0.3)" :
                cursorVariant === "image" ? "rgba(14, 165, 233, 0.3)" :
                "rgba(249, 115, 22, 0.3)",
            }}
          />
          <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9996]"
            animate={{
              x: mousePosition.x - 8,
              y: mousePosition.y - 8,
              scale: 0.4,
            }}
            transition={{
              type: "tween",
              duration: 0.6,
              ease: "easeOut",
            }}
            style={{
              height: 16,
              width: 16,
              opacity: 0.2,
              backgroundColor: 
                cursorVariant === "button" || cursorVariant === "project" ? "rgba(139, 92, 246, 0.25)" :
                cursorVariant === "link" || cursorVariant === "skill" ? "rgba(217, 70, 239, 0.25)" :
                cursorVariant === "image" ? "rgba(14, 165, 233, 0.25)" :
                "rgba(249, 115, 22, 0.25)",
            }}
          />
        </>
      )}
    </>
  );
}