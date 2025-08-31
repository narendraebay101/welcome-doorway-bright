import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

type Props = { room: any; scale: number; offset: { x: number; z: number } };

export const Room3D = ({ room, scale, offset }: Props) => {
  const x = (room.bounds.x + room.bounds.width / 2) / scale - offset.x;
  const z = (room.bounds.y + room.bounds.height / 2) / scale - offset.z;
  const width = Math.max(room.bounds.width / scale, 0.5);
  const depth = Math.max(room.bounds.height / scale, 0.5);

  const roomColors: Record<string, string> = {
    living: 'hsl(210, 100%, 95%)',
    bedroom: 'hsl(320, 100%, 96%)',
    kitchen: 'hsl(140, 80%, 92%)',
    bathroom: 'hsl(45, 100%, 90%)',
    hallway: 'hsl(220, 14%, 96%)',
    other: 'hsl(210, 20%, 95%)',
  };
  const roomColor = roomColors[room.type] || roomColors.other;

  return (
    <>
      {/* Enhanced Floor with better materials */}
      <mesh position={[x, -0.01, z]} receiveShadow>
        <boxGeometry args={[width, 0.02, depth]} />
        <meshStandardMaterial 
          color={roomColor} 
          transparent 
          opacity={0.9} 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Room border with gradient effect */}
      <mesh position={[x, 0.005, z]}>
        <ringGeometry args={[Math.min(width, depth) * 0.42, Math.min(width, depth) * 0.47, 32]} />
        <meshStandardMaterial 
          color="hsl(215, 25%, 70%)" 
          transparent 
          opacity={0.4} 
          side={THREE.DoubleSide}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* Subtle inner glow */}
      <mesh position={[x, 0.008, z]}>
        <ringGeometry args={[Math.min(width, depth) * 0.35, Math.min(width, depth) * 0.4, 32]} />
        <meshStandardMaterial 
          color={roomColor}
          transparent 
          opacity={0.2} 
          side={THREE.DoubleSide}
          emissive={roomColor}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Room label */}
      <Text
        position={[x, 0.1, z]}
        fontSize={Math.min(width, depth) * 0.15}
        color="hsl(215, 25%, 27%)"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {room.name}
      </Text>

      {/* Room type indicator */}
      <Text
        position={[x, 0.08, z + Math.min(width, depth) * 0.15]}
        fontSize={Math.min(width, depth) * 0.08}
        color="hsl(215, 15%, 45%)"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {room.type}
      </Text>

      {/* Procedural furniture for a more realistic feel */}
      <Furniture type={room.type} roomCenter={[x, z]} size={[width, depth]} />
    </>
  );
};

// --- Furniture primitives ---

type FurnitureProps = {
  type: string;
  roomCenter: [number, number];
  size: [number, number];
};

const Furniture = ({ type, roomCenter, size }: FurnitureProps) => {
  switch (type) {
    case 'bedroom':
      return <BedroomFurniture roomCenter={roomCenter} size={size} />;
    case 'living':
      return <LivingFurniture roomCenter={roomCenter} size={size} />;
    case 'kitchen':
      return <KitchenFurniture roomCenter={roomCenter} size={size} />;
    case 'bathroom':
      return <BathroomFurniture roomCenter={roomCenter} size={size} />;
    default:
      return <CommonFurniture roomCenter={roomCenter} size={size} />;
  }
};

const BedroomFurniture = ({ roomCenter, size }: { roomCenter: [number, number]; size: [number, number] }) => {
  const [cx, cz] = roomCenter;
  const [w, d] = size;
  const bedW = Math.min(w * 0.5, 2);
  const bedD = Math.min(d * 0.35, 1.6);
  const x = cx - w / 2 + bedW / 2 + 0.2;
  const z = cz - d / 2 + bedD / 2 + 0.2;

  return (
    <group>
      {/* Bed frame */}
      <mesh position={[x, 0.15, z]} castShadow receiveShadow>
        <boxGeometry args={[bedW, 0.3, bedD]} />
        <meshStandardMaterial color="hsl(25, 30%, 45%)" roughness={0.8} />
      </mesh>
      {/* Mattress */}
      <mesh position={[x, 0.35, z]} castShadow>
        <boxGeometry args={[bedW * 0.98, 0.2, bedD * 0.96]} />
        <meshStandardMaterial color="hsl(0, 0%, 98%)" roughness={0.6} />
      </mesh>
      {/* Pillows */}
      <mesh position={[x - bedW * 0.2, 0.5, z - bedD * 0.35]} castShadow>
        <boxGeometry args={[bedW * 0.25, 0.1, bedD * 0.2]} />
        <meshStandardMaterial color="hsl(210, 20%, 95%)" />
      </mesh>
      <mesh position={[x + bedW * 0.2, 0.5, z - bedD * 0.35]} castShadow>
        <boxGeometry args={[bedW * 0.25, 0.1, bedD * 0.2]} />
        <meshStandardMaterial color="hsl(210, 20%, 95%)" />
      </mesh>
      {/* Nightstands */}
      <mesh position={[x - bedW / 2 - 0.25, 0.25, z]}>
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="hsl(25, 30%, 45%)" />
      </mesh>
      <mesh position={[x + bedW / 2 + 0.25, 0.25, z]}>
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="hsl(25, 30%, 45%)" />
      </mesh>
    </group>
  );
};

