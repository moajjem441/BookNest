

"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen, Handshake, Clock, Loader2, BarChart2, PieChart as PieIcon } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";

// 1. Recharts Components Import
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";

interface Activity {
  id: string;
  bookName: string;
  activity: "Shared" | "Borrowed" | "Requested";
  date: string;
}

interface Stats {
  sharedBooks: number;
  borrowedBooks: number;
  pendingRequests: number;
}

interface BorrowRequestItem {
  _id?: string;
  bookTitle?: string;
  bookName?: string;
  status?: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    sharedBooks: 0,
    borrowedBooks: 0,
    pendingRequests: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { data: session, isPending: isSessionLoading } = useSession();

  const fetchDashboardData = useCallback(async () => {
    let token: string | undefined;

    try {
      const { data: tokenData } = await authClient.token();
      token = tokenData?.token;
      if (!token) {
        throw new Error("No token received. Please login again.");
      }
    } catch {
      toast.error("Authentication failed. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [booksRes, requestsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/books`, {
          headers,
        }),
        fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/borrowRequests/email`,
          { headers }
        ),
      ]);

      let sharedBooks = 0;
      let borrowedBooks = 0;
      let pendingRequests = 0;
      let formattedActivities: Activity[] = [];

      if (booksRes.ok) {
        const booksData = await booksRes.json();
        sharedBooks = booksData.sharedBooksCount || 0;
      }

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();

        if (requestsData.stats) {
          borrowedBooks = requestsData.stats.borrowedBooksCount || 0;
          pendingRequests = requestsData.stats.pendingRequestsCount || 0;
        }

        const rawList: BorrowRequestItem[] = requestsData.borrowRequests || [];
        formattedActivities = rawList.slice(0, 5).map((item) => ({
          id: item._id?.toString() || Math.random().toString(),
          bookName: item.bookTitle || item.bookName || "Unknown Book",
          activity: item.status === "approved" ? "Borrowed" : "Requested",
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })
            : "Recently",
        }));
      }

      setStats({
        sharedBooks,
        borrowedBooks,
        pendingRequests,
      });
      setRecentActivities(formattedActivities);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Error loading dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSessionLoading) return;

    if (session) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [session, isSessionLoading, fetchDashboardData]);

  // 2. Prepare Data for Recharts
  const chartData = [
    { name: "Shared", count: stats.sharedBooks, color: "#3B82F6" }, // Blue
    { name: "Borrowed", count: stats.borrowedBooks, color: "#10B981" }, // Emerald
    { name: "Pending", count: stats.pendingRequests, color: "#F59E0B" }, // Amber
  ];

  if (loading || isSessionLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor your book sharing, borrowed items, and recent updates.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Total Shared
            </span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-white">{stats.sharedBooks}</p>
            <span className="text-[11px] text-slate-500">Books listed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Currently Borrowed
            </span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Handshake className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-white">
              {stats.borrowedBooks}
            </p>
            <span className="text-[11px] text-slate-500">Active reads</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Pending Requests
            </span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-white">
              {stats.pendingRequests}
            </p>
            <span className="text-[11px] text-slate-500">Awaiting approval</span>
          </div>
        </div>
      </div>

      {/* 📊 Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-400" /> Activity Summary
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Overview of books shared, borrowed, and pending
              </p>
            </div>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie/Doughnut Chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" /> Distribution
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Visual ratio of your dashboard activities
              </p>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Recent Activities
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Your latest interactions in the library
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {recentActivities.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No recent activities found.
            </p>
          ) : (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] font-bold text-slate-500 uppercase bg-slate-950/50 border-b border-slate-800/80">
                <tr>
                  <th scope="col" className="px-4 py-3 rounded-l-xl">
                    Book Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Activity
                  </th>
                  <th scope="col" className="px-4 py-3 text-right rounded-r-xl">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentActivities.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-medium text-slate-200">
                      {item.bookName}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                          item.activity === "Shared"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : item.activity === "Borrowed"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {item.activity}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-400">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}