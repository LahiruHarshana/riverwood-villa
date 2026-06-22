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
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-bold text-slate-900">LOADING BOOKINGS...</div>
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-xl">
          <p className="text-slate-500">No bookings found</p>
        </div>
      ) : (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
          <BookingTable data={filteredBookings} />
        </div>
      )}
    </div>
  );
}
