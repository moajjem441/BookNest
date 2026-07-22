"use client";

import { BookOpen, Heart, FileText, Sparkles } from "lucide-react";

const CATEGORIES = [
  { name: "Programming & Tech", count: "320+ Books", icon: BookOpen, color: "from-blue-500/20 to-cyan-500/10" },
  { name: "Literature & Fiction", count: "450+ Books", icon: Heart, color: "from-indigo-500/20 to-purple-500/10" },
  { name: "Academic & Science", count: "280+ Books", icon: FileText, color: "from-cyan-500/20 to-teal-500/10" },
  { name: "Self-Improvement", count: "210+ Books", icon: Sparkles, color: "from-amber-500/20 to-orange-500/10" },
];

export default function Categories() {
  return (
    <section className="py-16 bg-slate-900/50 border-y border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Browse by Category</h2>
          <p className="text-slate-400 text-sm mt-2">Find what interests you across both physical collections and legal digital copies.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div 
                key={i}
                className={`p-6 rounded-3xl bg-gradient-to-br ${cat.color} bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all group`}
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{cat.count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}