"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBookingById, updateBookingStatus, deleteBooking, Booking } from "@/lib/firestore/bookings";
import { Spinner } from "@/components/ui/Spinner";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";
import { WhatsAppButton } from "@/components/admin/WhatsAppButton";
import { User, Mail, Phone, Calendar, Users, Clock, MessageSquare, CheckCircle, XCircle, ArrowLeft, DollarSign, Trash2 } from "lucide-react";

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<"confirmed" | "cancelled" | null>(null);
  const [deleting, setDeleting] = useState(false);
  const customMsgRef = useRef<HTMLTextAreaElement | null>(null);

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

  const handleDelete = async () => {
    if (!booking) return;
    if (!confirm("Remove this cancelled booking permanently? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteBooking(booking.id);
      router.push("/admin/bookings");
    } catch (error) {
      console.error("Failed to delete booking:", error);
      setDeleting(false);
    }
  };

  const handleStatusChange = async (status: "confirmed" | "cancelled") => {
    if (!booking) return;
    if (status === "cancelled" && !confirm("Cancel this booking? This will notify the guest.")) return;
    setConfirmAction(status);
    try {
      await updateBookingStatus(booking.id, status);
      setBooking((prev) => (prev ? { ...prev, status } : null));
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setConfirmAction(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
          <Calendar className="h-6 w-6" />
        </div>
        <p className="font-semibold text-gray-900">Booking not found</p>
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
    <div className="space-y-6 admin-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:text-gray-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <span className="admin-page-kicker">Guest request</span>
          <h1 className="admin-page-title">Booking Details</h1>
          <p className="admin-page-subtitle">Review the stay, update status, and send a clear message to the guest.</p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Guest */}
        <div className="admin-panel p-6">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Guest information</h2>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
              <User className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-medium text-sm text-gray-900">{booking.guestName}</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-sm text-gray-600">{booking.guestEmail}</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-sm text-gray-600">{booking.guestPhone}</span>
            </div>
          </div>
        </div>

        {/* Stay */}
        <div className="admin-panel p-6">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Stay information</h2>
          </div>
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Check-in</p>
                <p className="font-medium text-sm text-gray-900">{new Date(booking.checkIn).toLocaleDateString()}</p>
              </div>
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Check-out</p>
                <p className="font-medium text-sm text-gray-900">{new Date(booking.checkOut).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-sm text-gray-600">Duration: <strong className="text-gray-900">{duration} nights</strong></span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
              <Users className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-sm text-gray-600">{booking.guests} guests</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
              <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-sm text-gray-600">Total: <strong className="text-gray-900">${(booking.total || 0).toLocaleString()}</strong></span>
            </div>
            {booking.specialRequests && (
              <div className="flex items-start gap-3 rounded-lg bg-amber-50 px-4 py-3 border border-amber-200/50">
                <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-0.5">Special Requests</p>
                  <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Management */}
        <div className="admin-panel lg:col-span-2 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                <CheckCircle className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">Status management</h2>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <button
              onClick={() => handleStatusChange("confirmed")}
              disabled={booking.status === "confirmed" || confirmAction !== null}
              className="admin-primary-button disabled:cursor-not-allowed disabled:opacity-30 min-w-[160px]"
            >
              {confirmAction === "confirmed" ? <Spinner size="sm" /> : <CheckCircle className="w-4 h-4" />}
              {booking.status === "confirmed" ? "Already Confirmed" : "Confirm Booking"}
            </button>
            <button
              onClick={() => handleStatusChange("cancelled")}
              disabled={booking.status === "cancelled" || confirmAction !== null}
              className="admin-danger-button disabled:cursor-not-allowed disabled:opacity-30 min-w-[160px]"
            >
              {confirmAction === "cancelled" ? <Spinner size="sm" /> : <XCircle className="w-4 h-4" />}
              {booking.status === "cancelled" ? "Already Cancelled" : "Cancel Booking"}
            </button>
            {booking.status === "cancelled" && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="admin-danger-button disabled:cursor-not-allowed disabled:opacity-30 min-w-[160px] !border-red-600 !text-red-600 hover:!bg-red-600 hover:!text-white"
              >
                {deleting ? <Spinner size="sm" /> : <Trash2 className="w-4 h-4" />}
                Remove Booking
              </button>
            )}
          </div>
        </div>

        {/* WhatsApp */}
        <div className="admin-panel lg:col-span-2 p-6">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Contact guest</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {prebuiltMessages.map((msg) => (
              <WhatsAppButton
                key={msg.label}
                phone={booking.guestPhone}
                message={msg.message}
                label={msg.label}
              />
            ))}
          </div>
          <div className="mt-5 border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-2.5">Custom Message</h3>
            <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-end">
              <textarea
                ref={customMsgRef}
                placeholder="Type your custom message here..."
                className="admin-input flex-1 min-h-[70px]"
                rows={2}
              />
              <WhatsAppButton
                phone={booking.guestPhone}
                message=""
                label="Send Custom"
                customMessageRef={customMsgRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
