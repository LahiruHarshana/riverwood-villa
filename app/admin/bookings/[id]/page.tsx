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
      <div className="flex items-center justify-center h-64">
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Booking Details</h1>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guest Details */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Guest Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-slate-400" />
              <span className="text-slate-700">{booking.guestName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <span className="text-slate-700">{booking.guestEmail}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-slate-400" />
              <span className="text-slate-700">{booking.guestPhone}</span>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Booking Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-400" />
              <span className="text-slate-700">
                Check-in: {new Date(booking.checkIn).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-400" />
              <span className="text-slate-700">
                Check-out: {new Date(booking.checkOut).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-400" />
              <span className="text-slate-700">Duration: {duration} nights</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-slate-400" />
              <span className="text-slate-700">{booking.guests} guests</span>
            </div>
            {booking.specialRequests && (
              <div className="flex items-start gap-3 pt-2">
                <MessageSquare className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Special Requests:</p>
                  <p className="text-slate-600">{booking.specialRequests}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Management */}
        <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Status Management</h2>
          <div className="flex gap-3">
            <button
              onClick={() => handleStatusChange("confirmed")}
              disabled={booking.status === "confirmed"}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" /> Confirm Booking
            </button>
            <button
              onClick={() => handleStatusChange("cancelled")}
              disabled={booking.status === "cancelled"}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-4 h-4" /> Cancel Booking
            </button>
          </div>
        </div>

        {/* WhatsApp Actions */}
        <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">WhatsApp Guest</h2>
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
          {/* Custom Message */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Custom Message</label>
            <textarea
              placeholder="Type your custom message here..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent mb-3"
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
