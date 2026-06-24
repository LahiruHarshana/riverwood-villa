"use client";

import { useState } from "react";
import { useBookings } from "@/hooks/useBookings";
import { BookingTable } from "@/components/admin/BookingTable";
import { Spinner } from "@/components/ui/Spinner";
import { Filter } from "lucide-react";

export default function BookingsPage() {
  const { bookings, loading, error } = useBookings();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = statusFilter === "all"
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  if (loading) {
    return (
      <div className="admin-loading">
        <div>Loading bookings</div>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load bookings. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="admin-page-kicker">Reservations</span>
          <h1 className="admin-page-title">Bookings</h1>
          <p className="admin-page-subtitle">Filter enquiries, confirm guests, and keep every stay moving smoothly.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#151512]/10 bg-[#fffdf7]/70 px-3 py-2 shadow-sm">
          <Filter className="w-4 h-4 text-[#6f7d6c]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent px-2 py-1 text-sm font-bold text-[#151512] outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="admin-empty-state py-16 text-center">
          <p className="font-semibold text-[#6f746a]">No bookings found</p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <BookingTable data={filteredBookings} />
        </div>
      )}
    </div>
  );
}
