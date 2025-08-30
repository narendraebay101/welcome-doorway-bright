import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6 animate-fade-in">
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full text-primary text-sm font-medium animate-bounce-in">
            <Sparkles className="w-4 h-4" />
            Welcome to something amazing
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-gradient">Welcome</span>
            <br />
            <span className="text-foreground">to Your Journey</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Step into a world of possibilities. We're thrilled to have you here and can't wait to see what you'll discover.
          </p>
        </div>

        {/* CTA Section */}
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-hero-gradient hover:shadow-hero transition-all duration-300 transform hover:scale-105 px-8 py-3 text-lg group"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 px-8 py-3 text-lg hover:bg-primary/5 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Welcome Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <Card className="p-6 card-glow border-primary/10 hover:border-primary/20 transition-all duration-300 hover:transform hover:scale-105 bg-card/50 backdrop-blur-sm">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Made with Love</h3>
              <p className="text-muted-foreground text-sm">
                Every detail crafted with care and attention to create the perfect experience for you.
              </p>
            </div>
          </Card>

          <Card className="p-6 card-glow border-primary/10 hover:border-primary/20 transition-all duration-300 hover:transform hover:scale-105 bg-card/50 backdrop-blur-sm">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Beautiful Design</h3>
              <p className="text-muted-foreground text-sm">
                Modern, clean, and intuitive interface that makes every interaction delightful.
              </p>
            </div>
          </Card>

          <Card className="p-6 card-glow border-primary/10 hover:border-primary/20 transition-all duration-300 hover:transform hover:scale-105 bg-card/50 backdrop-blur-sm">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Ready to Go</h3>
              <p className="text-muted-foreground text-sm">
                Everything you need is here and ready. Start exploring and make it your own.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;