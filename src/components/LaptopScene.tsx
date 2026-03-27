import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { LaptopModel } from "./LaptopModel";

interface LaptopSceneProps {
  scrollProgress: number;
  lidOpenProgress: number;
}

const LaptopScene = ({ scrollProgress, lidOpenProgress }: LaptopSceneProps) => {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 4.5], fov: 40 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true, toneMapping: 3 }}
      dpr={[1, 2]}
      shadows
    >
      <Suspense fallback={null}>
        {/* Very low ambient for dark cinematic feel */}
        <ambientLight intensity={0.02} color="#e2e8f0" />

        {/* Main key light - soft top-down */}
        <directionalLight
          position={[0, 5, 2]}
          intensity={0.25}
          color="#c4b5fd"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Purple rim light (back-left) */}
        <pointLight
          position={[-3, 1.5, -3]}
          intensity={0.6}
          color="#7c3aed"
          distance={8}
        />

        {/* Purple rim light (back-right) */}
        <pointLight
          position={[3, 1.5, -3]}
          intensity={0.5}
          color="#a855f7"
          distance={8}
        />

        {/* Back center glow - reacts to lid */}
        <pointLight
          position={[0, 0.5, -3]}
          intensity={lidOpenProgress > 0 ? 1.2 : 0.4}
          color="#7c3aed"
          distance={8}
        />

        {/* Subtle cool fill from front */}
        <pointLight
          position={[0, 2, 4]}
          intensity={0.08}
          color="#94a3b8"
          distance={10}
        />

        {/* Floor reflection light */}
        <pointLight
          position={[0, -0.5, 0]}
          intensity={lidOpenProgress * 0.25}
          color="#7c3aed"
          distance={4}
        />

        {/* Subtle side highlights for edge reflections */}
        <pointLight
          position={[-2, 0.3, 1]}
          intensity={0.12}
          color="#c084fc"
          distance={4}
        />
        <pointLight
          position={[2, 0.3, 1]}
          intensity={0.12}
          color="#c084fc"
          distance={4}
        />

        <LaptopModel scrollProgress={scrollProgress} lidOpenProgress={lidOpenProgress} />
      </Suspense>
    </Canvas>
  );
};

export default LaptopScene;
