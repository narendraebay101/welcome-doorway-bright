import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Room {
  id: string;
  name: string;
  type: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'hallway' | 'other';
  bounds: { x: number; y: number; width: number; height: number };
  walls: Wall[];
}

export interface Wall {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  height: number;
  thickness: number;
}

export interface FloorPlan {
  id: string;
  name: string;
  rooms: Room[];
  walls: Wall[];
  scale: number; // pixels per meter
  originalImage?: string;
}

interface FloorPlanContextType {
  currentFloorPlan: FloorPlan | null;
  setCurrentFloorPlan: (plan: FloorPlan | null) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  generateFloorPlan: (files: File[]) => Promise<void>;
}

const FloorPlanContext = createContext<FloorPlanContextType | undefined>(undefined);

export const useFloorPlan = () => {
  const context = useContext(FloorPlanContext);
  if (!context) {
    throw new Error('useFloorPlan must be used within a FloorPlanProvider');
  }
  return context;
};

export const FloorPlanProvider = ({ children }: { children: ReactNode }) => {
  const [currentFloorPlan, setCurrentFloorPlan] = useState<FloorPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFloorPlan = async (files: File[]): Promise<void> => {
    if (files.length === 0) return;

    setIsGenerating(true);
    
    try {
      // Process the first image file
      const imageFile = files.find(file => file.type.startsWith('image/'));
      if (!imageFile) {
        throw new Error('No image file found');
      }

      // Convert file to image element
      const imageUrl = URL.createObjectURL(imageFile);
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Analyze the image to detect walls and rooms
      const floorPlan = await analyzeFloorPlan(img, imageFile.name);
      
      setCurrentFloorPlan(floorPlan);
      URL.revokeObjectURL(imageUrl);
      
    } catch (error) {
      console.error('Error generating floor plan:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <FloorPlanContext.Provider value={{
      currentFloorPlan,
      setCurrentFloorPlan,
      isGenerating,
      setIsGenerating,
      generateFloorPlan
    }}>
      {children}
    </FloorPlanContext.Provider>
  );
};

// Analyze floor plan image to extract geometric data
const analyzeFloorPlan = async (img: HTMLImageElement, filename: string): Promise<FloorPlan> => {
  // Create canvas for image processing
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Set canvas size to match image
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Draw image to canvas
  ctx.drawImage(img, 0, 0);
  
  // Get image data for processing
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Detect edges and convert to walls
  const walls = detectWalls(imageData);
  
  // Group walls into rooms
  const rooms = groupWallsIntoRooms(walls);
  
  // Calculate scale (assume 1 pixel = 2cm for demo)
  const scale = 50; // 50 pixels per meter
  
  return {
    id: `plan-${Date.now()}`,
    name: filename,
    rooms,
    walls,
    scale,
    originalImage: canvas.toDataURL()
  };
};

// Simple edge detection to find walls
const detectWalls = (imageData: ImageData): Wall[] => {
  const { data, width, height } = imageData;
  const walls: Wall[] = [];
  
  // Convert to grayscale and find edges
  const threshold = 100;
  const edges: boolean[][] = [];
  
  for (let y = 0; y < height; y++) {
    edges[y] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      edges[y][x] = gray < threshold;
    }
  }
  
  // Find horizontal and vertical lines
  const minLineLength = Math.min(width, height) * 0.1;
  
  // Horizontal lines
  for (let y = 0; y < height; y += 5) {
    let start = -1;
    for (let x = 0; x < width; x++) {
      if (edges[y] && edges[y][x]) {
        if (start === -1) start = x;
      } else {
        if (start !== -1 && x - start > minLineLength) {
          walls.push({
            id: `wall-h-${walls.length}`,
            start: { x: start, y },
            end: { x: x - 1, y },
            height: 3, // 3 meters default
            thickness: 0.2
          });
        }
        start = -1;
      }
    }
  }
  
  // Vertical lines
  for (let x = 0; x < width; x += 5) {
    let start = -1;
    for (let y = 0; y < height; y++) {
      if (edges[y] && edges[y][x]) {
        if (start === -1) start = y;
      } else {
        if (start !== -1 && y - start > minLineLength) {
          walls.push({
            id: `wall-v-${walls.length}`,
            start: { x, y: start },
            end: { x, y: y - 1 },
            height: 3,
            thickness: 0.2
          });
        }
        start = -1;
      }
    }
  }
  
  return walls;
};

// Group walls into rooms (simplified)
const groupWallsIntoRooms = (walls: Wall[]): Room[] => {
  const rooms: Room[] = [];
  
  // Create sample rooms based on wall clusters
  if (walls.length > 0) {
    // Find bounding box of all walls
    const allPoints = walls.flatMap(wall => [wall.start, wall.end]);
    const minX = Math.min(...allPoints.map(p => p.x));
    const maxX = Math.max(...allPoints.map(p => p.x));
    const minY = Math.min(...allPoints.map(p => p.y));
    const maxY = Math.max(...allPoints.map(p => p.y));
    
    const width = maxX - minX;
    const height = maxY - minY;
    
    // Create basic room divisions
    rooms.push({
      id: 'room-1',
      name: 'Living Room',
      type: 'living',
      bounds: { x: minX, y: minY, width: width * 0.6, height: height * 0.6 },
      walls: walls.filter((_, i) => i % 3 === 0)
    });
    
    rooms.push({
      id: 'room-2',
      name: 'Kitchen',
      type: 'kitchen',
      bounds: { x: minX + width * 0.6, y: minY, width: width * 0.4, height: height * 0.5 },
      walls: walls.filter((_, i) => i % 3 === 1)
    });
    
    rooms.push({
      id: 'room-3',
      name: 'Bedroom',
      type: 'bedroom',
      bounds: { x: minX, y: minY + height * 0.6, width: width * 0.5, height: height * 0.4 },
      walls: walls.filter((_, i) => i % 3 === 2)
    });
  }
  
  return rooms;
};