const LivingFurniture = ({ roomCenter, size }: { roomCenter: [number, number]; size: [number, number] }) => {
  const [cx, cz] = roomCenter;
  const [w, d] = size;
  const sofaW = Math.min(w * 0.5, 2.2);
  const sofaD = 0.8;
  const sofaX = cx - w / 2 + sofaW / 2 + 0.3;
  const sofaZ = cz + d / 2 - sofaD / 2 - 0.3;

  const tableR = Math.min(Math.min(w, d) * 0.12, 0.5);

  return (
    <group>
      {/* Sofa */}
      <mesh position={[sofaX, 0.45, sofaZ]} castShadow>
        <boxGeometry args={[sofaW, 0.9, sofaD]} />
        <meshStandardMaterial color="hsl(210, 10%, 35%)" roughness={0.9} />
      </mesh>
      {/* Coffee table */}
      <mesh position={[cx, 0.25, cz]} castShadow>
        <cylinderGeometry args={[tableR, tableR, 0.5, 24]} />
        <meshStandardMaterial color="hsl(30, 20%, 70%)" roughness={0.8} />
      </mesh>
      {/* TV Stand */}
      <mesh position={[cx + w / 2 - 0.3, 0.3, cz]}>
        <boxGeometry args={[0.6, 0.6, 1.2]} />
        <meshStandardMaterial color="hsl(210, 10%, 20%)" />
      </mesh>
    </group>
  );
};

const KitchenFurniture = ({ roomCenter, size }: { roomCenter: [number, number]; size: [number, number] }) => {
  const [cx, cz] = roomCenter;
  const [w, d] = size;
  const counterLen = Math.min(w * 0.8, 3);
  const counterDepth = 0.6;
  const x = cx;
  const z = cz - d / 2 + counterDepth / 2 + 0.2;

  return (
    <group>
      {/* Countertop */}
      <mesh position={[x, 0.95, z]} castShadow>
        <boxGeometry args={[counterLen, 0.1, counterDepth]} />
        <meshStandardMaterial color="hsl(30, 20%, 70%)" roughness={0.6} />
      </mesh>
      {/* Cabinets */}
      <mesh position={[x, 0.45, z]}>
        <boxGeometry args={[counterLen, 0.8, counterDepth]} />
        <meshStandardMaterial color="hsl(210, 10%, 30%)" />
      </mesh>
      {/* Island */}
      <mesh position={[cx - w * 0.15, 0.85, cz]} castShadow>
        <boxGeometry args={[Math.min(w * 0.3, 1.8), 0.7, Math.min(d * 0.25, 1)]} />
        <meshStandardMaterial color="hsl(210, 10%, 30%)" />
      </mesh>
    </group>
  );
};

const BathroomFurniture = ({ roomCenter, size }: { roomCenter: [number, number]; size: [number, number] }) => {
  const [cx, cz] = roomCenter;
  const [w, d] = size;
  const tubW = Math.min(w * 0.6, 1.6);
  const tubD = 0.7;
  const tubX = cx - w / 2 + tubW / 2 + 0.2;
  const tubZ = cz + d / 2 - tubD / 2 - 0.2;

  return (
    <group>
      {/* Bathtub */}
      <mesh position={[tubX, 0.45, tubZ]}>
        <boxGeometry args={[tubW, 0.5, tubD]} />
        <meshStandardMaterial color="hsl(0, 0%, 92%)" metalness={0.1} roughness={0.2} />
      </mesh>
      {/* Sink */}
      <mesh position={[cx + w / 2 - 0.4, 0.9, cz]}>
        <boxGeometry args={[0.6, 0.2, 0.4]} />
        <meshStandardMaterial color="hsl(0, 0%, 95%)" />
      </mesh>
      <mesh position={[cx + w / 2 - 0.4, 0.5, cz]}>
        <boxGeometry args={[0.5, 0.6, 0.35]} />
        <meshStandardMaterial color="hsl(210, 10%, 30%)" />
      </mesh>
      {/* Toilet */}
      <mesh position={[cx, 0.4, cz - d / 2 + 0.4]}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 18]} />
        <meshStandardMaterial color="hsl(0, 0%, 92%)" />
      </mesh>
    </group>
  );
};

const CommonFurniture = ({ roomCenter }: { roomCenter: [number, number]; size: [number, number] }) => {
  const [cx, cz] = roomCenter;
  return (
    <group>
      {/* Simple table */}
      <mesh position={[cx, 0.7, cz]}>
        <boxGeometry args={[1.2, 0.1, 0.7]} />
        <meshStandardMaterial color="hsl(30, 20%, 70%)" />
      </mesh>
      <mesh position={[cx - 0.5, 0.35, cz - 0.25]}>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 12]} />
        <meshStandardMaterial color="hsl(30, 25%, 40%)" />
      </mesh>
      <mesh position={[cx + 0.5, 0.35, cz - 0.25]}>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 12]} />
        <meshStandardMaterial color="hsl(30, 25%, 40%)" />
      </mesh>
      <mesh position={[cx - 0.5, 0.35, cz + 0.25]}>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 12]} />
        <meshStandardMaterial color="hsl(30, 25%, 40%)" />
      </mesh>
      <mesh position={[cx + 0.5, 0.35, cz + 0.25]}>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 12]} />
        <meshStandardMaterial color="hsl(30, 25%, 40%)" />
      </mesh>
    </group>
  );
};
