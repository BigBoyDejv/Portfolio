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
      camera={{ position: [0, 1.2, 5.5], fov: 40 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        {/* Very subtle ambient - dark scene */}
        <ambientLight intensity={0.03} />

        {/* Main purple backlight (behind laptop, casting upward glow) */}
        <pointLight
          position={[0, 0.5, -3]}
          intensity={lidOpenProgress > 0 ? 1.5 : 0.6}
          color="#7c3aed"
          distance={8}
        />
        <pointLight
          position={[-2.5, 0.5, -2]}
          intensity={0.4}
          color="#a855f7"
          distance={6}
        />
        <pointLight
          position={[2.5, 0.5, -2]}
          intensity={0.4}
          color="#c084fc"
          distance={6}
        />

        {/* Subtle fill from front */}
        <pointLight
          position={[0, 2, 3]}
          intensity={0.15}
          color="#e2e8f0"
          distance={8}
        />

        {/* Floor reflection light */}
        <pointLight
          position={[0, -1, 0]}
          intensity={lidOpenProgress * 0.3}
          color="#7c3aed"
          distance={4}
        />

        <LaptopModel scrollProgress={scrollProgress} lidOpenProgress={lidOpenProgress} />
      </Suspense>
    </Canvas>
  );
};

export default LaptopScene;
