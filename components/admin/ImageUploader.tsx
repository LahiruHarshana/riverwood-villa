"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
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
            className="w-full py-3 px-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-sky-500 transition-colors text-slate-500 hover:text-sky-600 font-medium"
          >
            Upload Photos
          </button>
        )}
      </CldUploadWidget>

      {value.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
              <Image
                src={url}
                alt={`Room image ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
