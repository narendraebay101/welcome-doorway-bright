import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useFloorPlan } from '@/contexts/FloorPlanContext';
import { Wall3D } from './3d/Wall3D';
import { Room3D } from './3d/Room3D';
import { DefaultHouse as DefaultHouse3D } from './3d/DefaultHouse';

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

  const offset = React.useMemo(() => {
    if (!currentFloorPlan) return { x: 0, z: 0 };
    const wallPoints = currentFloorPlan.walls.flatMap((w: any) => [w.start, w.end]);
    const roomPoints = currentFloorPlan.rooms.flatMap((r: any) => [
      { x: r.bounds.x, y: r.bounds.y },
      { x: r.bounds.x + r.bounds.width, y: r.bounds.y + r.bounds.height },
    ]);
    const all = [...wallPoints, ...roomPoints];
    if (all.length === 0) return { x: 0, z: 0 };
    const minX = Math.min(...all.map(p => p.x));
    const maxX = Math.max(...all.map(p => p.x));
    const minY = Math.min(...all.map(p => p.y));
    const maxY = Math.max(...all.map(p => p.y));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const s = currentFloorPlan.scale || 1;
    return { x: centerX / s, z: centerY / s };
  }, [currentFloorPlan]);
  
  if (!currentFloorPlan) {
    return <DefaultHouse3D />;
  }

  return (
    <group ref={groupRef}>
      {/* Generate walls from floor plan data */}
      {currentFloorPlan.walls.map((wall) => (
        <Wall3D key={wall.id} wall={wall} scale={currentFloorPlan.scale} offset={offset} />
      ))}

      {/* Generate floors for each room */}
      {currentFloorPlan.rooms.map((room) => (
        <Room3D key={room.id} room={room} scale={currentFloorPlan.scale} offset={offset} />
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

// Moved Wall3D to a dedicated component at src/components/3d/Wall3D.tsx

// Moved Room3D to a dedicated component at src/components/3d/Room3D.tsx

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