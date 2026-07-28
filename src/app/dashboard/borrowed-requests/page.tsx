'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Loader2, 
  AlertCircle, 
  UserX, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  Tag,
  User,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';

interface BorrowRequest {
  _id: string;
  bookTitle: string;
  bookAuthor?: string;
  coverImage?: string;
  category?: string;
  description?: string;
  ownerEmail?: string | null;
  borrowerName?: string;
  borrowerEmail?: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  createdAt?: string;
  requestDate?: string;
  durationDays?: number;
}

export default function BorrowRequestsPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const email = session?.user?.email;

  useEffect(() => {
    if (isSessionLoading || !email) return;

    const fetchBorrowRequests = async () => {
      setIsLoading(true);
      setError('');

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/borrowRequests/${encodeURIComponent(email)}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || 'Failed to fetch borrow requests');
        }

        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
        showCustomToast({
          type: 'error',
          title: 'Fetch Error',
          description: err.message || 'Failed to load borrow requests.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBorrowRequests();
  }, [email, isSessionLoading]);

  // Project-Matched Custom Toast Renderer
  const showCustomToast = ({
    type,
    title,
    description,
    id,
  }: {
    type: 'success' | 'error' | 'loading';
    title: string;
    description?: string;
    id?: string | number;
  }) => {
    return toast.custom(
      (t) => (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/95 border border-slate-800 text-slate-100 shadow-2xl backdrop-blur-xl max-w-md w-full">
          {type === 'loading' && <Loader2 className="w-5 h-5 animate-spin text-blue-400 shrink-0 mt-0.5" />}
          {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          
          <div className="flex-1">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-100">{title}</h4>
            {description && <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{description}</p>}
          </div>
        </div>
      ),
      { id }
    );
  };

  // Custom Styled Confirmation Toast
  const handleCancelRequest = (requestId: string, bookTitle: string) => {
    toast.custom((t) => (
      <div className="p-4 rounded-xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl max-w-md w-full space-y-3">
        <div className="flex items-center gap-2.5 text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <h4 className="text-xs sm:text-sm font-semibold text-slate-100">Cancel Request?</h4>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Are you sure you want to cancel your borrow request for <span className="text-slate-200 font-medium">"{bookTitle}"</span>?
        </p>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            Keep Request
          </button>
          <button
            onClick={() => {
              toast.dismiss(t);
              executeCancelRequest(requestId);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    ));
  };

  const executeCancelRequest = async (requestId: string) => {
    setCancelingId(requestId);
    const toastId = showCustomToast({
      type: 'loading',
      title: 'Processing Action',
      description: 'Canceling your borrow request...',
    });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/borrowRequests/${requestId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || 'Failed to cancel request');
      }

      setRequests((prev) => prev.filter((item) => item._id !== requestId));

      showCustomToast({
        id: toastId,
        type: 'success',
        title: 'Request Canceled',
        description: 'The borrow request was successfully removed.',
      });
    } catch (err: any) {
      showCustomToast({
        id: toastId,
        type: 'error',
        title: 'Action Failed',
        description: err.message || 'Something went wrong while canceling.',
      });
    } finally {
      setCancelingId(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          Approved
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border bg-rose-500/10 text-rose-400 border-rose-500/20">
          <XCircle className="w-3 h-3" />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border bg-amber-500/10 text-amber-400 border-amber-500/20">
        <Clock className="w-3 h-3 animate-pulse" />
        Pending
      </span>
    );
  };

  if (isSessionLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs sm:text-sm text-slate-400">Loading your borrow requests...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md max-w-md mx-auto space-y-4 my-10">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <UserX className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Authentication Required</h2>
          <p className="text-xs text-slate-400 mt-1">
            Please log in to your account to view your borrow requests.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center max-w-lg mx-auto space-y-3 my-8">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        <h3 className="text-sm font-semibold text-rose-300">Something went wrong</h3>
        <p className="text-xs text-rose-400/80">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          My Pending Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Track the status of your pending borrow requests.
        </p>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        {requests.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mx-auto text-slate-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No Pending Requests Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don't have any active pending borrow requests at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((item) => {
              const displayDate = item.createdAt || item.requestDate;
              const isCanceling = cancelingId === item._id;

              return (
                <div
                  key={item._id}
                  className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between group"
                >
                  <div className="flex gap-4">
                    <div className="relative w-24 h-36 shrink-0 rounded-lg overflow-hidden bg-slate-800 border border-slate-700/50 flex items-center justify-center">
                      {item.coverImage ? (
                        <Image
                          src={item.coverImage}
                          alt={item.bookTitle || 'Book Cover'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 96px"
                        />
                      ) : (
                        <BookOpen className="w-8 h-8 text-slate-500" />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between overflow-hidden">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                            {item.bookTitle}
                          </h3>
                          {renderStatusBadge(item.status)}
                        </div>

                        {item.bookAuthor && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            by <span className="text-slate-300 font-medium">{item.bookAuthor}</span>
                          </p>
                        )}

                        {item.category && (
                          <div className="mt-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              <Tag className="w-2.5 h-2.5" />
                              {item.category}
                            </span>
                          </div>
                        )}

                        {item.description && (
                          <p className="text-[11px] text-slate-400/90 mt-1.5 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        {(item.borrowerName || item.borrowerEmail) && (
                          <div className="mt-2 pt-2 border-t border-slate-800/40 text-[13px] space-y-0.5">
                            <p className="text-slate-400 flex items-center gap-1.5 truncate">
                              <User className="w-3 h-3 text-blue-400 shrink-0" />
                              <span>Borrower:</span>
                              <span className="text-slate-200 font-medium truncate">
                                {item.borrowerName || 'N/A'}
                              </span>
                            </p>
                            {item.borrowerEmail && (
                              <p className="text-slate-500 pl-4 truncate text-[10px]">
                                <span>Email:</span> <span className="text-slate-400">{item.borrowerEmail}</span>
                              </p>
                            )}
                          </div>
                        )}

                        {item.ownerEmail && (
                          <p className="text-[11px] text-slate-500 mt-1 truncate">
                            Owner: <span className="text-slate-400">{item.ownerEmail}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Requested Date:</span>{' '}
                      <span className="text-slate-400">
                        {displayDate ? new Date(displayDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </span>

                    <div className="flex items-center gap-2">
                      {item.durationDays && (
                        <span className="bg-slate-800/80 border border-slate-700/50 px-2 py-0.5 rounded text-slate-300 font-medium">
                          {item.durationDays} Days
                        </span>
                      )}

                      {item.status?.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => handleCancelRequest(item._id, item.bookTitle)}
                          disabled={isCanceling}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isCanceling ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}