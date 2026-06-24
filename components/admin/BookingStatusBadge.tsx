import { BookingStatus } from "@/lib/firestore/bookings";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const colors = {
    pending: "bg-[#f3dfb7] text-[#7b4f1f]",
    confirmed: "bg-[#dfe9dc] text-[#465143]",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${colors[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
