"use client";

import { useRef, useEffect, useState, Suspense, useCallback } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import * as THREE from "three";
import { X, GripVertical } from "lucide-react";

interface MousePosition {
  normalizedX: number;
  normalizedY: number;
}

interface GopherModelProps {
  isVisible: boolean;
  mousePosition: MousePosition;
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  onDragStart: (offsetX: number, offsetY: number) => void;
  onDragEnd: () => void;
}

// Container size for the floating Canvas viewport
const VIEWPORT_SIZE = 280;
const VIEWPORT_HALF = VIEWPORT_SIZE / 2;

function GopherModel({ 
  isVisible, 
  mousePosition, 
  isDragging,
  dragOffset,
  onDragStart,
  onDragEnd
}: GopherModelProps) {
  const { scene } = useGLTF("/models/go_gopher.glb");
  const groupRef = useRef<THREE.Group>(null);
  const hitboxRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const clonedScene = scene.clone();

  const breathPhase = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Target look direction based on mouse
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 5));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 5));

  useEffect(() => {
    // Calculate where cursor is relative to viewport center
    const cursorX = (mousePosition.normalizedX - 0.5) * 10;
    const cursorY = -(mousePosition.normalizedY - 0.5) * 10;
    targetLookAt.current.set(cursorX, cursorY, 8);
  }, [mousePosition]);

  useFrame((_, delta) => {
    if (!groupRef.current || !isVisible) return;

    // Gopher stays centered in the small viewport
    const targetX = 0;
    const targetY = 0;

    // LookAt interpolation - responsive gaze tracking
    const lookAtLerp = 0.15;
    currentLookAt.current.x += (targetLookAt.current.x - currentLookAt.current.x) * lookAtLerp;
    currentLookAt.current.y += (targetLookAt.current.y - currentLookAt.current.y) * lookAtLerp;

    // Breathing animation
    breathPhase.current += delta * 2.5;
    const breathScale = 1 + Math.sin(breathPhase.current) * 0.025;

    // Floating animation (subtle when not dragging)
    const time = Date.now() * 0.001;
    const floatY = isDragging ? 0 : Math.sin(time * 1.8) * 0.08;
    const floatX = isDragging ? 0 : Math.cos(time * 1.3) * 0.04;
    
    groupRef.current.position.set(targetX + floatX, targetY + floatY, 0);

    // Update hitbox position
    if (hitboxRef.current) {
      hitboxRef.current.position.copy(groupRef.current.position);
    }

    // Scale with breathing + excitement when hovered/dragged
    const excitementScale = isHovered || isDragging ? 1.08 : 1;
    groupRef.current.scale.setScalar(0.45 * breathScale * excitementScale);

    // Make Gopher look at cursor direction
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
    // Calculate offset from center of the viewport to where user clicked
    const offsetX = e.nativeEvent.clientX - (e.nativeEvent.clientX);
    const offsetY = e.nativeEvent.clientY - (e.nativeEvent.clientY);
    onDragStart(offsetX, offsetY);
  }, [onDragStart]);

  const handlePointerOver = useCallback(() => {
    setIsHovered(true);
    document.body.style.cursor = 'grab';
  }, []);

  const handlePointerOut = useCallback(() => {
    setIsHovered(false);
    if (!isDragging) {
      document.body.style.cursor = 'auto';
    }
  }, [isDragging]);

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
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <group ref={groupRef} scale={0.45}>
        <primitive object={clonedScene} />
      </group>
    </>
  );
}

interface FlyingGopherProps {
  isVisible: boolean;
  mousePosition?: MousePosition;
  onClose?: () => void;
}

