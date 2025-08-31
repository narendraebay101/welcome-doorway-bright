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
      {/* Enhanced Floor */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[8, 0.2, 6]} />
        <meshStandardMaterial 
          color="hsl(215, 16%, 87%)" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Enhanced Walls with better materials */}
      <mesh position={[0, 1.5, -3]} castShadow>
        <boxGeometry args={[8, 3, 0.2]} />
        <meshStandardMaterial 
          color="hsl(210, 15%, 95%)" 
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      
      <mesh position={[0, 1.5, 3]} castShadow>
        <boxGeometry args={[8, 3, 0.2]} />
        <meshStandardMaterial 
          color="hsl(210, 15%, 95%)" 
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      
      <mesh position={[-4, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial 
          color="hsl(210, 15%, 95%)" 
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      
      <mesh position={[4, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial 
          color="hsl(210, 15%, 95%)" 
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Enhanced Roof with texture */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[5, 1.5, 4]} />
        <meshStandardMaterial 
          color="hsl(215, 18%, 56%)" 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Enhanced Demo label with outline */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.4}
        color="hsl(215, 25%, 27%)"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="hsl(0, 0%, 100%)"
      >
        Upload floor plan to generate 3D model
      </Text>

      {/* Subtle atmospheric elements */}
      <group>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 12,
              Math.random() * 4 + 1,
              (Math.random() - 0.5) * 8
            ]}
          >
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial
              color="hsl(45, 100%, 70%)"
              transparent
              opacity={0.4}
              emissive="hsl(45, 100%, 50%)"
              emissiveIntensity={0.1}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
