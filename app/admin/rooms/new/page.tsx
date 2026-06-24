"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoomForm } from "@/components/admin/RoomForm";
import { createRoom, RoomFormData } from "@/lib/firestore/rooms";

export default function NewRoomPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: RoomFormData) => {
    setIsSubmitting(true);
    try {
      await createRoom(data);
      router.push("/admin/rooms");
    } catch (error) {
      console.error("Failed to create room:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <span className="admin-page-kicker">Inventory</span>
        <h1 className="admin-page-title">Add room</h1>
        <p className="admin-page-subtitle">Create a room listing with guest-ready details and imagery.</p>
      </div>
      <div className="admin-panel p-6 md:p-8">
        <RoomForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
