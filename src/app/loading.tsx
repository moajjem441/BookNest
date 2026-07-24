import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden selection:bg-blue-500 selection:text-white">
      
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Loading Card */}
      <div className="relative z-10 flex flex-col items-center gap-6 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl max-w-sm w-full mx-4 text-center">
        
        {/* Animated Icon & Spinner Ring */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Glow */}
          <div className="absolute w-20 h-20 rounded-2xl bg-blue-500/20 animate-ping" />

          {/* Rotating Gradient Spinner Ring */}
          <div className="w-16 h-16 rounded-2xl border-2 border-transparent border-t-blue-500 border-r-cyan-400 animate-spin" />

          {/* Center Book Icon */}
          <div className="absolute w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <BookOpen className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-xl tracking-tight text-white">
            Book<span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">Nest</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium tracking-wide animate-pulse">
            Loading books around your neighborhood...
          </p>
        </div>

        {/* Skeleton Progress Indicator Line */}
        <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-full w-1/2 animate-[loadingBar_1.5s_infinite_ease-in-out]" />
        </div>

      </div>

      {/* Tailwind Custom Keyframe for smooth progress bar animation */}
      <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}