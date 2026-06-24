"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { RoomForm } from "@/components/admin/RoomForm";
import { getRoomById, updateRoom, Room } from "@/lib/firestore/rooms";
import { Spinner } from "@/components/ui/Spinner";

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

  const handleSubmit = async (data: Omit<Room, "id" | "createdAt">) => {
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
        <div>Loading room</div>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Room not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <span className="admin-page-kicker">Inventory</span>
        <h1 className="admin-page-title">Edit room</h1>
        <p className="admin-page-subtitle">Refine the listing, rates, and availability guests see before booking.</p>
      </div>
      <div className="admin-panel p-6 md:p-8">
        <RoomForm defaultValues={room} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
