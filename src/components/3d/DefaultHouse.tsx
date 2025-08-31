import React, { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const DefaultHouse = () => {
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
        <meshStandardMaterial color="hsl(210, 40%, 92%)" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 1.5, -3]} castShadow>
        <boxGeometry args={[8, 3, 0.2]} />
        <meshStandardMaterial color="hsl(210, 40%, 98%)" />
      </mesh>
      
      <mesh position={[0, 1.5, 3]} castShadow>
        <boxGeometry args={[8, 3, 0.2]} />
        <meshStandardMaterial color="hsl(210, 40%, 98%)" />
      </mesh>
      
      <mesh position={[-4, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial color="hsl(210, 40%, 98%)" />
      </mesh>
      
      <mesh position={[4, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial color="hsl(210, 40%, 98%)" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[5, 1.5, 4]} />
        <meshStandardMaterial color="hsl(215, 18%, 56%)" />
      </mesh>

      {/* Demo label */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.4}
        color="hsl(215, 19%, 65%)"
        anchorX="center"
        anchorY="middle"
      >
        Upload floor plan to generate 3D model
      </Text>
    </group>
  );
};
