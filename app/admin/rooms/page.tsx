"use client";

import { useState } from "react";
import Link from "next/link";
import { useRooms } from "@/hooks/useRooms";
import { RoomCard } from "@/components/admin/RoomCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { deleteRoom } from "@/lib/firestore/rooms";
import { Spinner } from "@/components/ui/Spinner";
import { Plus, Search, SlidersHorizontal, BedDouble } from "lucide-react";
import Swal from "sweetalert2";

export default function RoomsPage() {
  const { rooms, loading, error, refetch } = useRooms();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableCount = rooms.filter((room) => room.isAvailable).length;

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this room? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    setDeletingId(id);
    try {
      await deleteRoom(id);
      refetch();
      Swal.fire({
        title: "Deleted!",
        text: "Room has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to delete room:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center admin-fade-in">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: "var(--ra-rose-bg)", color: "var(--ra-rose)" }}>
          <SlidersHorizontal className="h-6 w-6" />
        </div>
        <p className="mt-4 font-semibold" style={{ color: "var(--ra-ink)" }}>Failed to load rooms</p>
        <p className="text-sm mt-1" style={{ color: "var(--ra-ink-muted)" }}>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 admin-fade-in">
      <AdminPageHeader
        kicker="Inventory"
        title="Rooms"
        subtitle="Manage room listings with images, capacity, rates, and availability."
        actions={
          <Link href="/admin/rooms/new" className="admin-primary-button shrink-0">
            <Plus className="w-4 h-4" /> Add room
          </Link>
        }
      />

      <div className="admin-summary-strip">
        <div className="admin-summary-item">
          <span>Total rooms</span>
          <strong>{rooms.length}</strong>
        </div>
        <div className="admin-summary-item">
          <span>Available</span>
          <strong>{availableCount}</strong>
        </div>
        <div className="admin-summary-item">
          <span>Unavailable</span>
          <strong>{rooms.length - availableCount}</strong>
        </div>
      </div>

      <div className="admin-toolbar-panel">
        <div className="admin-toolbar-panel-row">
          <div className="relative admin-search-wrap">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ra-ink-faint)" }} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input !pl-9"
            />
          </div>
          <p className="admin-results-note">
            Showing {filteredRooms.length} of {rooms.length} room{rooms.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="admin-empty-state py-16 text-center">
          <div className="admin-empty-icon mb-4">
            <BedDouble className="h-6 w-6" />
          </div>
          <p className="mb-1 font-medium" style={{ color: "var(--ra-ink-muted)" }}>No rooms found</p>
          <p className="text-sm mb-5" style={{ color: "var(--ra-ink-faint)" }}>Create your first room to start accepting bookings.</p>
          <Link href="/admin/rooms/new" className="admin-primary-button">
            <Plus className="w-4 h-4" /> Create your first room
          </Link>
        </div>
      ) : (
        <div className="admin-room-grid grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredRooms.map((room) => (
            <div key={room.id} className={deletingId === room.id ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
              <RoomCard room={room} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
