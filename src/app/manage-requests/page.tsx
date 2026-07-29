"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  Mail,
  Calendar,
  BookOpen,
  X
} from "lucide-react";

// --- Types ---
export interface BorrowRequest {
  _id: string;
  userName?: string;
  name?: string;
  userEmail?: string;
  email?: string;
  userImage?: string;
  image?: string;
  bookTitle?: string;
  title?: string;
  bookCover?: string;
  requestDate?: string;
  createdAt?: string;
  status: string;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

const ITEMS_PER_PAGE = 8;

// Helper to normalize status strings to "Pending" | "Approved" | "Rejected"
const normalizeStatus = (status?: string): "Pending" | "Approved" | "Rejected" => {
  if (!status) return "Pending";
  const s = status.trim().toLowerCase();
  if (s === "approved") return "Approved";
  if (s === "rejected") return "Rejected";
  return "Pending";
};

export default function AdminManageRequestsPage() {
  // Data States
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [requestToDelete, setRequestToDelete] = useState<BorrowRequest | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Debounce logic for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

// Fetch All Borrow Requests
  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/borrow-requests`);

      if (!res.ok) throw new Error("Failed to load requests from server.");

      const data = await res.json();
      const fetchedRequests = data.requests || data;

      // Map & normalize incoming request objects safely
      const normalized = (Array.isArray(fetchedRequests) ? fetchedRequests : []).map((req: any) => {
        // Extract User Name across potential schema shapes
        const extractedName =
          req.userName ||
          req.user_name ||
          req.name ||
          req.user?.name ||
          req.user?.userName ||
          req.user?.displayName ||
          "N/A";

        // Extract User Email across potential schema shapes
        const extractedEmail =
          req.userEmail ||
          req.user_email ||
          req.email ||
          req.user?.email ||
          "N/A";

        // Extract User Image
        const extractedImage =
          req.userImage ||
          req.user_image ||
          req.image ||
          req.user?.image ||
          req.user?.avatar ||
          "";

        return {
          ...req,
          userName: extractedName,
          userEmail: extractedEmail,
          userImage: extractedImage,
          bookTitle: req.bookTitle || req.title || req.book_title || req.book?.title || "Untitled Book",
          requestDate: req.requestDate || req.createdAt || req.date || req.requestedAt || "",
          status: normalizeStatus(req.status),
        };
      });

      setRequests(normalized);
    } catch (err: any) {
      const errorMsg = err.message || "Error fetching requests.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Update Status Action (Approve / Reject)
  const handleStatusUpdate = async (id: string, newStatus: "Approved" | "Rejected") => {
    try {
      setUpdatingId(id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/borrow-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status.");

      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
      );

      toast.success(`Request marked as ${newStatus}!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Request Action
  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;

    try {
      setIsDeleting(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/borrow-requests/${requestToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete request.");

      setRequests((prev) => prev.filter((req) => req._id !== requestToDelete._id));

      toast.success("Borrow request deleted successfully!");
      setRequestToDelete(null);
    } catch (err: any) {
      toast.error(err.message || "Error deleting request.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter Logic
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const query = debouncedSearch.trim().toLowerCase();
      const userName = req.userName?.toLowerCase() || "";
      const userEmail = req.userEmail?.toLowerCase() || "";
      const bookTitle = req.bookTitle?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        userName.includes(query) ||
        userEmail.includes(query) ||
        bookTitle.includes(query);

      const matchesStatus =
        selectedStatus === "All" || req.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [requests, debouncedSearch, selectedStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedStatus]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRequests, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedStatus("All");
    setCurrentPage(1);
    toast.info("Filters reset to default");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ===== Header Section ===== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Manage <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">Borrow Requests</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Review, approve, reject, or delete user book borrow requests.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Total Requests</span>
            <p className="text-2xl font-bold text-blue-400">{requests.length} Items</p>
          </div>
        </div>

        {/* ===== Search & Filter Controls ===== */}
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by User Name, Email, or Book Title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
            {(["All", "Pending", "Approved", "Rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedStatus === status
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-950/40 text-slate-400 border border-slate-800/80 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Reset Alert */}
        {(searchQuery || selectedStatus !== "All") && (
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <span>
              Showing {filteredRequests.length} of {requests.length} requests
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>
        )}

        {/* ===== Requests Table ===== */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-xl">
          {isLoading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="text-center py-16 bg-red-950/10 border border-red-500/20 space-y-3">
              <p className="text-red-400 font-medium text-sm">{error}</p>
              <button
                onClick={fetchRequests}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : paginatedRequests.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mx-auto text-slate-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">No Borrow Requests Found</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                No matching requests found for your criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-4 px-6">User</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Requested Book</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {paginatedRequests.map((req) => (
                    <tr
                      key={req._id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* User Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                            {req.userImage ? (
                              <Image
                                src={req.userImage}
                                alt={req.userName || "User"}
                                width={36}
                                height={36}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <User className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {req.userName}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-slate-300">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[180px]">{req.userEmail}</span>
                        </div>
                      </td>

                      {/* Book Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="font-medium text-slate-200 line-clamp-1 max-w-[200px]">
                            {req.bookTitle}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-slate-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          {req.requestDate && !isNaN(new Date(req.requestDate).getTime())
                            ? new Date(req.requestDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                            req.status === "Approved"
                              ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                              : req.status === "Rejected"
                              ? "bg-red-950/60 text-red-400 border-red-500/30"
                              : "bg-amber-950/60 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {req.status === "Approved" && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {req.status === "Rejected" && <XCircle className="w-3.5 h-3.5" />}
                          {req.status === "Pending" && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                          {req.status}
                        </span>
                      </td>

                      {/* Actions (Approve / Reject / Delete) */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Approve Button (Visible if not already approved) */}
                          {req.status !== "Approved" && (
                            <button
                              disabled={updatingId === req._id}
                              onClick={() => handleStatusUpdate(req._id, "Approved")}
                              title="Approve Request"
                              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Reject Button (Visible if not already rejected) */}
                          {req.status !== "Rejected" && (
                            <button
                              disabled={updatingId === req._id}
                              onClick={() => handleStatusUpdate(req._id, "Rejected")}
                              title="Reject Request"
                              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => setRequestToDelete(req)}
                            title="Delete Request"
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===== Pagination ===== */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* ===== Delete Modal ===== */}
      <AnimatePresence>
        {requestToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setRequestToDelete(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center gap-4 text-red-400">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Delete Request</h3>
                  <p className="text-xs text-slate-400">This action cannot be undone.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <p className="text-sm font-semibold text-white">
                  User: {requestToDelete.userName}
                </p>
                <p className="text-xs text-slate-400">Book: {requestToDelete.bookTitle}</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  disabled={isDeleting}
                  onClick={() => setRequestToDelete(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isDeleting}
                  onClick={handleDeleteRequest}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? (
                    <span>Deleting...</span>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Skeleton Loading State ---
function TableSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-800/50 rounded-xl w-full" />
      ))}
    </div>
  );
}