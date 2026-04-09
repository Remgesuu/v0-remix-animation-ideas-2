"use client";

import { useRef, useEffect, useState, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

interface MousePosition {
  normalizedX: number;
  normalizedY: number;
}

interface GopherModelProps {
  isVisible: boolean;
  mousePosition: MousePosition;
  isDragging: boolean;
  dragPosition: { x: number; y: number } | null;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function GopherModel({ 
  isVisible, 
  mousePosition, 
  isDragging,
  dragPosition,
  onDragStart,
  onDragEnd
}: GopherModelProps) {
  const { scene } = useGLTF("/models/go_gopher.glb");
  const groupRef = useRef<THREE.Group>(null);
  const hitboxRef = useRef<THREE.Mesh>(null);
  const { viewport, camera } = useThree();

  const clonedScene = scene.clone();

  // Position refs - start in bottom right corner
  const basePosition = useRef({ x: viewport.width * 0.35, y: -viewport.height * 0.25, z: 0 });
  const currentPosition = useRef({ x: viewport.width * 0.35, y: -viewport.height * 0.25, z: 0 });
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 5));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 5));
  const breathPhase = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  // Update base position when dragging ends
  useEffect(() => {
    if (!isDragging && dragPosition) {
      // Convert screen position to 3D world position
      const x = (dragPosition.x / window.innerWidth - 0.5) * viewport.width;
      const y = -(dragPosition.y / window.innerHeight - 0.5) * viewport.height;
      basePosition.current = { x, y, z: 0 };
    }
  }, [isDragging, dragPosition, viewport]);

  useEffect(() => {
    // Gopher ALWAYS looks at cursor
    const cursorX = (mousePosition.normalizedX - 0.5) * viewport.width * 2;
    const cursorY = -(mousePosition.normalizedY - 0.5) * viewport.height * 2;
    targetLookAt.current.set(cursorX, cursorY, 8);
  }, [viewport.width, viewport.height, mousePosition]);

  useFrame((_, delta) => {
    if (!groupRef.current || !isVisible) return;

    // Target position - either dragged or base position
    let targetX = basePosition.current.x;
    let targetY = basePosition.current.y;

    if (isDragging && dragPosition) {
      targetX = (dragPosition.x / window.innerWidth - 0.5) * viewport.width;
      targetY = -(dragPosition.y / window.innerHeight - 0.5) * viewport.height;
    }

    // Position interpolation - faster when dragging
    const positionLerp = isDragging ? 0.3 : 0.08;
    
    currentPosition.current.x += (targetX - currentPosition.current.x) * positionLerp;
    currentPosition.current.y += (targetY - currentPosition.current.y) * positionLerp;

    // LookAt interpolation - SUPER responsive
    const lookAtLerp = 0.15;
    currentLookAt.current.x += (targetLookAt.current.x - currentLookAt.current.x) * lookAtLerp;
    currentLookAt.current.y += (targetLookAt.current.y - currentLookAt.current.y) * lookAtLerp;

    // Breathing animation
    breathPhase.current += delta * 2.5;
    const breathScale = 1 + Math.sin(breathPhase.current) * 0.025;

    // Floating animation (subtle when not dragging)
    const time = Date.now() * 0.001;
    const floatY = isDragging ? 0 : Math.sin(time * 1.8) * 0.06;
    const floatX = isDragging ? 0 : Math.cos(time * 1.3) * 0.025;
    
    groupRef.current.position.set(
      currentPosition.current.x + floatX,
      currentPosition.current.y + floatY,
      currentPosition.current.z
    );

    // Update hitbox position
    if (hitboxRef.current) {
      hitboxRef.current.position.copy(groupRef.current.position);
    }

    // Scale with breathing + excitement when hovered/dragged
    const excitementScale = isHovered || isDragging ? 1.05 : 1;
    groupRef.current.scale.setScalar(0.35 * breathScale * excitementScale);

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
    
    // VERY fast slerp for responsive gaze
    const slerpSpeed = isDragging ? 0.4 : 0.2;
    groupRef.current.quaternion.slerp(targetQuaternion, slerpSpeed);
    
    // Body sway - more when excited
    const swayIntensity = isHovered || isDragging ? 1.5 : 1;
    const swayX = Math.sin(time * 1.2) * 0.03 * swayIntensity;
    const swayZ = Math.cos(time * 0.9) * 0.025 * swayIntensity;
    groupRef.current.rotation.x += swayX * delta * 2;
    groupRef.current.rotation.z += swayZ * delta * 2;
  });

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onDragStart();
  }, [onDragStart]);

  const handlePointerOver = useCallback(() => {
    setIsHovered(true);
    document.body.style.cursor = 'grab';
  }, []);

  const handlePointerOut = useCallback(() => {
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Invisible hitbox for easier clicking */}
      <mesh
        ref={hitboxRef}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        visible={false}
      >
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <group ref={groupRef} scale={0.35}>
        <primitive object={clonedScene} />
      </group>
    </>
  );
}

function CameraController({ mousePosition }: { mousePosition: MousePosition }) {
  const { camera } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // Camera subtly follows mouse for parallax effect
    const mouseInfluenceX = (mousePosition.normalizedX - 0.5) * 2;
    const mouseInfluenceY = (mousePosition.normalizedY - 0.5) * 2;

    targetRotation.current.x = -mouseInfluenceY * 0.012;
    targetRotation.current.y = mouseInfluenceX * 0.012;

    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.025;
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.025;
  });

  return null;
}

interface FlyingGopherProps {
  isVisible: boolean;
  mousePosition?: MousePosition;
}

export function FlyingGopher({ isVisible, mousePosition }: FlyingGopherProps) {
  const [mounted, setMounted] = useState(false);
  const [internalMouse, setInternalMouse] = useState({ normalizedX: 0.5, normalizedY: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setInternalMouse({
        normalizedX: e.clientX / window.innerWidth,
        normalizedY: e.clientY / window.innerHeight,
      });
      
      // Update drag position if dragging
      if (isDragging) {
        setDragPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.cursor = 'auto';
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    document.body.style.cursor = 'grabbing';
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = 'auto';
  }, []);

  if (!mounted) return null;

  const effectiveMouse = mousePosition || internalMouse;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-40"
          style={{ pointerEvents: isDragging ? 'auto' : 'none' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent", pointerEvents: 'auto' }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />
            <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#C9673A" />
            <pointLight position={[0, 5, 0]} intensity={0.5} color="#00D4AA" />
            
            <CameraController mousePosition={effectiveMouse} />

            <Suspense fallback={null}>
              <GopherModel 
                isVisible={isVisible}
                mousePosition={effectiveMouse}
                isDragging={isDragging}
                dragPosition={dragPosition}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
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
