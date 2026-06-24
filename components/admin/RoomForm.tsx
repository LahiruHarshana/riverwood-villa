"use client";

import { useCallback } from "react";
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

  const addAmenity = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();
      if (value && !amenities.includes(value)) {
        setValue("amenities", [...amenities, value]);
        input.value = "";
      }
    }
  }, [amenities, setValue]);

  const removeAmenity = (index: number) => {
    setValue("amenities", amenities.filter((_, i) => i !== index));
  };

  const autoSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#465143]">Room Name</label>
          <input
            {...register("name", {
              onChange: (e) => {
                if (!defaultValues) {
                  setValue("slug", autoSlug(e.target.value));
                }
              },
            })}
            className="admin-input"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#465143]">Slug</label>
          <input
            {...register("slug")}
            className="admin-input"
          />
          {errors.slug && <p className="text-red-500 text-xs">{errors.slug.message}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-bold text-[#465143]">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="admin-input"
          />
          {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#465143]">Price Per Night (USD)</label>
          <input
            type="number"
            {...register("pricePerNight", { valueAsNumber: true })}
            className="admin-input"
          />
          {errors.pricePerNight && <p className="text-red-500 text-xs">{errors.pricePerNight.message}</p>}
        </div>

        {/* Max Guests */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#465143]">Max Guests</label>
          <input
            type="number"
            {...register("maxGuests", { valueAsNumber: true })}
            className="admin-input"
          />
          {errors.maxGuests && <p className="text-red-500 text-xs">{errors.maxGuests.message}</p>}
        </div>

        {/* Bedrooms */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#465143]">Bedrooms</label>
          <input
            type="number"
            {...register("bedrooms", { valueAsNumber: true })}
            className="admin-input"
          />
          {errors.bedrooms && <p className="text-red-500 text-xs">{errors.bedrooms.message}</p>}
        </div>

        {/* Bathrooms */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#465143]">Bathrooms</label>
          <input
            type="number"
            {...register("bathrooms", { valueAsNumber: true })}
            className="admin-input"
          />
          {errors.bathrooms && <p className="text-red-500 text-xs">{errors.bathrooms.message}</p>}
        </div>

        {/* Amenities */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-bold text-[#465143]">Amenities</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {amenities.map((amenity, index) => (
              <span key={index} className="inline-flex items-center gap-1 rounded-full bg-[#e8ebe3] px-2.5 py-1 text-sm font-bold text-[#465143]">
                {amenity}
                <button type="button" onClick={() => removeAmenity(index)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              onKeyDown={addAmenity}
              placeholder="Type and press Enter to add"
              className="admin-input flex-1"
            />
            <div className="p-2 text-[#6f7d6c]">
              <Plus className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-bold text-[#465143]">Images</label>
          <ImageUploader value={images} onChange={(urls) => setValue("images", urls)} />
        </div>

        {/* Available */}
        <div className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-[#151512]/10 bg-[#fffdf7]/70 p-4">
          <input
            type="checkbox"
            {...register("isAvailable")}
            id="isAvailable"
            className="h-5 w-5 accent-[#465143]"
          />
          <label htmlFor="isAvailable" className="cursor-pointer text-sm font-bold text-[#465143]">
            Room is available for booking
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="admin-primary-button w-full disabled:opacity-50"
      >
        {isSubmitting ? <> <Spinner size="sm" /> Saving...</> : "Save Room"}
      </button>
    </form>
  );
}
