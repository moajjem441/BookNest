"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Bell, 
  Menu, 
  X, 
  User, 
  LayoutDashboard, 
  Bookmark, 
  LogOut, 
  LogIn,
  UserPlus,
  ShieldCheck
} from "lucide-react";

// Better Auth Client Import
import { authClient, useSession } from "@/lib/auth-client";

interface NavItem {
  label: string;
  href: string;
}

const LOGGED_OUT_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Browse Books", href: "/books" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const LOGGED_IN_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Browse Books", href: "/books" },
  { label: "Share Book", href: "/share" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

// ✅ Admin Nav Items
const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Browse Books", href: "/books" },
  { label: "Share Book", href: "/share" },
  { label: "Manage Bookes", href: "/manage-books" },
  { label: "Manage Requests", href: "/manage-requests" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Better Auth Session
  const { data: session, isPending } = useSession();
  
  const isAuthenticated = !!session;
  const isLoading = isPending;

  // ✅ Check if the logged-in user is an admin
  const isAdmin = session?.user?.role === "admin";

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sign out method using Better Auth
  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    setIsMobileOpen(false);

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ✅ Select nav items based on authentication & admin role
  const currentNavItems = !isAuthenticated 
    ? LOGGED_OUT_NAV_ITEMS 
    : isAdmin 
      ? ADMIN_NAV_ITEMS 
      : LOGGED_IN_NAV_ITEMS;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-gradient-to-r from-slate-900/90 via-[#0F172A]/90 to-blue-950/90 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-blue-950/20"
          : "py-5 bg-gradient-to-r from-slate-950/70 via-slate-900/60 to-blue-950/70 backdrop-blur-md border-b border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Book<span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">Nest</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {currentNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive
                    ? "text-blue-400 font-semibold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-underline"
                    className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-slate-800 animate-pulse" />
              <div className="w-24 h-9 rounded-2xl bg-slate-800 animate-pulse" />
            </div>
          ) : isAuthenticated ? (
            <>
              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  aria-expanded={isDropdownOpen}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-300 hover:text-white border border-blue-500/30 hover:border-blue-400/60 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      width={28}
                      height={28}
                      className="rounded-xl object-cover ring-1 ring-blue-400/40"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-blue-600/40 flex items-center justify-center text-blue-200">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-200 max-w-[100px] truncate">
                    {session?.user?.name || "Account"}
                  </span>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-2xl p-2 z-50 origin-top-right"
                    >
                      <div className="px-3 py-2 border-b border-slate-800 mb-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-white truncate">
                            {session?.user?.name || "User"}
                          </p>
                          {isAdmin && (
                            <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-md">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {session?.user?.email || ""}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <Link
                          href="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-transparent rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-blue-400" /> My Profile
                        </Link>
                      </div>

                      <div className="h-[1px] bg-slate-800 my-1" />

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-400" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-2xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open Navigation Menu"
            className="p-2.5 rounded-2xl text-slate-200 hover:bg-white/10 transition-colors border border-white/5"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-lg z-50 md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs sm:max-w-sm bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950 border-l border-slate-800 shadow-2xl z-50 flex flex-col md:hidden p-6"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Menu
                  </span>
                  {isAdmin && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-md">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-2xl hover:bg-white/10 text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 py-8 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                  {currentNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`block px-4 py-3.5 rounded-2xl text-base font-medium transition-colors ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 font-semibold border border-blue-500/20"
                            : "text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {isAuthenticated && (
                  <div className="space-y-2 pt-4 border-t border-slate-800/80">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Account</p>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium text-slate-300 hover:bg-white/5"
                    >
                      <User className="w-5 h-5 text-blue-400" /> Profile
                    </Link>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-800">
                {isAuthenticated ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-semibold text-slate-200 hover:bg-white/5 border border-slate-800 transition-all"
                    >
                      <LogIn className="w-4 h-4" /> Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all"
                    >
                      <UserPlus className="w-4 h-4" /> Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}