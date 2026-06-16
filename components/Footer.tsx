"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { APP_NAME, APP_TAGLINE } from "@/lib/data";
import { Sparkles, Code2 as Github, MessageCircle as Twitter, Briefcase as Linkedin, Heart } from 'lucide-react';
import { fadeInUp, staggerContainer } from "@/lib/motion";

const footerLinks = {
  Product: [
    { label: "Dashboard", href: "/" },
    { label: "Workspace", href: "/workspace" },
    { label: "Inbox", href: "/inbox" },
    { label: "Settings", href: "/settings" },
  ],
  Features: [
    { label: "Kanban Board", href: "/workspace" },
    { label: "Task Management", href: "/workspace" },
    { label: "Team Collaboration", href: "/workspace" },
    { label: "Progress Tracking", href: "/workspace" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

const socialLinks = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer className="bg-[#1E1E2E] text-gray-400 border-t border-white/10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10"
        >
          {/* Brand Column */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center shadow-md shadow-[#7B68EE]/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Flow<span className="text-[#7B68EE]">Up</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs mb-6">
              {APP_TAGLINE} Empower your team to move faster, stay aligned, and
              ship great work together.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.12, y: shouldReduceMotion ? 0 : -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#7B68EE]/20 hover:border-[#7B68EE]/40 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} variants={fadeInUp}>
              <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1">
            Built with{" "}
            <Heart className="w-3 h-3 text-[#FF4D4D] fill-[#FF4D4D]" /> for
            productive teams everywhere.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}