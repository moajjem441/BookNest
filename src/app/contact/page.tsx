"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactDetails = [
    {
      icon: <Mail className="w-5 h-5 text-blue-400" />,
      title: "Email Us",
      value: "moajjem@bookshare.com",
      subtext: "We respond within 24 hours.",
    },
    {
      icon: <Phone className="w-5 h-5 text-indigo-400" />,
      title: "Call Us",
      value: "+880 1700-000000",
      subtext: "Mon-Fri from 9am to 6pm.",
    },
    {
      icon: <MapPin className="w-5 h-5 text-rose-400" />,
      title: "Our Office",
      value: "Mirpur, Dhaka, Bangladesh",
      subtext: "BUBT Permanent Campus Area",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-3.5 py-1.5 rounded-full bg-blue-950/80 text-blue-400 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider inline-block">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">We&apos;d Love to Hear From You</h1>
          <p className="text-slate-400 text-sm">
            Have a question about borrowing a book, reporting an issue, or general feedback? Send us a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-6 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" /> Contact Information
              </h2>

              <div className="space-y-4">
                {contactDetails.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-4">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400">{item.title}</p>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">{item.value}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{item.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Working Hours */}
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-3">
                <Clock className="w-4 h-4 shrink-0 text-blue-400" />
                <span>Our support team is active 7 days a week to assist you.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Moajjem Hossain"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="moajjem@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Issue with Borrow Request"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Your Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Sending Message..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}