"use client";

import { useRef, useState, type ComponentProps } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function LogoMesh(props: ComponentProps<'mesh'>) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Constant slow rotation
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      
      // Lerp scale on hover
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh
      {...props}
      ref={meshRef}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <icosahedronGeometry args={[1, 0]} />
      <MeshDistortMaterial
        color={hovered ? "#d946ef" : "#8b5cf6"} // Fuchsia to Violet
        attach="material"
        distort={0.4} // Strength, 0 disables the effect (default=1)
        speed={2} // Speed (default=1)
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

export default function ThreeLogo() {
  return (
    <div className="w-16 h-16 cursor-pointer -ml-4">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3.5]} />
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Float
          speed={3} // Animation speed
          rotationIntensity={1} // XYZ rotation intensity
          floatIntensity={1} // Up/down float intensity
        >
          <LogoMesh />
        </Float>
      </Canvas>
    </div>
  );
}
