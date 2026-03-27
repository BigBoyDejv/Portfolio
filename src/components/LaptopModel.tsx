import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LaptopModelProps {
  scrollProgress: number;
  isBooted: boolean;
}

export const LaptopModel = ({ scrollProgress, isBooted }: LaptopModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const screenLightRef = useRef<THREE.PointLight>(null);

  const screenMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isBooted ? "#1a0a2e" : "#000000",
        emissive: isBooted ? "#7c3aed" : "#000000",
        emissiveIntensity: isBooted ? 0.3 : 0,
        metalness: 0.1,
        roughness: 0.2,
      }),
    [isBooted]
  );

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1a2e",
        metalness: 0.8,
        roughness: 0.2,
      }),
    []
  );

  const keyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0f0f1a",
        metalness: 0.5,
        roughness: 0.4,
      }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    // Smooth zoom: camera moves toward laptop screen
    const zoomZ = THREE.MathUtils.lerp(6, 0.8, Math.min(scrollProgress * 1.5, 1));
    const zoomY = THREE.MathUtils.lerp(2, 1.65, Math.min(scrollProgress * 1.5, 1));
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, zoomZ, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, zoomY, 0.05);
    state.camera.lookAt(0, 1.2, 0);

    // Subtle idle animation when not scrolled
    if (scrollProgress < 0.05) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }

    // Screen glow
    if (screenLightRef.current) {
      screenLightRef.current.intensity = isBooted
        ? 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2
        : 0;
    }
  });

  // Lid angle: open at ~110 degrees
  const lidAngle = -1.92; // ~110 degrees open

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
      {/* Base / Bottom */}
      <mesh material={bodyMaterial} position={[0, 0.05, 0]}>
        <boxGeometry args={[3, 0.1, 2]} />
      </mesh>

      {/* Keyboard area */}
      <mesh material={keyMaterial} position={[0, 0.11, -0.1]}>
        <boxGeometry args={[2.6, 0.02, 1.4]} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0.115, 0.5]}>
        <boxGeometry args={[0.8, 0.01, 0.5]} />
        <meshStandardMaterial color="#151525" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Hinge */}
      <group position={[0, 0.1, -1]}>
        {/* Lid - rotates from hinge */}
        <group rotation={[lidAngle, 0, 0]}>
          {/* Screen back (lid exterior) */}
          <mesh material={bodyMaterial} position={[0, 0, -1.05]}>
            <boxGeometry args={[3, 0.08, 2.1]} />
          </mesh>

          {/* Screen surface */}
          <mesh material={screenMaterial} position={[0, -0.045, -1.05]}>
            <boxGeometry args={[2.7, 0.01, 1.8]} />
          </mesh>

          {/* Screen glow light */}
          <pointLight
            ref={screenLightRef}
            position={[0, -0.2, -1]}
            color="#a855f7"
            intensity={0}
            distance={3}
          />

          {/* Screen bezel */}
          {isBooted && (
            <mesh position={[0, -0.05, -1.05]}>
              <boxGeometry args={[2.65, 0.005, 1.75]} />
              <meshStandardMaterial
                color="#0a0015"
                emissive="#7c3aed"
                emissiveIntensity={0.15}
                transparent
                opacity={0.9}
              />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
};
