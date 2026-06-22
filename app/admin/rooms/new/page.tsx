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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Add New Room</h1>
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 md:p-8 shadow-sm">
        <RoomForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
