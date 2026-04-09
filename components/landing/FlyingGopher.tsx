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
  const { viewport, camera } = useThree();

  const clonedScene = scene.clone();

  // Start position in bottom-right corner
  const targetPosition = useRef({ x: 2, y: -1.5, z: 0 });
  const currentPosition = useRef({ x: 3, y: -1.5, z: 0 });
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 5));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 5));

  useEffect(() => {
    const normalizedScroll = scrollProgress;

    // Mouse influence (-1 to 1)
    const mouseInfluenceX = (mousePosition.normalizedX - 0.5) * 2;
    const mouseInfluenceY = (mousePosition.normalizedY - 0.5) * 2;

    // Gentler scroll oscillation - Gopher stays near edges
    const xOscillation = Math.sin(normalizedScroll * Math.PI * 2) * 0.8;
    const yOscillation = Math.sin(normalizedScroll * Math.PI * 3) * 0.6;
    
    // Keep Gopher in bottom-right quadrant
    const maxX = viewport.width * 0.35;
    const minX = viewport.width * 0.15;
    const baseX = minX + (maxX - minX) * (0.5 + xOscillation * 0.3);
    const baseY = -viewport.height * 0.2 + yOscillation * 0.4;
    
    // Clamp to viewport bounds
    const boundedX = Math.max(1.5, Math.min(baseX + mouseInfluenceX * 0.3, viewport.width * 0.4));
    const boundedY = Math.max(-viewport.height * 0.35, Math.min(baseY + mouseInfluenceY * 0.2, viewport.height * 0.25));

    targetPosition.current = {
      x: boundedX,
      y: boundedY,
      z: -1.5,
    };

    // Calculate 3D point where Gopher should look (cursor position in 3D space)
    // Convert normalized mouse to viewport coordinates
    const cursorX = (mousePosition.normalizedX - 0.5) * viewport.width;
    const cursorY = -(mousePosition.normalizedY - 0.5) * viewport.height;
    
    // The "look at" point is in front of Gopher, towards the cursor
    targetLookAt.current.set(cursorX, cursorY, 5);
  }, [scrollProgress, viewport.width, viewport.height, mousePosition]);

  useFrame((_, delta) => {
    if (!groupRef.current || !isVisible) return;

    // Position interpolation (slower, smooth movement)
    const positionLerp = 1 - Math.pow(0.001, delta);
    currentPosition.current.x += (targetPosition.current.x - currentPosition.current.x) * positionLerp;
    currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * positionLerp;
    currentPosition.current.z += (targetPosition.current.z - currentPosition.current.z) * positionLerp;

    // LookAt interpolation (faster, responsive gaze)
    const lookAtLerp = 1 - Math.pow(0.0001, delta);
    currentLookAt.current.x += (targetLookAt.current.x - currentLookAt.current.x) * lookAtLerp;
    currentLookAt.current.y += (targetLookAt.current.y - currentLookAt.current.y) * lookAtLerp;
    currentLookAt.current.z += (targetLookAt.current.z - currentLookAt.current.z) * lookAtLerp;

    // Set position
    groupRef.current.position.set(
      currentPosition.current.x,
      currentPosition.current.y,
      currentPosition.current.z
    );

    // Make Gopher look at cursor position
    // Create a temporary object to calculate lookAt rotation
    const gopherPos = groupRef.current.position.clone();
    const lookDirection = currentLookAt.current.clone().sub(gopherPos).normalize();
    
    // Calculate rotation to face the cursor
    // Gopher's default forward is -Z, so we need to adjust
    const targetQuaternion = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const matrix = new THREE.Matrix4();
    matrix.lookAt(gopherPos, currentLookAt.current, up);
    targetQuaternion.setFromRotationMatrix(matrix);
    
    // Add a base rotation so Gopher faces more towards camera
    const baseRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    targetQuaternion.multiply(baseRotation);
    
    // Smoothly interpolate rotation
    groupRef.current.quaternion.slerp(targetQuaternion, lookAtLerp * 0.5);
  });

  if (!isVisible) return null;

  return (
    <Float
      speed={2}
      rotationIntensity={0.15}
      floatIntensity={0.3}
      floatingRange={[-0.05, 0.05]}
    >
      <group ref={groupRef} scale={0.4}>
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
