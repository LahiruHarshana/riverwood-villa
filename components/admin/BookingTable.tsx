"use client";

import { useState } from "react";
import Link from "next/link";
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
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface BookingTableProps {
  data: Booking[];
}

const columnHelper = createColumnHelper<Booking>();

export function BookingTable({ data }: BookingTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = [
    columnHelper.accessor("guestName", {
      header: "Guest Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("roomName", {
      header: "Room",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("checkIn", {
      header: "Check-in",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("checkOut", {
      header: "Check-out",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("guests", {
      header: "Guests",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <BookingStatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor("id", {
      header: "Actions",
      cell: (info) => (
        <Link
          href={`/admin/bookings/${info.getValue()}`}
          className="font-bold text-[#465143] hover:text-[#151512]"
        >
          View
        </Link>
      ),
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

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="bg-[#e8ebe3]/70 font-bold text-[#465143]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="whitespace-nowrap border-b border-[#151512]/10 px-4 py-4">
                    {header.isPlaceholder ? null : (
                      <div
                        className={header.column.getCanSort() ? "cursor-pointer select-none flex items-center gap-1" : ""}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && <ArrowUpDown className="w-3 h-3 text-[#6f7d6c]" />}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="text-[#151512] transition-colors hover:bg-[#fffdf7]/80">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap border-b border-[#151512]/10 px-4 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-sm font-semibold text-[#6f746a]">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-full border border-[#151512]/10 p-2 text-[#151512] hover:bg-[#fffdf7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-full border border-[#151512]/10 p-2 text-[#151512] hover:bg-[#fffdf7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
