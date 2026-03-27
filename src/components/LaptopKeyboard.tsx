import { useMemo } from "react";
import * as THREE from "three";

interface LaptopKeyboardProps {
  lidOpenProgress: number;
}

// Realistic keyboard layout with proper sizing
const KEYBOARD_ROWS = [
  // Row 0: Function row (small keys)
  { keys: 14, keyWidth: 0.155, keyHeight: 0.12, zOffset: -0.72, gap: 0.015 },
  // Row 1: Number row
  { keys: 14, keyWidth: 0.155, keyHeight: 0.15, zOffset: -0.52, gap: 0.015 },
  // Row 2: QWERTY
  { keys: 13, keyWidth: 0.155, keyHeight: 0.15, zOffset: -0.32, gap: 0.015, xOffset: 0.08 },
  // Row 3: ASDF
  { keys: 12, keyWidth: 0.155, keyHeight: 0.15, zOffset: -0.12, gap: 0.015, xOffset: 0.14 },
  // Row 4: ZXCV
  { keys: 11, keyWidth: 0.155, keyHeight: 0.15, zOffset: 0.08, gap: 0.015, xOffset: 0.22 },
  // Row 5: Bottom row (space bar etc.)
  { keys: 8, keyWidth: 0.155, keyHeight: 0.14, zOffset: 0.27, gap: 0.015, xOffset: 0.0, hasSpacebar: true },
];

const KEY_LABELS_ROW2 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"];
const KEY_LABELS_ROW3 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "↵"];
const KEY_LABELS_ROW4 = ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "⇧"];

export const LaptopKeyboard = ({ lidOpenProgress }: LaptopKeyboardProps) => {
  const keys = useMemo(() => {
    const allKeys: {
      x: number;
      z: number;
      w: number;
      h: number;
      hue: number;
      label?: string;
      isSpecial?: boolean;
    }[] = [];

    KEYBOARD_ROWS.forEach((row, rowIdx) => {
      const xStart = -(row.keys * (row.keyWidth + row.gap)) / 2 + (row.xOffset || 0);

      if (row.hasSpacebar) {
        // Bottom row with spacebar
        const smallKeys = [
          { w: 0.2, label: "Ctrl" },
          { w: 0.17, label: "Fn" },
          { w: 0.17, label: "⊞" },
          { w: 0.17, label: "Alt" },
        ];
        let cx = -1.1;
        smallKeys.forEach((sk) => {
          allKeys.push({
            x: cx + sk.w / 2,
            z: row.zOffset,
            w: sk.w,
            h: row.keyHeight,
            hue: 260 + Math.random() * 40,
            isSpecial: true,
          });
          cx += sk.w + row.gap;
        });
        // Spacebar
        allKeys.push({
          x: 0,
          z: row.zOffset,
          w: 0.7,
          h: row.keyHeight,
          hue: 270,
          label: "",
        });
        cx = 0.42;
        const rightKeys = [
          { w: 0.17 },
          { w: 0.17 },
          { w: 0.17 },
          { w: 0.17 },
        ];
        rightKeys.forEach((sk) => {
          allKeys.push({
            x: cx + sk.w / 2,
            z: row.zOffset,
            w: sk.w,
            h: row.keyHeight,
            hue: 280 + Math.random() * 40,
            isSpecial: true,
          });
          cx += sk.w + row.gap;
        });
      } else {
        for (let col = 0; col < row.keys; col++) {
          const x = xStart + col * (row.keyWidth + row.gap) + row.keyWidth / 2;
          const hue = ((col / row.keys) * 120 + rowIdx * 60) % 360;
          let label: string | undefined;
          if (rowIdx === 2) label = KEY_LABELS_ROW2[col];
          if (rowIdx === 3) label = KEY_LABELS_ROW3[col];
          if (rowIdx === 4) label = KEY_LABELS_ROW4[col];

          allKeys.push({
            x,
            z: row.zOffset,
            w: row.keyWidth,
            h: row.keyHeight,
            hue,
            label,
            isSpecial: rowIdx === 0,
          });
        }
      }
    });

    return allKeys;
  }, []);

  const keyCapGeo = useMemo(() => {
    // Rounded box approximation - use a slightly beveled box
    return new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
  }, []);

  const rgbIntensity = lidOpenProgress > 0.3 ? (lidOpenProgress - 0.3) * 1.4 : 0;

  return (
    <group position={[0, 0.085, -0.15]}>
      {/* Keyboard plate (dark surface under keys) */}
      <mesh position={[0, -0.005, 0]}>
        <boxGeometry args={[2.85, 0.008, 1.2]} />
        <meshStandardMaterial
          color="#040408"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Individual keys */}
      {keys.map((key, i) => {
        const rgbColor = new THREE.Color().setHSL(key.hue / 360, 0.7, 0.5);
        const emissiveStrength = rgbIntensity * (key.isSpecial ? 0.15 : 0.25);

        return (
          <group key={i} position={[key.x, 0.012, key.z]}>
            {/* Key cap - main body */}
            <mesh
              geometry={keyCapGeo}
              scale={[key.w - 0.01, 0.022, key.h - 0.01]}
            >
              <meshStandardMaterial
                color="#0a0a10"
                metalness={0.3}
                roughness={0.7}
                transparent
                opacity={0.95}
              />
            </mesh>

            {/* Key top surface (slightly inset) */}
            <mesh position={[0, 0.012, 0]}>
              <boxGeometry args={[key.w - 0.025, 0.003, key.h - 0.025]} />
              <meshStandardMaterial
                color="#08080e"
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>

            {/* RGB underglow (light strip under key) */}
            {rgbIntensity > 0 && (
              <mesh position={[0, -0.008, 0]}>
                <boxGeometry args={[key.w - 0.015, 0.004, key.h - 0.015]} />
                <meshStandardMaterial
                  color="#000000"
                  emissive={rgbColor}
                  emissiveIntensity={emissiveStrength}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            )}

            {/* Subtle light bleed around key edges */}
            {rgbIntensity > 0.2 && (
              <pointLight
                position={[0, -0.01, 0]}
                color={`hsl(${key.hue}, 70%, 50%)`}
                intensity={emissiveStrength * 0.08}
                distance={0.15}
                decay={2}
              />
            )}
          </group>
        );
      })}
    </group>
  );
};
