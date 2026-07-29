"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  Bookmark, 
  X,
  LifeBuoy,
  LogOut,
  Sparkles
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Shared Books", href: "/dashboard/shared-books", icon: BookOpen },
    { name: "Borrowed Requests", href: "/dashboard/borrowed-requests", icon: Bookmark },
    
   
  ];

  return (
    <div className="h-full flex flex-col justify-between p-4 selection:bg-blue-500 selection:text-white">
      <div className="space-y-6">
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <p className="text-xs font-extrabold text-white uppercase tracking-wider">
              Dashboard Navigation
            </p>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close Navigation"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/50 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Header Label */}
        <div className="hidden lg:block px-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Menu Navigation
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`relative group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/15 to-indigo-600/10 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/5"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent hover:border-slate-800"
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                )}

                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                }`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Support Card */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-slate-200">
            <LifeBuoy className="w-4 h-4 text-blue-400 shrink-0" />
            <p className="text-xs font-semibold">Need Help?</p>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Having trouble with book exchanges or account settings?
          </p>
          <Link
            href="/contact"
            onClick={onClose}
            className="inline-block text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors pt-1"
          >
            Contact Support &rarr;
          </Link>
        </div>
      </div>

    </div>
  );
}