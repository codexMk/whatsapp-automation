import type { ReactNode } from "react";
import "./globals.css";
import "./tailwind-out.css";
import { CategoryProvider } from "@/lib/category-context";

export const metadata = {
  title: "WhatsApp Automation SaaS",
  description: "SaaS starter for WhatsApp automation for local businesses"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <CategoryProvider>
          {children}
        </CategoryProvider>
      </body>
    </html>
  );
}
