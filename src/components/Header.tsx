import React from "react";
import { Button } from "./ui/button";
import { Upload, HelpCircle } from "lucide-react";

interface HeaderProps {
  onUploadClick?: () => void;
  onGuideClick?: () => void;
}

const Header = ({
  onUploadClick = () => {},
  onGuideClick = () => {},
}: HeaderProps) => {
  return (
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
            onClick={onGuideClick}
            className="flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            Hướng dẫn
          </Button>
          <Button onClick={onUploadClick} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Image
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
