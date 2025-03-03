import React, { useState } from "react";
import ImageGallery from "./ImageGallery";
import ImageDetails from "./ImageDetails";
import UploadProgress from "./UploadProgress";
import UploadZone from "./UploadZone";
import CloudflareUploadGuide from "./CloudflareUploadGuide";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { Upload, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { api } from "@/lib/api";

interface Image {
  id: string;
  imageUrl: string;
  title: string;
  uploadDate: string;
  size: string;
  dimensions: string;
  format: string;
  tags?: string[];
  description?: string;
}

const Home = () => {
  const { toast } = useToast();
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageDetails, setShowImageDetails] = useState(false);

  // Sample images data
  const [images, setImages] = useState<Image[]>([
    {
      id: "img-1",
      imageUrl: "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a",
      title: "Mountain Landscape",
      uploadDate: "2023-05-15",
      size: "1.2 MB",
      dimensions: "1200 x 800",
      format: "JPEG",
      tags: ["nature", "landscape", "mountains"],
      description: "A beautiful mountain landscape captured during sunrise.",
    },
    {
      id: "img-2",
      imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
      title: "Ocean Sunset",
      uploadDate: "2023-05-20",
      size: "2.4 MB",
      dimensions: "1920 x 1080",
      format: "PNG",
      tags: ["ocean", "sunset", "water"],
      description: "Stunning sunset over the ocean with vibrant colors.",
    },
    {
      id: "img-3",
      imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      title: "Forest Path",
      uploadDate: "2023-06-01",
      size: "1.8 MB",
      dimensions: "1600 x 900",
      format: "JPEG",
      tags: ["forest", "path", "nature"],
      description:
        "A serene path through a dense forest with sunlight filtering through the trees.",
    },
    {
      id: "img-4",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      title: "Autumn Trees",
      uploadDate: "2023-06-10",
      size: "3.1 MB",
      dimensions: "2400 x 1600",
      format: "JPEG",
      tags: ["autumn", "trees", "fall"],
      description: "Colorful autumn trees with red and orange leaves.",
    },
    {
      id: "img-5",
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      title: "Misty Morning",
      uploadDate: "2023-06-15",
      size: "2.2 MB",
      dimensions: "2000 x 1200",
      format: "PNG",
      tags: ["mist", "morning", "forest"],
      description:
        "A misty morning in the forest creating a mystical atmosphere.",
    },
    {
      id: "img-6",
      imageUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
      title: "Green Valley",
      uploadDate: "2023-06-22",
      size: "1.5 MB",
      dimensions: "1800 x 1000",
      format: "JPEG",
      tags: ["valley", "green", "landscape"],
      description: "A lush green valley viewed from above with rolling hills.",
    },
  ]);

  // State for showing the guide
  const [showGuide, setShowGuide] = useState(false);

  // Handle image upload to Cloudflare
  const handleUpload = async (file: File) => {
    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      // Create metadata for the image
      const metadata = {
        title: file.name,
        uploadDate: new Date().toISOString().split("T")[0],
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        dimensions: "Calculating...", // We'll update this after upload
      };

      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90; // Hold at 90% until the actual upload completes
          }
          return prev + 5;
        });
      }, 300);

      // Create form data for upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("metadata", JSON.stringify(metadata));

      // Upload to Cloudflare using the global API
      const response = await api.cloudflare.uploadImage(formData);
      const result = response.result;

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus("success");

      // Add the new image to the gallery
      const newImage = {
        id: result.id,
        imageUrl: result.variants[0], // Use the first variant URL
        title: file.name,
        uploadDate: new Date().toISOString().split("T")[0],
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        dimensions: "1200 x 800", // This would ideally be calculated from the actual image
        format: file.type.split("/")[1].toUpperCase(),
        tags: ["uploaded"],
        description: "Uploaded via Cloudflare Images",
      };

      setImages([newImage, ...images]);

      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded to Cloudflare Images`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error uploading to Cloudflare:", error);
      setUploadStatus("error");
      setUploadProgress(0);

      toast({
        variant: "destructive",
        title: "Upload Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to upload image to Cloudflare",
        duration: 5000,
      });
    }
  };

  // Handle view image details
  const handleViewDetails = (id: string) => {
    setSelectedImage(id);
    setShowImageDetails(true);
  };

  // Handle copy image URL
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Image URL has been copied to clipboard",
      duration: 3000,
    });
  };

  // Handle download image
  const handleDownload = (id: string) => {
    const image = images.find((img) => img.id === id);
    if (image) {
      // In a real app, this would trigger a download
      toast({
        title: "Download Started",
        description: `Downloading ${image.title}...`,
        duration: 3000,
      });
    }
  };

  // Handle delete image
  const handleDelete = (id: string) => {
    // In a real app, this would delete the image from the server
    setImages((prev) => prev.filter((img) => img.id !== id));
    setShowImageDetails(false);
    toast({
      title: "Image Deleted",
      description: "The image has been deleted successfully",
      duration: 3000,
    });
  };

  // Handle share image
  const handleShare = (id: string) => {
    const image = images.find((img) => img.id === id);
    if (image) {
      handleCopyUrl(image.imageUrl);
      toast({
        title: "Ready to Share",
        description: "Image URL copied to clipboard for sharing",
        duration: 3000,
      });
    }
  };

  // Get the selected image details
  const selectedImageDetails = selectedImage
    ? images.find((img) => img.id === selectedImage)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with upload button */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=cloudflare"
              alt="Logo"
              className="h-8 w-8"
            />
            <h1 className="text-xl font-bold">Cloudflare Image Uploader</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Hướng dẫn
            </Button>
            <Button
              onClick={() => setShowUploadZone(true)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Cloudflare Upload Guide */}
        {showGuide && (
          <div className="mb-6 flex flex-col items-center">
            <CloudflareUploadGuide />
          </div>
        )}

        {/* Upload Zone */}
        {showUploadZone && (
          <div className="mb-6 flex flex-col items-center">
            <UploadZone
              onUpload={handleUpload}
              onCancel={() => setShowUploadZone(false)}
            />

            {uploadStatus !== "idle" && (
              <div className="mt-4 w-full max-w-[600px]">
                <UploadProgress
                  status={uploadStatus}
                  progress={uploadProgress}
                  fileName="image.jpg"
                  onRetry={() => handleUpload(null)}
                  onDismiss={() => {
                    setUploadStatus("idle");
                    setUploadProgress(0);
                    setShowUploadZone(false);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Image Gallery */}
        <ImageGallery
          images={images}
          onViewDetails={handleViewDetails}
          onCopyUrl={handleCopyUrl}
        />
      </main>

      {/* Image Details Modal */}
      {selectedImageDetails && (
        <ImageDetails
          open={showImageDetails}
          onOpenChange={setShowImageDetails}
          image={{
            id: selectedImageDetails.id,
            url: selectedImageDetails.imageUrl,
            title: selectedImageDetails.title,
            uploadDate: selectedImageDetails.uploadDate,
            size: selectedImageDetails.size,
            dimensions: selectedImageDetails.dimensions,
            format: selectedImageDetails.format,
            tags: selectedImageDetails.tags,
            description: selectedImageDetails.description,
          }}
          onCopyUrl={handleCopyUrl}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onShare={handleShare}
        />
      )}

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default Home;
