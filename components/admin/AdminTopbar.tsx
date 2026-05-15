"use client";

import { useState } from "react";
import { Menu, Search, Bell, Moon, Sun, ChevronDown, User, LogOut, Settings } from "lucide-react";

interface TopbarProps {
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
}

export default function AdminTopbar({ onToggleSidebar, onToggleMobileSidebar }: TopbarProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 lg:px-6 h-16 flex items-center gap-4">
      {/* Toggle sidebar (desktop) */}
      <button
        onClick={onToggleSidebar}
        className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Toggle sidebar (mobile) */}
      <button
        onClick={onToggleMobileSidebar}
        className="flex lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search or type command..."
          className="w-full pl-9 pr-4 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-slate-700 placeholder:text-slate-400 transition-all"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
          Ctrl K
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode((v) => !v)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Profile (Static) */}
        <div className="flex items-center gap-2.5 pl-1 pr-2 py-1">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
            A
          </div>
          <div className="hidden md:block text-left">
            <p className="text-[13px] font-medium text-slate-700 leading-tight">Admin Bali Travel</p>
            <p className="text-[11px] text-slate-400 leading-tight">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
