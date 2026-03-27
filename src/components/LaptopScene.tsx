import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment } from "@react-three/drei";
import { LaptopModel } from "./LaptopModel";

interface LaptopSceneProps {
  scrollProgress: number;
  isBooted: boolean;
}

const LaptopScene = ({ scrollProgress, isBooted }: LaptopSceneProps) => {
  return (
    <Canvas
      camera={{ position: [0, 2, 6], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 3, 2]} intensity={isBooted ? 1.5 : 0.3} color="#a855f7" />
        <pointLight position={[-3, 2, -1]} intensity={0.4} color="#7c3aed" />
        <pointLight position={[3, 1, 1]} intensity={0.3} color="#c084fc" />
        {isBooted && (
          <spotLight
            position={[0, 1.5, 1]}
            angle={0.6}
            penumbra={0.5}
            intensity={2}
            color="#a855f7"
            target-position={[0, 0, 0]}
          />
        )}
        <LaptopModel scrollProgress={scrollProgress} isBooted={isBooted} />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
};

export default LaptopScene;
