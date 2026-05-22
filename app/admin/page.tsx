"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminMainPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin dashboard
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="text-center">
        <p className="text-white text-lg">Loading admin dashboard...</p>
      </div>
    </div>
  );
}
