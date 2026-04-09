"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

interface GopherModelProps {
  scrollProgress: number;
  isVisible: boolean;
}

function GopherModel({ scrollProgress, isVisible }: GopherModelProps) {
  const { scene } = useGLTF("/models/go_gopher.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  // Clone the scene to avoid mutation issues
  const clonedScene = scene.clone();
  
  // Target position based on scroll
  const targetPosition = useRef({ x: 3, y: 0, z: 0 });
  const currentPosition = useRef({ x: 5, y: 0, z: 0 });
  const targetRotation = useRef({ x: 0, y: -Math.PI / 4, z: 0 });
  const currentRotation = useRef({ x: 0, y: -Math.PI / 4, z: 0 });
  
  useEffect(() => {
    // Calculate position based on scroll progress
    // Gopher flies in a sinusoidal pattern as user scrolls
    const normalizedScroll = scrollProgress;
    
    // Create a dynamic flying path
    // X: oscillates between left and right
    const xOscillation = Math.sin(normalizedScroll * Math.PI * 4) * 2.5;
    // Y: follows scroll but with some bounce
    const yPosition = Math.sin(normalizedScroll * Math.PI * 2) * 1.5 + Math.cos(normalizedScroll * Math.PI * 6) * 0.3;
    // Z: slight depth variation
    const zPosition = Math.cos(normalizedScroll * Math.PI * 3) * 1;
    
    // Position in viewport space
    const baseX = viewport.width * 0.35;
    targetPosition.current = {
      x: baseX + xOscillation,
      y: yPosition,
      z: zPosition - 2,
    };
    
    // Rotation to face movement direction
    const rotationY = -Math.PI / 4 + xOscillation * 0.15;
    const rotationX = yPosition * 0.1;
    const rotationZ = -xOscillation * 0.08;
    
    targetRotation.current = {
      x: rotationX,
      y: rotationY,
      z: rotationZ,
    };
  }, [scrollProgress, viewport.width]);
  
  useFrame((_, delta) => {
    if (!groupRef.current || !isVisible) return;
    
    // Smooth interpolation for position
    const lerpFactor = 1 - Math.pow(0.001, delta);
    
    currentPosition.current.x += (targetPosition.current.x - currentPosition.current.x) * lerpFactor;
    currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * lerpFactor;
    currentPosition.current.z += (targetPosition.current.z - currentPosition.current.z) * lerpFactor;
    
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * lerpFactor;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * lerpFactor;
    currentRotation.current.z += (targetRotation.current.z - currentRotation.current.z) * lerpFactor;
    
    groupRef.current.position.set(
      currentPosition.current.x,
      currentPosition.current.y,
      currentPosition.current.z
    );
    
    groupRef.current.rotation.set(
      currentRotation.current.x,
      currentRotation.current.y,
      currentRotation.current.z
    );
  });
  
  if (!isVisible) return null;
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.3}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <group ref={groupRef} scale={0.8}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
}

function Scene({ scrollProgress, isVisible }: GopherModelProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#C9673A" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#00D4AA" />
      
      <Suspense fallback={null}>
        <GopherModel scrollProgress={scrollProgress} isVisible={isVisible} />
        <Environment preset="city" />
      </Suspense>
    </>
  );
}

interface FlyingGopherProps {
  isVisible: boolean;
}

export function FlyingGopher({ isVisible }: FlyingGopherProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);
  
  if (!mounted) return null;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <Scene scrollProgress={scrollProgress} isVisible={isVisible} />
          </Canvas>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Preload the model
useGLTF.preload("/models/go_gopher.glb");
