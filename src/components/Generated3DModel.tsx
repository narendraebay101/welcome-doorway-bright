import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useFloorPlan } from '@/contexts/FloorPlanContext';

export const Generated3DModel = () => {
  const { currentFloorPlan } = useFloorPlan();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle breathing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  console.log('Generated3DModel render - currentFloorPlan:', currentFloorPlan);

  if (!currentFloorPlan) {
    return <DefaultHouse />;
  }

  return (
    <group ref={groupRef}>
      {/* Generate walls from floor plan data */}
      {currentFloorPlan.walls.map((wall) => (
        <Wall3D key={wall.id} wall={wall} scale={currentFloorPlan.scale} />
      ))}
      
      {/* Generate floors for each room */}
      {currentFloorPlan.rooms.map((room) => (
        <Room3D key={room.id} room={room} scale={currentFloorPlan.scale} />
      ))}
      
      {/* Floor plan title */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.4}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        {currentFloorPlan.name}
      </Text>
      
      {/* Info text showing room and wall count */}
      <Text
        position={[0, 3.2, 0]}
        fontSize={0.25}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {currentFloorPlan.rooms.length} rooms • {currentFloorPlan.walls.length} walls
      </Text>
    </group>
  );
};

const Wall3D = ({ wall, scale }: { wall: any; scale: number }) => {
  // Convert 2D coordinates to 3D world coordinates with proper centering
  const centerOffsetX = 0; // Remove arbitrary offset
  const centerOffsetZ = 0;
  
  const startX = wall.start.x / scale - centerOffsetX;
  const startZ = wall.start.y / scale - centerOffsetZ;
  const endX = wall.end.x / scale - centerOffsetX;
  const endZ = wall.end.y / scale - centerOffsetZ;
  
  // Calculate wall dimensions
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
  const angle = Math.atan2(endZ - startZ, endX - startX);
  
  // Position at center of wall
  const centerX = (startX + endX) / 2;
  const centerZ = (startZ + endZ) / 2;
  
  // Ensure minimum visible dimensions
  const actualLength = Math.max(length, 0.1);
  const actualHeight = Math.max(wall.height, 0.1);
  const actualThickness = Math.max(wall.thickness, 0.05);
  
  return (
    <mesh 
      position={[centerX, actualHeight / 2, centerZ]}
      rotation={[0, angle, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[actualLength, actualHeight, actualThickness]} />
      <meshStandardMaterial 
        color="#e2e8f0" 
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};

const Room3D = ({ room, scale }: { room: any; scale: number }) => {
  // Convert room bounds to 3D coordinates with proper centering
  const x = (room.bounds.x + room.bounds.width / 2) / scale;
  const z = (room.bounds.y + room.bounds.height / 2) / scale;
  const width = Math.max(room.bounds.width / scale, 0.5);
  const depth = Math.max(room.bounds.height / scale, 0.5);
  
  // Room type colors with better contrast
  const roomColors = {
    living: '#dbeafe',    // Blue tint
    bedroom: '#fce7f3',   // Pink tint
    kitchen: '#dcfce7',   // Green tint
    bathroom: '#fef3c7',  // Yellow tint
    hallway: '#f3f4f6',   // Gray tint
    other: '#f1f5f9'      // Light gray
  };
  
  const roomColor = roomColors[room.type] || roomColors.other;
  
  return (
    <>
      {/* Floor */}
      <mesh position={[x, -0.01, z]} receiveShadow>
        <boxGeometry args={[width, 0.02, depth]} />
        <meshStandardMaterial 
          color={roomColor}
          transparent
          opacity={0.8}
          roughness={0.9}
        />
      </mesh>
      
      {/* Room outline */}
      <mesh position={[x, 0.005, z]}>
        <ringGeometry args={[Math.min(width, depth) * 0.4, Math.min(width, depth) * 0.45, 32]} />
        <meshStandardMaterial 
          color="#64748b"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Room label */}
      <Text
        position={[x, 0.1, z]}
        fontSize={Math.min(width, depth) * 0.15}
        color="#374151"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
        font="/fonts/inter-medium.woff"
      >
        {room.name}
      </Text>
      
      {/* Room type indicator */}
      <Text
        position={[x, 0.08, z + Math.min(width, depth) * 0.15]}
        fontSize={Math.min(width, depth) * 0.08}
        color="#6b7280"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {room.type}
      </Text>
    </>
  );
};

// Fallback default house when no floor plan is generated
const DefaultHouse = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Floor */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[8, 0.2, 6]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 1.5, -3]} castShadow>
        <boxGeometry args={[8, 3, 0.2]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      
      <mesh position={[0, 1.5, 3]} castShadow>
        <boxGeometry args={[8, 3, 0.2]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      
      <mesh position={[-4, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      
      <mesh position={[4, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[5, 1.5, 4]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Demo label */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.4}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        Upload floor plan to generate 3D model
      </Text>
    </group>
  );
};