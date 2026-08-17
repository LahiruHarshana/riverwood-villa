"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/hooks/useAuth";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export function AdminShell({ children }: { children: React.ReactNode }) {
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
        <main className="admin-main flex-1 ml-0 md:ml-[272px] min-h-screen">
          <AdminTopBar />
          <div className="admin-content">
            <div className="admin-page-wrapper">{children}</div>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
