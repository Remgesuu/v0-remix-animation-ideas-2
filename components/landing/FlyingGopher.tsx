"use client";

import { useRef, useEffect, useState, Suspense } from "react";
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
}

function GopherModel({ scrollProgress, isVisible, mousePosition }: GopherModelProps) {
  const { scene } = useGLTF("/models/go_gopher.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const clonedScene = scene.clone();

  // Position refs
  const targetPosition = useRef({ x: 2, y: -1, z: 0 });
  const currentPosition = useRef({ x: 3, y: -1, z: 0 });
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 5));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 5));
  const breathPhase = useRef(0);

  useEffect(() => {
    // Smart positioning: Gopher stays on edges, alternates sides based on scroll
    const section = Math.floor(scrollProgress * 8); // 8 sections for smooth transitions
    const isRightSide = section % 2 === 0;
    
    // Vertical position follows scroll with wave pattern - stays between content
    const scrollWave = Math.sin(scrollProgress * Math.PI * 3) * 0.8;
    const verticalOffset = Math.cos(scrollProgress * Math.PI * 2) * 0.3;
    
    // Horizontal position on screen edge
    const edgeDistance = viewport.width * 0.42; // Stay at edge
    const baseX = isRightSide ? edgeDistance : -edgeDistance;
    
    // Add subtle horizontal drift
    const xDrift = Math.sin(scrollProgress * Math.PI * 4) * 0.15;
    
    targetPosition.current = {
      x: baseX + xDrift,
      y: scrollWave + verticalOffset,
      z: -1.5 + Math.abs(scrollWave) * 0.3, // Subtle z movement
    };

    // Gopher ALWAYS looks at cursor - calculate 3D cursor position
    const cursorX = (mousePosition.normalizedX - 0.5) * viewport.width * 1.5;
    const cursorY = -(mousePosition.normalizedY - 0.5) * viewport.height * 1.5;
    targetLookAt.current.set(cursorX, cursorY, 6);
  }, [scrollProgress, viewport.width, viewport.height, mousePosition]);

  useFrame((_, delta) => {
    if (!groupRef.current || !isVisible) return;

    // Position interpolation - smooth gliding
    const positionLerp = 1 - Math.pow(0.002, delta);
    
    currentPosition.current.x += (targetPosition.current.x - currentPosition.current.x) * positionLerp;
    currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * positionLerp;
    currentPosition.current.z += (targetPosition.current.z - currentPosition.current.z) * positionLerp;

    // LookAt interpolation - VERY responsive for lively feel
    const lookAtLerp = 1 - Math.pow(0.000001, delta);
    currentLookAt.current.x += (targetLookAt.current.x - currentLookAt.current.x) * lookAtLerp;
    currentLookAt.current.y += (targetLookAt.current.y - currentLookAt.current.y) * lookAtLerp;
    currentLookAt.current.z += (targetLookAt.current.z - currentLookAt.current.z) * lookAtLerp;

    // Breathing animation
    breathPhase.current += delta * 2;
    const breathScale = 1 + Math.sin(breathPhase.current) * 0.02;

    // Set position with floating animation
    const time = Date.now() * 0.001;
    const floatY = Math.sin(time * 1.5) * 0.08;
    const floatX = Math.cos(time * 1.2) * 0.03;
    
    groupRef.current.position.set(
      currentPosition.current.x + floatX,
      currentPosition.current.y + floatY,
      currentPosition.current.z
    );

    // Scale with breathing
    groupRef.current.scale.setScalar(0.32 * breathScale);

    // Make Gopher look at cursor with FAST response
    const gopherPos = groupRef.current.position.clone();
    
    const targetQuaternion = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const matrix = new THREE.Matrix4();
    matrix.lookAt(gopherPos, currentLookAt.current, up);
    targetQuaternion.setFromRotationMatrix(matrix);
    
    // Base rotation so Gopher faces camera
    const baseRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    targetQuaternion.multiply(baseRotation);
    
    // VERY fast slerp (0.25) for super responsive gaze
    groupRef.current.quaternion.slerp(targetQuaternion, 0.25);
    
    // Add subtle body sway - makes it feel alive
    const swayX = Math.sin(time * 0.8) * 0.04;
    const swayZ = Math.cos(time * 0.6) * 0.03;
    groupRef.current.rotation.x += swayX * delta * 2;
    groupRef.current.rotation.z += swayZ * delta * 2;
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef} scale={0.32}>
      <primitive object={clonedScene} />
    </group>
  );
}

function CameraController({ mousePosition }: { mousePosition: MousePosition }) {
  const { camera } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // Camera subtly follows mouse for parallax effect
    const mouseInfluenceX = (mousePosition.normalizedX - 0.5) * 2;
    const mouseInfluenceY = (mousePosition.normalizedY - 0.5) * 2;

    targetRotation.current.x = -mouseInfluenceY * 0.015;
    targetRotation.current.y = mouseInfluenceX * 0.015;

    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.03;
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.03;
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse tracking - responsive
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setInternalMouse({
        normalizedX: e.clientX / window.innerWidth,
        normalizedY: e.clientY / window.innerHeight,
      });
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

  if (!mounted) return null;

  const effectiveMouse = mousePosition || internalMouse;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-40 pointer-events-none"
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
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />
            <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#C9673A" />
            <pointLight position={[0, 5, 0]} intensity={0.5} color="#00D4AA" />
            
            <CameraController mousePosition={effectiveMouse} />

            <Suspense fallback={null}>
              <GopherModel 
                scrollProgress={scrollProgress} 
                isVisible={isVisible}
                mousePosition={effectiveMouse}
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
