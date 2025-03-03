import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ImageCardProps {
  id?: string;
  imageUrl?: string;
  title?: string;
  uploadDate?: string;
  size?: string;
  dimensions?: string;
  onViewDetails?: (id: string) => void;
  onCopyUrl?: (url: string) => void;
}

const ImageCard = ({
  id = "img-123",
  imageUrl = "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a",
  title = "Sample Image",
  uploadDate = "2023-05-15",
  size = "1.2 MB",
  dimensions = "1200 x 800",
  onViewDetails = () => {},
  onCopyUrl = () => {},
}: ImageCardProps) => {
  return (
    <Card className="w-full max-w-[320px] overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium text-gray-900 truncate">{title}</h3>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-500">Uploaded: {uploadDate}</p>
          <p className="text-sm text-gray-500">
            {size} • {dimensions}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(id)}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View image details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCopyUrl(imageUrl)}
                className="flex items-center gap-1"
              >
                <Copy className="h-4 w-4" />
                <span>Copy URL</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy image URL to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default ImageCard;
