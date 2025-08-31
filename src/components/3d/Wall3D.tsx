import React from 'react';
import * as THREE from 'three';

type Props = { wall: any; scale: number; offset: { x: number; z: number } };

export const Wall3D = ({ wall, scale, offset }: Props) => {
  const startX = wall.start.x / scale - offset.x;
  const startZ = wall.start.y / scale - offset.z;
  const endX = wall.end.x / scale - offset.x;
  const endZ = wall.end.y / scale - offset.z;

  const length = Math.hypot(endX - startX, endZ - startZ);
  const angle = Math.atan2(endZ - startZ, endX - startX);

  const centerX = (startX + endX) / 2;
  const centerZ = (startZ + endZ) / 2;

  const actualLength = Math.max(length, 0.1);
  const actualHeight = Math.max(wall.height, 0.1);
  const actualThickness = Math.max(wall.thickness, 0.05);

  return (
    <mesh position={[centerX, actualHeight / 2, centerZ]} rotation={[0, angle, 0]} castShadow receiveShadow>
      <boxGeometry args={[actualLength, actualHeight, actualThickness]} />
      <meshStandardMaterial 
        color="hsl(210, 15%, 88%)" 
        roughness={0.9} 
        metalness={0.05}
        normalScale={new THREE.Vector2(0.3, 0.3)}
      />
    </mesh>
  );
};
