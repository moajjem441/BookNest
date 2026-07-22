"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHome, 
  FaBook, 
  FaInfoCircle, 
  FaEnvelope, 
  FaSignInAlt, 
  FaUserPlus,
  FaBars,
  FaTimes,
  FaUser,
  FaPlus,
  FaChartBar,
  FaSignOutAlt,
  FaCog
} from "react-icons/fa";
import Image from "next/image";

// ==================== টাইপ ডিফিনেশন ====================
type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  requiresAuth?: boolean;
};

type User = {
  name: string;
  email: string;
  avatar?: string;
} | null;

// ==================== ন্যাভবার কম্পোনেন্ট ====================
export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: আপনার অথেনটিকেশন সিস্টেমের সাথে কানেক্ট করুন
  const [user, setUser] = useState<User>(null); // TODO: রিয়েল ইউজার ডেটা দিয়ে রিপ্লেস করুন
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // স্ক্রল ইফেক্ট (স্টিকি নেভবারের জন্য)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // বর্তমানে লগইন স্টেট (ডেমো ডেটা)
  useEffect(() => {
    // এখানে আপনার অথেনটিকেশন চেক বসান (যেমন: localStorage থেকে টোকেন চেক)
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      setUser({
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&background=C68A5C&color=fff&size=40",
      });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // ========== নেভিগেশন আইটেম ==========
  const navItems: NavItem[] = [
    { label: "Home", href: "/", icon: <FaHome /> },
    { label: "Browse Books", href: "/books", icon: <FaBook /> },
    { label: "About", href: "/about", icon: <FaInfoCircle /> },
    { label: "Contact", href: "/contact", icon: <FaEnvelope /> },
  ];

  const authItems: NavItem[] = [
    { label: "Login", href: "/login", icon: <FaSignInAlt /> },
    { label: "Register", href: "/register", icon: <FaUserPlus /> },
  ];

  const loggedInItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <FaChartBar /> },
    { label: "Share Book", href: "/share", icon: <FaPlus /> },
    { label: "Profile", href: "/profile", icon: <FaUser /> },
  ];

  // ========== ড্রপডাউন মেনু আইটেম ==========
  const dropdownItems = [
    { label: "Profile", href: "/profile", icon: <FaUser /> },
    { label: "Dashboard", href: "/dashboard", icon: <FaChartBar /> },
    { label: "Settings", href: "/settings", icon: <FaCog /> },
    { label: "Logout", href: "#", icon: <FaSignOutAlt />, danger: true },
  ];

  // ========== লিংক অ্যাক্টিভ চেক ==========
  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  // ========== লগআউট হ্যান্ডেলার ==========
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
    window.location.href = "/";
  };

  // ========== মোবাইল মেনু টগল ==========
  const toggleMenu = () => setIsOpen(!isOpen);

  // ========== মোবাইল লিংক ক্লিক ==========
  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* =============================================== */}
      {/* নেভবার (স্টিকি + গ্লাসমর্ফিজম) */}
      {/* =============================================== */}
      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20"
            : "bg-white/30 backdrop-blur-md border-b border-white/10"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* ===== লোগো ===== */}
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-[#3D2B1F] transition hover:scale-105">
              <span className="text-3xl">📚</span>
              <span className="font-['Playfair_Display']">BookNest</span>
            </Link>

            {/* ===== ডেস্কটপ মেনু ===== */}
            <div className="hidden md:flex md:items-center md:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:text-[#C68A5C] ${
                    isActive(item.href)
                      ? "text-[#C68A5C] font-semibold"
                      : "text-[#3D2B1F]/70"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              {/* লগইন/লগআউট স্টেট */}
              {isLoggedIn ? (
                <div className="relative ml-2">
                  {/* ইউজার অ্যাভাটার বাটন */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 rounded-full border-2 border-[#C68A5C]/30 p-1 transition-all hover:border-[#C68A5C] hover:shadow-lg"
                  >
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C68A5C] text-sm font-bold text-white">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </button>

                  {/* ড্রপডাউন মেনু */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-white/30 bg-white/90 p-1 shadow-2xl backdrop-blur-xl"
                      >
                        {/* ইউজার ইনফো */}
                        <div className="border-b border-gray-100 px-3 py-2.5">
                          <p className="font-semibold text-[#3D2B1F]">{user?.name}</p>
                          <p className="text-xs text-[#3D2B1F]/60">{user?.email}</p>
                        </div>

                        {/* মেনু আইটেম */}
                        {dropdownItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={(e) => {
                              if (item.label === "Logout") {
                                e.preventDefault();
                                handleLogout();
                              } else {
                                setIsDropdownOpen(false);
                              }
                            }}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                              item.danger
                                ? "text-red-500 hover:bg-red-50"
                                : "text-[#3D2B1F]/70 hover:bg-[#C68A5C]/10 hover:text-[#C68A5C]"
                            }`}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 rounded-full bg-[#C68A5C] px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-[#b07a4e] hover:shadow-lg"
                  >
                    <FaSignInAlt />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 rounded-full border-2 border-[#C68A5C] px-5 py-2 text-sm font-semibold text-[#C68A5C] transition-all hover:scale-105 hover:bg-[#C68A5C] hover:text-white hover:shadow-lg"
                  >
                    <FaUserPlus />
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* ===== মোবাইল মেনু বাটন ===== */}
            <button
              onClick={toggleMenu}
              className="rounded-lg p-2 text-2xl text-[#3D2B1F] transition hover:bg-[#C68A5C]/10 md:hidden"
              aria-label="Toggle Menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* ===== মোবাইল মেনু (অ্যানিমেটেড) ===== */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-white/20 bg-white/90 backdrop-blur-xl md:hidden"
            >
              <div className="space-y-1 px-4 pb-5 pt-3">
                {/* নেভিগেশন লিংক */}
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleMobileLinkClick}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive(item.href)
                        ? "bg-[#C68A5C]/10 text-[#C68A5C]"
                        : "text-[#3D2B1F]/70 hover:bg-[#C68A5C]/5"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}

                <div className="my-2 border-t border-gray-200"></div>

                {/* লগইন/লগআউট (মোবাইল) */}
                {isLoggedIn ? (
                  <>
                    {loggedInItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleMobileLinkClick}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#3D2B1F]/70 transition hover:bg-[#C68A5C]/5"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        handleLogout();
                        handleMobileLinkClick();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={handleMobileLinkClick}
                      className="flex items-center gap-3 rounded-lg bg-[#C68A5C] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b07a4e]"
                    >
                      <FaSignInAlt />
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={handleMobileLinkClick}
                      className="flex items-center gap-3 rounded-lg border-2 border-[#C68A5C] px-4 py-3 text-sm font-semibold text-[#C68A5C] transition hover:bg-[#C68A5C] hover:text-white"
                    >
                      <FaUserPlus />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* নেভবারের নিচে স্পেস (কন্টেন্ট যেন নেভবারের আড়ালে না যায়) */}
      <div className="h-16"></div>
    </>
  );
}