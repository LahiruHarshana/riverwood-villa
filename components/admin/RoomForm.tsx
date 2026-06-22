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
          <label className="text-sm font-medium text-slate-700">Room Name</label>
          <input
            {...register("name", {
              onChange: (e) => {
                if (!defaultValues) {
                  setValue("slug", autoSlug(e.target.value));
                }
              },
            })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Slug</label>
          <input
            {...register("slug")}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          {errors.slug && <p className="text-red-500 text-xs">{errors.slug.message}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Price Per Night (USD)</label>
          <input
            type="number"
            {...register("pricePerNight", { valueAsNumber: true })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          {errors.pricePerNight && <p className="text-red-500 text-xs">{errors.pricePerNight.message}</p>}
        </div>

        {/* Max Guests */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Max Guests</label>
          <input
            type="number"
            {...register("maxGuests", { valueAsNumber: true })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          {errors.maxGuests && <p className="text-red-500 text-xs">{errors.maxGuests.message}</p>}
        </div>

        {/* Bedrooms */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Bedrooms</label>
          <input
            type="number"
            {...register("bedrooms", { valueAsNumber: true })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          {errors.bedrooms && <p className="text-red-500 text-xs">{errors.bedrooms.message}</p>}
        </div>

        {/* Bathrooms */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Bathrooms</label>
          <input
            type="number"
            {...register("bathrooms", { valueAsNumber: true })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          {errors.bathrooms && <p className="text-red-500 text-xs">{errors.bathrooms.message}</p>}
        </div>

        {/* Amenities */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Amenities</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {amenities.map((amenity, index) => (
              <span key={index} className="inline-flex items-center gap-1 bg-sky-100 text-sky-700 px-2.5 py-1 rounded-full text-sm">
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
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <div className="p-2 text-slate-400">
              <Plus className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Images</label>
          <ImageUploader value={images} onChange={(urls) => setValue("images", urls)} />
        </div>

        {/* Available */}
        <div className="md:col-span-2 flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
          <input
            type="checkbox"
            {...register("isAvailable")}
            id="isAvailable"
            className="w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <label htmlFor="isAvailable" className="text-sm font-medium text-slate-700 cursor-pointer">
            Room is available for booking
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? <> <Spinner size="sm" /> Saving...</> : "Save Room"}
      </button>
    </form>
  );
}
