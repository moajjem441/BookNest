"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Users, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Active Books Shared", value: "1,200+" },
    { label: "Community Members", value: "850+" },
    { label: "Successful Borrows", value: "3,400+" },
    { label: "PDFs Available", value: "500+" },
  ];

  const values = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      title: "Knowledge Accessibility",
      description: "Making books—both physical and digital—accessible to everyone in our community without financial barriers.",
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      title: "Community First",
      description: "Connecting passionate readers, fostering discussions, and enabling seamless peer-to-peer book sharing.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Trust & Safety",
      description: "Providing a verified platform where book owners and borrowers can interact with peace of mind.",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-rose-400" />,
      title: "Sustainability",
      description: "Promoting book reusability to reduce paper waste and build an eco-friendly reading ecosystem.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3.5 py-1.5 rounded-full bg-blue-950/80 text-blue-400 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider inline-block"
          >
            About Our Platform
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white leading-tight"
          >
            Empowering Readers to Share, Discover, & Learn Together
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            We built this community platform to bridge the gap between avid readers. Whether you want to lend physical books, borrow from neighbors, or read digital PDFs, we make reading collaborative and hassle-free.
          </motion.p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-1">
              <p className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Core Values Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Why We Created This</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Our core principles define how we build tools for book lovers everywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="p-3 bg-slate-950 rounded-xl w-fit border border-slate-800">
                  {val.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{val.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{val.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call To Action */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/20 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to start sharing your library?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Join hundreds of readers today. Share your favorite books or request your next great read in just a few clicks.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/books"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              Explore Books <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}