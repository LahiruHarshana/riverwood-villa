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
    <div className="admin-card admin-room-card group">
      {/* Image */}
      <div className="admin-room-card-media relative h-48 overflow-hidden bg-gray-100 sm:h-52">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={room.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <BedDouble className="w-10 h-10" />
          </div>
        )}

        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          {room.isAvailable ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-red-500/20">
              <XCircle className="w-3 h-3" /> Unavailable
            </span>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <h3 className="text-base font-semibold leading-tight text-gray-900">
            {room.name}
          </h3>
          <span className="w-fit shrink-0 rounded-md bg-gray-50 px-2.5 py-1 text-sm font-bold text-gray-900 ring-1 ring-gray-200">
            ${room.pricePerNight}<span className="text-gray-400 font-normal text-xs">/night</span>
          </span>
        </div>

        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 ring-1 ring-gray-100">
            <BedDouble className="w-3.5 h-3.5 text-gray-400" /> {room.bedrooms}
          </span>
          <span className="flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 ring-1 ring-gray-100">
            <Bath className="w-3.5 h-3.5 text-gray-400" /> {room.bathrooms}
          </span>
          <span className="flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 ring-1 ring-gray-100">
            <Users className="w-3.5 h-3.5 text-gray-400" /> {room.maxGuests}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 border-t border-gray-100 pt-3">
          <Link
            href={`/admin/rooms/${room.id}/edit`}
            className="admin-secondary-button flex-1 text-sm"
          >
            <Edit className="w-3.5 h-3.5" /> Edit
          </Link>
          <button
            onClick={() => onDelete(room.id)}
            className="admin-danger-button text-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
