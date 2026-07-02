"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Room } from "@/lib/firestore/rooms";
import { Spinner } from "@/components/ui/Spinner";
import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const bookingFormSchema = z.object({
  roomId: z.string().min(1, "Please select a room"),
  roomName: z.string(),
  guestName: z.string().min(1, "Full name is required"),
  guestEmail: z.string().email("Invalid email"),
  guestPhone: z.string().min(1, "Phone number is required"),
  checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  guests: z.number().min(1, "At least 1 guest"),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  rooms: Room[];
}

export function BookingForm({ rooms }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormValues | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { guests: 1 },
  });

  const selectedRoomId = watch("roomId");
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  const onSubmit = async (data: BookingFormValues) => {
    if (!selectedRoom) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          roomName: selectedRoom.name,
          checkIn: new Date(data.checkIn).toISOString(),
          checkOut: new Date(data.checkOut).toISOString(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setBookingData(data);
      }
    } catch (error) {
      console.error("Booking submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94765670128";
  const waLink =
    whatsappNumber && bookingData && selectedRoom
      ? getWhatsAppUrl(
          whatsappNumber,
          `Hi, I just submitted a booking request.\n\n*Room:* ${selectedRoom.name}\n*Dates:* ${bookingData.checkIn} to ${bookingData.checkOut}\n*Guests:* ${bookingData.guests}\n\n*Name:* ${bookingData.guestName}\n*Email:* ${bookingData.guestEmail}\n*Phone:* ${bookingData.guestPhone}${bookingData.specialRequests ? `\n*Special Requests:* ${bookingData.specialRequests}` : ''}`
        )
      : null;

  if (submitted && bookingData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold mb-4">Booking Request Sent!</h3>
        <p className="text-slate-600 mb-6">
          We will contact you on WhatsApp within a few hours.
        </p>
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <MessageCircle className="w-5 h-5" /> Open WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Room</label>
        <select
          {...register("roomId")}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        >
          <option value="">Select a room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} (${room.pricePerNight}/night, max {room.maxGuests} guests)
            </option>
          ))}
        </select>
        {errors.roomId && <p className="text-red-500 text-xs">{errors.roomId.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Check-in</label>
          <input
            type="date"
            {...register("checkIn")}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          {errors.checkIn && <p className="text-red-500 text-xs">{errors.checkIn.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Check-out</label>
          <input
            type="date"
            {...register("checkOut")}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          {errors.checkOut && <p className="text-red-500 text-xs">{errors.checkOut.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Guests</label>
        <input
          type="number"
          {...register("guests", { valueAsNumber: true })}
          min={1}
          max={selectedRoom?.maxGuests || 10}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
        {errors.guests && <p className="text-red-500 text-xs">{errors.guests.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Full Name</label>
        <input
          {...register("guestName")}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
        {errors.guestName && <p className="text-red-500 text-xs">{errors.guestName.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            {...register("guestEmail")}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          {errors.guestEmail && <p className="text-red-500 text-xs">{errors.guestEmail.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <input
            {...register("guestPhone")}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          {errors.guestPhone && <p className="text-red-500 text-xs">{errors.guestPhone.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Special Requests (optional)</label>
        <textarea
          {...register("specialRequests")}
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? <> <Spinner size="sm" /> Submitting...</> : "Request Booking"}
      </button>
    </form>
  );
}
