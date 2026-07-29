'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Loader2, 
  AlertCircle, 
  UserX, 
  CheckCircle2, 
  Calendar,
  Tag,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';

interface BorrowedBook {
  _id: string;
  bookTitle: string;
  bookAuthor?: string;
  coverImage?: string;
  category?: string;
  description?: string;
  ownerEmail?: string | null;
  borrowedBy?: string;
  status: 'borrowed' | string;
  createdAt?: string;
  borrowedAt?: string;
  durationDays?: number;
}

export default function BorrowedBooksPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [returningId, setReturningId] = useState<string | null>(null);

  const email = session?.user?.email;

  useEffect(() => {
    if (isSessionLoading || !email) return;

    const fetchBorrowedBooks = async () => {
      setIsLoading(true);
      setError('');

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/books/borrowed/${encodeURIComponent(email)}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || 'Failed to fetch borrowed books');
        }

        const data: BorrowedBook[] = await res.json();
        
        if (Array.isArray(data)) {
          setBorrowedBooks(data);
        } else {
          setBorrowedBooks([]);
        }
      } catch (err: any) {
        setError(err.message);
        showCustomToast({
          type: 'error',
          title: 'Fetch Error',
          description: err.message || 'Failed to load borrowed books.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, [email, isSessionLoading]);

  // Toast UI Renderer
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

  // Return Confirmation Dialog
  const handleReturnBook = (bookId: string, bookTitle: string) => {
    toast.custom((t) => (
      <div className="p-4 rounded-xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl max-w-md w-full space-y-3">
        <div className="flex items-center gap-2.5 text-blue-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <h4 className="text-xs sm:text-sm font-semibold text-slate-100">Return Book?</h4>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Are you sure you want to return <span className="text-slate-200 font-medium">"{bookTitle}"</span> back to the library/owner?
        </p>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            Keep Book
          </button>
          <button
            onClick={() => {
              toast.dismiss(t);
              executeReturnBook(bookId);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
          >
            Confirm Return
          </button>
        </div>
      </div>
    ));
  };

  // Return API Execution
  const executeReturnBook = async (bookId: string) => {
    setReturningId(bookId);
    const toastId = showCustomToast({
      type: 'loading',
      title: 'Processing Action',
      description: 'Returning the book...',
    });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/books/return/${bookId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || 'Failed to return the book');
      }

      // Local state reset so UI updates immediately
      setBorrowedBooks((prev) => prev.filter((item) => item._id !== bookId));

      showCustomToast({
        id: toastId,
        type: 'success',
        title: 'Book Returned',
        description: 'The book status was updated successfully.',
      });
    } catch (err: any) {
      showCustomToast({
        id: toastId,
        type: 'error',
        title: 'Action Failed',
        description: err.message || 'Something went wrong while returning the book.',
      });
    } finally {
      setReturningId(null);
    }
  };

  if (isSessionLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs sm:text-sm text-slate-400">Loading your borrowed books...</p>
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
            Please log in to your account to view your borrowed books.
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
          My Borrowed Books
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage and return books you currently have borrowed.
        </p>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        {borrowedBooks.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mx-auto text-slate-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No Borrowed Books Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don't have any actively borrowed books right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {borrowedBooks.map((item) => {
              const displayDate = item.borrowedAt || item.createdAt;
              const isReturning = returningId === item._id;

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
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shrink-0">
                            <CheckCircle2 className="w-3 h-3" />
                            Borrowed
                          </span>
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

                        {item.ownerEmail && (
                          <p className="text-[11px] text-slate-500 mt-2 truncate">
                            Owner: <span className="text-slate-300 font-medium">{item.ownerEmail}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Borrowed Date:</span>{' '}
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

                      <button
                        onClick={() => handleReturnBook(item._id, item.bookTitle)}
                        disabled={isReturning}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isReturning ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <RotateCcw className="w-3 h-3" />
                        )}
                        <span>Return Book</span>
                      </button>
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