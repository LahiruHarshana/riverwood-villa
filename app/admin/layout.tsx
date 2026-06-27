"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/hooks/useAuth";
import { Sidebar } from "@/components/admin/Sidebar";
import "./admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <AuthProvider>
        <div className="admin-app min-h-screen" style={{ background: "var(--ra-paper)" }}>
          {children}
        </div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="admin-app flex min-h-screen" style={{ background: "var(--ra-paper)" }}>
        <Sidebar currentPath={pathname} />
        <main className="admin-main flex-1 ml-0 md:ml-[260px] min-h-screen">
          <div className="admin-content">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
