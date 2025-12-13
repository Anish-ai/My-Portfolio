"use client"

import { useRef, useMemo, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { MeshDistortMaterial, Float } from "@react-three/drei"
import * as THREE from "three"

function FloatingMesh({ 
  position, 
  color, 
  speed, 
  factor, 
  scale 
}: { 
  position: [number, number, number], 
  color: string, 
  speed: number, 
  factor: number, 
  scale: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHover] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return
    // Subtle rotation
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = Math.cos(t / 4) * Math.PI / 8
    meshRef.current.rotation.y = Math.sin(t / 4) * Math.PI / 8
    meshRef.current.rotation.z = (1 + Math.sin(t / 1.5)) / 20
    
    // Scale on hover
    const targetScale = hovered ? scale * 1.5 : scale
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  return (
    <Float
        speed={speed} // Animation speed
        rotationIntensity={factor} // XYZ rotation intensity
        floatIntensity={factor} // Up/down float intensity
    >
      <mesh 
        ref={meshRef} 
        position={position} 
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <icosahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color={hovered ? "#d946ef" : color}
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  )
}

export default function FloatingShapes() {
  // Generate random shapes
  const shapes = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    width: 1,
    position: [
      (Math.random() - 0.5) * 15, // Spread x
      (Math.random() - 0.5) * 10,  // Spread y
      (Math.random() - 0.5) * 5    // Spread z
    ] as [number, number, number],
    color: i % 2 === 0 ? "#8b5cf6" : "#0ea5e9", // Violet or Sky Blue
    scale: 0.2 + Math.random() * 0.5,
    speed: 1 + Math.random(),
    factor: 0.5 + Math.random(),
  })), [])

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
        {/* pointer-events-none ensures clicks pass through to content, but we might want to enable them for individual meshes if we want interaction. 
            However, for a background, it's safer to let clicks pass through unless we manage z-index carefully. 
            Actually, R3F handles pointer events on meshes even with pointer-events-none on container if configured, 
            but standard DOM overlay prevents it. 
            Let's allow pointer events on the container but maybe z-index low?
            If we want hover effects on shapes, the container must capture pointer events.
            But the text is in front. 
            We'll place this behind the text.
        */}
      <Canvas eventSource={typeof window !== 'undefined' ? document.body : undefined}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {shapes.map((props, i) => (
          <FloatingMesh key={i} {...props} />
        ))}
      </Canvas>
    </div>
  )
}
