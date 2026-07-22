"use client";

import Link from "next/link";
import { MapPin, Users, Star, ArrowRight } from "lucide-react";

const FEATURED_BOOKS = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    location: "Mirpur 10, Dhaka",
    type: "Both",
    rating: 4.9,
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400",
    owner: "Adnan Chowdhury"
  },
  {
    id: 2,
    title: "Sapiens: A Brief History",
    author: "Yuval Noah Harari",
    category: "History",
    location: "Dhanmondi 27, Dhaka",
    type: "Physical Only",
    rating: 4.8,
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    owner: "Ayesha Rahman"
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    location: "Uttara Sector 4, Dhaka",
    type: "Both",
    rating: 5.0,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400",
    owner: "Tanvir Ahmed"
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Technology",
    location: "Gulshan 2, Dhaka",
    type: "Digital PDF",
    rating: 4.7,
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
    owner: "Samiul Alam"
  },
];

export default function FeaturedBooks() {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">Explore Catalog</p>
            <h2 className="text-3xl font-extrabold text-white">Available in Your Neighborhood</h2>
          </div>
          <Link href="/books" className="mt-4 md:mt-0 text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View all books <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_BOOKS.map((book) => (
            <div 
              key={book.id}
              className="group rounded-3xl bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 p-4 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-slate-950">
                  <img 
                    src={book.cover} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-cyan-400">
                    {book.type}
                  </div>
                </div>

                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{book.category}</span>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-blue-400 transition-colors truncate">{book.title}</h3>
                <p className="text-xs text-slate-400 mb-3">{book.author}</p>

                <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                  <p className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{book.location}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-400">
                    <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>By {book.owner}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {book.rating}
                </span>
                <Link 
                  href={`/books/${book.id}`}
                  className="text-xs font-semibold text-blue-400 hover:text-cyan-300 transition-colors"
                >
                  Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}