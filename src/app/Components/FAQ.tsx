"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How does physical book sharing work?",
    a: "Users upload books they own. When a neighbor requests a book, you both receive contact details to arrange a safe local meeting or drop-off."
  },
  {
    q: "Can anyone upload a digital PDF?",
    a: "Only open-access books, public domain materials, or books where the uploader possesses explicit distribution rights are allowed. We enforce strict copyright guidelines."
  },
  {
    q: "Is BookNest completely free to use?",
    a: "Yes! BookNest is built for community growth and local knowledge sharing without commercial rental fees."
  },
  {
    q: "What if a physical book gets damaged or lost?",
    a: "Our community operates on trust and verified user ratings. We encourage set borrowing terms and deposit agreements for high-value books."
  }
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="py-20 bg-slate-900/30 border-t border-slate-800/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm mt-2">Everything you need to know about physical exchanges and legal PDF sharing.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div 
                key={i} 
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-base font-semibold text-white focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-400" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}