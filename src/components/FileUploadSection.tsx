import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useFloorPlan } from "@/contexts/FloorPlanContext";

interface FileWithPreview extends File {
  preview?: string;
}

export const FileUploadSection = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { generateFloorPlan, isGenerating } = useFloorPlan();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      toast.error(`${rejectedFiles.length} file(s) rejected. Please check file format and size.`);
    }

    // Process accepted files
    const filesWithPreview = acceptedFiles.map(file => {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file)
      });
      return fileWithPreview;
    });

    setFiles(prev => [...prev, ...filesWithPreview]);
    
    if (acceptedFiles.length > 0) {
      toast.success(`${acceptedFiles.length} file(s) added successfully`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      // Revoke the object URL
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
    toast.success("File removed");
  };

  const processFiles = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one floor plan");
      return;
    }

    const loadingToast = toast.loading("Analyzing floor plan and generating 3D model...");

    try {
      await generateFloorPlan(files);
      toast.dismiss(loadingToast);
      toast.success("3D model generated successfully! Scroll down to view.");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to generate 3D model. Please try again.");
      console.error("Floor plan generation error:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section className="py-20 bg-gradient-surface">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Upload Your Floor Plans
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Drag and drop your architectural drawings or click to browse. 
            We support PNG, JPG, PDF, and SVG formats.
          </p>
        </div>

        {/* Upload Zone */}
        <Card className="architectural-surface p-8 mb-8">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
              transition-all duration-300 ease-architectural
              ${isDragActive 
                ? 'border-primary bg-accent/20 scale-105' 
                : 'border-border hover:border-primary/50 hover:bg-accent/10'
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className={`
              h-16 w-16 mx-auto mb-6 transition-colors
              ${isDragActive ? 'text-primary' : 'text-muted-foreground'}
            `} />
            
            {isDragActive ? (
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-2">
                  Drop your files here
                </h3>
                <p className="text-muted-foreground">
                  Release to upload your floor plans
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  Upload Floor Plans
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag & drop files here, or click to browse
                </p>
                <Button variant="outline" size="lg">
                  Choose Files
                </Button>
              </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Badge variant="secondary">PNG</Badge>
              <Badge variant="secondary">JPG</Badge>
              <Badge variant="secondary">PDF</Badge>
              <Badge variant="secondary">SVG</Badge>
              <Badge variant="outline">Max 10MB each</Badge>
            </div>
          </div>
        </Card>

        {/* File Preview */}
        {files.length > 0 && (
          <Card className="architectural-surface p-6 mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <File className="mr-2 h-5 w-5" />
              Uploaded Files ({files.length})
            </h3>
            
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                  <div className="flex items-center space-x-4">
                    {file.type.startsWith('image/') && file.preview && (
                      <img 
                        src={file.preview} 
                        alt={file.name}
                        className="h-12 w-12 object-cover rounded border"
                      />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Process Button */}
        {files.length > 0 && (
          <div className="text-center">
            <Button 
              variant="architectural" 
              size="lg" 
              onClick={processFiles}
              disabled={isGenerating}
              className="min-w-48"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-2" />
                  Generating 3D Model...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Generate 3D Model
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};