import { BookingStatus } from "@/lib/firestore/bookings";

interface BookingStatusBadgeProps {
  status: BookingStatus;
  dot?: boolean;
}

export function BookingStatusBadge({ status, dot }: BookingStatusBadgeProps) {
  const base = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold";

  const styles = {
    pending: {
      badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20",
      dot: "bg-amber-500",
    },
    confirmed: {
      badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20",
      dot: "bg-emerald-500",
    },
    cancelled: {
      badge: "bg-red-50 text-red-700 ring-1 ring-red-500/20",
      dot: "bg-red-500",
    },
  };

  const s = styles[status];

  return (
    <span className={`${base} ${s.badge}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0`} />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
