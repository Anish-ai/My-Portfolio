"use client";

import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image as DreiImage, Text, useScroll, ScrollControls, Stars, Float, Sparkles } from "@react-three/drei";
import { useTheme } from "next-themes";
import { projects } from "@/data/projects";


import { useColor } from "@/context/color-context";
import { THEME_COLORS } from "@/lib/constants";

// --------------------------------------------------------
// 1. 3D Project Card
// --------------------------------------------------------
interface ProjectCard3DProps {
    project: typeof projects[0];
    position: [number, number, number];
    index: number;
    rotation?: [number, number, number];
    onSelect: (index: number) => void;
    isDark: boolean;
    themeColors: any;
}

const ProjectCard3D = ({ project, position, index, rotation = [0, 0, 0], onSelect, isDark, themeColors }: ProjectCard3DProps) => {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);
  
  // Animate: slow bobbing + hover scale
  useFrame((state) => {
    if (ref.current) {
        // Subtle floating independent of Float component for more control
        ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
    }
  });

  return (
    <group 
        ref={ref} 
        position={position} 
        rotation={rotation as [number, number, number]}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }} 
        onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
        onClick={(e) => { e.stopPropagation(); onSelect(index); }}
    >
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        {/* Glass Frame / Background */}
        <mesh position={[0, 0, -0.05]}>
            <planeGeometry args={[4.2, 2.5]} />
            <meshBasicMaterial 
                color={hovered ? themeColors.primary : (isDark ? "#000000" : "#ffffff")} 
                transparent 
                opacity={hovered ? 0.3 : 0.6} 
                side={THREE.DoubleSide}
            />
        </mesh>

        {/* The Project Image */}
        <DreiImage 
            url={project.thumbnail || "/placeholder.svg"} 
            scale={hovered ? [4.1, 2.3] : [4, 2.25]} 
            transparent 
            opacity={hovered ? 1 : 0.8}
            toneMapped={false}
        />

        {/* Tech Borders - Top/Bottom bars */}
        <mesh position={[0, 1.2, 0.02]}>
             <boxGeometry args={[4.2, 0.05, 0.05]} />
             <meshBasicMaterial color={themeColors.primary} />
        </mesh>
        <mesh position={[0, -1.2, 0.02]}>
             <boxGeometry args={[4.2, 0.05, 0.05]} />
             <meshBasicMaterial color={themeColors.accent} />
        </mesh>
        
        {/* Title Tooltip (Only visible on hover or always?) -> Always visible but brighter on hover */}
        <Text
            position={[0, -1.6, 0.1]}
            fontSize={0.25}
            color={hovered ? themeColors.primary : (isDark ? "white" : "#1e293b")}
            anchorX="center"
            anchorY="top"
            outlineWidth={0.01}
            outlineColor={isDark ? "#000000" : "#ffffff"}
        >
            {project.title.toUpperCase()}
        </Text>
      </Float>
    </group>
  );
};


// --------------------------------------------------------
// 2. The Tunnel/Warp Scene
// --------------------------------------------------------
const WarpScene = ({ onSelectProject, isDark, themeColors }: { onSelectProject: (index: number) => void, isDark: boolean, themeColors: any }) => {
    const scroll = useScroll();

    useFrame((state) => {
        const totalDistance = projects.length * 6;
        
        // BUFFER LOGIC: 
        // We ignore the first 5% of scroll to let the sticky container dock firmly at the top of the browser.
        const startBuffer = 0.05; 
        // Normalize the remaining 95% to 0-1
        const adjustedOffset = Math.max(0, scroll.offset - startBuffer) / (1 - startBuffer);
        
        // Target Z position
        // Start at z=5 (entrance), fly into negative Z
        const targetZ = -adjustedOffset * totalDistance + 5;
        
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);
    });

    return (
        <group>
            {/* The Tunnel Wireframe */}
            {/* Creating a long cylinder grid */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -30]}>
                <cylinderGeometry args={[10, 10, 100, 32, 20, true]} />
                <meshBasicMaterial color={isDark ? "#2d1b69" : "#cbd5e1"} wireframe transparent opacity={0.1} side={THREE.BackSide} />
            </mesh>
            
            {/* Fog to hide the end */}
            <fog attach="fog" args={[isDark ? '#000000' : '#ffffff', 5, 25]} />
            
            {/* Ambient Particles */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={500} scale={[12, 12, 100]} size={2} speed={0.4} opacity={0.5} color={themeColors.primary} position={[0,0,-50]} />

            {/* Lights */}
            <ambientLight intensity={2} />
            <pointLight position={[10, 10, 10]} intensity={1} color={themeColors.accent} />
            <pointLight position={[-10, -10, -10]} intensity={1} color={themeColors.primary} />

            {/* Project Cards */}
            {projects.map((project, i) => {
                const zPos = -i * 6;
                const xPos = i % 2 === 0 ? -2.5 : 2.5; 
                return (
                    <ProjectCard3D 
                        key={i} 
                        project={project} 
                        index={i}
                        position={[xPos, 0, zPos]}
                        rotation={[0, (i % 2 === 0 ? 0.25 : -0.25), 0]} // Face slightly inward
                        onSelect={onSelectProject}
                        isDark={isDark}
                        themeColors={themeColors}
                    />
                )
            })}
        </group>
    )
}

// --------------------------------------------------------
// 3. Main Export
// --------------------------------------------------------
export default function ProjectTunnel({ onSelect }: { onSelect: (index: number) => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();
    const { colorTheme } = useColor();
    const themeColors = THEME_COLORS[colorTheme] || THEME_COLORS.cyber;
    const isDark = resolvedTheme === "dark";

    useEffect(() => {
      if (!containerRef.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Projects section is visible - hide scrollbar
            document.documentElement.classList.add('no-scrollbar');
          } else {
            // Projects section is not visible - show scrollbar
            document.documentElement.classList.remove('no-scrollbar');
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="h-[100vh] w-full relative overflow-hidden">
             {/* Canvas Container */}
             <div className="sticky top-0 h-screen w-full">
                <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
                    <color attach="background" args={[isDark ? themeColors.background : '#ffffff']} />
                    
                    <ScrollControls pages={projects.length * 0.5} damping={0.2} distance={1}>
                        <WarpScene onSelectProject={onSelect} isDark={isDark} themeColors={themeColors} />
                    </ScrollControls>
                    
                    {/* Post Processing can go here (Bloom, Glitch) */}
                </Canvas>
                
                {/* Scroll Indicator */}
                <div 
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs font-mono animate-bounce pointer-events-none transition-colors duration-300"
                    style={{ color: themeColors.primary }}
                >
                    SCROLL TO EXPLORE :: DRAG TO NAVIGATE
                </div>
             </div>
        </div>
    )
}
