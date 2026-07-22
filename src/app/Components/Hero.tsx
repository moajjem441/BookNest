"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  FileText, 
  Users, 
  ArrowRight, 
  PlusCircle, 
  ShieldCheck, 
  Sparkles,
  BookCheck 
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/60">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Community-Driven Book Sharing
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Share Physical Books, <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                Read Digital PDFs Nearby
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Connect with readers in your neighborhood. Exchange physical books sitting idle on your shelf, or read verified legal PDF versions instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/books"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                Browse Books
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/share"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800/80 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-blue-400" />
                Share a Book
              </Link>
            </div>

            <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Verified Legal PDFs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Local Neighborhood Focus</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Card Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-sm rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Currently Nearby</p>
                  <p className="text-sm font-semibold text-white">Dhaka, Bangladesh</p>
                </div>
              </div>

              <div className="py-4 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <FileText className="w-8 h-8 text-cyan-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">Clean Code (6th Edition)</p>
                    <p className="text-[11px] text-slate-400">Physical + PDF Copy Available</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Ready</span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <BookCheck className="w-8 h-8 text-blue-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">Sapiens: A Brief History</p>
                    <p className="text-[11px] text-slate-400">Borrow physically from Adnan</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-bold">Handover</span>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl border border-blue-500/30 flex items-center justify-between">
                <span className="text-xs text-blue-300 font-medium">Have unread books?</span>
                <Link href="/share" className="text-xs font-bold text-cyan-300 hover:underline">List now →</Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}