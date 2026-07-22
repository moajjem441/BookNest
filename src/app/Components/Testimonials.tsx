"use client";

const TESTIMONIALS = [
  {
    quote: "BookNest helped me find rare programming books right in my neighborhood (Mirpur). I exchanged two books physically and even accessed a digital reference manual!",
    author: "Mahfuzur Rahman",
    role: "Computer Science Student",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
  },
  {
    quote: "Instead of letting my university text books gather dust, I shared them here. Meeting fellow readers around Uttara has been an amazing bonus.",
    author: "Nusrat Jahan",
    role: "University Lecturer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white">What Neighbors Say</h2>
          <p className="text-slate-400 text-sm mt-2">Real feedback from community members sharing and reading books.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-slate-900 border border-slate-800/80 flex flex-col justify-between">
              <p className="text-slate-300 text-sm leading-relaxed italic mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.author} className="w-11 h-11 rounded-full object-cover border border-blue-500/30" />
                <div>
                  <h4 className="text-sm font-bold text-white">{t.author}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}