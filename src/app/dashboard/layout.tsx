"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Mobile Toggle Bar (শুধুমাত্র ছোট স্ক্রিনে দেখাবে) */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800 sticky top-16 z-30 backdrop-blur-md">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700/50 transition-all cursor-pointer"
        >
          <Menu className="w-4 h-4" /> Dashboard Menu
        </button>
      </div>

      {/* Main Body Container */}
      <div className="flex flex-1 pt-0 lg:pt-16">
        
        {/* Desktop Sidebar (বড় স্ক্রিনের জন্য) */}
        <aside className="w-64 hidden lg:block shrink-0 border-r border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-16 h-[calc(100vh-4rem)]">
          <Sidebar />
        </aside>

        {/* Mobile Drawer Sidebar (মোবাইলের জন্য Slide-in Menu) */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Dark Overlay Background */}
            <div 
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileOpen(false)}
            />
            {/* Drawer Panel */}
            <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 p-4 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</span>
                  <button 
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}