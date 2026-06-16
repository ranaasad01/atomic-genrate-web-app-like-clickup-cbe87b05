"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, Tag, CheckSquare, MessageSquare, Activity, ChevronDown, ChevronRight, Plus, Edit, Trash2, Check, AlertCircle, Star, Eye, Paperclip, Send, MoreHorizontal, Flag, Layers, X } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/lib/data";
import type { Priority, TaskStatus } from "@/lib/data";

// ─── Inline Mock Data ─────────────────────────────────────────────────────────

const MOCK_USERS = [
  { id: "u1", name: "Alex Rivera", avatar: "AR", color: "#7B68EE" },
  { id: "u2", name: "Jordan Kim", avatar: "JK", color: "#00C896" },
  { id: "u3", name: "Sam Patel", avatar: "SP", color: "#FFA500" },
  { id: "u4", name: "Morgan Lee", avatar: "ML", color: "#FF4D4D" },
];

const MOCK_TASK = {
  id: "task-001",
  title: "Redesign the onboarding flow for new users",
  description: `The current onboarding experience has a 42% drop-off rate after step 2. We need to redesign the entire flow to be more intuitive, engaging, and personalized.

**Goals:**
- Reduce drop-off rate to under 15%
- Personalize the experience based on user role (developer, designer, manager)
- Add interactive product tour with tooltips
- Implement progress indicators throughout

**Acceptance Criteria:**
- New flow tested with at least 10 users in usability sessions
- All screens designed in Figma and approved by stakeholders
- Mobile-responsive implementation
- Analytics events tracked at each step`,
  status: "in_progress" as TaskStatus,
  priority: "high" as Priority,
  assigneeId: "u1",
  projectId: "proj-1",
  projectName: "Product Redesign Q1",
  spaceName: "Design Team",
  dueDate: "2024-02-15",
  createdAt: "2024-01-10",
  updatedAt: "2024-01-28",
  estimatedHours: 24,
  loggedHours: 14,
  watchers: ["u2", "u3"],
  tags: ["UX", "Onboarding", "High Impact", "Q1"],
  subtasks: [
    { id: "st1", title: "Audit current onboarding analytics", completed: true },
    { id: "st2", title: "Conduct 5 user interviews", completed: true },
    { id: "st3", title: "Create user journey maps", completed: true },
    { id: "st4", title: "Design wireframes for new flow", completed: false },
    { id: "st5", title: "Build interactive Figma prototype", completed: false },
    { id: "st6", title: "Run usability testing sessions", completed: false },
    { id: "st7", title: "Implement frontend changes", completed: false },
    { id: "st8", title: "QA and cross-browser testing", completed: false },
  ],
  comments: [
    {
      id: "c1",
      authorId: "u2",
      content:
        "I've finished the analytics audit. The biggest drop-off happens right after the 'invite your team' step. Users seem confused about whether it's required. Attaching the full report.",
      createdAt: "2024-01-15T10:30:00Z",
      reactions: [{ emoji: "👍", count: 3 }, { emoji: "🔥", count: 1 }],
    },
    {
      id: "c2",
      authorId: "u3",
      content:
        "Great findings! I'd suggest we make the team invite step optional and move it to a later stage — maybe after the user has created their first project. That way they have context for why they'd want teammates.",
      createdAt: "2024-01-16T14:15:00Z",
      reactions: [{ emoji: "💯", count: 2 }],
    },
    {
      id: "c3",
      authorId: "u1",
      content:
        "Agreed. I'm starting on the wireframes today. Will share a Figma link by end of week. @Jordan can you review the mobile breakpoints once I have a draft?",
      createdAt: "2024-01-20T09:00:00Z",
      reactions: [],
    },
    {
      id: "c4",
      authorId: "u4",
      content:
        "From the PM side — we need to make sure we're tracking conversion at each step with Mixpanel events. I'll create the tracking spec doc and share it here.",
      createdAt: "2024-01-22T16:45:00Z",
      reactions: [{ emoji: "👍", count: 1 }],
    },
  ],
  activity: [
    { id: "a1", type: "created", userId: "u1", detail: "created this task", timestamp: "2024-01-10T08:00:00Z" },
    { id: "a2", type: "status", userId: "u2", detail: "changed status from To Do → In Progress", timestamp: "2024-01-12T10:00:00Z" },
    { id: "a3", type: "assignment", userId: "u1", detail: "assigned to Alex Rivera", timestamp: "2024-01-12T10:05:00Z" },
    { id: "a4", type: "priority", userId: "u3", detail: "changed priority from Normal → High", timestamp: "2024-01-14T14:30:00Z" },
    { id: "a5", type: "subtask", userId: "u1", detail: "completed subtask: Audit current onboarding analytics", timestamp: "2024-01-15T09:00:00Z" },
    { id: "a6", type: "subtask", userId: "u2", detail: "completed subtask: Conduct 5 user interviews", timestamp: "2024-01-18T17:00:00Z" },
    { id: "a7", type: "due_date", userId: "u3", detail: "set due date to Feb 15, 2024", timestamp: "2024-01-20T11:00:00Z" },
    { id: "a8", type: "subtask", userId: "u1", detail: "completed subtask: Create user journey maps", timestamp: "2024-01-25T15:30:00Z" },
  ],
  attachments: [
    { id: "att1", name: "onboarding-analytics-report.pdf", size: "2.4 MB", type: "pdf", uploadedBy: "u2", uploadedAt: "2024-01-15T10:35:00Z" },
    { id: "att2", name: "user-interview-notes.docx", size: "890 KB", type: "doc", uploadedBy: "u2", uploadedAt: "2024-01-18T17:05:00Z" },
    { id: "att3", name: "journey-map-v1.fig", size: "5.1 MB", type: "figma", uploadedBy: "u1", uploadedAt: "2024-01-25T15:35:00Z" },
  ],
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getUserById(id: string) {
  return MOCK_USERS.find((u) => u.id === id) ?? MOCK_USERS[0];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatRelative(isoStr: string) {
  const date = new Date(isoStr);
  const now = new Date("2024-01-29T12:00:00Z");
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(isoStr);
}

// ─── Avatar Component ─────────────────────────────────────────────────────────

function Avatar({ userId, size = "md" }: { userId: string; size?: "sm" | "md" | "lg" }) {
  const user = getUserById(userId);
  const sizeClass = size === "sm" ? "w-6 h-6 text-xs" : size === "lg" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ backgroundColor: user.color }}
      title={user.name}
    >
      {user.avatar}
    </div>
  );
}

