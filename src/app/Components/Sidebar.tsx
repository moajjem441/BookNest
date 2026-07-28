"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  Bookmark, 
  PlusCircle, 
  Settings, 
  User,
  X 
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "My Books", href: "/dashboard/my-books", icon: BookOpen },
    { name: "Add Book", href: "/dashboard/add-book", icon: PlusCircle },
    { name: "Borrow Requests", href: "/dashboard/requests", icon: Bookmark },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-4 space-y-6">
      <div className="space-y-4">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-800">
          <p className="text-xs font-bold text-white uppercase tracking-wider">Navigation</p>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1">
          <p className="hidden lg:block px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Dashboard Menu
          </p>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // মোবাইলে ক্লিক করলে ড্রয়ার বন্ধ হবে
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
        <p className="font-medium text-slate-200">Need Help?</p>
        <p className="text-[11px] text-slate-500 mt-0.5">Contact system support</p>
      </div>
    </div>
  );
}