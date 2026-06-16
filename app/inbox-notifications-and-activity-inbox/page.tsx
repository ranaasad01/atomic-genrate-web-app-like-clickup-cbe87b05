"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Bell, AtSign, CheckCircle, Clock, MessageSquare, UserPlus, AlertCircle, Filter, Search, Check, Trash2, ChevronRight, Star, Activity, ArrowRight, Circle } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType = "mention" | "assignment" | "comment" | "status_change" | "due_date" | "invite";

interface NotifItem {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  read: boolean;
  starred: boolean;
  createdAt: string;
  actor: { name: string; avatar: string; initials: string; color: string };
  taskTitle?: string;
  projectName?: string;
  priority?: "urgent" | "high" | "normal" | "low";
  status?: "todo" | "in_progress" | "in_review" | "done";
}

interface ActivityItem {
  id: string;
  type: "created" | "updated" | "commented" | "completed" | "assigned" | "moved";
  description: string;
  taskTitle: string;
  projectName: string;
  actor: { name: string; initials: string; color: string };
  timestamp: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: NotifItem[] = [
  {
    id: "n1",
    type: "mention",
    title: "You were mentioned",
    message: "@you can you review the new landing page designs before EOD?",
    read: false,
    starred: true,
    createdAt: "2 min ago",
    actor: { name: "Sarah Chen", avatar: "", initials: "SC", color: "#7B68EE" },
    taskTitle: "Landing Page Redesign",
    projectName: "Marketing Q4",
    priority: "high",
  },
  {
    id: "n2",
    type: "assignment",
    title: "Task assigned to you",
    message: "You've been assigned to implement the new authentication flow.",
    read: false,
    starred: false,
    createdAt: "18 min ago",
    actor: { name: "Marcus Lee", avatar: "", initials: "ML", color: "#00C896" },
    taskTitle: "Auth Flow Implementation",
    projectName: "Backend Sprint 12",
    priority: "urgent",
  },
  {
    id: "n3",
    type: "comment",
    title: "New comment on your task",
    message: "Left some feedback on the API integration — looks great overall, just a few edge cases to handle.",
    read: false,
    starred: false,
    createdAt: "45 min ago",
    actor: { name: "Priya Nair", avatar: "", initials: "PN", color: "#FFA500" },
    taskTitle: "Stripe API Integration",
    projectName: "Payments Module",
    priority: "normal",
  },
  {
    id: "n4",
    type: "status_change",
    title: "Task status updated",
    message: "\"User Dashboard Wireframes\" moved from In Progress → In Review.",
    read: false,
    starred: false,
    createdAt: "1 hr ago",
    actor: { name: "Tom Rivera", avatar: "", initials: "TR", color: "#FF4D4D" },
    taskTitle: "User Dashboard Wireframes",
    projectName: "Design System",
    status: "in_review",
  },
  {
    id: "n5",
    type: "due_date",
    title: "Task due soon",
    message: "\"Mobile Responsive Fixes\" is due tomorrow. Make sure it's ready for review.",
    read: true,
    starred: false,
    createdAt: "2 hr ago",
    actor: { name: "System", avatar: "", initials: "SY", color: "#6B7280" },
    taskTitle: "Mobile Responsive Fixes",
    projectName: "Frontend Sprint",
    priority: "high",
  },
  {
    id: "n6",
    type: "invite",
    title: "Team invitation",
    message: "You've been invited to join the \"Product Launch 2025\" workspace.",
    read: true,
    starred: false,
    createdAt: "3 hr ago",
    actor: { name: "Alex Kim", avatar: "", initials: "AK", color: "#7B68EE" },
    projectName: "Product Launch 2025",
  },
  {
    id: "n7",
    type: "comment",
    title: "New comment on your task",
    message: "The color palette looks perfect! Can we also add a dark mode variant?",
    read: true,
    starred: true,
    createdAt: "5 hr ago",
    actor: { name: "Jess Park", avatar: "", initials: "JP", color: "#00C896" },
    taskTitle: "Brand Color System",
    projectName: "Design System",
    priority: "normal",
  },
  {
    id: "n8",
    type: "mention",
    title: "You were mentioned",
    message: "@you what's the ETA on the onboarding flow? The PM is asking.",
    read: true,
    starred: false,
    createdAt: "Yesterday",
    actor: { name: "Dan Walsh", avatar: "", initials: "DW", color: "#FFA500" },
    taskTitle: "Onboarding Flow v2",
    projectName: "Growth Team",
    priority: "high",
  },
  {
    id: "n9",
    type: "status_change",
    title: "Task completed",
    message: "\"Database Schema Migration\" has been marked as Done. Great work!",
    read: true,
    starred: false,
    createdAt: "Yesterday",
    actor: { name: "Ravi Patel", avatar: "", initials: "RP", color: "#00C896" },
    taskTitle: "Database Schema Migration",
    projectName: "Backend Sprint 12",
    status: "done",
  },
  {
    id: "n10",
    type: "assignment",
    title: "Task assigned to you",
    message: "You've been assigned to write unit tests for the notification service.",
    read: true,
    starred: false,
    createdAt: "2 days ago",
    actor: { name: "Sarah Chen", avatar: "", initials: "SC", color: "#7B68EE" },
    taskTitle: "Notification Service Tests",
    projectName: "Backend Sprint 12",
    priority: "normal",
  },
];

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    type: "commented",
    description: "commented on",
    taskTitle: "Landing Page Redesign",
    projectName: "Marketing Q4",
    actor: { name: "Sarah Chen", initials: "SC", color: "#7B68EE" },
    timestamp: "2 min ago",
  },
  {
    id: "a2",
    type: "completed",
    description: "completed",
    taskTitle: "Database Schema Migration",
    projectName: "Backend Sprint 12",
    actor: { name: "Ravi Patel", initials: "RP", color: "#00C896" },
    timestamp: "18 min ago",
  },
  {
    id: "a3",
    type: "assigned",
    description: "assigned you to",
    taskTitle: "Auth Flow Implementation",
    projectName: "Backend Sprint 12",
    actor: { name: "Marcus Lee", initials: "ML", color: "#00C896" },
    timestamp: "45 min ago",
  },
  {
    id: "a4",
    type: "moved",
    description: "moved",
    taskTitle: "User Dashboard Wireframes",
    projectName: "Design System",
    actor: { name: "Tom Rivera", initials: "TR", color: "#FF4D4D" },
    timestamp: "1 hr ago",
  },
  {
    id: "a5",
    type: "created",
    description: "created",
    taskTitle: "Q4 Roadmap Planning",
    projectName: "Product Strategy",
    actor: { name: "Alex Kim", initials: "AK", color: "#7B68EE" },
    timestamp: "2 hr ago",
  },
  {
    id: "a6",
    type: "updated",
    description: "updated",
    taskTitle: "Mobile Responsive Fixes",
    projectName: "Frontend Sprint",
    actor: { name: "Jess Park", initials: "JP", color: "#FFA500" },
    timestamp: "3 hr ago",
  },
  {
    id: "a7",
    type: "commented",
    description: "commented on",
    taskTitle: "Brand Color System",
    projectName: "Design System",
    actor: { name: "Jess Park", initials: "JP", color: "#FFA500" },
    timestamp: "5 hr ago",
  },
  {
    id: "a8",
    type: "completed",
    description: "completed",
    taskTitle: "Stripe API Integration",
    projectName: "Payments Module",
    actor: { name: "Priya Nair", initials: "PN", color: "#FFA500" },
    timestamp: "Yesterday",
  },
];

