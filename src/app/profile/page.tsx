"use client";

import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { User, Mail, Calendar, Shield, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function ProfilePage() {
  // ✅ Better Auth uses `isPending` instead of `status`
  const { data: session, isPending } = useSession();

  // Date Formatter Helper
  const formatDate = (date?: Date | string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fallback Avatar Image
  const defaultImage =
    "https://static.vecteezy.com/system/resources/thumbnails/067/968/582/small/default-avatar-profile-icon-social-media-user-photo-vector.jpg";

  // 1. Loading State
  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          <span className="text-sm font-medium text-slate-300">Loading profile...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="text-center bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md space-y-3">
          <p className="text-lg font-bold text-white">Access Denied</p>
          <p className="text-xs text-slate-400">
            Please log in to view your profile session details.
          </p>
        </div>
      </div>
    );
  }

  // 3. Extract Session User Info
  const user = session.user;
  const userRole = (user as { role?: string })?.role || "user";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">

        {/* Header / Avatar & Primary Session Details */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-800 border-2 border-slate-700 overflow-hidden shrink-0 shadow-lg relative">
            <Image
              src={user.image || defaultImage}
              alt={user.name || "User Avatar"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="text-center sm:text-left space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-white capitalize">
                {user.name || "N/A"}
              </h1>
              <span className="px-3 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center gap-1 capitalize">
                <Shield className="w-3 h-3" /> {userRole}
              </span>
            </div>

            <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-4 h-4 text-slate-500" /> {user.email || "N/A"}
            </p>

            <div className="pt-1">
              {session?.user ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" /> User Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
                  <XCircle className="w-3.5 h-3.5" /> Not Logged In
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Account Role */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-slate-400" /> Account Role
            </span>
            <p className="text-sm font-semibold text-slate-200 capitalize">
              {userRole}
            </p>
          </div>

          {/* Created At */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Account Created
            </span>
            <p className="text-xs font-medium text-slate-300">
              {formatDate(user.createdAt)}
            </p>
          </div>

          {/* Updated At */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Last Updated
            </span>
            <p className="text-xs font-medium text-slate-300">
              {formatDate(user.updatedAt)}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}