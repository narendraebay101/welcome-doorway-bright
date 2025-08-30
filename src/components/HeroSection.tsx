import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Eye, Layers3 } from "lucide-react";
import heroImage from "@/assets/hero-architecture.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="3D House Visualization" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-depth" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Your
            <span className="block bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
              Floor Plans to 3D
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload your 2D floor plans and watch them come to life in stunning 3D visualizations. 
            Perfect for architects, designers, and real estate professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button variant="hero" size="lg" className="group">
              <Upload className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Upload Floor Plan
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="heroSecondary" size="lg" className="group">
              <Eye className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              View Demo
            </Button>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
          <div className="architectural-elevation rounded-2xl p-6 backdrop-blur-sm bg-white/10 border border-white/20">
            <Upload className="h-12 w-12 text-primary-glow mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">Easy Upload</h3>
            <p className="text-white/80">Support for PNG, JPG, PDF, and SVG formats with drag & drop interface.</p>
          </div>
          
          <div className="architectural-elevation rounded-2xl p-6 backdrop-blur-sm bg-white/10 border border-white/20">
            <Layers3 className="h-12 w-12 text-primary-glow mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">3D Generation</h3>
            <p className="text-white/80">Automatic conversion from 2D floor plans to interactive 3D models.</p>
          </div>
          
          <div className="architectural-elevation rounded-2xl p-6 backdrop-blur-sm bg-white/10 border border-white/20">
            <Eye className="h-12 w-12 text-primary-glow mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-white mb-2">Interactive View</h3>
            <p className="text-white/80">Navigate, measure, and explore your 3D models with professional tools.</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};