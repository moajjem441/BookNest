'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { 
  BookOpen, 
  Loader2, 
  AlertCircle, 
  PlusCircle, 
  UserX, 
  MapPin, 
  Tag, 
  DollarSign 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Book {
  _id: string;
  title: string;
  author: string;
  category?: string;
  status?: string;
  coverImage?: string;
  description?: string;
  condition?: string; // e.g., 'New', 'Like New', 'Good'
  rentPrice?: number;
  location?: string;
}

export default function SharedBooksPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId || isSessionLoading) return;

    const fetchSharedBooks = async () => {
      setIsLoading(true);
      setError('');

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/shared-books/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to fetch books');
        }

        const data = await res.json();
        setBorrowedBooks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedBooks();
  }, [userId, isSessionLoading]);

  // Loading State
  if (isSessionLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs sm:text-sm text-slate-400">Loading your shared books...</p>
      </div>
    );
  }

  // Not Logged In State
  if (!session) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md max-w-md mx-auto space-y-4 my-10">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <UserX className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Authentication Required</h2>
          <p className="text-xs text-slate-400 mt-1">
            Please log in to your account to view your shared books.
          </p>
        </div>
      </div>
    );
  }

  // Error State
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
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Your Shared Books
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage and view all the books you have listed for sharing.
          </p>
        </div>

        <Link
          href="/share"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-lg shadow-blue-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Book</span>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        {borrowedBooks.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mx-auto text-slate-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No Shared Books Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't listed any books yet. Start sharing your books with the community today!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {borrowedBooks.map((book) => (
              <div
                key={book._id}
                className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700/80 transition-all flex gap-4 group"
              >
                {/* Book Cover Image */}
                <div className="relative w-20 h-28 shrink-0 rounded-lg overflow-hidden bg-slate-800 border border-slate-700/50 flex items-center justify-center">
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <BookOpen className="w-8 h-8 text-slate-500" />
                  )}
                </div>

                {/* Book Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                        {book.title}
                      </h3>
                      <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        {book.status || 'Available'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-0.5">
                      by <span className="text-slate-300">{book.author}</span>
                    </p>

                    {book.description && (
                      <p className="text-[11px] text-slate-400/80 mt-1.5 line-clamp-2">
                        {book.description}
                      </p>
                    )}
                  </div>

                  {/* Badges / Meta Info */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                    {book.category && (
                      <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {book.category}
                      </span>
                    )}

                    {book.condition && (
                      <span className="bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50 text-slate-300">
                        {book.condition}
                      </span>
                    )}

                    {book.rentPrice !== undefined && (
                      <span className="inline-flex items-center gap-0.5 text-blue-400 font-medium bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                        <DollarSign className="w-3 h-3" />
                        {book.rentPrice > 0 ? `${book.rentPrice}/day` : 'Free'}
                      </span>
                    )}

                    {book.location && (
                      <span className="inline-flex items-center gap-1 text-slate-400 ml-auto">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {book.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}