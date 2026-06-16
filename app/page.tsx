"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
  slideInLeft,
  slideInRight,
} from "@/lib/motion";
import {
  APP_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  BRAND_COLORS,
} from "@/lib/data";
import { Sparkles, ArrowRight, Check, Star, Users, Layout, Bell, Calendar, Activity, ChevronRight, Zap, Shield, Clock, GitBranch, Search, Settings, Heart, Eye, FileText, Circle } from 'lucide-react';

// ─── Inline Data ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Layout,
    title: "Kanban & List Views",
    description:
      "Switch between board, list, and calendar views to match how your team thinks. Drag-and-drop tasks across columns with zero friction.",
    color: "#7B68EE",
    bg: "#F0EEFF",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Assign tasks, leave comments, mention teammates, and share files — all in context. No more hunting through email threads.",
    color: "#00C896",
    bg: "#EDFFF9",
  },
  {
    icon: Activity,
    title: "Real-Time Progress",
    description:
      "Track project health with live dashboards, burndown charts, and automated status updates. Always know where things stand.",
    color: "#FFA500",
    bg: "#FFF8EC",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get pinged only when it matters. FlowUp's intelligent notification engine filters noise so you stay focused on deep work.",
    color: "#FF4D4D",
    bg: "#FFF0F0",
  },
  {
    icon: Calendar,
    title: "Due Date & Scheduling",
    description:
      "Set deadlines, recurring tasks, and milestones. The calendar view surfaces what's due today, this week, or next sprint.",
    color: "#7B68EE",
    bg: "#F0EEFF",
  },
  {
    icon: GitBranch,
    title: "Subtasks & Dependencies",
    description:
      "Break big work into subtasks, link blockers, and visualize the critical path. Ship complex projects without surprises.",
    color: "#00C896",
    bg: "#EDFFF9",
  },
];

