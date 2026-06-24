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
            className="w-full rounded-2xl border-2 border-dashed border-[#151512]/15 bg-[#fffdf7]/60 px-4 py-5 font-bold text-[#465143] transition-colors hover:border-[#6f7d6c] hover:bg-[#fffdf7]"
          >
            Upload Photos
          </button>
        )}
      </CldUploadWidget>

      {value.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-2xl bg-[#e8ebe3]">
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
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-90 transition-opacity hover:opacity-100"
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
