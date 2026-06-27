"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { X, Upload } from "lucide-react";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <CldUploadWidget
        uploadPreset="riverwood_rooms"
        onSuccess={(result) => {
          if (typeof result.info === "object" && result.info !== null) {
            const info = result.info as { secure_url?: string };
            if (info.secure_url) {
              onChange([...value, info.secure_url]);
            }
          }
        }}
        options={{ multiple: true, maxFiles: 8, sources: ["local", "url"] }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open?.()}
            className="group flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 px-4 py-5 text-sm font-semibold text-gray-500 transition-all duration-150 hover:border-emerald-300 hover:bg-emerald-50/50"
          >
            <Upload className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
            Upload Photos
          </button>
        )}
      </CldUploadWidget>

      {value.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div key={index} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
              <Image
                src={url}
                alt={`Room image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="150px"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[0.6rem] font-bold text-white">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
