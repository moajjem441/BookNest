"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  User, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  BookMarked,
  X,
  Trash2,
  AlertTriangle,
  Eye,
  ShieldCheck
} from "lucide-react";

// --- Types ---
export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  type: "Physical" | "PDF" | "Both";
  coverImage: string;
  description: string;
  createdAt: string;
}

const CATEGORIES = [
  "All Categories",
  "Fiction",
  "Non-Fiction",
  "Technology",
  "Science",
  "History",
  "Self-Help",
  "Biography",
  "Others"
];

const ITEMS_PER_PAGE = 8;

export default function AdminManageBooksPage() {
  // Data States
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState<"All" | "Physical" | "PDF">("All");
  const [sortBy, setSortBy] = useState<"latest" | "a-z" | "z-a">("latest");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Delete Modal States
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search Debounce Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch All Books
  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books`); 
      
      if (!res.ok) throw new Error("Failed to load books from server.");
      
      const data = await res.json();
      const fetchedBooks = data.books || data;
      setBooks(fetchedBooks);
    } catch (err: any) {
      const errorMsg = err.message || "Something went wrong while fetching books.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle Book Delete Action
  const handleDeleteBook = async () => {
    if (!bookToDelete) return;

    // console.log("bookto delete",bookToDelete._id);

    try {
      setIsDeleting(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books/${bookToDelete._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete the book. Please try again.");
      }

      // UI state থেকে রিমুভ করা
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookToDelete._id));
    

      toast.success(`"${bookToDelete.title}" deleted successfully!`, {
        id: "delete-book-success",
      });

      setBookToDelete(null); // Modal বন্ধ করা
    } catch (err: any) {
      toast.error(err.message || "Error deleting book.", {
        id: "delete-book-error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and Sort Logic
  const filteredAndSortedBooks = useMemo(() => {
    return books
      .filter((book) => {
        const query = debouncedSearch.trim().toLowerCase();
        const matchesSearch =
          !query ||
          book.title?.toLowerCase().includes(query) ||
          book.author?.toLowerCase().includes(query);

        const selectedCat = selectedCategory.trim().toLowerCase();
        const bookCat = (book.category || "").trim().toLowerCase();

        const standardCategories = [
          "fiction",
          "non-fiction",
          "technology",
          "science",
          "history",
          "self-help",
          "biography",
        ];

        let matchesCategory = false;

        if (selectedCategory === "All Categories") {
          matchesCategory = true;
        } else if (selectedCat === "fiction") {
          matchesCategory = !bookCat.includes("non-fiction") && bookCat.includes("fiction");
        } else if (selectedCat === "non-fiction") {
          matchesCategory = bookCat.includes("non-fiction");
        } else if (selectedCat === "others") {
          matchesCategory = !standardCategories.some((sc) => bookCat.includes(sc));
        } else {
          matchesCategory = bookCat.includes(selectedCat) || bookCat === selectedCat;
        }

        const matchesType =
          selectedType === "All" ||
          book.type === selectedType ||
          book.type === "Both";

        return matchesSearch && matchesCategory && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "latest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "a-z") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "z-a") {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
  }, [books, debouncedSearch, selectedCategory, selectedType, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, selectedType, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedBooks, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedCategory("All Categories");
    setSelectedType("All");
    setSortBy("latest");
    setCurrentPage(1);
    toast.info("Filters reset to default");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white">
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
              Manage <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">Books</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Overview of all collection items. Search, review details, or delete books.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Total Database Records</span>
            <p className="text-2xl font-bold text-blue-400">{books.length} Books</p>
          </div>
        </div>

        {/* ===== Controls & Filters Bar ===== */}
        <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-4">
          
          {/* Top Row: Search Input & Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title or author..."
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

            {/* Sort & Format Controls */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
              
              {/* Format Filter */}
              <div className="flex items-center bg-slate-950/60 p-1 rounded-2xl border border-slate-800 w-full sm:w-auto">
                {(["All", "Physical", "PDF"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedType === type
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto appearance-none pl-10 pr-8 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                >
                  <option value="latest">Sort by: Latest</option>
                  <option value="a-z">Sort by: Title (A - Z)</option>
                  <option value="z-a">Sort by: Title (Z - A)</option>
                </select>
                <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
            <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm"
                    : "bg-slate-950/40 text-slate-400 border border-slate-800/80 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Reset Indicator */}
        {(searchQuery || selectedCategory !== "All Categories" || selectedType !== "All" || sortBy !== "latest") && (
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <span>
              Showing {filteredAndSortedBooks.length} of {books.length} records
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>
        )}

        {/* ===== Grid Display ===== */}
        {isLoading ? (
          <BookGridSkeleton />
        ) : error ? (
          <div className="text-center py-16 bg-red-950/10 border border-red-500/20 rounded-3xl space-y-3">
            <p className="text-red-400 font-medium text-sm">{error}</p>
            <button
              onClick={fetchBooks}
              className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : paginatedBooks.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800/60 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mx-auto text-slate-400">
              <BookMarked className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">No Books Found</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              No matching books found for your query. Try resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-xs rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {paginatedBooks.map((book) => (
                <AdminBookCard
                  key={book._id}
                  book={book}
                  onDelete={() => setBookToDelete(book)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ===== Pagination Controls ===== */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
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

      {/* ===== Delete Confirmation Modal ===== */}
      <AnimatePresence>
        {bookToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setBookToDelete(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
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
                  <h3 className="text-lg font-bold text-white">Delete Book</h3>
                  <p className="text-xs text-slate-400">This action cannot be undone.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
                <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                  <Image
                    src={bookToDelete.coverImage || "/placeholder-book.png"}
                    alt={bookToDelete.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="truncate">
                  <p className="text-sm font-semibold text-white truncate">{bookToDelete.title}</p>
                  <p className="text-xs text-slate-400 truncate">by {bookToDelete.author}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  disabled={isDeleting}
                  onClick={() => setBookToDelete(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isDeleting}
                  onClick={handleDeleteBook}
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

// --- Admin Book Card Component ---
function AdminBookCard({ book, onDelete }: { book: Book; onDelete: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col rounded-3xl bg-slate-900/60 border border-slate-800/80 overflow-hidden hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
        <Image
          src={book.coverImage || "/placeholder-book.png"}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-slate-200 shadow-sm">
            {book.category}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full backdrop-blur-md text-[10px] font-semibold flex items-center gap-1 border shadow-sm ${
              book.type === "PDF"
                ? "bg-purple-950/80 text-purple-300 border-purple-500/30"
                : book.type === "Physical"
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                : "bg-blue-950/80 text-blue-300 border-blue-500/30"
            }`}
          >
            {book.type === "PDF" ? (
              <FileText className="w-3 h-3" />
            ) : (
              <BookOpen className="w-3 h-3" />
            )}
            {book.type}
          </span>
        </div>
      </div>

      {/* Book Info & Admin Actions */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-1.5">
          <h2 className="font-bold text-base text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
            {book.title}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{book.author}</span>
          </div>
        </div>

        {/* Admin Action Buttons (View + Delete) */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
          <Link
            href={`/books/${book._id}`}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 border border-slate-700/50 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </Link>
          <button
            onClick={onDelete}
            className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Skeleton Loading Grid ---
function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl bg-slate-900/40 border border-slate-800/60 overflow-hidden animate-pulse flex flex-col"
        >
          <div className="aspect-[3/4] bg-slate-800/60 w-full" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-slate-800 rounded-md w-3/4" />
            <div className="h-3 bg-slate-800/60 rounded-md w-1/2" />
            <div className="h-9 bg-slate-800 rounded-2xl w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}