export function FlyingGopher({ isVisible, mousePosition, onClose }: FlyingGopherProps) {
  const [mounted, setMounted] = useState(false);
  const [internalMouse, setInternalMouse] = useState({ normalizedX: 0.5, normalizedY: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Spring-animated position for smooth following
  const springConfig = { stiffness: 120, damping: 20, mass: 0.8 };
  const containerX = useSpring(0, springConfig);
  const containerY = useSpring(0, springConfig);
  
  // Base position (where gopher "lives" when not following cursor)
  const basePosition = useRef({ x: 0, y: 0 });
  
  // Mobile drag handle position
  const [mobilePosition, setMobilePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    
    // Set initial position to bottom right
    const initialX = window.innerWidth - VIEWPORT_SIZE - 20;
    const initialY = window.innerHeight - VIEWPORT_SIZE - 100;
    basePosition.current = { x: initialX, y: initialY };
    containerX.set(initialX);
    containerY.set(initialY);
    
    setMobilePosition({ 
      x: window.innerWidth - 120, 
      y: window.innerHeight - 180 
    });
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [containerX, containerY]);

  // Mouse/touch tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setInternalMouse({
        normalizedX: e.clientX / window.innerWidth,
        normalizedY: e.clientY / window.innerHeight,
      });
      
      if (isDragging && !isMobile) {
        // When dragging, viewport follows cursor directly
        const newX = e.clientX - VIEWPORT_HALF + dragOffset.x;
        const newY = e.clientY - VIEWPORT_HALF + dragOffset.y;
        containerX.set(newX);
        containerY.set(newY);
        basePosition.current = { x: newX, y: newY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && isMobile && e.touches[0]) {
        const touch = e.touches[0];
        setMobilePosition({
          x: Math.max(60, Math.min(window.innerWidth - 60, touch.clientX)),
          y: Math.max(60, Math.min(window.innerHeight - 60, touch.clientY)),
        });
        setInternalMouse({
          normalizedX: touch.clientX / window.innerWidth,
          normalizedY: touch.clientY / window.innerHeight,
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.cursor = 'auto';
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, isMobile, dragOffset, containerX, containerY]);

  const handleDragStart = useCallback((offsetX: number, offsetY: number) => {
    setIsDragging(true);
    setDragOffset({ x: offsetX, y: offsetY });
    if (!isMobile) {
      document.body.style.cursor = 'grabbing';
    }
  }, [isMobile]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = 'auto';
  }, []);

  const handleMobileTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    if (e.touches[0]) {
      setMobilePosition({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  }, []);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      setIsMinimized(true);
    }
  }, [onClose]);

  const handleRestore = useCallback(() => {
    setIsMinimized(false);
  }, []);

  if (!mounted) return null;

  const effectiveMouse = mousePosition || internalMouse;

  // Show minimized button when hidden
  if (isMinimized) {
    return (
      <motion.button
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-[#00ADD8] rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        onClick={handleRestore}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        aria-label="Show Gopher"
      >
        <span className="text-2xl">🐹</span>
      </motion.button>
    );
  }

  // Mobile version with draggable container
  if (isMobile) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{ 
              left: mobilePosition.x - 60, 
              top: mobilePosition.y - 60,
              width: 120,
              height: 120,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute -top-2 -right-2 z-10 w-7 h-7 bg-card border border-border rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform pointer-events-auto"
              aria-label="Hide Gopher"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Drag handle */}
            <div
              onTouchStart={handleMobileTouchStart}
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 w-12 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-md pointer-events-auto ${
                isDragging ? 'bg-primary/20 border-primary' : ''
              }`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Gopher Canvas */}
            <div className="w-full h-full overflow-visible pointer-events-auto">
              <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
              >
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1.2} />
                <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#C9673A" />
                <pointLight position={[0, 5, 0]} intensity={0.5} color="#00D4AA" />

                <Suspense fallback={null}>
                  <MobileGopherModel mousePosition={effectiveMouse} />
                  <Environment preset="city" />
                </Suspense>
              </Canvas>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop version - Small viewport that follows cursor
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Close button - positioned independently */}
          <motion.button
            onClick={handleClose}
            className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-card border border-border rounded-lg flex items-center gap-2 shadow-md hover:bg-muted transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            aria-label="Hide Gopher"
          >
            <X className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Скрыть Gopher</span>
          </motion.button>

          {/* Floating viewport container - only covers a small area */}
          <motion.div
            className="fixed z-40 pointer-events-none"
            style={{ 
              x: containerX,
              y: containerY,
              width: VIEWPORT_SIZE,
              height: VIEWPORT_SIZE,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              style={{ 
                background: "transparent", 
                pointerEvents: 'auto',
                borderRadius: '50%',
              }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1.2} />
              <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#C9673A" />
              <pointLight position={[0, 5, 0]} intensity={0.5} color="#00D4AA" />

              <Suspense fallback={null}>
                <GopherModel 
                  isVisible={isVisible}
                  mousePosition={effectiveMouse}
                  isDragging={isDragging}
                  dragOffset={dragOffset}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
                <Environment preset="city" />
              </Suspense>
            </Canvas>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Simplified mobile gopher that stays centered in its container
function MobileGopherModel({ mousePosition }: { mousePosition: MousePosition }) {
  const { scene } = useGLTF("/models/go_gopher.glb");
  const groupRef = useRef<THREE.Group>(null);
  const breathPhase = useRef(0);

  const clonedScene = scene.clone();

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Breathing animation
    breathPhase.current += delta * 2.5;
    const breathScale = 1 + Math.sin(breathPhase.current) * 0.025;

    groupRef.current.scale.setScalar(0.6 * breathScale);

    // Look toward cursor direction
    const targetX = (mousePosition.normalizedX - 0.5) * 0.5;
    const targetY = -(mousePosition.normalizedY - 0.5) * 0.3;
    
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.1;
    groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.1;

    // Subtle floating
    const time = Date.now() * 0.001;
    groupRef.current.position.y = Math.sin(time * 1.8) * 0.05;
  });

  return (
    <group ref={groupRef} scale={0.6} position={[0, 0, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/models/go_gopher.glb");
