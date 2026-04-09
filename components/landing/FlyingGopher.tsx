"use client";

import { useRef, useEffect, useState, Suspense, useCallback } from "react";
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
  isDragging: boolean;
  dragOffset: { x: number; y: number };
}

function GopherModel({ scrollProgress, isVisible, mousePosition, isDragging, dragOffset }: GopherModelProps) {
  const { scene } = useGLTF("/models/go_gopher.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const clonedScene = scene.clone();

  // Position refs
  const targetPosition = useRef({ x: 2, y: -1, z: 0 });
  const currentPosition = useRef({ x: 3, y: -1, z: 0 });
  
  // Rotation refs for look-at
  const targetRotation = useRef(new THREE.Quaternion());
  const currentRotation = useRef(new THREE.Quaternion());

  useEffect(() => {
    if (!isVisible) return;

    // If dragging, use drag offset position
    if (isDragging) {
      // Convert normalized drag offset to viewport coordinates
      const dragX = (dragOffset.x - 0.5) * viewport.width * 1.2;
      const dragY = -(dragOffset.y - 0.5) * viewport.height * 1.2;
      
      targetPosition.current = {
        x: dragX + viewport.width * 0.3,
        y: dragY,
        z: 0,
      };
    } else {
      // Smart positioning based on scroll - stays on edges, alternates sides
      const normalizedScroll = scrollProgress;
      
      // Alternate between left and right edges based on scroll
      const scrollSection = Math.floor(normalizedScroll * 6); // 6 sections
      const isRightSide = scrollSection % 2 === 0;
      
      // Vertical position follows scroll with gentle wave
      const yWave = Math.sin(normalizedScroll * Math.PI * 4) * 0.3;
      const baseY = (normalizedScroll - 0.5) * -viewport.height * 0.6 + yWave;
      
      // X position: far right or far left edge
      const edgeMargin = viewport.width * 0.38;
      const baseX = isRightSide ? edgeMargin : -edgeMargin + viewport.width * 0.1;
      
      // Small hover towards cursor
      const mouseInfluenceX = (mousePosition.normalizedX - 0.5) * 0.4;
      const mouseInfluenceY = (mousePosition.normalizedY - 0.5) * 0.3;
      
      targetPosition.current = {
        x: baseX + mouseInfluenceX,
        y: baseY - mouseInfluenceY,
        z: -1,
      };
    }

    // Calculate look-at rotation towards cursor - VERY responsive
    const cursorX = (mousePosition.normalizedX - 0.5) * viewport.width * 2;
    const cursorY = -(mousePosition.normalizedY - 0.5) * viewport.height * 2;
    
    // Direction from gopher to cursor
    const gopherPos = new THREE.Vector3(
      currentPosition.current.x,
      currentPosition.current.y,
      currentPosition.current.z
    );
    const cursorPos = new THREE.Vector3(cursorX, cursorY, 5);
    
    // Create lookAt matrix
    const lookMatrix = new THREE.Matrix4();
    lookMatrix.lookAt(gopherPos, cursorPos, new THREE.Vector3(0, 1, 0));
    
    // Extract quaternion and add base rotation (Gopher faces -Z by default)
    const lookQuat = new THREE.Quaternion().setFromRotationMatrix(lookMatrix);
    const baseRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    lookQuat.multiply(baseRot);
    
    targetRotation.current.copy(lookQuat);
  }, [scrollProgress, viewport.width, viewport.height, mousePosition, isDragging, dragOffset, isVisible]);

  useFrame((_, delta) => {
    if (!groupRef.current || !isVisible) return;

    // Position interpolation - faster when dragging
    const positionSpeed = isDragging ? 0.00001 : 0.0005;
    const positionLerp = 1 - Math.pow(positionSpeed, delta);
    
    currentPosition.current.x += (targetPosition.current.x - currentPosition.current.x) * positionLerp;
    currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * positionLerp;
    currentPosition.current.z += (targetPosition.current.z - currentPosition.current.z) * positionLerp;

    // Rotation interpolation - VERY fast and responsive
    const rotationLerp = 1 - Math.pow(0.00001, delta);
    currentRotation.current.slerp(targetRotation.current, rotationLerp);

    // Apply position
    groupRef.current.position.set(
      currentPosition.current.x,
      currentPosition.current.y,
      currentPosition.current.z
    );

    // Apply rotation
    groupRef.current.quaternion.copy(currentRotation.current);
  });

  if (!isVisible) return null;

  return (
    <Float
      speed={isDragging ? 0 : 1.5}
      rotationIntensity={isDragging ? 0 : 0.1}
      floatIntensity={isDragging ? 0 : 0.2}
      floatingRange={[-0.03, 0.03]}
    >
      <group ref={groupRef} scale={0.35}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
}

interface SceneProps {
  scrollProgress: number;
  isVisible: boolean;
  mousePosition: MousePosition;
  isDragging: boolean;
  dragOffset: { x: number; y: number };
}

function Scene({ scrollProgress, isVisible, mousePosition, isDragging, dragOffset }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#C9673A" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#00D4AA" />

      <Suspense fallback={null}>
        <GopherModel 
          scrollProgress={scrollProgress} 
          isVisible={isVisible} 
          mousePosition={mousePosition}
          isDragging={isDragging}
          dragOffset={dragOffset}
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0.7, y: 0.5 });
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse tracking
  useEffect(() => {
    if (mousePosition) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newMouse = {
        normalizedX: e.clientX / window.innerWidth,
        normalizedY: e.clientY / window.innerHeight,
      };
      setInternalMouse(newMouse);
      
      // Update drag position if dragging
      if (isDragging) {
        setDragOffset(newMouse);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mousePosition, isDragging]);

  // External mouse position updates drag
  useEffect(() => {
    if (!mousePosition || !isDragging) return;
    setDragOffset(mousePosition);
  }, [mousePosition, isDragging]);

  // Scroll tracking
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

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse up listener
  useEffect(() => {
    if (!isDragging) return;
    
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging]);

  if (!mounted) return null;

  const effectiveMouse = mousePosition || internalMouse;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={canvasRef}
          className={`fixed inset-0 z-40 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ pointerEvents: 'auto' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent", pointerEvents: 'none' }}
          >
            <Scene 
              scrollProgress={scrollProgress} 
              isVisible={isVisible}
              mousePosition={effectiveMouse}
              isDragging={isDragging}
              dragOffset={dragOffset}
            />
          </Canvas>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

useGLTF.preload("/models/go_gopher.glb");
