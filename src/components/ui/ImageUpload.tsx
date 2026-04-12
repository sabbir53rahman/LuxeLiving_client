"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useUploadSingleImageMutation, useUploadMultipleImagesMutation } from "@/redux/api/uploadApi";

interface ImageUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFormats?: string[];
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  aspectRatio?: string;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_ACCEPTED_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export default function ImageUpload({
  value = [],
  onChange,
  maxFiles = 10,
  maxSize = DEFAULT_MAX_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  className = "",
  disabled = false,
  showPreview = true,
  aspectRatio = "aspect-video",
}: ImageUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [uploadSingleImage] = useUploadSingleImageMutation();
  const [uploadMultipleImages] = useUploadMultipleImagesMutation();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file format. Accepted formats: ${acceptedFormats.map(f => f.split('/')[1]).join(", ")}`;
    }
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)} limit`;
    }
    return null;
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await uploadSingleImage(formData).unwrap();
      return result.data?.url || result.url || "";
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));

    try {
      const result = await uploadMultipleImages(formData).unwrap();
      return result.data?.urls || result.urls || [];
    } catch (error) {
      console.error("Multiple upload failed:", error);
      throw error;
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      const newErrors: string[] = [];
      const validFiles: File[] = [];

      // Validate files
      acceptedFiles.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (newErrors.length > 0) {
        setErrors(newErrors);
        toast.error("Some files were rejected");
        return;
      }

      // Check max files limit
      if (value.length + validFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      setErrors([]);
      setIsUploading(true);

      try {
        let uploadedUrls: string[] = [];

        if (validFiles.length === 1) {
          // Single file upload
          const url = await uploadFile(validFiles[0]);
          uploadedUrls = [url];
        } else {
          // Multiple files upload
          uploadedUrls = await uploadFiles(validFiles);
        }

        // Update value
        const newValue = [...value, ...uploadedUrls];
        onChange?.(newValue);
        toast.success(`${uploadedUrls.length} file(s) uploaded successfully`);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
        setUploadProgress({});
      }
    },
    [value, maxFiles, maxSize, acceptedFormats, disabled, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => {
      acc[format] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    maxFiles: maxFiles - value.length,
    disabled: disabled || isUploading,
    multiple: maxFiles > 1,
  });

  const removeImage = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange?.(newValue);
    toast.success("Image removed");
  };

  const clearAll = () => {
    onChange?.([]);
    toast.success("All images cleared");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {value.length < maxFiles && (
        <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`cursor-pointer text-center ${
                isDragActive ? "bg-primary/5" : ""
              } ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input {...getInputProps()} />
              
              {isUploading ? (
                <div className="py-8">
                  <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <div className="py-8">
                  <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {isDragActive
                      ? "Drop the files here..."
                      : "Drag & drop files here, or click to select"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {acceptedFormats.map(f => f.split('/')[1]).join(", ")} up to{" "}
                    {formatFileSize(maxSize)} each
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max {maxFiles} files
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600">
                    {error}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Previews */}
      {showPreview && value.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Uploaded Images ({value.length}/{maxFiles})
            </h3>
            {value.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                disabled={disabled}
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {value.map((url, index) => (
              <motion.div
                key={`${url}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                <div className={`relative overflow-hidden rounded-lg border ${aspectRatio}`}>
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                      disabled={disabled}
                      className="p-2 h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Success indicator */}
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2 truncate">
                  Image {index + 1}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([file, progress]) => (
            <div key={file} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="truncate">{file}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
