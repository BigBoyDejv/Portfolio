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

  // Premium anodized aluminum material
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#0d0d16",
        metalness: 0.95,
        roughness: 0.12,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2,
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
        roughness: 0.02,
      }),
    []
  );

  // Clear polycarbonate key material
  const keycapMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#0a0a14",
        metalness: 0.1,
        roughness: 0.3,
        transmission: 0.15,
        thickness: 0.5,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
      }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    const screenGlow = lidOpenProgress > 0.5 ? (lidOpenProgress - 0.5) * 2 : 0;
    screenMaterial.emissive.setHex(screenGlow > 0 ? 0x1a0a2e : 0x000000);
    screenMaterial.emissiveIntensity = screenGlow * 0.6;

    if (screenLightRef.current) {
      screenLightRef.current.intensity = screenGlow * 3;
    }

    if (ambientGlowRef.current) {
      ambientGlowRef.current.intensity =
        0.6 + Math.sin(state.clock.elapsedTime * 0.8) * 0.2 + screenGlow * 2;
    }

    // Camera position - stays relatively static, no extreme zoom
    const targetZ = THREE.MathUtils.lerp(5.5, 4.5, Math.min(scrollProgress * 3, 1));
    const targetY = THREE.MathUtils.lerp(2.5, 2.2, Math.min(scrollProgress * 3, 1));
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.06);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.06);
    state.camera.lookAt(0, 1.0, 0);

    // Subtle idle sway
    if (scrollProgress < 0.03) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.02;
    } else {
      groupRef.current.rotation.y *= 0.95;
    }
  });

  const lidAngle = 1.85 * lidOpenProgress;

  // RGB keyboard - individual clear mechanical keys
  const keyRows = useMemo(() => {
    const keys: { x: number; z: number; w: number; h: number; color: string }[] = [];
    const rowConfigs = [
      { cols: 14, z: -0.7, h: 0.16 },
      { cols: 13, z: -0.45, h: 0.18 },
      { cols: 12, z: -0.2, h: 0.18 },
      { cols: 11, z: 0.05, h: 0.18 },
      { cols: 8, z: 0.3, h: 0.18 },
    ];

    rowConfigs.forEach((row, rowIdx) => {
      const totalWidth = 2.4;
      const keyWidth = totalWidth / row.cols - 0.03;
      const startX = -totalWidth / 2 + keyWidth / 2;

      for (let col = 0; col < row.cols; col++) {
        const t = col / row.cols;
        const rowHueOffset = rowIdx * 25;
        const hue = (t * 280 + rowHueOffset) % 360;
        const saturation = 85 + Math.sin(t * Math.PI) * 15;
        keys.push({
          x: startX + col * (totalWidth / row.cols),
          z: row.z,
          w: keyWidth,
          h: row.h,
          color: `hsl(${hue}, ${saturation}%, 55%)`,
        });
      }
    });
    return keys;
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
      {/* Ambient purple glow behind */}
      <pointLight
        ref={ambientGlowRef}
        position={[0, 1.5, -3]}
        color="#7c3aed"
        intensity={0.6}
        distance={12}
      />

      {/* Base chassis - premium aluminum */}
      <mesh material={bodyMaterial} position={[0, 0.035, 0]}>
        <boxGeometry args={[3.3, 0.07, 2.2]} />
      </mesh>

      {/* Chamfered edge strip */}
      <mesh position={[0, 0.005, 0]}>
        <boxGeometry args={[3.35, 0.01, 2.25]} />
        <meshPhysicalMaterial color="#0f0f1a" metalness={0.98} roughness={0.08} clearcoat={0.5} />
      </mesh>

      {/* Keyboard well - recessed area */}
      <mesh position={[0, 0.075, -0.15]}>
        <boxGeometry args={[2.7, 0.008, 1.6]} />
        <meshStandardMaterial color="#060610" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Individual clear mechanical keys with RGB backlighting */}
      {lidOpenProgress > 0.3 &&
        keyRows.map((key, i) => (
          <group key={i} position={[key.x, 0.085, key.z]}>
            {/* Key stem glow (underneath) */}
            <mesh position={[0, -0.005, 0]}>
              <boxGeometry args={[key.w * 0.7, 0.003, key.h * 0.7]} />
              <meshStandardMaterial
                color="#000"
                emissive={key.color}
                emissiveIntensity={lidOpenProgress * 1.2}
                transparent
                opacity={0.9}
              />
            </mesh>
            {/* Clear keycap */}
            <mesh position={[0, 0.008, 0]} material={keycapMaterial}>
              <boxGeometry args={[key.w, 0.016, key.h]} />
            </mesh>
            {/* Top surface light bleed */}
            <mesh position={[0, 0.017, 0]}>
              <boxGeometry args={[key.w * 0.5, 0.002, key.h * 0.5]} />
              <meshStandardMaterial
                color="#000"
                emissive={key.color}
                emissiveIntensity={lidOpenProgress * 0.5}
                transparent
                opacity={0.4}
              />
            </mesh>
          </group>
        ))}

      {/* Trackpad - glass surface */}
      <mesh position={[0, 0.075, 0.6]}>
        <boxGeometry args={[1.0, 0.005, 0.6]} />
        <meshPhysicalMaterial
          color="#0a0a16"
          metalness={0.8}
          roughness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Cyan indicator LED - left palm rest */}
      <mesh position={[-1.3, 0.08, 0.3]}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshStandardMaterial
          color="#000"
          emissive="#06b6d4"
          emissiveIntensity={lidOpenProgress > 0.1 ? 3 : 0}
        />
      </mesh>
      {/* Cyan LED glow */}
      {lidOpenProgress > 0.1 && (
        <pointLight position={[-1.3, 0.12, 0.3]} color="#06b6d4" intensity={0.3} distance={1} />
      )}

      {/* Hinge area */}
      <group position={[0, 0.07, -1.05]}>
        {/* Hinge cylinders */}
        <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.18, 12]} />
          <meshPhysicalMaterial color="#0a0a14" metalness={0.95} roughness={0.08} />
        </mesh>
        <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.18, 12]} />
          <meshPhysicalMaterial color="#0a0a14" metalness={0.95} roughness={0.08} />
        </mesh>

        {/* Lid */}
        <group rotation={[lidAngle, 0, 0]}>
          {/* Lid back panel */}
          <mesh material={bodyMaterial} position={[0, -0.03, -1.15]}>
            <boxGeometry args={[3.3, 0.05, 2.3]} />
          </mesh>

          {/* Screen bezel */}
          <mesh position={[0, 0.003, -1.15]}>
            <boxGeometry args={[3.1, 0.008, 2.15]} />
            <meshStandardMaterial color="#040408" metalness={0.4} roughness={0.5} />
          </mesh>

          {/* Screen surface */}
          <mesh material={screenMaterial} position={[0, 0.01, -1.15]}>
            <boxGeometry args={[2.85, 0.004, 1.85]} />
          </mesh>

          {/* Screen glow light */}
          <pointLight
            ref={screenLightRef}
            position={[0, 0.4, -1.15]}
            color="#a855f7"
            intensity={0}
            distance={5}
          />

          {/* Red camera indicator - top center bezel */}
          <mesh position={[0, 0.005, -0.2]}>
            <sphereGeometry args={[0.015, 12, 12]} />
            <meshStandardMaterial
              color="#000"
              emissive="#ef4444"
              emissiveIntensity={lidOpenProgress > 0.8 ? 2.5 : 0}
            />
          </mesh>

          {/* Twin purple indicators - bottom bezel */}
          <mesh position={[-0.06, 0.005, -2.08]}>
            <sphereGeometry args={[0.012, 12, 12]} />
            <meshStandardMaterial
              color="#000"
              emissive="#8b5cf6"
              emissiveIntensity={lidOpenProgress > 0.6 ? 2.5 : 0}
            />
          </mesh>
          <mesh position={[0.06, 0.005, -2.08]}>
            <sphereGeometry args={[0.012, 12, 12]} />
            <meshStandardMaterial
              color="#000"
              emissive="#8b5cf6"
              emissiveIntensity={lidOpenProgress > 0.6 ? 2.5 : 0}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
