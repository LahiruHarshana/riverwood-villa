"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { getBookingById, updateBookingStatus, Booking } from "@/lib/firestore/bookings";
import { Spinner } from "@/components/ui/Spinner";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";
import { WhatsAppButton } from "@/components/admin/WhatsAppButton";
import { User, Mail, Phone, Calendar, Users, Clock, MessageSquare, CheckCircle, XCircle } from "lucide-react";

export default function BookingDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        const data = await getBookingById(id);
        setBooking(data);
      } catch (error) {
        console.error("Failed to fetch booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const duration = useMemo(() => {
    if (!booking) return 0;
    const diff = new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [booking]);

  const handleStatusChange = async (status: "confirmed" | "cancelled") => {
    if (!booking) return;
    try {
      await updateBookingStatus(booking.id, status);
      setBooking((prev) => (prev ? { ...prev, status } : null));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div>Loading booking</div>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Booking not found.</p>
      </div>
    );
  }

  const prebuiltMessages = [
    {
      label: "Confirm Booking",
      message: `Hi ${booking.guestName}, your booking at Riverwood Villa (${booking.roomName}, ${new Date(booking.checkIn).toLocaleDateString()}–${new Date(booking.checkOut).toLocaleDateString()}) is confirmed. We look forward to hosting you!`,
    },
    {
      label: "Request Deposit",
      message: `Hi ${booking.guestName}, thank you for booking Riverwood Villa. To secure your reservation, please send a 30% deposit to [payment details].`,
    },
    {
      label: "Ask for Details",
      message: `Hi ${booking.guestName}, we received your booking request. Could you confirm the number of guests and any dietary requirements?`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="admin-page-kicker">Guest request</span>
          <h1 className="admin-page-title">Booking details</h1>
          <p className="admin-page-subtitle">Review the stay, update status, and send a clear message to the guest.</p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-panel p-6">
          <h2 className="mb-4 font-serif text-2xl font-medium tracking-[-0.04em] text-[#151512]">Guest information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#6f7d6c]" />
              <span className="font-semibold text-[#151512]">{booking.guestName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#6f7d6c]" />
              <span className="text-[#6f746a]">{booking.guestEmail}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#6f7d6c]" />
              <span className="text-[#6f746a]">{booking.guestPhone}</span>
            </div>
          </div>
        </div>

        <div className="admin-panel p-6">
          <h2 className="mb-4 font-serif text-2xl font-medium tracking-[-0.04em] text-[#151512]">Stay information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#6f7d6c]" />
              <span className="text-[#6f746a]">
                Check-in: {new Date(booking.checkIn).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#6f7d6c]" />
              <span className="text-[#6f746a]">
                Check-out: {new Date(booking.checkOut).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#6f7d6c]" />
              <span className="text-[#6f746a]">Duration: {duration} nights</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#6f7d6c]" />
              <span className="text-[#6f746a]">{booking.guests} guests</span>
            </div>
            {booking.specialRequests && (
              <div className="flex items-start gap-3 pt-2">
                <MessageSquare className="w-5 h-5 text-[#6f7d6c] mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#465143]">Special Requests:</p>
                  <p className="text-[#6f746a]">{booking.specialRequests}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="admin-panel lg:col-span-2 p-6">
          <h2 className="mb-4 font-serif text-2xl font-medium tracking-[-0.04em] text-[#151512]">Status management</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => handleStatusChange("confirmed")}
              disabled={booking.status === "confirmed"}
              className="admin-primary-button disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" /> Confirm Booking
            </button>
            <button
              onClick={() => handleStatusChange("cancelled")}
              disabled={booking.status === "cancelled"}
              className="admin-danger-button disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" /> Cancel Booking
            </button>
          </div>
        </div>

        <div className="admin-panel lg:col-span-2 p-6">
          <h2 className="mb-4 font-serif text-2xl font-medium tracking-[-0.04em] text-[#151512]">WhatsApp guest</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prebuiltMessages.map((msg) => (
              <WhatsAppButton
                key={msg.label}
                phone={booking.guestPhone}
                message={msg.message}
                label={msg.label}
              />
            ))}
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-bold text-[#465143]">Custom Message</label>
            <textarea
              placeholder="Type your custom message here..."
              className="admin-input mb-3"
              rows={3}
              id="customMessage"
            />
            <WhatsAppButton
              phone={booking.guestPhone}
              message=""
              label="Send Custom Message"
              customMessageId="customMessage"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
