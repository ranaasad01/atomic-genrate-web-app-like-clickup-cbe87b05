"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { navLinks, APP_NAME } from "@/lib/data";
import { Menu, X, Bell, Search, Sparkles, ChevronDown } from 'lucide-react';

const MOCK_NOTIFICATIONS = 3;

export default function Navbar() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#1E1E2E]/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-[#1E1E2E]"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.08, rotate: shouldReduceMotion ? 0 : 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center shadow-md shadow-[#7B68EE]/30"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-white font-bold text-xl tracking-tight">
              Flow<span className="text-[#7B68EE]">Up</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer block ${
                      isActive
                        ? "text-white bg-white/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#7B68EE]"
                      />
                    )}
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <motion.button
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-xs">Search tasks…</span>
              <kbd className="ml-2 text-xs bg-white/10 px-1.5 py-0.5 rounded text-gray-500">
                ⌘K
              </kbd>
            </motion.button>

            {/* Notifications */}
            <Link href="/inbox">
              <motion.button
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={`Notifications (${MOCK_NOTIFICATIONS} unread)`}
              >
                <Bell className="w-5 h-5" />
                {MOCK_NOTIFICATIONS > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF4D4D] ring-2 ring-[#1E1E2E]"
                  />
                )}
              </motion.button>
            </Link>

            {/* Avatar */}
            <motion.button
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/10 transition-colors group"
              aria-label="User menu"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                JD
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 transition-colors hidden sm:block" />
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden overflow-hidden border-t border-white/10"
          >
            <nav className="px-4 py-3 flex flex-col gap-1 bg-[#1E1E2E]">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link key={link.href} href={link.href}>
                    <span
                      className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "text-white bg-[#7B68EE]/20 border border-[#7B68EE]/30"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                );
              })}
              <div className="mt-2 pt-2 border-t border-white/10">
                <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm">
                  <Search className="w-4 h-4" />
                  Search tasks…
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}