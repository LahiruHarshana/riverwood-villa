"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { Booking } from "@/lib/firestore/bookings";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { CalendarDays, ChevronLeft, ChevronRight, ChevronsUpDown, Trash2, Users } from "lucide-react";
import Swal from "sweetalert2";

interface BookingTableProps {
  data: Booking[];
  onDelete?: (id: string) => void;
}

const columnHelper = createColumnHelper<Booking>();

const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export function BookingTable({ data, onDelete }: BookingTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);

  const requestDelete = async (booking: Booking) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Remove this cancelled booking permanently? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, remove it!'
    });
    if (result.isConfirmed) {
      onDelete?.(booking.id);
    }
  };

  const columns = [
    columnHelper.accessor("guestName", {
      header: "Guest",
      cell: (info) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-600">
            {(info.getValue() || "?").charAt(0)}
          </div>
          <span className="font-medium" style={{ color: "var(--ra-ink)" }}>{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("roomName", {
      header: "Room",
      cell: (info) => <span style={{ color: "var(--ra-ink)" }}>{info.getValue()}</span>,
    }),
    columnHelper.accessor("checkIn", {
      header: "Check-in",
      cell: (info) => <span style={{ color: "var(--ra-ink-muted)" }}>{formatDate(info.getValue())}</span>,
    }),
    columnHelper.accessor("checkOut", {
      header: "Check-out",
      cell: (info) => <span style={{ color: "var(--ra-ink-muted)" }}>{formatDate(info.getValue())}</span>,
    }),
    columnHelper.accessor("guests", {
      header: "Guests",
      cell: (info) => <span style={{ color: "var(--ra-ink-muted)" }}>{info.getValue()}</span>,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <BookingStatusBadge status={info.getValue()} dot />,
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => {
        const booking = info.row.original;
        if (booking.status !== "cancelled") return null;
        return (
          <button
            onClick={async (e) => {
              e.stopPropagation();
              await requestDelete(booking);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Remove booking"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const rows = table.getRowModel().rows;
  const pageCount = Math.max(table.getPageCount(), 1);

  return (
    <div className="space-y-4">
      {rows.length === 0 ? (
        <div className="admin-empty-state py-12 text-center">
          <div className="admin-empty-icon mb-3">
            <CalendarDays className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--ra-ink-muted)" }}>No matching bookings</p>
        </div>
      ) : null}

      {rows.length > 0 && (
        <div className="hidden overflow-x-auto rounded-lg border md:block" style={{ borderColor: "var(--ra-line)" }}>
          <table className="w-full text-left text-sm admin-table admin-table-zebra">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={header.column.getCanSort() ? "cursor-pointer select-none flex items-center gap-1.5" : ""}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && <ChevronsUpDown className="w-3 h-3" style={{ color: "var(--ra-ink-faint)" }} />}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => router.push(`/admin/bookings/${row.original.id}`)}
                  className="transition-all duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length > 0 && (
        <div className="grid gap-3 md:hidden">
          {rows.map((row) => {
            const booking = row.original;

            return (
              <div
                key={booking.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/admin/bookings/${booking.id}`);
                  }
                }}
                className="admin-booking-mobile-card text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="admin-booking-avatar">
                      {(booking.guestName || "?").charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black" style={{ color: "var(--ra-ink-strong)" }}>
                        {booking.guestName}
                      </p>
                      <p className="mt-0.5 truncate text-xs font-semibold" style={{ color: "var(--ra-ink-muted)" }}>
                        {booking.roomName}
                      </p>
                    </div>
                  </div>
                  <BookingStatusBadge status={booking.status} dot />
                </div>

                <div className="admin-booking-mobile-meta">
                  <span>
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                  </span>
                  <span>
                    <Users className="h-3.5 w-3.5" />
                    {booking.guests} guest{booking.guests === 1 ? "" : "s"}
                  </span>
                </div>

                {booking.status === "cancelled" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      requestDelete(booking);
                    }}
                    className="admin-booking-mobile-delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove cancelled booking
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="admin-table-pagination flex items-center justify-between px-1 py-3" style={{ borderTop: "1px solid var(--ra-line)" }}>
        <div className="text-sm" style={{ color: "var(--ra-ink-muted)" }}>
          Page <span className="font-semibold" style={{ color: "var(--ra-ink)" }}>{table.getState().pagination.pageIndex + 1}</span> of <span className="font-semibold" style={{ color: "var(--ra-ink)" }}>{pageCount}</span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderColor: "var(--ra-line)", background: "var(--ra-paper-raised)", color: "var(--ra-ink-muted)" }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ borderColor: "var(--ra-line)", background: "var(--ra-paper-raised)", color: "var(--ra-ink-muted)" }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
