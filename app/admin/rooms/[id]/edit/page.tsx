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
      <div className="flex items-center justify-center h-64">
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Room</h1>
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 md:p-8 shadow-sm">
        <RoomForm defaultValues={room} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
