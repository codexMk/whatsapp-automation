"use client";

import { LanguageSelector } from "./LanguageSelector";
import Link from "next/link";

interface TopBarProps {
  userName?: string;
  showLanguageToggle?: boolean;
}

export function TopBar({ userName = "User", showLanguageToggle = true }: TopBarProps) {
  return (
    <div className="bg-white border-b-2 border-slate-200 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-black text-blue-600">Message Mitra</span>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {showLanguageToggle && <LanguageSelector />}

          {/* User menu */}
          <div className="flex items-center gap-3 pl-4 border-l-2 border-slate-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border-2 border-blue-200">
              <span className="text-lg font-bold text-blue-600">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">Business Account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
