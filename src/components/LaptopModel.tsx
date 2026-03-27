import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LaptopModelProps {
  scrollProgress: number;
  lidOpenProgress: number;
}

export const LaptopModel = ({ scrollProgress, lidOpenProgress }: LaptopModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const screenLightRef = useRef<THREE.PointLight>(null);
  const ambientGlowRef = useRef<THREE.PointLight>(null);

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a0a12",
        metalness: 0.9,
        roughness: 0.15,
      }),
    []
  );

  const screenMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000",
        emissive: "#000000",
        emissiveIntensity: 0,
        metalness: 0.1,
        roughness: 0.05,
      }),
    []
  );

  const keyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#050508",
        metalness: 0.4,
        roughness: 0.5,
      }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    // Screen glow reacts to lid opening
    const screenGlow = lidOpenProgress > 0.5 ? (lidOpenProgress - 0.5) * 2 : 0;
    screenMaterial.emissive.setHex(screenGlow > 0 ? 0x1a0a2e : 0x000000);
    screenMaterial.emissiveIntensity = screenGlow * 0.4;

    if (screenLightRef.current) {
      screenLightRef.current.intensity = screenGlow * 2.5;
    }

    // Ambient purple glow behind laptop
    if (ambientGlowRef.current) {
      ambientGlowRef.current.intensity =
        0.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.15 + screenGlow * 1.5;
    }

    // Camera zoom on scroll
    const zoomProgress = Math.min(scrollProgress * 2, 1);
    const targetZ = THREE.MathUtils.lerp(5.5, 1.2, zoomProgress);
    const targetY = THREE.MathUtils.lerp(1.8, 2.0, zoomProgress);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.06);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.06);
    state.camera.lookAt(0, 1.2, 0);

    // Subtle idle sway
    if (scrollProgress < 0.03) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.03;
    } else {
      groupRef.current.rotation.y *= 0.95;
    }
  });

  // Lid angle: 0 = closed (flat), +1.85 = ~106 degrees open (screen faces viewer)
  const lidAngle = 1.85 * lidOpenProgress;

  // Keyboard LED positions
  const keyLEDs = useMemo(() => {
    const leds: { x: number; z: number; color: string }[] = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 12; col++) {
        const hue = (col / 12 + row * 0.1) % 1;
        const color = `hsl(${hue * 360}, 80%, 50%)`;
        leds.push({
          x: -1.1 + col * 0.2,
          z: -0.6 + row * 0.28,
          color,
        });
      }
    }
    return leds;
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.08, 0, 0]}>
      {/* Ambient purple glow behind laptop */}
      <pointLight
        ref={ambientGlowRef}
        position={[0, 1.5, -2.5]}
        color="#7c3aed"
        intensity={0.5}
        distance={10}
      />

      {/* Base / Bottom chassis */}
      <mesh material={bodyMaterial} position={[0, 0.04, 0]}>
        <boxGeometry args={[3.2, 0.08, 2.1]} />
      </mesh>

      {/* Bottom edge bevel */}
      <mesh material={bodyMaterial} position={[0, 0, 0]}>
        <boxGeometry args={[3.3, 0.02, 2.2]} />
      </mesh>

      {/* Keyboard well */}
      <mesh material={keyMaterial} position={[0, 0.09, -0.15]}>
        <boxGeometry args={[2.8, 0.015, 1.5]} />
      </mesh>

      {/* Individual key LEDs (RGB backlight) */}
      {lidOpenProgress > 0.3 &&
        keyLEDs.map((led, i) => (
          <mesh key={i} position={[led.x, 0.1, led.z]}>
            <boxGeometry args={[0.14, 0.005, 0.18]} />
            <meshStandardMaterial
              color="#0a0a12"
              emissive={led.color}
              emissiveIntensity={lidOpenProgress * 0.4}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}

      {/* Trackpad */}
      <mesh position={[0, 0.09, 0.55]}>
        <boxGeometry args={[0.9, 0.008, 0.55]} />
        <meshStandardMaterial color="#0c0c18" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Front edge indicator LED */}
      <mesh position={[0, 0.02, 1.05]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial
          color="#000"
          emissive="#3b82f6"
          emissiveIntensity={lidOpenProgress > 0.1 ? 2 : 0}
        />
      </mesh>

      {/* Red indicator LED (left side, like reference) */}
      <mesh position={[-1.2, 0.1, 0.2]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color="#000"
          emissive="#ef4444"
          emissiveIntensity={lidOpenProgress > 0.1 ? 3 : 0}
        />
      </mesh>

      {/* Hinge area - at the BACK of the laptop */}
      <group position={[0, 0.08, -1.0]}>
        {/* Hinge cylinders */}
        <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
          <meshStandardMaterial color="#0a0a12" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
          <meshStandardMaterial color="#0a0a12" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Lid - rotates from hinge. Positive X rotation swings -Z upward */}
        <group rotation={[lidAngle, 0, 0]}>
          {/* Lid panel (exterior back) */}
          <mesh material={bodyMaterial} position={[0, -0.03, -1.1]}>
            <boxGeometry args={[3.2, 0.06, 2.2]} />
          </mesh>

          {/* Screen bezel (inner frame) */}
          <mesh position={[0, 0.005, -1.1]}>
            <boxGeometry args={[3.0, 0.01, 2.05]} />
            <meshStandardMaterial color="#050508" metalness={0.3} roughness={0.6} />
          </mesh>

          {/* Screen surface (inner face, facing +Y = toward viewer when open) */}
          <mesh material={screenMaterial} position={[0, 0.012, -1.1]}>
            <boxGeometry args={[2.75, 0.005, 1.75]} />
          </mesh>

          {/* Screen glow light (shines forward from screen) */}
          <pointLight
            ref={screenLightRef}
            position={[0, 0.3, -1.1]}
            color="#a855f7"
            intensity={0}
            distance={4}
          />

          {/* Camera dot (top center of screen bezel) */}
          <mesh position={[0, 0.005, -0.18]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial
              color="#000"
              emissive="#ef4444"
              emissiveIntensity={lidOpenProgress > 0.8 ? 1.5 : 0}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
