"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, User, MessageSquare, ArrowRight, Clock, AlertCircle, Filter, ExternalLink, Check, Circle, Tag, Calendar, ChevronRight, Activity } from 'lucide-react';
import Link from "next/link";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/lib/data";
import type { Priority, TaskStatus } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

type NotificationType = "assignment" | "comment" | "status_change" | "due_date" | "mention";

interface MockNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  taskStatus: TaskStatus;
  taskPriority: Priority;
  projectName: string;
  spaceName: string;
  actor: {
    name: string;
    avatar: string;
    initials: string;
    color: string;
  };
  actionLabel?: string;
  dueDate?: string;
}

const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "n1",
    type: "assignment",
    title: "Task assigned to you",
    message: "Jordan Lee assigned you to 'Redesign onboarding flow'",
    read: false,
    createdAt: "2 min ago",
    taskId: "t1",
    taskTitle: "Redesign onboarding flow",
    taskDescription:
      "Revamp the entire onboarding experience for new users. This includes updating the welcome screen, step-by-step wizard, and the first-run tooltips to match the new brand guidelines.",
    taskStatus: "in_progress",
    taskPriority: "high",
    projectName: "Product Redesign",
    spaceName: "Design",
    actor: { name: "Jordan Lee", avatar: "", initials: "JL", color: "#7B68EE" },
    actionLabel: "View Task",
    dueDate: "Dec 28, 2024",
  },
  {
    id: "n2",
    type: "comment",
    title: "New comment on your task",
    message: "Priya Sharma commented on 'API rate limiting implementation'",
    read: false,
    createdAt: "18 min ago",
    taskId: "t2",
    taskTitle: "API rate limiting implementation",
    taskDescription:
      "Implement rate limiting on all public API endpoints to prevent abuse. Use a sliding window algorithm with Redis. Limits: 100 req/min for free tier, 1000 req/min for pro.",
    taskStatus: "in_progress",
    taskPriority: "urgent",
    projectName: "Backend Infrastructure",
    spaceName: "Engineering",
    actor: { name: "Priya Sharma", avatar: "", initials: "PS", color: "#00C896" },
    actionLabel: "Reply",
    dueDate: "Dec 22, 2024",
  },
  {
    id: "n3",
    type: "mention",
    title: "You were mentioned",
    message: "Alex Kim mentioned you in 'Q4 Marketing Campaign'",
    read: false,
    createdAt: "45 min ago",
    taskId: "t3",
    taskTitle: "Q4 Marketing Campaign Strategy",
    taskDescription:
      "Plan and execute the Q4 marketing campaign across all channels. Includes email sequences, social media calendar, paid ads budget allocation, and influencer partnerships.",
    taskStatus: "todo",
    taskPriority: "high",
    projectName: "Q4 Campaign",
    spaceName: "Marketing",
    actor: { name: "Alex Kim", avatar: "", initials: "AK", color: "#FFA500" },
    actionLabel: "View Mention",
    dueDate: "Jan 5, 2025",
  },
  {
    id: "n4",
    type: "status_change",
    title: "Task status updated",
    message: "Marcus Chen moved 'User authentication module' to In Review",
    read: false,
    createdAt: "1 hr ago",
    taskId: "t4",
    taskTitle: "User authentication module",
    taskDescription:
      "Build a complete authentication system with JWT tokens, refresh token rotation, OAuth2 social login (Google, GitHub), and two-factor authentication via TOTP.",
    taskStatus: "in_review",
    taskPriority: "urgent",
    projectName: "Backend Infrastructure",
    spaceName: "Engineering",
    actor: { name: "Marcus Chen", avatar: "", initials: "MC", color: "#FF4D4D" },
    actionLabel: "Review Task",
    dueDate: "Dec 20, 2024",
  },
  {
    id: "n5",
    type: "due_date",
    title: "Due date approaching",
    message: "'Mobile app performance audit' is due in 2 days",
    read: true,
    createdAt: "3 hr ago",
    taskId: "t5",
    taskTitle: "Mobile app performance audit",
    taskDescription:
      "Conduct a thorough performance audit of the iOS and Android apps. Profile startup time, memory usage, frame rate, and network request efficiency. Produce a report with actionable recommendations.",
    taskStatus: "in_progress",
    taskPriority: "high",
    projectName: "Mobile v2.0",
    spaceName: "Engineering",
    actor: { name: "System", avatar: "", initials: "SY", color: "#6B7280" },
    actionLabel: "View Task",
    dueDate: "Dec 21, 2024",
  },
  {
    id: "n6",
    type: "comment",
    title: "New comment on your task",
    message: "Sofia Reyes left feedback on 'Brand identity refresh'",
    read: true,
    createdAt: "5 hr ago",
    taskId: "t6",
    taskTitle: "Brand identity refresh",
    taskDescription:
      "Update the brand identity including logo variations, color palette documentation, typography system, and icon library. Deliver a comprehensive brand guidelines PDF.",
    taskStatus: "in_review",
    taskPriority: "normal",
    projectName: "Product Redesign",
    spaceName: "Design",
    actor: { name: "Sofia Reyes", avatar: "", initials: "SR", color: "#7B68EE" },
    actionLabel: "View Comment",
    dueDate: "Dec 30, 2024",
  },
  {
    id: "n7",
    type: "assignment",
    title: "Task assigned to you",
    message: "Jordan Lee assigned you to 'Write API documentation'",
    read: true,
    createdAt: "Yesterday",
    taskId: "t7",
    taskTitle: "Write API documentation",
    taskDescription:
      "Create comprehensive API documentation using OpenAPI 3.0 spec. Cover all endpoints, request/response schemas, authentication flows, error codes, and include interactive examples via Swagger UI.",
    taskStatus: "todo",
    taskPriority: "normal",
    projectName: "Developer Experience",
    spaceName: "Engineering",
    actor: { name: "Jordan Lee", avatar: "", initials: "JL", color: "#7B68EE" },
    actionLabel: "View Task",
    dueDate: "Jan 10, 2025",
  },
  {
    id: "n8",
    type: "status_change",
    title: "Task completed",
    message: "Priya Sharma marked 'Database schema migration' as Done",
    read: true,
    createdAt: "Yesterday",
    taskId: "t8",
    taskTitle: "Database schema migration",
    taskDescription:
      "Migrate the production database schema to support multi-tenancy. Includes writing migration scripts, testing rollback procedures, and coordinating a zero-downtime deployment window.",
    taskStatus: "done",
    taskPriority: "urgent",
    projectName: "Backend Infrastructure",
    spaceName: "Engineering",
    actor: { name: "Priya Sharma", avatar: "", initials: "PS", color: "#00C896" },
    actionLabel: "View Task",
    dueDate: "Dec 18, 2024",
  },
  {
    id: "n9",
    type: "mention",
    title: "You were mentioned",
    message: "Alex Kim mentioned you in 'Content calendar planning'",
    read: true,
    createdAt: "2 days ago",
    taskId: "t9",
    taskTitle: "Content calendar planning",
    taskDescription:
      "Build out the content calendar for Q1 2025. Map blog posts, social content, newsletters, and webinars to key product milestones and industry events.",
    taskStatus: "todo",
    taskPriority: "low",
    projectName: "Q4 Campaign",
    spaceName: "Marketing",
    actor: { name: "Alex Kim", avatar: "", initials: "AK", color: "#FFA500" },
    actionLabel: "View Mention",
    dueDate: "Jan 15, 2025",
  },
];

