"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import cn from "classnames";

type Props = {
  children: ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/customers", label: "Customers", icon: "👥" },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: "📢" },
  { href: "/dashboard/automations", label: "Automations", icon: "⚙️" },
  { href: "/dashboard/templates", label: "Templates", icon: "📝" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" }
];

export function DashboardShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      console.log("[LOGOUT] Initiating logout...");
      const response = await fetch("/api/auth/logout", { method: "POST" });

      if (response.ok) {
        console.log("[LOGOUT] Logout successful, redirecting to login...");
        router.push("/login");
      } else {
        console.error("[LOGOUT] Logout failed:", response.statusText);
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("[LOGOUT] Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-6 left-6 z-50 md:hidden bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition-colors"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform md:translate-x-0 md:relative md:h-auto z-40",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
          <Link href="/dashboard" className="text-2xl font-black text-slate-900">
            ⚡ Message Mitra
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all-smooth",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors text-center"
          >
            Logout 👋
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-20 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg flex items-center px-6 md:px-8">
          <div className="flex-1 text-white">
            <h2 className="text-2xl font-black">WhatsApp Automation</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-white text-sm text-right hidden sm:block">
              <p className="font-bold">Welcome back!</p>
              <p className="text-blue-100">Ready to automate? 🚀</p>
            </div>
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg transition-colors"
            >
              ⚙️
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

