"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner"; // ✅ Sonner Toast

import { authClient } from "@/lib/auth-client";

import { 
  BookOpen, 
  Upload, 
  MapPin, 
  FileText, 
  Image as ImageIcon, 
  Tag, 
  User, 
  AlignLeft,
  Loader2
} from "lucide-react";

const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Technology",
  "Science",
  "History",
  "Self-Help",
  "Biography",
  "Other", // 👈 Added "Other" option
];

export default function ShareBookPage() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "Science Fiction",
    customCategory: "", // 👈 For user-typed category when "Other" is selected
    type: "Physical" as "Physical" | "PDF",
    coverImage: "",
    pdfUrl: "",
    pickupLocation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input Change Handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Dynamic Category selection
    const finalCategory =
      formData.category === "Other"
        ? formData.customCategory.trim()
        : formData.category;

    if (!finalCategory) {
      toast.error("Please specify a category.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      description: formData.description.trim(),
      category: finalCategory,
      type: formData.type,
      coverImage: formData.coverImage.trim() || "/placeholder-book.png",
      pdfUrl: formData.type === "PDF" ? formData.pdfUrl.trim() : "",
      pickupLocation: formData.type === "Physical" ? formData.pickupLocation.trim() : "",
    };

    // JWT Token Retrieval
    let token: string | undefined;
    try {
      const { data: tokenData } = await authClient.token();
      token = tokenData?.token;
      if (!token) {
        throw new Error("No token received. Please login again.");
      }
    } catch (tokenError: any) {
      toast.error("Authentication failed. Please login again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // credentials: "include", // 👈 কুকি (Session) ব্যাকএন্ডে পাঠানোর জন্য
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to share the book.");
      }

      toast.success("Book shared successfully! Redirecting...");

      setTimeout(() => {
        router.push("/books");
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* ===== Header ===== */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Share a <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">Book</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Contribute to the community by sharing physical books or uploading digital PDF resources.
          </p>
        </div>

        {/* ===== Form Container ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Book Type Selector (Physical / PDF) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Book Format / Type
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: "Physical" }))}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all ${
                    formData.type === "Physical"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> Physical Book
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: "PDF" }))}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all ${
                    formData.type === "PDF"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileText className="w-4 h-4" /> PDF Document
                </button>
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Book Title <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. The Martian"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Author Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Author Name <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="author"
                  required
                  placeholder="e.g. Andy Weir"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Category <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conditional Input: Custom Category (When "Other" is selected) */}
            <AnimatePresence>
              {formData.category === "Other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Specify Custom Category <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      name="customCategory"
                      required={formData.category === "Other"}
                      placeholder="e.g. Manga, Philosophy, Romance"
                      value={formData.customCategory}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Description <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Write a brief overview of the book..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Cover Image URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Cover Image URL <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="url"
                  name="coverImage"
                  placeholder="https://example.com/cover.jpg"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Conditional Input: Pickup Location (Physical) */}
            <AnimatePresence>
              {formData.type === "Physical" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Pickup Location <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      name="pickupLocation"
                      required={formData.type === "Physical"}
                      placeholder="e.g. Mirpur, Dhaka"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Conditional Input: PDF URL (PDF) */}
            <AnimatePresence>
              {formData.type === "PDF" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    PDF Download Link / URL <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      name="pdfUrl"
                      required={formData.type === "PDF"}
                      placeholder="https://example.com/book.pdf"
                      value={formData.pdfUrl}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sharing Book...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Share Book Now
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}