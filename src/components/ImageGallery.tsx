import React, { useState } from "react";
import ImageCard from "./ImageCard";
import { Button } from "./ui/button";
import { Grid, List, Search } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Image {
  id: string;
  imageUrl: string;
  title: string;
  uploadDate: string;
  size: string;
  dimensions: string;
}

interface ImageGalleryProps {
  images?: Image[];
  onViewDetails?: (id: string) => void;
  onCopyUrl?: (url: string) => void;
  isLoading?: boolean;
}

const ImageGallery = ({
  images = [
    {
      id: "img-1",
      imageUrl: "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a",
      title: "Mountain Landscape",
      uploadDate: "2023-05-15",
      size: "1.2 MB",
      dimensions: "1200 x 800",
    },
    {
      id: "img-2",
      imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
      title: "Ocean Sunset",
      uploadDate: "2023-05-20",
      size: "2.4 MB",
      dimensions: "1920 x 1080",
    },
    {
      id: "img-3",
      imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      title: "Forest Path",
      uploadDate: "2023-06-01",
      size: "1.8 MB",
      dimensions: "1600 x 900",
    },
    {
      id: "img-4",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      title: "Autumn Trees",
      uploadDate: "2023-06-10",
      size: "3.1 MB",
      dimensions: "2400 x 1600",
    },
    {
      id: "img-5",
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      title: "Misty Morning",
      uploadDate: "2023-06-15",
      size: "2.2 MB",
      dimensions: "2000 x 1200",
    },
    {
      id: "img-6",
      imageUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
      title: "Green Valley",
      uploadDate: "2023-06-22",
      size: "1.5 MB",
      dimensions: "1800 x 1000",
    },
  ],
  onViewDetails = () => {},
  onCopyUrl = () => {},
  isLoading = false,
}: ImageGalleryProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Filter images based on search query
  const filteredImages = images.filter((image) =>
    image.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sort images based on selected option
  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
    } else if (sortBy === "oldest") {
      return (
        new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
      );
    } else if (sortBy === "name") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "size") {
      return parseFloat(b.size) - parseFloat(a.size);
    }
    return 0;
  });

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="size">Size (Largest)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex bg-white rounded-md border">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : sortedImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-xl font-medium text-gray-600 mb-2">
            No images found
          </p>
          <p className="text-gray-500">
            Try adjusting your search or upload a new image
          </p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid-view" : "list-view"}>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedImages.map((image) => (
                <div key={image.id} className="flex justify-center">
                  <ImageCard
                    id={image.id}
                    imageUrl={image.imageUrl}
                    title={image.title}
                    uploadDate={image.uploadDate}
                    size={image.size}
                    dimensions={image.dimensions}
                    onViewDetails={onViewDetails}
                    onCopyUrl={onCopyUrl}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedImages.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-4">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-900">
                      {image.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 text-sm text-gray-500">
                      <p>Uploaded: {image.uploadDate}</p>
                      <p>{image.size}</p>
                      <p>{image.dimensions}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(image.id)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCopyUrl(image.imageUrl)}
                      className="flex items-center gap-1"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline">Copy URL</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
