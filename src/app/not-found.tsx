'use client'

import Link from "next/link";
import { BookOpen, Home, ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden text-slate-100 selection:bg-blue-500 selection:text-white px-4">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full p-8 md:p-12 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
        
        {/* Floating 404 Badge */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
          <div className="relative w-20 h-20 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-blue-400 shadow-inner">
            <SearchX className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        {/* Huge Gradient 404 Text */}
        <h1 className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent mb-2">
          404
        </h1>

        {/* Title & Description */}
        <h2 className="text-2xl font-bold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-medium text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 font-medium text-sm hover:bg-slate-800 hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="relative z-10 mt-8 flex items-center gap-2 text-slate-500 text-xs font-medium">
        <BookOpen className="w-4 h-4 text-blue-400" />
        <span>BookNest &copy; {new Date().getFullYear()}</span>
      </div>

    </div>
  );
}