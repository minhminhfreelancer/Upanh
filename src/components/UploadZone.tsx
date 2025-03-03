import React, { useState } from "react";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";

interface UploadZoneProps {
  onUpload?: (file: File) => void;
  onCancel?: () => void;
}

const UploadZone = ({
  onUpload = () => {},
  onCancel = () => {},
}: UploadZoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-[600px] bg-white p-6 rounded-lg border shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Upload Image to Cloudflare</h2>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? "border-primary bg-primary/5" : "border-gray-300"
        } transition-colors`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="space-y-4">
            <div className="w-full max-h-[200px] overflow-hidden rounded-md">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-full h-auto object-contain"
              />
            </div>
            <p className="text-sm text-gray-500">
              {selectedFile.name} (
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          </div>
        ) : (
          <>
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-lg font-medium">Drag and drop your image here</p>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              or click to browse files
            </p>
            <label htmlFor="file-upload">
              <Button
                variant="outline"
                size="sm"
                className="mx-auto"
                type="button"
              >
                Browse Files
              </Button>
            </label>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              id="file-upload"
            />
          </>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleUploadClick} disabled={!selectedFile}>
          Upload to Cloudflare
        </Button>
      </div>
    </div>
  );
};

export default UploadZone;
