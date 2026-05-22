'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CatchAllPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin panel
    router.push('/admin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="text-center">
        <p className="text-white text-lg">Redirecting to Admin Panel...</p>
      </div>
    </div>
  );
}
