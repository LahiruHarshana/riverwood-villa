"use client";

import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Users, Trash2, Edit, CheckCircle2, XCircle } from "lucide-react";
import { Room } from "@/lib/firestore/rooms";

interface RoomCardProps {
  room: Room;
  onDelete: (id: string) => void;
}

export function RoomCard({ room, onDelete }: RoomCardProps) {
  const firstImage = room.images && room.images.length > 0 ? room.images[0] : null;

  return (
    <div className="admin-card transition-transform duration-200 hover:-translate-y-1">
      <div className="relative h-56 bg-[#e8ebe3]">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={room.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6f746a]">
            No Image
          </div>
        )}

        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          {room.isAvailable ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e4efdf] px-2.5 py-1 text-xs font-bold text-[#465143] shadow-sm">
              <CheckCircle2 className="w-3 h-3" /> Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 shadow-sm">
              <XCircle className="w-3 h-3" /> Unavailable
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-serif text-2xl font-medium tracking-[-0.04em] text-[#151512]">{room.name}</h3>
          <span className="rounded-full bg-[#e8ebe3] px-3 py-1 text-sm font-bold text-[#465143]">${room.pricePerNight}/night</span>
        </div>

        <div className="mb-5 flex items-center gap-4 text-sm font-semibold text-[#6f746a]">
          <span className="flex items-center gap-1">
            <BedDouble className="w-4 h-4" /> {room.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" /> {room.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {room.maxGuests}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/admin/rooms/${room.id}/edit`}
            className="admin-secondary-button flex-1"
          >
            <Edit className="w-4 h-4" /> Edit
          </Link>
          <button
            onClick={() => onDelete(room.id)}
            className="admin-danger-button"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