// ─── Icon map ─────────────────────────────────────────────────────────────────

const NOTIF_ICON: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  mention: { icon: AtSign, color: "#7B68EE", bg: "#F0EEFF" },
  assignment: { icon: UserPlus, color: "#00C896", bg: "#EDFFF9" },
  comment: { icon: MessageSquare, color: "#FFA500", bg: "#FFF8EC" },
  status_change: { icon: Activity, color: "#7B68EE", bg: "#F0EEFF" },
  due_date: { icon: Clock, color: "#FF4D4D", bg: "#FFF0F0" },
  invite: { icon: UserPlus, color: "#00C896", bg: "#EDFFF9" },
};

const ACTIVITY_ICON: Record<ActivityItem["type"], { icon: React.ElementType; color: string }> = {
  created: { icon: Circle, color: "#7B68EE" },
  updated: { icon: Activity, color: "#FFA500" },
  commented: { icon: MessageSquare, color: "#00C896" },
  completed: { icon: CheckCircle, color: "#00C896" },
  assigned: { icon: UserPlus, color: "#7B68EE" },
  moved: { icon: ArrowRight, color: "#FFA500" },
};

type FilterTab = "all" | "unread" | "mentions" | "assignments" | "starred";

const FILTER_TABS: { id: FilterTab; label: string; count?: number }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread", count: 4 },
  { id: "mentions", label: "Mentions" },
  { id: "assignments", label: "Assignments" },
  { id: "starred", label: "Starred" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InboxPage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotifItem[]>(MOCK_NOTIFICATIONS);
  const [activeView, setActiveView] = useState<"notifications" | "activity">("notifications");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      searchQuery === "" ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.taskTitle ?? "").toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeTab) {
      case "unread":
        return !n.read;
      case "mentions":
        return n.type === "mention";
      case "assignments":
        return n.type === "assignment";
      case "starred":
        return n.starred;
      default:
        return true;
    }
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const toggleStar = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, starred: !n.starred } : n))
    );
  };

  const deleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#F4F4F8]">
      {/* ── Page Header ── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-[#1E1E2E] border-b border-white/10"
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center shadow-lg shadow-[#7B68EE]/30">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Inbox</h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#7B68EE] text-white text-xs font-semibold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm ml-12">
                Stay on top of mentions, assignments, and team activity.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={markAllRead}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors border border-white/10"
              >
                <Check className="w-4 h-4" />
                Mark all read
              </motion.button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 mt-6 bg-white/5 rounded-xl p-1 w-fit">
            {(["notifications", "activity"] as const).map((view) => (
              <motion.button
                key={view}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  activeView === view
                    ? "bg-[#7B68EE] text-white shadow-md shadow-[#7B68EE]/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {view === "notifications" ? "Notifications" : "Activity Feed"}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeView === "notifications" ? (
            <motion.div
              key="notifications"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col lg:flex-row gap-6"
            >
              {/* ── Sidebar Filters ── */}
              <motion.aside
                variants={fadeInUp}
                className="lg:w-56 flex-shrink-0"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sticky top-20">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                    Filter
                  </p>
                  <nav className="space-y-0.5">
                    {FILTER_TABS.map((tab) => (
                      <motion.button
                        key={tab.id}
                        whileHover={{ x: shouldReduceMotion ? 0 : 2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-[#7B68EE]/10 text-[#7B68EE]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span>{tab.label}</span>
                        {tab.count !== undefined && tab.count > 0 && (
                          <span
                            className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                              activeTab === tab.id
                                ? "bg-[#7B68EE] text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {tab.count}
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </nav>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                      By Type
                    </p>
                    <nav className="space-y-0.5">
                      {(
                        [
                          { id: "mention", label: "Mentions", icon: AtSign },
                          { id: "comment", label: "Comments", icon: MessageSquare },
                          { id: "assignment", label: "Assignments", icon: UserPlus },
                          { id: "due_date", label: "Due Dates", icon: Clock },
                        ] as const
                      ).map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {item.label}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              </motion.aside>

              {/* ── Notifications List ── */}
              <div className="flex-1 min-w-0">
                {/* Search */}
                <motion.div variants={fadeInUp} className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] transition-all"
                    />
                  </div>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"
                >
                  {[
                    { label: "Total", value: notifications.length, color: "#7B68EE", bg: "#F0EEFF" },
                    { label: "Unread", value: unreadCount, color: "#FF4D4D", bg: "#FFF0F0" },
                    { label: "Starred", value: notifications.filter((n) => n.starred).length, color: "#FFA500", bg: "#FFF8EC" },
                    { label: "Mentions", value: notifications.filter((n) => n.type === "mention").length, color: "#00C896", bg: "#EDFFF9" },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      variants={scaleIn}
                      className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 shadow-sm"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ background: stat.bg, color: stat.color }}
                      >
                        {stat.value}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Notification Cards */}
                {filteredNotifications.length === 0 ? (
                  <motion.div
                    variants={fadeInUp}
                    className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No notifications found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchQuery ? "Try a different search term." : "You're all caught up!"}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2"
                  >
                    {filteredNotifications.map((notif) => {
                      const cfg = NOTIF_ICON[notif.type];
                      const Icon = cfg.icon;
                      return (
                        <motion.div
                          key={notif.id}
                          variants={fadeInUp}
                          layout
                          whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
                          className={`group bg-white rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer ${
                            !notif.read
                              ? "border-[#7B68EE]/20 bg-gradient-to-r from-[#7B68EE]/[0.03] to-white"
                              : "border-gray-100"
                          }`}
                          onClick={() => markRead(notif.id)}
                        >
                          <div className="p-4 flex items-start gap-4">
                            {/* Unread dot */}
                            <div className="flex-shrink-0 mt-1">
                              {!notif.read ? (
                                <div className="w-2 h-2 rounded-full bg-[#7B68EE] mt-1" />
                              ) : (
                                <div className="w-2 h-2" />
                              )}
                            </div>

                            {/* Type icon */}
                            <div
                              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                              style={{ background: cfg.bg }}
                            >
                              <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                            </div>

                            {/* Actor avatar */}
                            <div
                              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                              style={{ background: notif.actor.color }}
                            >
                              {notif.actor.initials}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p
                                    className={`text-sm font-semibold ${
                                      notif.read ? "text-gray-700" : "text-gray-900"
                                    }`}
                                  >
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    <span className="font-medium text-gray-700">
                                      {notif.actor.name}
                                    </span>{" "}
                                    · {notif.createdAt}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleStar(notif.id);
                                    }}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                      notif.starred
                                        ? "text-[#FFA500] bg-[#FFF8EC]"
                                        : "text-gray-400 hover:text-[#FFA500] hover:bg-[#FFF8EC]"
                                    }`}
                                  >
                                    <Star className="w-3.5 h-3.5" fill={notif.starred ? "#FFA500" : "none"} />
                                  </motion.button>
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotif(notif.id);
                                    }}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#FF4D4D] hover:bg-[#FFF0F0] transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </motion.button>
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed line-clamp-2">
                                {notif.message}
                              </p>

                              {/* Meta tags */}
                              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                                {notif.taskTitle && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-xs text-gray-600 font-medium">
                                    <CheckCircle className="w-3 h-3 text-gray-400" />
                                    {notif.taskTitle}
                                  </span>
                                )}
                                {notif.projectName && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#7B68EE]/8 text-xs text-[#7B68EE] font-medium">
                                    {notif.projectName}
                                  </span>
                                )}
                                {notif.priority && (
                                  <span
                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold"
                                    style={{
                                      background: PRIORITY_CONFIG[notif.priority].bg,
                                      color: PRIORITY_CONFIG[notif.priority].color,
                                    }}
                                  >
                                    {PRIORITY_CONFIG[notif.priority].label}
                                  </span>
                                )}
                                {notif.status && (
                                  <span
                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold"
                                    style={{
                                      background: STATUS_CONFIG[notif.status].bg,
                                      color: STATUS_CONFIG[notif.status].color,
                                    }}
                                  >
                                    {STATUS_CONFIG[notif.status].label}
                                  </span>
                                )}
                              </div>
                            </div>

                            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1 group-hover:text-gray-500 transition-colors" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            /* ── Activity Feed ── */
            <motion.div
              key="activity"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="max-w-2xl mx-auto"
            >
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#7B68EE]" />
                    <h2 className="text-sm font-semibold text-gray-800">Recent Activity</h2>
                  </div>
                  <span className="text-xs text-gray-400">{MOCK_ACTIVITY.length} events today</span>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-gray-50"
                >
                  {MOCK_ACTIVITY.map((item, idx) => {
                    const cfg = ACTIVITY_ICON[item.type];
                    const Icon = cfg.icon;
                    return (
                      <motion.div
                        key={item.id}
                        variants={fadeInUp}
                        whileHover={{ backgroundColor: "#FAFAFA" }}
                        className="px-6 py-4 flex items-start gap-4 transition-colors"
                      >
                        {/* Timeline line */}
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                            style={{ background: item.actor.color }}
                          >
                            {item.actor.initials}
                          </div>
                          {idx < MOCK_ACTIVITY.length - 1 && (
                            <div className="w-px h-full min-h-[20px] bg-gray-100 mt-2" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 pt-1">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            <span className="font-semibold text-gray-900">{item.actor.name}</span>{" "}
                            <span className="text-gray-500">{item.description}</span>{" "}
                            <span className="font-medium text-gray-800">{item.taskTitle}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div
                              className="w-4 h-4 rounded flex items-center justify-center"
                              style={{ color: cfg.color }}
                            >
                              <Icon className="w-3 h-3" />
                            </div>
                            <span className="text-xs text-[#7B68EE] font-medium">
                              {item.projectName}
                            </span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-400">{item.timestamp}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                  <Link
                    href="/workspace"
                    className="flex items-center justify-center gap-2 text-sm text-[#7B68EE] font-medium hover:underline"
                  >
                    View all workspace activity
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-3 gap-4 mt-6"
              >
                {[
                  { label: "Tasks completed today", value: "3", icon: CheckCircle, color: "#00C896", bg: "#EDFFF9" },
                  { label: "Comments received", value: "7", icon: MessageSquare, color: "#7B68EE", bg: "#F0EEFF" },
                  { label: "Mentions this week", value: "12", icon: AtSign, color: "#FFA500", bg: "#FFF8EC" },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      variants={scaleIn}
                      whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
                      className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                        style={{ background: stat.bg }}
                      >
                        <Icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-tight">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Notification Preferences Card */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="mt-6 bg-gradient-to-br from-[#7B68EE]/10 to-[#9B8FFF]/5 rounded-2xl border border-[#7B68EE]/20 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#7B68EE]/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-[#7B68EE]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Customize your notifications
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Control which events trigger notifications and how you receive them — email, push, or in-app.
                    </p>
                    <Link
                      href="/settings"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7B68EE] hover:underline"
                    >
                      Go to Notification Settings
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}