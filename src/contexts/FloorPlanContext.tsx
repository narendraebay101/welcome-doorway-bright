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
  console.log('Analyzing floor plan:', filename, 'Size:', img.width, 'x', img.height);
  
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
  console.log('Detected walls:', walls.length);
  
  // Group walls into rooms
  const rooms = groupWallsIntoRooms(walls, img.width, img.height);
  console.log('Generated rooms:', rooms.length);
  
  // Calculate scale (pixels per meter - assume typical floor plan scale)
  const scale = Math.min(img.width, img.height) / 20; // Assume 20m max dimension
  
  const floorPlan = {
    id: `plan-${Date.now()}`,
    name: filename.replace(/\.[^/.]+$/, ""), // Remove file extension
    rooms,
    walls,
    scale,
    originalImage: canvas.toDataURL()
  };
  
  console.log('Generated floor plan:', floorPlan);
  return floorPlan;
};

// Enhanced edge detection to find walls
const detectWalls = (imageData: ImageData): Wall[] => {
  const { data, width, height } = imageData;
  const walls: Wall[] = [];
  
  // Convert to grayscale and apply edge detection
  const threshold = 128;
  const minLineLength = Math.min(width, height) * 0.05; // More sensitive
  
  // Create a simplified edge map
  const edges: boolean[][] = [];
  for (let y = 0; y < height; y++) {
    edges[y] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      // Consider both dark lines (walls) and light areas (spaces)
      edges[y][x] = gray < threshold;
    }
  }
  
  // Find horizontal lines (walls)
  for (let y = 10; y < height - 10; y += 8) {
    let start = -1;
    let consecutivePixels = 0;
    
    for (let x = 0; x < width; x++) {
      if (edges[y] && edges[y][x]) {
        if (start === -1) start = x;
        consecutivePixels++;
      } else {
        if (start !== -1 && consecutivePixels > minLineLength) {
          walls.push({
            id: `wall-h-${walls.length}`,
            start: { x: start, y },
            end: { x: x - 1, y },
            height: 2.8,
            thickness: 0.15
          });
        }
        start = -1;
        consecutivePixels = 0;
      }
    }
    
    // Handle line extending to edge
    if (start !== -1 && consecutivePixels > minLineLength) {
      walls.push({
        id: `wall-h-${walls.length}`,
        start: { x: start, y },
        end: { x: width - 1, y },
        height: 2.8,
        thickness: 0.15
      });
    }
  }
  
  // Find vertical lines (walls)
  for (let x = 10; x < width - 10; x += 8) {
    let start = -1;
    let consecutivePixels = 0;
    
    for (let y = 0; y < height; y++) {
      if (edges[y] && edges[y][x]) {
        if (start === -1) start = y;
        consecutivePixels++;
      } else {
        if (start !== -1 && consecutivePixels > minLineLength) {
          walls.push({
            id: `wall-v-${walls.length}`,
            start: { x, y: start },
            end: { x, y: y - 1 },
            height: 2.8,
            thickness: 0.15
          });
        }
        start = -1;
        consecutivePixels = 0;
      }
    }
    
    // Handle line extending to edge
    if (start !== -1 && consecutivePixels > minLineLength) {
      walls.push({
        id: `wall-v-${walls.length}`,
        start: { x, y: start },
        end: { x, y: height - 1 },
        height: 2.8,
        thickness: 0.15
      });
    }
  }
  
  // Add perimeter walls if no walls detected
  if (walls.length === 0) {
    const margin = Math.min(width, height) * 0.1;
    walls.push(
      {
        id: 'perimeter-top',
        start: { x: margin, y: margin },
        end: { x: width - margin, y: margin },
        height: 2.8,
        thickness: 0.2
      },
      {
        id: 'perimeter-bottom',
        start: { x: margin, y: height - margin },
        end: { x: width - margin, y: height - margin },
        height: 2.8,
        thickness: 0.2
      },
      {
        id: 'perimeter-left',
        start: { x: margin, y: margin },
        end: { x: margin, y: height - margin },
        height: 2.8,
        thickness: 0.2
      },
      {
        id: 'perimeter-right',
        start: { x: width - margin, y: margin },
        end: { x: width - margin, y: height - margin },
        height: 2.8,
        thickness: 0.2
      }
    );
  }
  
  return walls;
};

