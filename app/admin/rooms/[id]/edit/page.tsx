"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { RoomForm } from "@/components/admin/RoomForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getRoomById, updateRoom, Room, RoomFormData } from "@/lib/firestore/rooms";
import { Spinner } from "@/components/ui/Spinner";
import { BedDouble } from "lucide-react";

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchRoom = async () => {
      try {
        const data = await getRoomById(id);
        if (data) {
          setRoom(data);
        } else {
          router.push("/admin/rooms");
        }
      } catch (error) {
        console.error("Failed to fetch room:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, router]);

  const handleSubmit = async (data: RoomFormData) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateRoom(id, data);
      router.push("/admin/rooms");
    } catch (error) {
      console.error("Failed to update room:", error);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="admin-empty-state py-24 text-center admin-fade-in">
        <div className="admin-empty-icon mb-4">
          <BedDouble className="h-6 w-6" />
        </div>
        <p className="font-semibold" style={{ color: "var(--ra-ink-strong)" }}>Room not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl admin-fade-in">
      <AdminPageHeader
        kicker="Inventory"
        title="Edit room"
        subtitle="Refine the listing, rates, and availability guests see before booking."
        backHref="/admin/rooms"
        backLabel="Back to rooms"
      />
      <RoomForm defaultValues={room} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
