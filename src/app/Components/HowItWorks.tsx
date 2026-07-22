"use client";

import { PlusCircle, Search, BookCheck } from "lucide-react";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "List Your Books",
    desc: "Upload details of physical books sitting on your shelf. Attach a legal PDF copy if you have digital distribution rights.",
    icon: PlusCircle
  },
  {
    step: "02",
    title: "Discover Nearby",
    desc: "Search by neighborhood location to find available physical copies or instantly read free shared eBooks.",
    icon: Search
  },
  {
    step: "03",
    title: "Connect & Exchange",
    desc: "Request a physical handover from your neighbor or download the digital PDF for instant reading.",
    icon: BookCheck
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">Simplified Workflow</p>
          <h2 className="text-3xl font-extrabold text-white">How BookNest Works</h2>
          <p className="text-slate-400 text-sm mt-2">Three simple steps to exchange knowledge in your community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {HOW_IT_WORKS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col items-center text-center">
                <span className="text-4xl font-black text-slate-800 mb-4">{item.step}</span>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-6">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}