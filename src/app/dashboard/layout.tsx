import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body Container */}
      <div className="flex flex-1 pt-16">
        
        {/* Sticky/Fixed Sidebar */}
        <aside className="w-64 hidden lg:block shrink-0 border-r border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-16 h-[calc(100vh-4rem)]">
          <Sidebar />
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}