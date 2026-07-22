import Link from "next/link";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[#3D2B1F] text-white/80">
      {/* ===== মেইন ফুটার ===== */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* ===== ব্র্যান্ড ===== */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
              <span className="text-3xl">📚</span>
              <span className="font-['Playfair_Display']">BookNest</span>
            </Link>
            <p className="text-sm leading-relaxed">
              আপনার পাড়ার বই বিনিময় প্ল্যাটফর্ম। ফিজিক্যাল ও ডিজিটাল—দুইভাবেই জ্ঞান ভাগ করুন।
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-white/60 transition hover:text-[#C68A5C] hover:scale-110">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white/60 transition hover:text-[#C68A5C] hover:scale-110">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white/60 transition hover:text-[#C68A5C] hover:scale-110">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white/60 transition hover:text-[#C68A5C] hover:scale-110">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-white/60 transition hover:text-[#C68A5C] hover:scale-110">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* ===== কুইক লিংক ===== */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">দ্রুত লিংক</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/books" className="transition hover:text-[#C68A5C]">বই ব্রাউজ করুন</Link></li>
              <li><Link href="/share" className="transition hover:text-[#C68A5C]">বই শেয়ার করুন</Link></li>
              <li><Link href="/about" className="transition hover:text-[#C68A5C]">আমাদের সম্পর্কে</Link></li>
              <li><Link href="/contact" className="transition hover:text-[#C68A5C]">যোগাযোগ</Link></li>
            </ul>
          </div>

          {/* ===== সাপোর্ট ===== */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">সহায়তা</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="transition hover:text-[#C68A5C]">সাধারণ জিজ্ঞাসা</Link></li>
              <li><Link href="/privacy" className="transition hover:text-[#C68A5C]">গোপনীয়তা নীতি</Link></li>
              <li><Link href="/terms" className="transition hover:text-[#C68A5C]">শর্তাবলী</Link></li>
              <li><Link href="/report" className="transition hover:text-[#C68A5C]">অভিযোগ করুন</Link></li>
            </ul>
          </div>

          {/* ===== যোগাযোগ ===== */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">যোগাযোগ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-[#C68A5C]" />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-[#C68A5C]" />
                <a href="mailto:info@booknest.com" className="transition hover:text-[#C68A5C]">
                  info@booknest.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-[#C68A5C]" />
                <a href="tel:+880123456789" className="transition hover:text-[#C68A5C]">
                  +৮৮০ ১২৩৪ ৫৬৭৮৯
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ===== কপিরাইট ===== */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm">
          <p>
            © {currentYear} <span className="font-semibold text-white">BookNest</span>. 
            ❤️ দিয়ে তৈরি করা হয়েছে বাংলাদেশে। 
            সকল স্বত্ব সংরক্ষিত।
          </p>
          <p className="mt-1 text-xs text-white/40">
            Made with <FaHeart className="inline text-red-500 animate-pulse" /> for the community
          </p>
        </div>
      </div>
    </footer>
  );
}