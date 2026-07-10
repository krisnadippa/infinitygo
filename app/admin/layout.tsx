"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { ToastProvider } from "@/components/admin/Toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-white flex print:bg-white print:block print:min-h-0">
      {/* Sidebar */}
      <div className="print:hidden">
        <AdminSidebar
          isOpen={sidebarOpen}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden print:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 print:min-h-0 print:ml-0 print:block ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        <div className="print:hidden">
          <AdminTopbar
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
            onToggleMobileSidebar={() => setMobileSidebarOpen((v) => !v)}
          />
        </div>
        <main className="flex-1 p-4 lg:p-6 xl:p-8 print:p-0 print:block">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}
