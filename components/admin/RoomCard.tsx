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
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-slate-100">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={room.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No Image
          </div>
        )}

        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          {room.isAvailable ? (
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">
              <CheckCircle2 className="w-3 h-3" /> Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium">
              <XCircle className="w-3 h-3" /> Unavailable
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
          <span className="text-sky-600 font-bold">${room.pricePerNight}/night</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
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
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Edit className="w-4 h-4" /> Edit
          </Link>
          <button
            onClick={() => onDelete(room.id)}
            className="inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
