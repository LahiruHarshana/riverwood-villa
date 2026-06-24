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
      <div className="admin-loading">
        <div>Loading rooms</div>
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
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="admin-page-kicker">Inventory</span>
          <h1 className="admin-page-title">Rooms</h1>
          <p className="admin-page-subtitle">Shape room listings with polished images, guest capacity, rates, and availability.</p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="admin-primary-button"
        >
          <Plus className="w-4 h-4" /> Add Room
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="admin-empty-state py-16 text-center">
          <p className="mb-4 font-semibold text-[#6f746a]">No rooms found</p>
          <Link
            href="/admin/rooms/new"
            className="admin-secondary-button"
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
