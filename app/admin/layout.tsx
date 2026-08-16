import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import "./admin.css";

export const metadata: Metadata = {
  title: { absolute: "Riverwood Villa Administration" },
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
