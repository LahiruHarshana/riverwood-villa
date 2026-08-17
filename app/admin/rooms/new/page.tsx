"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoomForm } from "@/components/admin/RoomForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
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
    <div className="mx-auto max-w-3xl admin-fade-in">
      <AdminPageHeader
        kicker="Inventory"
        title="Add room"
        subtitle="Create a room listing with guest-ready details and imagery."
        backHref="/admin/rooms"
        backLabel="Back to rooms"
      />
      <RoomForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