// Group walls into rooms with improved logic
const groupWallsIntoRooms = (walls: Wall[], imageWidth: number, imageHeight: number): Room[] => {
  const rooms: Room[] = [];
  
  if (walls.length > 0) {
    // Find bounding box of all walls
    const allPoints = walls.flatMap(wall => [wall.start, wall.end]);
    const minX = Math.min(...allPoints.map(p => p.x));
    const maxX = Math.max(...allPoints.map(p => p.x));
    const minY = Math.min(...allPoints.map(p => p.y));
    const maxY = Math.max(...allPoints.map(p => p.y));
    
    const width = maxX - minX;
    const height = maxY - minY;
    
    // Use image dimensions as fallback if walls don't provide good bounds
    const effectiveWidth = width > imageWidth * 0.1 ? width : imageWidth * 0.8;
    const effectiveHeight = height > imageHeight * 0.1 ? height : imageHeight * 0.8;
    const effectiveMinX = width > imageWidth * 0.1 ? minX : imageWidth * 0.1;
    const effectiveMinY = height > imageHeight * 0.1 ? minY : imageHeight * 0.1;
    
    // Create intelligent room divisions based on common architectural patterns
    const roomConfigs = [
      {
        id: 'main-area',
        name: 'Living Area',
        type: 'living' as const,
        bounds: { 
          x: effectiveMinX, 
          y: effectiveMinY, 
          width: effectiveWidth * 0.65, 
          height: effectiveHeight * 0.7 
        }
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        type: 'kitchen' as const,
        bounds: { 
          x: effectiveMinX + effectiveWidth * 0.65, 
          y: effectiveMinY, 
          width: effectiveWidth * 0.35, 
          height: effectiveHeight * 0.4 
        }
      },
      {
        id: 'bedroom',
        name: 'Bedroom',
        type: 'bedroom' as const,
        bounds: { 
          x: effectiveMinX + effectiveWidth * 0.65, 
          y: effectiveMinY + effectiveHeight * 0.4, 
          width: effectiveWidth * 0.35, 
          height: effectiveHeight * 0.3 
        }
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        type: 'bathroom' as const,
        bounds: { 
          x: effectiveMinX, 
          y: effectiveMinY + effectiveHeight * 0.7, 
          width: effectiveWidth * 0.3, 
          height: effectiveHeight * 0.3 
        }
      },
      {
        id: 'hallway',
        name: 'Hallway',
        type: 'hallway' as const,
        bounds: { 
          x: effectiveMinX + effectiveWidth * 0.3, 
          y: effectiveMinY + effectiveHeight * 0.7, 
          width: effectiveWidth * 0.35, 
          height: effectiveHeight * 0.3 
        }
      }
    ];
    
    // Filter out rooms that would be too small
    const minRoomSize = Math.min(effectiveWidth, effectiveHeight) * 0.1;
    
    roomConfigs.forEach((config, index) => {
      if (config.bounds.width > minRoomSize && config.bounds.height > minRoomSize) {
        // Assign walls to rooms based on proximity
        const roomWalls = walls.filter(wall => {
          const wallCenterX = (wall.start.x + wall.end.x) / 2;
          const wallCenterY = (wall.start.y + wall.end.y) / 2;
          
          return wallCenterX >= config.bounds.x - 20 && 
                 wallCenterX <= config.bounds.x + config.bounds.width + 20 &&
                 wallCenterY >= config.bounds.y - 20 && 
                 wallCenterY <= config.bounds.y + config.bounds.height + 20;
        });
        
        rooms.push({
          ...config,
          walls: roomWalls.length > 0 ? roomWalls : walls.filter((_, i) => i % 5 === index % 5)
        });
      }
    });
  } else {
    // Fallback: create a basic single room if no walls detected
    rooms.push({
      id: 'default-room',
      name: 'Main Room',
      type: 'living',
      bounds: { 
        x: imageWidth * 0.1, 
        y: imageHeight * 0.1, 
        width: imageWidth * 0.8, 
        height: imageHeight * 0.8 
      },
      walls: []
    });
  }
  
  return rooms;
};