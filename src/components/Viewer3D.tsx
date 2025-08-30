import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid, Environment } from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Generated3DModel } from "@/components/Generated3DModel";
import { useFloorPlan } from "@/contexts/FloorPlanContext";
import * as THREE from "three";

// Simple house structure for demo
const HouseStructure = () => {
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
      {/* Front wall */}
      <mesh position={[0, 1.5, -3]} castShadow>
        <boxGeometry args={[8, 3, 0.2]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      
      {/* Back wall */}
      <mesh position={[0, 1.5, 3]} castShadow>
        <boxGeometry args={[8, 3, 0.2]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-4, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[4, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[5, 1.5, 4]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Interior dividing walls */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.1, 3, 4]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      
      <mesh position={[-2, 1.5, 1]} castShadow>
        <boxGeometry args={[4, 3, 0.1]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[10, 8, 10]} fov={60} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Environment */}
      <Environment preset="apartment" />
      
      {/* Grid */}
      <Grid 
        args={[20, 20]}
        position={[0, -0.2, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#cbd5e1"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#94a3b8"
        fadeDistance={30}
        fadeStrength={1}
      />
      
      {/* Generated 3D Model */}
      <Generated3DModel />
    </>
  );
};

export const Viewer3D = () => {
  const { currentFloorPlan, isGenerating } = useFloorPlan();
  
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Interactive 3D Visualization
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentFloorPlan 
              ? `Exploring: ${currentFloorPlan.name}` 
              : "Upload a floor plan above to generate your 3D model"
            }
          </p>
        </div>

        <Card className="architectural-elevation overflow-hidden">
          {/* Controls */}
          <div className="p-4 border-b bg-surface-subtle flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset View
              </Button>
              <Button variant="outline" size="sm">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline" size="sm">
              <Maximize className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>

          {/* 3D Canvas */}
          <div className="h-[600px] relative">
            <Canvas shadows>
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>
            
            {/* Loading overlay */}
            <div className={`absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center pointer-events-none transition-opacity ${
              isGenerating ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Generating 3D model...</p>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="p-4 bg-surface-subtle border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-foreground">Controls:</span>
                <span className="text-muted-foreground ml-2">Click & drag to rotate</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Zoom:</span>
                <span className="text-muted-foreground ml-2">Scroll wheel or pinch</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Pan:</span>
                <span className="text-muted-foreground ml-2">Right-click & drag</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};