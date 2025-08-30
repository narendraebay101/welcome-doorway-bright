import { HeroSection } from "@/components/HeroSection";
import { FileUploadSection } from "@/components/FileUploadSection";
import { Viewer3D } from "@/components/Viewer3D";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FileUploadSection />
      <Viewer3D />
    </div>
  );
};

export default Index;