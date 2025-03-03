import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Calendar,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Info,
  Share2,
  Tag,
  Trash2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ImageDetailsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  image?: {
    id: string;
    url: string;
    title: string;
    uploadDate: string;
    size: string;
    dimensions: string;
    format: string;
    tags?: string[];
    description?: string;
  };
  onCopyUrl?: (url: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
}

const ImageDetails = ({
  open = true,
  onOpenChange = () => {},
  image = {
    id: "img-123",
    url: "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a",
    title: "Sample Image",
    uploadDate: "May 15, 2023",
    size: "1.2 MB",
    dimensions: "1200 x 800",
    format: "JPEG",
    tags: ["nature", "landscape", "mountains"],
    description: "A beautiful mountain landscape captured during sunrise.",
  },
  onCopyUrl = () => {},
  onDownload = () => {},
  onDelete = () => {},
  onShare = () => {},
}: ImageDetailsProps) => {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 h-full">
          {/* Image Preview Section */}
          <div className="bg-gray-100 flex items-center justify-center p-4 h-[300px] md:h-auto">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={image.url}
                alt={image.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col h-full">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {image.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Uploaded {image.uploadDate}</span>
              </div>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="organize">Organize</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pt-4">
                <TabsContent value="details" className="mt-0 h-full">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-500">Format:</span>
                        <span className="font-medium">{image.format}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-500">Size:</span>
                        <span className="font-medium">{image.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-500">Dimensions:</span>
                      <span className="font-medium">{image.dimensions}</span>
                    </div>

                    {image.description && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">
                          Description
                        </h4>
                        <p className="text-sm text-gray-600">
                          {image.description}
                        </p>
                      </div>
                    )}

                    {image.tags && image.tags.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {image.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Image URL</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 p-2 rounded text-sm truncate">
                          {image.url}
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => onCopyUrl(image.url)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy URL to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="organize" className="mt-0 h-full">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Edit Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {image.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="gap-1">
                            {tag}
                            <button className="ml-1 text-gray-500 hover:text-gray-700">
                              ×
                            </button>
                          </Badge>
                        ))}
                        <Badge
                          variant="outline"
                          className="bg-gray-100 cursor-pointer"
                        >
                          + Add Tag
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Edit Description
                      </h4>
                      <textarea
                        className="w-full p-2 border rounded-md text-sm h-24"
                        defaultValue={image.description}
                        placeholder="Add a description for this image..."
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Edit Title</h4>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md text-sm"
                        defaultValue={image.title}
                      />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <Separator />

            <DialogFooter className="p-4 flex justify-between">
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(image.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onShare(image.id)}
                  className="flex items-center gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
                <Button
                  onClick={() => onDownload(image.id)}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </div>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetails;