// ─── Tab Types ────────────────────────────────────────────────────────────────

type TabKey = "subtasks" | "comments" | "activity" | "attachments";

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function TaskDetailPage() {
  const task = MOCK_TASK;
  const [activeTab, setActiveTab] = useState<TabKey>("subtasks");
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(task.comments);
  const [descExpanded, setDescExpanded] = useState(true);
  const [newSubtask, setNewSubtask] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);

  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const subtaskProgress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const statusConfig = STATUS_CONFIG[task.status];

  function toggleSubtask(id: string) {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  }

  function handleAddSubtask() {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: `st-new-${prev.length}`, title: newSubtask.trim(), completed: false },
    ]);
    setNewSubtask("");
    setAddingSubtask(false);
  }

  function handleAddComment() {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c-new-${prev.length}`,
        authorId: "u1",
        content: newComment.trim(),
        createdAt: "2024-01-29T12:00:00Z",
        reactions: [],
      },
    ]);
    setNewComment("");
  }

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "subtasks", label: "Subtasks", icon: <CheckSquare className="w-4 h-4" />, count: subtasks.length },
    { key: "comments", label: "Comments", icon: <MessageSquare className="w-4 h-4" />, count: comments.length },
    { key: "activity", label: "Activity", icon: <Activity className="w-4 h-4" />, count: task.activity.length },
    { key: "attachments", label: "Attachments", icon: <Paperclip className="w-4 h-4" />, count: task.attachments.length },
  ];

  return (
    <main className="min-h-screen bg-[#F4F4F8]">
      {/* Top Bar */}
      <div className="bg-[#1E1E2E] border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/workspace" className="hover:text-white transition-colors">{task.spaceName}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/workspace" className="hover:text-white transition-colors">{task.projectName}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-300 truncate max-w-xs">{task.title}</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Back Button */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-6">
          <Link href="/workspace">
            <motion.span
              whileHover={{ x: -3 }}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#7B68EE] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Project
            </motion.span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Task Header */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              {/* Status + Priority Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ color: statusConfig.color, backgroundColor: statusConfig.bg }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusConfig.color }} />
                  {statusConfig.label}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ color: priorityConfig.color, backgroundColor: priorityConfig.bg }}
                >
                  <Flag className="w-3 h-3" />
                  {priorityConfig.label}
                </span>
                {task.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0EEFF] text-[#7B68EE]">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
                {task.title}
              </h1>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-4 border-b border-gray-100">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Due {formatDate(task.dueDate ?? "")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {task.loggedHours}h / {task.estimatedHours}h logged
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-gray-400" />
                  {task.projectName}
                </span>
              </div>

              {/* Description */}
              <div className="mt-4">
                <button
                  onClick={() => setDescExpanded((v) => !v)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3 hover:text-[#7B68EE] transition-colors"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${descExpanded ? "" : "-rotate-90"}`}
                  />
                  Description
                </button>
                <AnimatePresence initial={false}>
                  {descExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl p-4 text-sm">
                        {task.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-[#7B68EE]">{subtaskProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${subtaskProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF]"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {completedSubtasks} of {subtasks.length} subtasks completed
              </p>
            </motion.div>

            {/* Tabs */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Tab Bar */}
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                      activeTab === tab.key
                        ? "text-[#7B68EE] border-[#7B68EE] bg-[#F0EEFF]/40"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {tab.count !== undefined && (
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                          activeTab === tab.key ? "bg-[#7B68EE] text-white" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-5">
                <AnimatePresence mode="wait">
                  {activeTab === "subtasks" && (
                    <motion.div
                      key="subtasks"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0 }}
                    >
                      <div className="space-y-2">
                        {subtasks.map((subtask) => (
                          <motion.div
                            key={subtask.id}
                            variants={fadeInUp}
                            whileHover={{ x: 2 }}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <button
                              onClick={() => toggleSubtask(subtask.id)}
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                subtask.completed
                                  ? "bg-[#00C896] border-[#00C896]"
                                  : "border-gray-300 hover:border-[#7B68EE]"
                              }`}
                            >
                              {subtask.completed && <Check className="w-3 h-3 text-white" />}
                            </button>
                            <span
                              className={`text-sm flex-1 transition-colors ${
                                subtask.completed ? "line-through text-gray-400" : "text-gray-700"
                              }`}
                            >
                              {subtask.title}
                            </span>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200">
                              <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                          </motion.div>
                        ))}
                      </div>

                      {/* Add Subtask */}
                      <div className="mt-3">
                        {addingSubtask ? (
                          <div className="flex items-center gap-2 p-3 rounded-xl border border-[#7B68EE]/30 bg-[#F0EEFF]/30">
                            <div className="w-5 h-5 rounded-md border-2 border-gray-300 flex-shrink-0" />
                            <input
                              type="text"
                              value={newSubtask}
                              onChange={(e) => setNewSubtask(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddSubtask();
                                if (e.key === "Escape") setAddingSubtask(false);
                              }}
                              placeholder="New subtask title..."
                              autoFocus
                              className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
                            />
                            <button onClick={handleAddSubtask} className="p-1 rounded hover:bg-[#7B68EE]/20 text-[#7B68EE]">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setAddingSubtask(false)} className="p-1 rounded hover:bg-gray-200 text-gray-400">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAddingSubtask(true)}
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#7B68EE] transition-colors p-3 w-full rounded-xl hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                            Add subtask
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "comments" && (
                    <motion.div
                      key="comments"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      {comments.map((comment) => {
                        const author = getUserById(comment.authorId);
                        return (
                          <motion.div key={comment.id} variants={fadeInUp} className="flex gap-3">
                            <Avatar userId={comment.authorId} size="md" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-sm font-semibold text-gray-800">{author.name}</span>
                                <span className="text-xs text-gray-400">{formatRelative(comment.createdAt)}</span>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-3.5 text-sm text-gray-700 leading-relaxed">
                                {comment.content}
                              </div>
                              {comment.reactions.length > 0 && (
                                <div className="flex items-center gap-1.5 mt-2">
                                  {comment.reactions.map((r, i) => (
                                    <span
                                      key={i}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors"
                                    >
                                      {r.emoji} {r.count}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* New Comment */}
                      <div className="flex gap-3 pt-2 border-t border-gray-100">
                        <Avatar userId="u1" size="md" />
                        <div className="flex-1">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment... Use @ to mention teammates"
                            rows={3}
                            className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none outline-none focus:border-[#7B68EE] focus:ring-2 focus:ring-[#7B68EE]/10 transition-all text-gray-700 placeholder-gray-400"
                          />
                          <div className="flex justify-end mt-2">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={handleAddComment}
                              disabled={!newComment.trim()}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7B68EE] text-white text-sm font-medium hover:bg-[#6A57DD] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Comment
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "activity" && (
                    <motion.div
                      key="activity"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0 }}
                      className="space-y-1"
                    >
                      {task.activity.map((item, idx) => {
                        const user = getUserById(item.userId);
                        return (
                          <motion.div
                            key={item.id}
                            variants={fadeInUp}
                            className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0"
                          >
                            <div className="relative flex-shrink-0">
                              <Avatar userId={item.userId} size="sm" />
                              {idx < task.activity.length - 1 && (
                                <div className="absolute left-1/2 top-full w-px h-4 bg-gray-100 -translate-x-1/2 mt-0.5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-800">{user.name}</span>{" "}
                                {item.detail}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{formatRelative(item.timestamp)}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}

                  {activeTab === "attachments" && (
                    <motion.div
                      key="attachments"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {task.attachments.map((att) => {
                        const uploader = getUserById(att.uploadedBy);
                        const extColor =
                          att.type === "pdf"
                            ? "bg-red-50 text-red-500"
                            : att.type === "figma"
                            ? "bg-purple-50 text-purple-500"
                            : "bg-blue-50 text-blue-500";
                        return (
                          <motion.div
                            key={att.id}
                            variants={scaleIn}
                            whileHover={{ y: -1 }}
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#7B68EE]/30 hover:shadow-sm transition-all cursor-pointer group"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold uppercase ${extColor}`}>
                              {att.type}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{att.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {att.size} · Uploaded by {uploader.name} · {formatRelative(att.uploadedAt)}
                              </p>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-gray-100">
                              <Eye className="w-4 h-4 text-gray-400" />
                            </button>
                          </motion.div>
                        );
                      })}

                      <motion.button
                        variants={fadeInUp}
                        whileHover={{ scale: 1.01 }}
                        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-[#7B68EE]/40 hover:text-[#7B68EE] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Upload attachment
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            {/* Task Details Card */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#7B68EE]" />
                Task Details
              </h2>

              <div className="space-y-4">
                {/* Assignee */}
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide font-medium">Assignee</p>
                  <div className="flex items-center gap-2">
                    <Avatar userId={task.assigneeId ?? "u1"} size="sm" />
                    <span className="text-sm text-gray-700 font-medium">
                      {getUserById(task.assigneeId ?? "u1").name}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide font-medium">Status</p>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ color: statusConfig.color, backgroundColor: statusConfig.bg }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusConfig.color }} />
                    {statusConfig.label}
                  </span>
                </div>

                {/* Priority */}
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide font-medium">Priority</p>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ color: priorityConfig.color, backgroundColor: priorityConfig.bg }}
                  >
                    <Flag className="w-3 h-3" />
                    {priorityConfig.label}
                  </span>
                </div>

                {/* Due Date */}
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide font-medium">Due Date</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(task.dueDate ?? "")}
                  </div>
                </div>

                {/* Time Tracking */}
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide font-medium">Time Tracked</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {task.loggedHours}h of {task.estimatedHours}h
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.round((task.loggedHours / task.estimatedHours) * 100))}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF]"
                    />
                  </div>
                </div>

                {/* Project */}
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide font-medium">Project</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-3 h-3 rounded-sm bg-[#7B68EE]" />
                    {task.projectName}
                  </div>
                </div>

                {/* Space */}
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide font-medium">Space</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Layers className="w-4 h-4 text-gray-400" />
                    {task.spaceName}
                  </div>
                </div>

                {/* Created */}
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 uppercase tracking-wide font-medium">Created</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {formatDate(task.createdAt)}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Watchers Card */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#7B68EE]" />
                Watchers
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                {task.watchers.map((wId) => {
                  const w = getUserById(wId);
                  return (
                    <div key={wId} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <Avatar userId={wId} size="sm" />
                      <span className="text-xs text-gray-600 font-medium">{w.name.split(" ")[0]}</span>
                    </div>
                  );
                })}
                <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dashed border-gray-200 text-xs text-gray-400 hover:border-[#7B68EE]/40 hover:text-[#7B68EE] transition-colors">
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              </div>
            </motion.div>

            {/* Tags Card */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#7B68EE]" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0EEFF] text-[#7B68EE] hover:bg-[#7B68EE] hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                    <X className="w-3 h-3 opacity-60" />
                  </span>
                ))}
                <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-gray-200 text-gray-400 hover:border-[#7B68EE]/40 hover:text-[#7B68EE] transition-colors">
                  <Plus className="w-3 h-3" />
                  Add tag
                </button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-2"
            >
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h2>
              {[
                { icon: <Edit className="w-4 h-4" />, label: "Edit Task", color: "text-[#7B68EE]", bg: "hover:bg-[#F0EEFF]" },
                { icon: <Star className="w-4 h-4" />, label: "Mark as Favorite", color: "text-yellow-500", bg: "hover:bg-yellow-50" },
                { icon: <Eye className="w-4 h-4" />, label: "Watch Task", color: "text-blue-500", bg: "hover:bg-blue-50" },
                { icon: <Trash2 className="w-4 h-4" />, label: "Delete Task", color: "text-red-500", bg: "hover:bg-red-50" },
              ].map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 ${action.bg} transition-colors text-left`}
                >
                  <span className={action.color}>{action.icon}</span>
                  {action.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Missing import fix ───────────────────────────────────────────────────────
function slideInRight(props: any) { return props; }