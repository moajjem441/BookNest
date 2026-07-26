"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  User, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Send, 
  Clock, 
  Share2,
  Mail,
  ShieldCheck,
  Check
} from "lucide-react";

// Interfaces
export interface OwnerDetail {
  _id?: string;
  name: string;
  email: string;
  image?: string;
}

export interface BookDetail {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  type: "Physical" | "PDF" | "Both";
  coverImage: string;
  pdfUrl?: string;
  status: "Available" | "Borrowed" | "Reserved" | string;
  pickupLocation?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params?.id as string;

  // Better Auth Session Hook
  const { data: session } = useSession();
  const user = session?.user;

  const [book, setBook] = useState<BookDetail | null>(null);
  const [owner, setOwner] = useState<OwnerDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOwnerLoading, setIsOwnerLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!bookId) return;

    const fetchBookDataAndOwner = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Fetch Book Details
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books/${bookId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch book details.");
        }

        const data = await res.json();
        const fetchedBook: BookDetail = data.book || data;
        setBook(fetchedBook);

        // 2. Fetch Owner Info using ownerId
        if (fetchedBook?.ownerId) {
          setIsOwnerLoading(true);
          try {
            const ownerRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${fetchedBook.ownerId}`);
            if (ownerRes.ok) {
              const ownerData = await ownerRes.json();
              setOwner(ownerData.user || ownerData);
            }
          } catch (ownerErr) {
            console.error("Error fetching owner details:", ownerErr);
          } finally {
            setIsOwnerLoading(false);
          }
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while loading the book.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDataAndOwner();
  }, [bookId]);

  const handleBorrowRequest = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsRequesting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/books/${bookId}/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            ownerId: book?.ownerId,
            ownerEmail: owner?.email,
          }),
        }
      );

      if (res.ok) {
        setRequestSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to send request.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book?.title || "Book Details",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return <BookDetailSkeleton />;
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 pt-28">
        <div className="text-center max-w-md bg-slate-900/60 p-8 rounded-3xl border border-slate-800 space-y-4">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Book Not Found</h2>
          <p className="text-slate-400 text-sm">{error || "The book you are looking for does not exist."}</p>
          <button
            onClick={() => router.push("/books")}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-semibold transition-all cursor-pointer"
          >
            Back to Browse Books
          </button>
        </div>
      </div>
    );
  }

  const isPDF = book.type === "PDF" || book.type === "Both";
  const isPhysical = book.type === "Physical" || book.type === "Both";
  const isOwner = user?.id && user.id === book.ownerId;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-800/80 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Books
        </button>

        {/* Main Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl"
        >
          
          {/* Left Column: Cover Image */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-4">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group">
              <Image
                src={book.coverImage || "/placeholder-book.png"}
                alt={book.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                    book.status === "Available"
                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-950/80 text-amber-300 border-amber-500/30"
                  }`}
                >
                  {book.status}
                </span>
              </div>
            </div>

            {/* Category & Format */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full">
              <span className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-slate-300 text-xs font-medium">
                {book.category}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-medium flex items-center gap-1.5">
                {isPDF ? <FileText className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                {book.type} Format
              </span>
            </div>
          </div>

          {/* Right Column: Book Details & Owner */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              
              {/* Title & Author */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {book.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <User className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>By <strong className="text-slate-200">{book.author}</strong></span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Description
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>

              {/* Owner Information Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Book Shared By
                </div>

                {isOwnerLoading ? (
                  <div className="flex items-center gap-3 animate-pulse py-1">
                    <div className="w-10 h-10 bg-slate-800 rounded-full" />
                    <div className="space-y-1">
                      <div className="w-28 h-3.5 bg-slate-800 rounded" />
                      <div className="w-36 h-3 bg-slate-800/60 rounded" />
                    </div>
                  </div>
                ) : owner ? (
                  <div className="flex items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                        {owner.image ? (
                          <Image
                            src={owner.image}
                            alt={owner.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                            {owner.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{owner.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-500" /> {owner.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Owner information unavailable</p>
                )}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {isPhysical && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-medium text-slate-400">Pickup Location</p>
                      <p className="text-xs font-semibold text-slate-200">
                        {book.pickupLocation || "Contact Owner for Location"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">Added On</p>
                    <p className="text-xs font-semibold text-slate-200">
                      {new Date(book.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              {requestSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-medium">
                    Borrow request sent successfully! The owner will contact you soon.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {isPhysical && !isOwner && (
                    <button
                      onClick={handleBorrowRequest}
                      disabled={book.status !== "Available" || isRequesting}
                      className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isRequesting ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" /> Requesting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Request to Borrow
                        </>
                      )}
                    </button>
                  )}

                  {isPDF && book.pdfUrl && (
                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-semibold text-sm text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Open / Download PDF
                    </a>
                  )}

                  <button
                    onClick={handleShare}
                    className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    title="Share Book"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400 sm:hidden">Link Copied</span>
                      </>
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>

          </div>

        </motion.div>
      </div>
    </div>
  );
}

// Skeleton Loader
function BookDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="w-32 h-9 bg-slate-900 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 rounded-3xl bg-slate-900/40 border border-slate-800">
          <div className="lg:col-span-5 flex flex-col items-center space-y-4">
            <div className="w-full max-w-sm aspect-[3/4] bg-slate-800 rounded-2xl" />
            <div className="flex gap-2 w-full justify-center">
              <div className="w-20 h-7 bg-slate-800 rounded-xl" />
              <div className="w-24 h-7 bg-slate-800 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-8 bg-slate-800 rounded-xl w-3/4" />
              <div className="h-4 bg-slate-800/80 rounded-lg w-1/3" />
              <div className="space-y-2 pt-4">
                <div className="h-4 bg-slate-800/60 rounded-md w-full" />
                <div className="h-4 bg-slate-800/60 rounded-md w-full" />
              </div>
              <div className="h-20 bg-slate-800/50 rounded-2xl w-full" />
            </div>
            <div className="h-12 bg-slate-800 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}