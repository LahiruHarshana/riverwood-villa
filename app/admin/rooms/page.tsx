"use client";

import { useState } from "react";
import Link from "next/link";
import { useRooms } from "@/hooks/useRooms";
import { RoomCard } from "@/components/admin/RoomCard";
import { deleteRoom } from "@/lib/firestore/rooms";
import { Spinner } from "@/components/ui/Spinner";
import { Plus } from "lucide-react";

export default function RoomsPage() {
  const { rooms, loading, error, refetch } = useRooms();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteRoom(id);
      refetch();
    } catch (err) {
      console.error("Failed to delete room:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-bold text-slate-900">LOADING ROOMS...</div>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load rooms. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Rooms</h1>
        <Link
          href="/admin/rooms/new"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Room
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-xl">
          <p className="text-slate-500 mb-4">No rooms found</p>
          <Link
            href="/admin/rooms/new"
            className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
          >
            <Plus className="w-4 h-4" /> Create your first room
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className={deletingId === room.id ? "opacity-50" : ""}>
              <RoomCard room={room} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
