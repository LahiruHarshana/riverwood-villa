"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/admin/StatsCard";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";
import { getRooms } from "@/lib/firestore/rooms";
import { getBookings, Booking } from "@/lib/firestore/bookings";
import { Spinner } from "@/components/ui/Spinner";
import { BedDouble, CalendarCheck, Clock, Users, DollarSign, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedThisMonth: 0,
    revenueThisMonth: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [upcomingCheckins, setUpcomingCheckins] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rooms, bookings] = await Promise.all([getRooms(), getBookings()]);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const pendingBookings = bookings.filter((b) => b.status === "pending");
        const confirmedThisMonth = bookings.filter(
          (b) => b.status === "confirmed" && new Date(b.createdAt) >= startOfMonth
        );

        const revenueThisMonth = confirmedThisMonth.reduce((total, booking) => {
          const nights = Math.max(
            1,
            Math.ceil(
              (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          );
          return total; // We don't have price per night in booking, so revenue is 0 for now
        }, 0);

        const next7Days = new Date();
        next7Days.setDate(next7Days.getDate() + 7);

        const upcoming = bookings
          .filter((b) => new Date(b.checkIn) >= now && new Date(b.checkIn) <= next7Days)
          .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

        setStats({
          totalRooms: rooms.length,
          totalBookings: bookings.length,
          pendingBookings: pendingBookings.length,
          confirmedThisMonth: confirmedThisMonth.length,
          revenueThisMonth,
        });

        setRecentBookings(bookings.slice(0, 5));
        setUpcomingCheckins(upcoming);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl font-bold text-slate-900">LOADING DASHBOARD...</div>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Total Rooms" value={stats.totalRooms} icon={BedDouble} color="bg-sky-500" />
        <StatsCard title="Total Bookings" value={stats.totalBookings} icon={CalendarCheck} color="bg-slate-600" />
        <StatsCard title="Pending Bookings" value={stats.pendingBookings} icon={Clock} color="bg-amber-500" />
        <StatsCard title="Confirmed (This Month)" value={stats.confirmedThisMonth} icon={Users} color="bg-green-500" />
        <StatsCard title="Est. Revenue" value={`$${stats.revenueThisMonth}`} icon={DollarSign} color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <p className="text-slate-500">No recent bookings</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900">{booking.guestName}</p>
                    <p className="text-sm text-slate-500">{booking.roomName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookingStatusBadge status={booking.status} />
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Check-ins */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Check-ins</h2>
          {upcomingCheckins.length === 0 ? (
            <p className="text-slate-500">No upcoming check-ins in the next 7 days</p>
          ) : (
            <div className="space-y-3">
              {upcomingCheckins.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900">{booking.guestName}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(booking.checkIn).toLocaleDateString()} · {booking.roomName}
                    </p>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
