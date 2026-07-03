"use client";

import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { Room, RoomFormData } from "@/lib/firestore/rooms";
import { ImageUploader } from "./ImageUploader";
import { Spinner } from "@/components/ui/Spinner";

const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  pricePerNight: z.number().min(1, "Price must be at least 1"),
  maxGuests: z.number().min(1, "Max guests must be at least 1"),
  bedrooms: z.number().min(1, "Bedrooms must be at least 1"),
  bathrooms: z.number().min(1, "Bathrooms must be at least 1"),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
  isAvailable: z.boolean(),
});

interface RoomFormProps {
  defaultValues?: Room;
  onSubmit: (data: RoomFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function RoomForm({ defaultValues, onSubmit, isSubmitting }: RoomFormProps) {
  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: defaultValues || {
      name: "",
      slug: "",
      description: "",
      pricePerNight: 50,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [],
      images: [],
      isAvailable: true,
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const amenities = watch("amenities") || [];
  const images = watch("images") || [];
  const slugTouched = useRef(false);

  const addAmenity = useCallback((value: string) => {
    if (value && !amenities.includes(value)) {
      setValue("amenities", [...amenities, value]);
    }
  }, [amenities, setValue]);

  const handleAmenityKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAmenity(e.currentTarget.value.trim());
      e.currentTarget.value = "";
    }
  }, [addAmenity]);

  const handleAmenityClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const input = e.currentTarget.parentElement?.querySelector("input");
    if (input) {
      addAmenity(input.value.trim());
      input.value = "";
    }
  }, [addAmenity]);

  const removeAmenity = (index: number) => {
    setValue("amenities", amenities.filter((_, i) => i !== index));
  };

  const autoSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="admin-panel p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Room Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Room Name</label>
            <input
              {...register("name", {
                onChange: (e) => {
                  if (!defaultValues && !slugTouched.current) {
                    setValue("slug", autoSlug(e.target.value));
                  }
                },
              })}
              className="admin-input"
              placeholder="e.g. River View Suite"
            />
            {errors.name && <p className="text-xs font-medium text-red-600">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Slug</label>
            <input
              {...register("slug", {
                onChange: () => { slugTouched.current = true; },
              })}
              className="admin-input"
              placeholder="e.g. river-view-suite"
            />
            {errors.slug && <p className="text-xs font-medium text-red-600">{errors.slug.message}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="admin-input"
              placeholder="Describe the room, its features, and what makes it special..."
            />
            {errors.description && <p className="text-xs font-medium text-red-600">{errors.description.message}</p>}
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Price Per Night (USD)</label>
            <input
              type="number"
              step="0.01"
              {...register("pricePerNight", { valueAsNumber: true })}
              className="admin-input"
            />
            {errors.pricePerNight && <p className="text-xs font-medium text-red-600">{errors.pricePerNight.message}</p>}
          </div>

          {/* Max Guests */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Max Guests</label>
            <input
              type="number"
              {...register("maxGuests", { valueAsNumber: true })}
              className="admin-input"
            />
            {errors.maxGuests && <p className="text-xs font-medium text-red-600">{errors.maxGuests.message}</p>}
          </div>

          {/* Bedrooms */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Bedrooms</label>
            <input
              type="number"
              {...register("bedrooms", { valueAsNumber: true })}
              className="admin-input"
            />
            {errors.bedrooms && <p className="text-xs font-medium text-red-600">{errors.bedrooms.message}</p>}
          </div>

          {/* Bathrooms */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Bathrooms</label>
            <input
              type="number"
              {...register("bathrooms", { valueAsNumber: true })}
              className="admin-input"
            />
            {errors.bathrooms && <p className="text-xs font-medium text-red-600">{errors.bathrooms.message}</p>}
          </div>

          {/* Amenities */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">Amenities</label>
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-500/20"
                  >
                    {amenity}
                    <button type="button" onClick={() => removeAmenity(index)} className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                onKeyDown={handleAmenityKeyDown}
                placeholder="Type and press Enter to add"
                className="admin-input flex-1"
              />
              <button
                type="button"
                onClick={handleAmenityClick}
                className="flex h-[42px] w-full items-center justify-center rounded-md bg-gray-900 text-white transition-colors hover:bg-gray-700 sm:h-[38px] sm:w-[38px]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Images</label>
            <ImageUploader value={images} onChange={(urls) => setValue("images", urls)} />
          </div>

          {/* Available */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3.5 cursor-pointer transition-colors hover:bg-gray-100">
              <input
                type="checkbox"
                {...register("isAvailable")}
                id="isAvailable"
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500/20"
              />
              <span className="text-sm font-medium text-gray-700 cursor-pointer">
                Room is available for booking
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-2.5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="admin-primary-button flex-1 disabled:opacity-40"
        >
          {isSubmitting ? <><Spinner size="sm" /> Saving...</> : "Save Room"}
        </button>
      </div>
    </form>
  );
}
