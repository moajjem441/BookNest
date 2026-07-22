"use client";

import { BookOpen } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const STATS_DATA = [
  { month: "Jan", physicalExchanges: 120, digitalDownloads: 250 },
  { month: "Feb", physicalExchanges: 190, digitalDownloads: 410 },
  { month: "Mar", physicalExchanges: 280, digitalDownloads: 580 },
  { month: "Apr", physicalExchanges: 390, digitalDownloads: 820 },
  { month: "May", physicalExchanges: 520, digitalDownloads: 1100 },
  { month: "Jun", physicalExchanges: 710, digitalDownloads: 1450 },
];

export default function Statistics() {
  return (
    <section className="py-20 bg-slate-900/40 border-y border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Platform Impact</span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Empowering Communities Through Shared Knowledge
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track how neighborhood exchanges and legal digital readings are growing month over month.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-2xl font-bold text-blue-400">2,500+</p>
                <p className="text-xs text-slate-400 mt-1">Physical Handovers</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-2xl font-bold text-cyan-400">4,800+</p>
                <p className="text-xs text-slate-400 mt-1">PDF Reads & Downloads</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-950/80 p-6 rounded-3xl border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Community Exchange Growth (2026)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={STATS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPhysical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDigital" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="digitalDownloads" stroke="#06b6d4" fillOpacity={1} fill="url(#colorDigital)" name="Digital Downloads" />
                  <Area type="monotone" dataKey="physicalExchanges" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPhysical)" name="Physical Exchanges" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}