// ─── Type Icon Map ─────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  assignment: { icon: User, color: "#7B68EE", bg: "#F0EEFF", label: "Assignment" },
  comment: { icon: MessageSquare, color: "#00C896", bg: "#EDFFF9", label: "Comment" },
  mention: { icon: Tag, color: "#FFA500", bg: "#FFF8EC", label: "Mention" },
  status_change: { icon: Activity, color: "#7B68EE", bg: "#F0EEFF", label: "Status" },
  due_date: { icon: Clock, color: "#FF4D4D", bg: "#FFF0F0", label: "Due Date" },
};

type FilterTab = "all" | "unread" | "mentions";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InboxPage() {
  const [notifications, setNotifications] = useState<MockNotification[]>(MOCK_NOTIFICATIONS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_NOTIFICATIONS[0]?.id ?? "");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.read;
    if (activeFilter === "mentions") return n.type === "mention";
    return true;
  });

  const selectedNotification = notifications.find((n) => n.id === selectedId) ?? null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    markOneRead(id);
  };

  const filterTabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "mentions", label: "Mentions", count: notifications.filter((n) => n.type === "mention").length },
  ];

  return (
    <main className="min-h-screen bg-[#F4F4F8]">
      {/* Page Header */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-[#1E1E2E] border-b border-white/10 px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center shadow-lg shadow-[#7B68EE]/30">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold tracking-tight">Inbox</h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                  : "All caught up!"}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-white/10"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 h-[calc(100vh-220px)] min-h-[500px]">
          {/* ── Left Panel ── */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="w-full md:w-[380px] lg:w-[420px] flex-shrink-0 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-3 border-b border-gray-100 bg-gray-50/50">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === tab.key
                      ? "bg-[#7B68EE] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                  {(tab.count ?? 0) > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                        activeFilter === tab.key
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 py-16">
                  <Bell className="w-10 h-10 opacity-30" />
                  <p className="text-sm font-medium">No notifications here</p>
                </div>
              ) : (
                <motion.ul
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-gray-50"
                >
                  {filteredNotifications.map((notif) => {
                    const typeConf = TYPE_CONFIG[notif.type];
                    const Icon = typeConf.icon;
                    const isSelected = selectedId === notif.id;

                    return (
                      <motion.li
                        key={notif.id}
                        variants={fadeInUp}
                        whileHover={{ backgroundColor: "#F9F9FF" }}
                        onClick={() => handleSelect(notif.id)}
                        className={`relative flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#F0EEFF] border-l-2 border-[#7B68EE]"
                            : "hover:bg-gray-50 border-l-2 border-transparent"
                        }`}
                      >
                        {/* Unread dot */}
                        {!notif.read && (
                          <span className="absolute top-4 right-3 w-2 h-2 rounded-full bg-[#7B68EE] flex-shrink-0" />
                        )}

                        {/* Actor Avatar */}
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: notif.actor.color }}
                        >
                          {notif.actor.initials}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className="inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-md"
                              style={{ color: typeConf.color, backgroundColor: typeConf.bg }}
                            >
                              <Icon className="w-3 h-3" />
                              {typeConf.label}
                            </span>
                          </div>
                          <p
                            className={`text-sm leading-snug truncate ${
                              !notif.read ? "font-semibold text-gray-900" : "text-gray-600"
                            }`}
                          >
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">{notif.createdAt}</span>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-gray-400 truncate">{notif.projectName}</span>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              )}
            </div>
          </motion.div>

          {/* ── Right Detail Panel ── */}
          <div className="hidden md:flex flex-1 flex-col">
            <AnimatePresence mode="wait">
              {selectedNotification ? (
                <motion.div
                  key={selectedNotification.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full"
                >
                  {/* Detail Header */}
                  <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-[#F0EEFF] to-white">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {(() => {
                          const typeConf = TYPE_CONFIG[selectedNotification.type];
                          const Icon = typeConf.icon;
                          return (
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: typeConf.bg }}
                            >
                              <Icon className="w-5 h-5" style={{ color: typeConf.color }} />
                            </div>
                          );
                        })()}
                        <div>
                          <h2 className="text-gray-900 font-bold text-lg leading-tight">
                            {selectedNotification.title}
                          </h2>
                          <p className="text-gray-500 text-sm mt-0.5">
                            {selectedNotification.message}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 mt-1">
                        {selectedNotification.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Detail Body */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {/* Actor */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: selectedNotification.actor.color }}
                      >
                        {selectedNotification.actor.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {selectedNotification.actor.name}
                        </p>
                        <p className="text-xs text-gray-400">Team Member</p>
                      </div>
                    </div>

                    {/* Task Card */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50/60 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-[#7B68EE]" />
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Linked Task
                          </span>
                        </div>
                        <Link
                          href="/workspace"
                          className="flex items-center gap-1 text-xs text-[#7B68EE] hover:underline font-medium"
                        >
                          Open <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                      <div className="px-4 py-4 space-y-3">
                        <h3 className="text-gray-900 font-semibold text-base leading-snug">
                          {selectedNotification.taskTitle}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {selectedNotification.taskDescription}
                        </p>

                        {/* Meta Row */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {/* Status */}
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              color: STATUS_CONFIG[selectedNotification.taskStatus]?.color ?? "#6B7280",
                              backgroundColor: STATUS_CONFIG[selectedNotification.taskStatus]?.bg ?? "#F3F4F6",
                            }}
                          >
                            <Circle className="w-2.5 h-2.5 fill-current" />
                            {STATUS_CONFIG[selectedNotification.taskStatus]?.label ?? "Unknown"}
                          </span>

                          {/* Priority */}
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              color: PRIORITY_CONFIG[selectedNotification.taskPriority]?.color ?? "#6B7280",
                              backgroundColor: PRIORITY_CONFIG[selectedNotification.taskPriority]?.bg ?? "#F3F4F6",
                            }}
                          >
                            <AlertCircle className="w-2.5 h-2.5" />
                            {PRIORITY_CONFIG[selectedNotification.taskPriority]?.label ?? "Normal"}
                          </span>

                          {/* Due Date */}
                          {selectedNotification.dueDate && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                              <Calendar className="w-3 h-3" />
                              {selectedNotification.dueDate}
                            </span>
                          )}
                        </div>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
                          <span className="font-medium text-gray-500">{selectedNotification.spaceName}</span>
                          <ChevronRight className="w-3 h-3" />
                          <span>{selectedNotification.projectName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Quick Actions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Link
                            href="/workspace"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7B68EE] text-white text-sm font-semibold shadow-sm shadow-[#7B68EE]/30 hover:bg-[#6A57DD] transition-colors"
                          >
                            {selectedNotification.actionLabel ?? "View Task"}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </motion.div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => markOneRead(selectedNotification.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Mark as read
                        </motion.button>
                      </div>
                    </div>

                    {/* Context Timeline */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Activity Context
                      </p>
                      <div className="space-y-3">
                        {[
                          {
                            icon: User,
                            color: "#7B68EE",
                            text: `${selectedNotification.actor.name} triggered this notification`,
                            time: selectedNotification.createdAt,
                          },
                          {
                            icon: Activity,
                            color: "#00C896",
                            text: `Task status: ${STATUS_CONFIG[selectedNotification.taskStatus]?.label ?? "Unknown"}`,
                            time: "Current",
                          },
                          {
                            icon: Clock,
                            color: "#FFA500",
                            text: selectedNotification.dueDate
                              ? `Due ${selectedNotification.dueDate}`
                              : "No due date set",
                            time: "Deadline",
                          },
                        ].map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <div key={i} className="flex items-start gap-3">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${item.color}18` }}
                              >
                                <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700">{item.text}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Detail Footer */}
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Notification · {selectedNotification.projectName}
                    </span>
                    <Link
                      href="/workspace"
                      className="flex items-center gap-1.5 text-xs text-[#7B68EE] font-semibold hover:underline"
                    >
                      Go to workspace <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 gap-4 text-gray-400"
                >
                  <Bell className="w-12 h-12 opacity-20" />
                  <p className="text-sm font-medium">Select a notification to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}