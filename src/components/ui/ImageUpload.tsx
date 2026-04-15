"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Upload,
  Loader2,
  CheckCircle2,
  Plus,
  Trash2,
  Fingerprint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useUploadSingleImageMutation,
  useUploadMultipleImagesMutation,
} from "@/redux/api/uploadApi";
import Image from "next/image";

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

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function ImageUpload({
  value = [],
  onChange,
  maxFiles = 10,
  maxSize = DEFAULT_MAX_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  className = "",
  disabled = false,
  showPreview = true,
  aspectRatio = "aspect-square",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [uploadSingleImage] = useUploadSingleImageMutation();
  const [uploadMultipleImages] = useUploadMultipleImagesMutation();

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedFormats.includes(file.type)) {
        return `Invalid format. Use JPG, PNG, WEBP or GIF.`;
      }
      if (file.size > maxSize) {
        return `Too large. Limit is ${formatFileSize(maxSize)}.`;
      }
      return null;
    },
    [acceptedFormats, maxSize],
  );

  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const result = await uploadSingleImage(formData).unwrap();
        return result.data?.url || result.url || "";
      } catch (error) {
        console.error("Upload failed:", error);
        throw error;
      }
    },
    [uploadSingleImage],
  );

  const uploadFiles = useCallback(
    async (files: File[]): Promise<string[]> => {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      try {
        const result = await uploadMultipleImages(formData).unwrap();

        // Fixed logic to handle multiple response formats
        if (Array.isArray(result.data)) {
          return result.data
            .map((item: { url: string }) => item.url)
            .filter(Boolean);
        }

        if (result.data?.urls && Array.isArray(result.data.urls)) {
          return result.data.urls;
        }

        if (result.urls && Array.isArray(result.urls)) {
          return result.urls;
        }

        return [];
      } catch (error) {
        console.error("Multiple upload failed:", error);
        throw error;
      }
    },
    [uploadMultipleImages],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled || isUploading) return;

      const validFiles: File[] = [];
      const validationErrors: string[] = [];

      acceptedFiles.forEach((file) => {
        const error = validateFile(file);
        if (error) validationErrors.push(`${file.name}: ${error}`);
        else validFiles.push(file);
      });

      if (validationErrors.length > 0) {
        validationErrors.forEach((err) => toast.error(err));
        return;
      }

      if (value.length + validFiles.length > maxFiles) {
        toast.error(`Exceeds maximum of ${maxFiles} entries.`);
        return;
      }

      setIsUploading(true);
      setUploadProgress(10); // Start progress

      try {
        let uploadedUrls: string[] = [];

        if (validFiles.length === 1) {
          const url = await uploadFile(validFiles[0]);
          if (url) uploadedUrls = [url];
        } else {
          uploadedUrls = await uploadFiles(validFiles);
        }

        setUploadProgress(90);

        if (uploadedUrls.length > 0) {
          const newValue = [...value, ...uploadedUrls];
          onChange?.(newValue);
          toast.success(`${uploadedUrls.length} masterpiece(s) uploaded.`);
        } else {
          toast.error("Process completed but no assets were captured.");
        }
      } catch {
        toast.error("The vault remains empty. Upload failed.");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [
      value,
      maxFiles,
      disabled,
      isUploading,
      onChange,
      validateFile,
      uploadFile,
      uploadFiles,
    ],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce(
      (acc, format) => {
        acc[format] = [];
        return acc;
      },
      {} as Record<string, string[]>,
    ),
    maxSize,
    maxFiles: maxFiles - value.length,
    disabled: disabled || isUploading,
    multiple: maxFiles > 1,
  });

  const removeImage = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange?.(newValue);
    toast.info("Asset removed from portfolio");
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      {value.length < maxFiles && (
        <motion.div
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          className="relative"
        >
          <div
            {...getRootProps()}
            className={`
              relative group cursor-pointer overflow-hidden rounded-[2rem] border-2 border-dashed transition-all duration-500
              ${isDragActive ? "border-luxury-gold bg-luxury-gold/5" : "border-luxury-slate/10 hover:border-luxury-gold/40 hover:bg-luxury-slate/[0.02]"}
              ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input {...getInputProps()} />

            <div className="py-12 px-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div
                  className={`
                  w-16 h-16 rounded-2xl bg-linear-to-br from-luxury-slate to-black flex items-center justify-center shadow-xl transition-transform duration-500 group-hover:rotate-12
                  ${isUploading ? "animate-pulse" : ""}
                `}
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-luxury-gold" />
                  )}
                </div>
                {!isUploading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-luxury-emerald rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-lg font-black text-white/60 tracking-tight uppercase">
                  {isUploading
                    ? "Integrating Assets..."
                    : isDragActive
                      ? "Release for Capture"
                      : "Acquire Visual Assets"}
                </p>
                <p className="text-xs text-white/40 font-medium uppercase tracking-[0.2em]">
                  {maxFiles - value.length} slots remaining • Premium Quality
                  Only
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                {["JPG", "PNG", "WEBP"].map((ext) => (
                  <span
                    key={ext}
                    className="px-3 py-1 bg-luxury-slate text-[10px] font-black text-white rounded-full"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-luxury-slate/10 overflow-hidden rounded-full mx-8 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                className="h-full bg-luxury-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
              />
            </div>
          )}
        </motion.div>
      )}

      {/* Image Previews */}
      <AnimatePresence>
        {showPreview && value.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-luxury-slate/50">
                Curated Collection ({value.length}/{maxFiles})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange?.([])}
                className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                Clear Portfolio
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {value.map((url, index) => (
                <motion.div
                  key={`${url}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div
                    className={`
                    relative overflow-hidden rounded-3xl border-2 border-transparent transition-all duration-500
                    hover:border-luxury-gold/50 hover:shadow-2xl hover:shadow-luxury-gold/10
                    ${aspectRatio}
                  `}
                  >
                    <Image
                      width={500}
                      height={500}
                      src={url}
                      alt={`Asset ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Glass Overlay */}
                    <div className="absolute inset-0 bg-luxury-slate/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="rounded-2xl h-12 w-12 p-0 bg-red-600/90 hover:bg-red-600 shadow-xl"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">
                        Remove Asset
                      </span>
                    </div>

                    {/* Master Tag */}
                    {index === 0 && (
                      <div className="absolute top-4 left-4">
                        <div className="px-3 py-1 bg-luxury-gold text-luxury-slate text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1">
                          <Fingerprint className="w-3 h-3" /> Cover
                        </div>
                      </div>
                    )}

                    {/* Checkmark */}
                    <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-8 h-8 bg-luxury-emerald rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