const STATS = [
  { value: "50K+", label: "Teams worldwide" },
  { value: "12M+", label: "Tasks completed" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.9★", label: "Average rating" },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Engineering Lead @ Vercel",
    avatar: "/images/sarah-chen-avatar.jpg",
    quote:
      "FlowUp replaced three tools for us. Our sprint velocity went up 40% in the first month. The kanban board is buttery smooth.",
    rating: 5,
  },
  {
    name: "Marcus Rivera",
    role: "Product Manager @ Stripe",
    avatar: "/images/marcus-rivera-avatar.jpg",
    quote:
      "Finally a project tool that doesn't feel like a spreadsheet. The subtask dependencies alone saved our Q3 launch from disaster.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Design Director @ Figma",
    avatar: "/images/priya-nair-avatar.jpg",
    quote:
      "We onboarded 60 designers in a day. The workspace hierarchy is intuitive and the notification controls are a godsend.",
    rating: 5,
  },
];

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for individuals and small teams getting started.",
    features: [
      "Up to 5 members",
      "3 active projects",
      "List & Board views",
      "100MB storage",
      "Community support",
    ],
    cta: "Get started free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/user/mo",
    description: "For growing teams that need more power and flexibility.",
    features: [
      "Unlimited members",
      "Unlimited projects",
      "All views incl. Calendar",
      "10GB storage",
      "Priority support",
      "Custom fields",
      "Time tracking",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$29",
    period: "/user/mo",
    description: "Advanced security, compliance, and dedicated support.",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Audit logs",
      "Unlimited storage",
      "Dedicated CSM",
      "SLA guarantee",
      "Custom integrations",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

const INTEGRATIONS = [
  { name: "GitHub", icon: "/images/github-integration-logo.jpg" },
  { name: "Slack", icon: "/images/slack-integration-logo.jpg" },
  { name: "Figma", icon: "/images/figma-integration-logo.jpg" },
  { name: "Notion", icon: "/images/notion-integration-logo.jpg" },
  { name: "Jira", icon: "/images/jira-integration-logo.jpg" },
  { name: "Zoom", icon: "/images/zoom-integration-logo.jpg" },
];

const MOCK_TASKS = [
  {
    id: "t1",
    title: "Design new onboarding flow",
    status: "in_progress",
    priority: "high",
    assignee: "SC",
    assigneeColor: "#7B68EE",
    due: "Dec 18",
    tags: ["Design", "UX"],
  },
  {
    id: "t2",
    title: "API rate limiting implementation",
    status: "todo",
    priority: "urgent",
    assignee: "MR",
    assigneeColor: "#FF4D4D",
    due: "Dec 20",
    tags: ["Backend"],
  },
  {
    id: "t3",
    title: "Write Q4 retrospective doc",
    status: "done",
    priority: "normal",
    assignee: "PN",
    assigneeColor: "#00C896",
    due: "Dec 15",
    tags: ["Docs"],
  },
  {
    id: "t4",
    title: "Fix mobile nav overflow bug",
    status: "in_review",
    priority: "high",
    assignee: "SC",
    assigneeColor: "#7B68EE",
    due: "Dec 19",
    tags: ["Frontend", "Bug"],
  },
];

const STATUS_COLORS: Record<string, { dot: string; label: string }> = {
  todo: { dot: "#6B7280", label: "To Do" },
  in_progress: { dot: "#7B68EE", label: "In Progress" },
  in_review: { dot: "#FFA500", label: "In Review" },
  done: { dot: "#00C896", label: "Done" },
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "#FF4D4D",
  high: "#FFA500",
  normal: "#7B68EE",
  low: "#00C896",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroTaskCard() {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="relative w-full max-w-lg mx-auto"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7B68EE]/30 to-[#9B8FFF]/10 rounded-2xl blur-2xl scale-110 pointer-events-none" />

      {/* Card */}
      <div className="relative bg-[#1E1E2E]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF4D4D]" />
            <div className="w-3 h-3 rounded-full bg-[#FFA500]" />
            <div className="w-3 h-3 rounded-full bg-[#00C896]" />
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Q4 Sprint · 4 tasks
          </span>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-[#7B68EE]/30 flex items-center justify-center">
              <span className="text-[9px] text-[#7B68EE] font-bold">SC</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-[#FF4D4D]/30 flex items-center justify-center">
              <span className="text-[9px] text-[#FF4D4D] font-bold">MR</span>
            </div>
          </div>
        </div>

        {/* Task rows */}
        <div className="divide-y divide-white/5">
          {MOCK_TASKS.map((task, i) => {
            const statusInfo = STATUS_COLORS[task.status] ?? {
              dot: "#6B7280",
              label: task.status,
            };
            const priorityColor = PRIORITY_COLORS[task.priority] ?? "#6B7280";
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors group"
              >
                {/* Status dot */}
                <Circle
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{ color: statusInfo.dot }}
                  fill={task.status === "done" ? statusInfo.dot : "none"}
                />

                {/* Title */}
                <span
                  className={`flex-1 text-sm font-medium truncate ${
                    task.status === "done"
                      ? "line-through text-gray-600"
                      : "text-gray-200"
                  }`}
                >
                  {task.title}
                </span>

                {/* Priority */}
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                  style={{
                    color: priorityColor,
                    backgroundColor: priorityColor + "22",
                  }}
                >
                  {task.priority}
                </span>

                {/* Due */}
                <span className="text-[11px] text-gray-600 hidden sm:block">
                  {task.due}
                </span>

                {/* Assignee */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{
                    backgroundColor: task.assigneeColor + "33",
                    color: task.assigneeColor,
                  }}
                >
                  {task.assignee}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 w-32 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] rounded-full"
              />
            </div>
            <span className="text-[11px] text-gray-500">65% complete</span>
          </div>
          <span className="text-[11px] text-[#7B68EE] font-medium">
            View all →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="bg-[#F4F4F8] min-h-screen overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#1E1E2E] overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#7B68EE]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#9B8FFF]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left copy */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-[#7B68EE]/15 border border-[#7B68EE]/30 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#7B68EE]" />
                <span className="text-xs font-semibold text-[#9B8FFF] tracking-wide uppercase">
                  Now with AI task suggestions
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6"
              >
                Project management
                <br />
                <span className="bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] bg-clip-text text-transparent">
                  built for flow.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
              >
                {APP_DESCRIPTION} FlowUp brings tasks, docs, goals, and
                teammates into one beautifully organized workspace.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              >
                <Link href="/workspace">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-[#7B68EE]/30 hover:shadow-[#7B68EE]/50 transition-shadow cursor-pointer"
                  >
                    Get started free
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
                <Link href="/workspace">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/15 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    See it in action
                  </motion.span>
                </Link>
              </motion.div>

              {/* Social proof micro */}
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-3 mt-8 justify-center lg:justify-start"
              >
                <div className="flex -space-x-2">
                  {["#7B68EE", "#FF4D4D", "#00C896", "#FFA500"].map(
                    (color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-[#1E1E2E] flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {["SC", "MR", "PN", "JK"][i]}
                      </div>
                    )
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  <span className="text-white font-semibold">50,000+</span>{" "}
                  teams already flowing
                </p>
              </motion.div>
            </motion.div>

            {/* Right — task card preview */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              className="w-full"
            >
              <HeroTaskCard />
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-[#F4F4F8]" />
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-[#1E1E2E] mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-[#F4F4F8]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeInUp}
              className="text-sm font-semibold text-[#7B68EE] uppercase tracking-widest mb-3"
            >
              Everything you need
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E1E2E] leading-tight mb-4"
            >
              One workspace.
              <br />
              <span className="text-[#7B68EE]">Infinite possibilities.</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-500 max-w-2xl mx-auto"
            >
              FlowUp consolidates your scattered tools into a single source of
              truth — so your team spends less time context-switching and more
              time shipping.
            </motion.p>
          </motion.div>

          {/* Feature grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={scaleIn}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#7B68EE]/20 transition-all duration-300 group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: feature.bg }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3 className="text-base font-bold text-[#1E1E2E] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Product Showcase ──────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-white overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left copy */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.p
                variants={fadeInUp}
                className="text-sm font-semibold text-[#7B68EE] uppercase tracking-widest mb-3"
              >
                Workspace view
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl sm:text-4xl font-extrabold text-[#1E1E2E] leading-tight mb-5"
              >
                See every project,
                <br />
                every status — at a glance.
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-gray-500 leading-relaxed mb-8"
              >
                The FlowUp workspace gives you a bird's-eye view of all your
                projects, spaces, and team activity. Drill down into any task in
                two clicks, or zoom out to see the full portfolio.
              </motion.p>

              <motion.ul variants={staggerContainer} className="space-y-4">
                {[
                  {
                    icon: Zap,
                    text: "Instant search across all tasks and docs",
                  },
                  {
                    icon: Shield,
                    text: "Role-based permissions for every space",
                  },
                  {
                    icon: Clock,
                    text: "Time tracking built into every task",
                  },
                  {
                    icon: FileText,
                    text: "Linked docs and wikis alongside tasks",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={item.text}
                      variants={fadeInUp}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F0EEFF] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-[#7B68EE]" />
                      </div>
                      <span className="text-gray-700 font-medium text-sm leading-relaxed pt-1.5">
                        {item.text}
                      </span>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <motion.div variants={fadeInUp} className="mt-8">
                <Link href="/workspace">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-[#1E1E2E] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#2a2a3e] transition-colors cursor-pointer"
                  >
                    Explore workspace
                    <ChevronRight className="w-4 h-4" />
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — mini workspace UI */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#7B68EE]/10 to-transparent rounded-3xl blur-2xl" />
              <div className="relative bg-[#1E1E2E] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Sidebar + main */}
                <div className="flex">
                  {/* Mini sidebar */}
                  <div className="w-44 bg-[#16162A] border-r border-white/10 p-3 hidden sm:block">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mb-3 px-2">
                      Spaces
                    </p>
                    {[
                      { name: "Engineering", color: "#7B68EE", count: 12 },
                      { name: "Design", color: "#FF4D4D", count: 8 },
                      { name: "Marketing", color: "#00C896", count: 5 },
                      { name: "Product", color: "#FFA500", count: 9 },
                    ].map((space) => (
                      <div
                        key={space.name}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer group mb-0.5"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: space.color }}
                          />
                          <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
                            {space.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-600">
                          {space.count}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Main area */}
                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-white">
                        Engineering
                      </h4>
                      <div className="flex gap-1">
                        {["List", "Board"].map((v) => (
                          <span
                            key={v}
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                              v === "List"
                                ? "bg-[#7B68EE]/20 text-[#9B8FFF]"
                                : "text-gray-600"
                            }`}
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Kanban columns */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          label: "To Do",
                          color: "#6B7280",
                          tasks: ["Auth refactor", "DB migration"],
                        },
                        {
                          label: "In Progress",
                          color: "#7B68EE",
                          tasks: ["API endpoints", "Rate limiting"],
                        },
                        {
                          label: "Done",
                          color: "#00C896",
                          tasks: ["CI/CD setup"],
                        },
                      ].map((col) => (
                        <div key={col.label} className="space-y-1.5">
                          <div className="flex items-center gap-1 mb-2">
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: col.color }}
                            />
                            <span className="text-[10px] text-gray-500 font-semibold">
                              {col.label}
                            </span>
                          </div>
                          {col.tasks.map((task) => (
                            <div
                              key={task}
                              className="bg-white/5 border border-white/10 rounded-lg p-2 hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              <p className="text-[10px] text-gray-300 leading-tight">
                                {task}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-[#F4F4F8]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeInUp}
              className="text-sm font-semibold text-[#7B68EE] uppercase tracking-widest mb-3"
            >
              Loved by teams
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-extrabold text-[#1E1E2E] mb-4"
            >
              Don't take our word for it.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-500 max-w-xl mx-auto"
            >
              Thousands of teams across engineering, design, and product have
              made FlowUp their home base.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.name}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[#FFA500] fill-[#FFA500]"
                    />
                  ))}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1E1E2E]">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-14"
          >
            <motion.p
              variants={fadeInUp}
              className="text-sm font-semibold text-[#7B68EE] uppercase tracking-widest mb-3"
            >
              Simple pricing
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-extrabold text-[#1E1E2E] mb-4"
            >
              Start free. Scale when ready.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-500 max-w-xl mx-auto"
            >
              No hidden fees, no surprise overages. Every plan includes a 14-day
              free trial of Pro features.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
          >
            {PRICING_PLANS.map((plan) => (
              <motion.div
                key={plan.name}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl p-7 border transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-[#1E1E2E] border-[#7B68EE]/50 shadow-xl shadow-[#7B68EE]/10"
                    : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-[#7B68EE]/20"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <p
                  className={`text-sm font-semibold mb-1 ${
                    plan.highlighted ? "text-[#9B8FFF]" : "text-[#7B68EE]"
                  }`}
                >
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span
                    className={`text-4xl font-extrabold ${
                      plan.highlighted ? "text-white" : "text-[#1E1E2E]"
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={`text-sm mb-1.5 ${
                        plan.highlighted ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mb-6 ${
                    plan.highlighted ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.highlighted
                            ? "bg-[#7B68EE]/20"
                            : "bg-[#F0EEFF]"
                        }`}
                      >
                        <Check
                          className="w-2.5 h-2.5"
                          style={{ color: "#7B68EE" }}
                        />
                      </div>
                      <span
                        className={`text-sm ${
                          plan.highlighted ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/workspace">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`block text-center font-semibold py-3 rounded-xl transition-all cursor-pointer ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] text-white shadow-lg shadow-[#7B68EE]/30 hover:shadow-[#7B68EE]/50"
                        : "bg-[#F4F4F8] text-[#1E1E2E] hover:bg-[#E8E8F0]"
                    }`}
                  >
                    {plan.cta}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Integrations ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#F4F4F8] border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-10"
          >
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Integrates with your stack
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-wrap justify-center gap-4"
          >
            {INTEGRATIONS.map((integration) => (
              <motion.div
                key={integration.name}
                variants={scaleIn}
                whileHover={{ scale: 1.06, y: -2 }}
                className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-2.5 shadow-sm hover:shadow-md hover:border-[#7B68EE]/20 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                  <Settings className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {integration.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-[#1E1E2E] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#7B68EE]/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-[#7B68EE]/15 border border-[#7B68EE]/30 rounded-full px-4 py-1.5 mb-6"
            >
              <Heart className="w-3.5 h-3.5 text-[#7B68EE]" />
              <span className="text-xs font-semibold text-[#9B8FFF] tracking-wide uppercase">
                Free forever plan available
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5"
            >
              Ready to find your flow?
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-400 max-w-xl mx-auto mb-8"
            >
              Join 50,000+ teams who've replaced chaos with clarity. Set up your
              first workspace in under 2 minutes — no credit card required.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link href="/workspace">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-[#7B68EE]/30 hover:shadow-[#7B68EE]/50 transition-shadow cursor-pointer"
                >
                  Start for free
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
              <Link href="/workspace">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/15 transition-colors cursor-pointer"
                >
                  View live demo
                </motion.span>
              </Link>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-xs text-gray-600 mt-5"
            >
              No credit card · Free forever plan · Cancel anytime
            </motion.p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}