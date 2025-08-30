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
        position={[0, 5, 0]}
        fontSize={0.5}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        {currentFloorPlan.name}
      </Text>
    </group>
  );
};

const Wall3D = ({ wall, scale }: { wall: any; scale: number }) => {
  // Convert 2D coordinates to 3D world coordinates
  const startX = (wall.start.x - 400) / scale; // Center around origin
  const startZ = (wall.start.y - 300) / scale;
  const endX = (wall.end.x - 400) / scale;
  const endZ = (wall.end.y - 300) / scale;
  
  // Calculate wall dimensions
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
  const angle = Math.atan2(endZ - startZ, endX - startX);
  
  // Position at center of wall
  const centerX = (startX + endX) / 2;
  const centerZ = (startZ + endZ) / 2;
  
  return (
    <mesh 
      position={[centerX, wall.height / 2, centerZ]}
      rotation={[0, angle, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[length, wall.height, wall.thickness]} />
      <meshStandardMaterial color="#f1f5f9" />
    </mesh>
  );
};

const Room3D = ({ room, scale }: { room: any; scale: number }) => {
  // Convert room bounds to 3D coordinates
  const x = (room.bounds.x + room.bounds.width / 2 - 400) / scale;
  const z = (room.bounds.y + room.bounds.height / 2 - 300) / scale;
  const width = room.bounds.width / scale;
  const depth = room.bounds.height / scale;
  
  // Room type colors
  const roomColors = {
    living: '#e0f2fe',
    bedroom: '#fce7f3',
    kitchen: '#ecfdf5',
    bathroom: '#fff7ed',
    hallway: '#f8fafc',
    other: '#f1f5f9'
  };
  
  return (
    <>
      {/* Floor */}
      <mesh position={[x, -0.01, z]} receiveShadow>
        <boxGeometry args={[width, 0.02, depth]} />
        <meshStandardMaterial color={roomColors[room.type] || roomColors.other} />
      </mesh>
      
      {/* Room label */}
      <Text
        position={[x, 0.1, z]}
        fontSize={Math.min(width, depth) * 0.2}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {room.name}
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