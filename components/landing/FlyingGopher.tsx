"use client";

import { useRef, useEffect, useState, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
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
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 5));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 5));

  useEffect(() => {
    if (isDragging) {
      // When dragging, Gopher follows cursor with offset
      const cursorX = (mousePosition.normalizedX - 0.5) * viewport.width;
      const cursorY = -(mousePosition.normalizedY - 0.5) * viewport.height;
      
      targetPosition.current = {
        x: cursorX + dragOffset.x,
        y: cursorY + dragOffset.y,
        z: 0.5, // Bring forward when dragging
      };
    } else {
      // Smart positioning: alternate sides based on scroll sections
      const section = Math.floor(scrollProgress * 6); // 6 sections
      const isRightSide = section % 2 === 0;
      
      // Oscillation for organic movement
      const yOscillation = Math.sin(scrollProgress * Math.PI * 4) * 0.5;
      const xOffset = Math.sin(scrollProgress * Math.PI * 2) * 0.3;
      
      // Position on edge of screen
      const baseX = isRightSide 
        ? viewport.width * 0.38 + xOffset
        : -viewport.width * 0.38 - xOffset;
      
      // Y position varies with scroll
      const baseY = yOscillation;
      
      targetPosition.current = {
        x: baseX,
        y: baseY,
        z: -1,
      };
    }

    // Gopher always looks at cursor
    const cursorX = (mousePosition.normalizedX - 0.5) * viewport.width;
    const cursorY = -(mousePosition.normalizedY - 0.5) * viewport.height;
    targetLookAt.current.set(cursorX, cursorY, 5);
  }, [scrollProgress, viewport.width, viewport.height, mousePosition, isDragging, dragOffset]);

  useFrame((_, delta) => {
    if (!groupRef.current || !isVisible) return;

    // Position interpolation - faster when dragging
    const positionSpeed = isDragging ? 0.00001 : 0.001;
    const positionLerp = 1 - Math.pow(positionSpeed, delta);
    
    currentPosition.current.x += (targetPosition.current.x - currentPosition.current.x) * positionLerp;
    currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * positionLerp;
    currentPosition.current.z += (targetPosition.current.z - currentPosition.current.z) * positionLerp;

    // LookAt interpolation - very responsive
    const lookAtLerp = 1 - Math.pow(0.00001, delta);
    currentLookAt.current.x += (targetLookAt.current.x - currentLookAt.current.x) * lookAtLerp;
    currentLookAt.current.y += (targetLookAt.current.y - currentLookAt.current.y) * lookAtLerp;
    currentLookAt.current.z += (targetLookAt.current.z - currentLookAt.current.z) * lookAtLerp;

    // Set position
    groupRef.current.position.set(
      currentPosition.current.x,
      currentPosition.current.y,
      currentPosition.current.z
    );

    // Make Gopher look at cursor
    const gopherPos = groupRef.current.position.clone();
    
    const targetQuaternion = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const matrix = new THREE.Matrix4();
    matrix.lookAt(gopherPos, currentLookAt.current, up);
    targetQuaternion.setFromRotationMatrix(matrix);
    
    // Base rotation so Gopher faces camera
    const baseRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    targetQuaternion.multiply(baseRotation);
    
    // Fast slerp for responsive gaze
    groupRef.current.quaternion.slerp(targetQuaternion, 0.15);
    
    // Add subtle bobbing animation
    if (!isDragging) {
      const time = Date.now() * 0.001;
      groupRef.current.position.y += Math.sin(time * 2) * 0.02;
      groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.03;
    }
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef} scale={0.35}>
      <primitive object={clonedScene} />
    </group>
  );
}

function CameraController({ mousePosition }: { mousePosition: MousePosition }) {
  const { camera } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    const mouseInfluenceX = (mousePosition.normalizedX - 0.5) * 2;
    const mouseInfluenceY = (mousePosition.normalizedY - 0.5) * 2;

    targetRotation.current.x = -mouseInfluenceY * 0.02;
    targetRotation.current.y = mouseInfluenceX * 0.02;

    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.05;
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.05;
  });

  return null;
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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newMouse = {
        normalizedX: e.clientX / window.innerWidth,
        normalizedY: e.clientY / window.innerHeight,
      };
      setInternalMouse(newMouse);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    // Check if clicking on Gopher area (right side of screen or wherever it currently is)
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Start dragging
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
    e.preventDefault();
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      return () => window.removeEventListener("mouseup", handleMouseUp);
    }
  }, [isDragging, handleMouseUp]);

  if (!mounted) return null;

  const effectiveMouse = mousePosition || internalMouse;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          className={`fixed inset-0 z-40 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ pointerEvents: 'auto' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          onMouseDown={handleMouseDown}
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent", pointerEvents: 'none' }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#C9673A" />
            <pointLight position={[0, 5, 0]} intensity={0.4} color="#00D4AA" />
            
            <CameraController mousePosition={effectiveMouse} />

            <Suspense fallback={null}>
              <GopherModel 
                scrollProgress={scrollProgress} 
                isVisible={isVisible}
                mousePosition={effectiveMouse}
                isDragging={isDragging}
                dragOffset={dragOffset}
              />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

useGLTF.preload("/models/go_gopher.glb");
