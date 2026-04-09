"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

interface MousePosition {
  normalizedX: number;
  normalizedY: number;
}

interface GopherModelProps {
  scrollProgress: number;
  isVisible: boolean;
  mousePosition: MousePosition;
}

function GopherModel({ scrollProgress, isVisible, mousePosition }: GopherModelProps) {
  const { scene } = useGLTF("/models/go_gopher.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const clonedScene = scene.clone();

  const targetPosition = useRef({ x: 3, y: 0, z: 0 });
  const currentPosition = useRef({ x: 5, y: 0, z: 0 });
  const targetRotation = useRef({ x: 0, y: -Math.PI / 4, z: 0 });
  const currentRotation = useRef({ x: 0, y: -Math.PI / 4, z: 0 });

  useEffect(() => {
    const normalizedScroll = scrollProgress;

    // Mouse influence (-1 to 1)
    const mouseInfluenceX = (mousePosition.normalizedX - 0.5) * 2;
    const mouseInfluenceY = (mousePosition.normalizedY - 0.5) * 2;

    // Reduced scroll oscillation for more subtle movement
    const xOscillation = Math.sin(normalizedScroll * Math.PI * 3) * 1.8;
    const yPosition = Math.sin(normalizedScroll * Math.PI * 2) * 1.2 + Math.cos(normalizedScroll * Math.PI * 5) * 0.2;
    const zPosition = Math.cos(normalizedScroll * Math.PI * 2) * 0.8;

    const baseX = viewport.width * 0.3;

    // Combined position: scroll + mouse influence
    targetPosition.current = {
      x: baseX + xOscillation + mouseInfluenceX * 0.6,
      y: yPosition + mouseInfluenceY * 0.4,
      z: zPosition - 2 + Math.abs(mouseInfluenceX) * 0.3,
    };

    // Gopher "looks at" cursor - tilts head toward mouse
    const rotationY = -Math.PI / 4 + xOscillation * 0.1 + mouseInfluenceX * 0.25;
    const rotationX = yPosition * 0.08 - mouseInfluenceY * 0.15;
    const rotationZ = -xOscillation * 0.06 + mouseInfluenceX * 0.08;

    targetRotation.current = {
      x: rotationX,
      y: rotationY,
      z: rotationZ,
    };
  }, [scrollProgress, viewport.width, mousePosition]);

  useFrame((_, delta) => {
    if (!groupRef.current || !isVisible) return;

    // Smooth interpolation with slightly faster response
    const lerpFactor = 1 - Math.pow(0.0005, delta);

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
      speed={2.5}
      rotationIntensity={0.2}
      floatIntensity={0.4}
      floatingRange={[-0.08, 0.08]}
    >
      <group ref={groupRef} scale={0.75}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
}

function CameraController({ mousePosition }: { mousePosition: MousePosition }) {
  const { camera } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // Subtle camera parallax based on mouse
    const mouseInfluenceX = (mousePosition.normalizedX - 0.5) * 2;
    const mouseInfluenceY = (mousePosition.normalizedY - 0.5) * 2;

    targetRotation.current.x = -mouseInfluenceY * 0.03;
    targetRotation.current.y = mouseInfluenceX * 0.03;

    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.05;
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.05;
  });

  return null;
}

interface SceneProps extends GopherModelProps {}

function Scene({ scrollProgress, isVisible, mousePosition }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#C9673A" />
      <pointLight position={[0, 5, 0]} intensity={0.4} color="#00D4AA" />
      
      <CameraController mousePosition={mousePosition} />

      <Suspense fallback={null}>
        <GopherModel 
          scrollProgress={scrollProgress} 
          isVisible={isVisible} 
          mousePosition={mousePosition}
        />
        <Environment preset="city" />
      </Suspense>
    </>
  );
}

interface FlyingGopherProps {
  isVisible: boolean;
  mousePosition?: MousePosition;
}

export function FlyingGopher({ isVisible, mousePosition }: FlyingGopherProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [internalMouse, setInternalMouse] = useState({ normalizedX: 0.5, normalizedY: 0.5 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Internal mouse tracking if no external position provided
  useEffect(() => {
    if (mousePosition) return;

    const handleMouseMove = (e: MouseEvent) => {
      setInternalMouse({
        normalizedX: e.clientX / window.innerWidth,
        normalizedY: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mousePosition]);

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

  const effectiveMouse = mousePosition || internalMouse;

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
            <Scene 
              scrollProgress={scrollProgress} 
              isVisible={isVisible}
              mousePosition={effectiveMouse}
            />
          </Canvas>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

useGLTF.preload("/models/go_gopher.glb");
