"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, Calendar, Check, ChevronDown, Clock, Edit, Mail, Plus, Star, Trash2, User, X, AlertCircle, FileText, Activity, Image, Eye, Bell } from 'lucide-react';
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
  slideInLeft,
} from "@/lib/motion";
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  type Priority,
  type TaskStatus,
} from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubtaskItem {
  id: string;
  title: string;
  completed: boolean;
}

interface CommentItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

interface ActivityItem {
  id: string;
  type: "status_change" | "assignment" | "comment" | "priority" | "created" | "due_date";
  description: string;
  user: string;
  timestamp: string;
}

interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USERS = [
  { id: "u1", name: "Alex Rivera", avatar: "AR", email: "alex@flowup.io", color: "#7B68EE" },
  { id: "u2", name: "Jamie Chen", avatar: "JC", email: "jamie@flowup.io", color: "#00C896" },
  { id: "u3", name: "Morgan Lee", avatar: "ML", email: "morgan@flowup.io", color: "#FFA500" },
  { id: "u4", name: "Sam Patel", avatar: "SP", email: "sam@flowup.io", color: "#FF4D4D" },
  { id: "u5", name: "Taylor Kim", avatar: "TK", email: "taylor@flowup.io", color: "#9B8FFF" },
];

const INITIAL_SUBTASKS: SubtaskItem[] = [
  { id: "st1", title: "Research competitor pricing models", completed: true },
  { id: "st2", title: "Design wireframes for onboarding flow", completed: true },
  { id: "st3", title: "Write API documentation for auth endpoints", completed: false },
  { id: "st4", title: "Set up staging environment", completed: false },
  { id: "st5", title: "Conduct user interviews (5 participants)", completed: false },
];

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: "c1",
    authorId: "u2",
    authorName: "Jamie Chen",
    authorAvatar: "JC",
    content: "I've finished the wireframes — they're looking great! Let me know if you want me to iterate on the onboarding screens before we hand off to engineering.",
    createdAt: "2024-01-15T09:30:00Z",
  },
  {
    id: "c2",
    authorId: "u3",
    authorName: "Morgan Lee",
    authorAvatar: "ML",
    content: "The API docs are about 60% done. I'll have the auth endpoints fully documented by EOD tomorrow. @Alex can you review the schema definitions when ready?",
    createdAt: "2024-01-15T11:45:00Z",
  },
  {
    id: "c3",
    authorId: "u1",
    authorName: "Alex Rivera",
    authorAvatar: "AR",
    content: "Sounds good Morgan! I'll block off time Thursday afternoon to review. Also, the staging environment is almost ready — just waiting on the SSL cert to propagate.",
    createdAt: "2024-01-15T14:20:00Z",
  },
];

const INITIAL_ACTIVITY: ActivityItem[] = [
  { id: "a1", type: "created", description: "Task created", user: "Alex Rivera", timestamp: "2024-01-10T08:00:00Z" },
  { id: "a2", type: "assignment", description: "Assigned to Alex Rivera", user: "Alex Rivera", timestamp: "2024-01-10T08:01:00Z" },
  { id: "a3", type: "priority", description: "Priority set to High", user: "Alex Rivera", timestamp: "2024-01-10T08:02:00Z" },
  { id: "a4", type: "status_change", description: "Status changed from To Do → In Progress", user: "Jamie Chen", timestamp: "2024-01-12T10:15:00Z" },
  { id: "a5", type: "comment", description: "Left a comment", user: "Jamie Chen", timestamp: "2024-01-15T09:30:00Z" },
  { id: "a6", type: "due_date", description: "Due date set to Jan 22, 2024", user: "Morgan Lee", timestamp: "2024-01-15T11:00:00Z" },
  { id: "a7", type: "comment", description: "Left a comment", user: "Morgan Lee", timestamp: "2024-01-15T11:45:00Z" },
  { id: "a8", type: "comment", description: "Left a comment", user: "Alex Rivera", timestamp: "2024-01-15T14:20:00Z" },
];

const INITIAL_ATTACHMENTS: AttachmentItem[] = [
  { id: "att1", name: "onboarding-wireframes-v2.fig", size: "4.2 MB", type: "figma", uploadedBy: "Jamie Chen", uploadedAt: "2024-01-14T16:30:00Z" },
  { id: "att2", name: "competitor-analysis.pdf", size: "1.8 MB", type: "pdf", uploadedBy: "Alex Rivera", uploadedAt: "2024-01-13T09:00:00Z" },
  { id: "att3", name: "user-interview-notes.docx", size: "256 KB", type: "doc", uploadedBy: "Sam Patel", uploadedAt: "2024-01-15T13:00:00Z" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function getActivityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "created": return <Plus className="w-3 h-3" />;
    case "assignment": return <User className="w-3 h-3" />;
    case "comment": return <Mail className="w-3 h-3" />;
    case "status_change": return <Activity className="w-3 h-3" />;
    case "priority": return <AlertCircle className="w-3 h-3" />;
    case "due_date": return <Calendar className="w-3 h-3" />;
    default: return <Clock className="w-3 h-3" />;
  }
}

function getActivityColor(type: ActivityItem["type"]): string {
  switch (type) {
    case "created": return "bg-[#7B68EE] text-white";
    case "assignment": return "bg-[#00C896] text-white";
    case "comment": return "bg-blue-500 text-white";
    case "status_change": return "bg-[#FFA500] text-white";
    case "priority": return "bg-[#FF4D4D] text-white";
    case "due_date": return "bg-purple-500 text-white";
    default: return "bg-gray-400 text-white";
  }
}

function getFileIcon(type: string): string {
  switch (type) {
    case "figma": return "🎨";
    case "pdf": return "📄";
    case "doc": return "📝";
    case "image": return "🖼️";
    default: return "📎";
  }
}

// ─── Avatar Component ─────────────────────────────────────────────────────────

function Avatar({ initials, color, size = "md" }: { initials: string; color: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TaskDetailPage() {
  const shouldReduceMotion = useReducedMotion();

  // Task fields
  const [title, setTitle] = useState("Launch New User Onboarding Flow");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(title);
  const [description, setDescription] = useState(
    "Design and implement a comprehensive onboarding experience for new users. This includes the welcome screen, feature tour, initial workspace setup wizard, and the first-run checklist. The goal is to reduce time-to-value from 3 days to under 30 minutes.\n\nKey success metrics:\n• 80% completion rate for the onboarding checklist\n• < 5% drop-off at each step\n• NPS score improvement of +15 points within 60 days"
  );
  const [status, setStatus] = useState<TaskStatus>("in_progress");
  const [priority, setPriority] = useState<Priority>("high");
  const [assigneeId, setAssigneeId] = useState<string>("u1");
  const [dueDate, setDueDate] = useState("2024-01-22");
  const [starred, setStarred] = useState(false);

  // Dropdowns
  const [statusOpen, setStatusOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [assigneeOpen, setAssigneeOpen] = useState(false);

  // Subtasks
  const [subtasks, setSubtasks] = useState<SubtaskItem[]>(INITIAL_SUBTASKS);
  const [newSubtask, setNewSubtask] = useState("");

  // Comments
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState("");

  // Activity
  const [activity, setActivity] = useState<ActivityItem[]>(INITIAL_ACTIVITY);

  // Active tab
  const [activeTab, setActiveTab] = useState<"subtasks" | "comments" | "attachments" | "activity">("subtasks");

  // ── Title editing ──
  const commitTitle = useCallback(() => {
    const trimmed = titleDraft.trim();
    if (trimmed) setTitle(trimmed);
    else setTitleDraft(title);
    setEditingTitle(false);
  }, [titleDraft, title]);

  // ── Status change ──
  const handleStatusChange = useCallback((s: TaskStatus) => {
    const prev = STATUS_CONFIG[status]?.label ?? status;
    const next = STATUS_CONFIG[s]?.label ?? s;
    setStatus(s);
    setStatusOpen(false);
    setActivity((prev_) => [
      {
        id: `a${Date.now()}`,
        type: "status_change",
        description: `Status changed from ${prev} → ${next}`,
        user: "You",
        timestamp: new Date().toISOString(),
      },
      ...prev_,
    ]);
  }, [status]);

  // ── Priority change ──
  const handlePriorityChange = useCallback((p: Priority) => {
    const label = PRIORITY_CONFIG[p]?.label ?? p;
    setPriority(p);
    setPriorityOpen(false);
    setActivity((prev) => [
      {
        id: `a${Date.now()}`,
        type: "priority",
        description: `Priority changed to ${label}`,
        user: "You",
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  // ── Assignee change ──
  const handleAssigneeChange = useCallback((uid: string) => {
    const user = MOCK_USERS.find((u) => u.id === uid);
    setAssigneeId(uid);
    setAssigneeOpen(false);
    setActivity((prev) => [
      {
        id: `a${Date.now()}`,
        type: "assignment",
        description: `Assigned to ${user?.name ?? "Unknown"}`,
        user: "You",
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  // ── Subtask actions ──
  const addSubtask = useCallback(() => {
    const trimmed = newSubtask.trim();
    if (!trimmed) return;
    setSubtasks((prev) => [
      ...prev,
      { id: `st${Date.now()}`, title: trimmed, completed: false },
    ]);
    setNewSubtask("");
  }, [newSubtask]);

  const toggleSubtask = useCallback((id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  }, []);

  const deleteSubtask = useCallback((id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // ── Comment actions ──
  const addComment = useCallback(() => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c${Date.now()}`,
        authorId: "u1",
        authorName: "Alex Rivera",
        authorAvatar: "AR",
        content: trimmed,
        createdAt: new Date().toISOString(),
      },
    ]);
    setActivity((prev) => [
      {
        id: `a${Date.now()}`,
        type: "comment",
        description: "Left a comment",
        user: "You",
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNewComment("");
  }, [newComment]);

  // ── Derived ──
  const assignee = MOCK_USERS.find((u) => u.id === assigneeId) ?? MOCK_USERS[0];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const subtaskProgress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;
  const statusCfg = STATUS_CONFIG[status];
  const priorityCfg = PRIORITY_CONFIG[priority];

  const tabs = [
    { id: "subtasks" as const, label: "Subtasks", count: subtasks.length },
    { id: "comments" as const, label: "Comments", count: comments.length },
    { id: "attachments" as const, label: "Attachments", count: INITIAL_ATTACHMENTS.length },
    { id: "activity" as const, label: "Activity", count: activity.length },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F8]">
      {/* ── Top Bar ── */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="bg-white border-b border-gray-200 sticky top-16 z-30"
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#7B68EE] transition-colors">Dashboard</Link>
              <span>/</span>
              <Link href="/workspace" className="hover:text-[#7B68EE] transition-colors">Workspace</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium truncate max-w-[200px]">{title}</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStarred((v) => !v)}
                className={`p-2 rounded-lg transition-colors ${starred ? "text-yellow-400 bg-yellow-50" : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-50"}`}
                aria-label="Star task"
              >
                <Star className="w-4 h-4" fill={starred ? "currentColor" : "none"} />
              </motion.button>
              <motion.button
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-gray-400 hover:text-[#7B68EE] hover:bg-[#7B68EE]/10 transition-colors"
                aria-label="Watch task"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-gray-400 hover:text-[#7B68EE] hover:bg-[#7B68EE]/10 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
              </motion.button>
              <Link href="/workspace">
                <motion.span
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Main Content ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Main Task Content ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            {/* Title */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-3">
                <div
                  className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: priorityCfg?.color ?? "#7B68EE" }}
                />
                <div className="flex-1 min-w-0">
                  {editingTitle ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={titleDraft}
                        onChange={(e) => setTitleDraft(e.target.value)}
                        onBlur={commitTitle}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitTitle();
                          if (e.key === "Escape") { setTitleDraft(title); setEditingTitle(false); }
                        }}
                        className="flex-1 text-2xl font-bold text-gray-900 border-b-2 border-[#7B68EE] outline-none bg-transparent pb-1"
                      />
                      <button onClick={commitTitle} className="p-1 text-[#7B68EE] hover:bg-[#7B68EE]/10 rounded">
                        <Check className="w-5 h-5" />
                      </button>
                      <button onClick={() => { setTitleDraft(title); setEditingTitle(false); }} className="p-1 text-gray-400 hover:bg-gray-100 rounded">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 group">
                      <h1 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h1>
                      <button
                        onClick={() => { setTitleDraft(title); setEditingTitle(true); }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-[#7B68EE] hover:bg-[#7B68EE]/10 rounded transition-all mt-0.5"
                        aria-label="Edit title"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ color: statusCfg?.color, backgroundColor: statusCfg?.bg }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusCfg?.color }} />
                      {statusCfg?.label}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ color: priorityCfg?.color, backgroundColor: priorityCfg?.bg }}
                    >
                      {priorityCfg?.label} Priority
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated Jan 15, 2024
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#7B68EE]" />
                Description
              </h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                placeholder="Add a description..."
                className="w-full text-sm text-gray-700 leading-relaxed resize-none outline-none border border-transparent rounded-xl p-3 hover:border-gray-200 focus:border-[#7B68EE] focus:ring-2 focus:ring-[#7B68EE]/10 transition-all bg-gray-50 focus:bg-white"
              />
            </motion.div>

            {/* Tabs */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                      activeTab === tab.id
                        ? "text-[#7B68EE] border-[#7B68EE]"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-200"
                    }`}
                  >
                    {tab.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id ? "bg-[#7B68EE]/10 text-[#7B68EE]" : "bg-gray-100 text-gray-500"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* ── Subtasks Tab ── */}
                  {activeTab === "subtasks" && (
                    <motion.div
                      key="subtasks"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {/* Progress */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">
                            {completedSubtasks} of {subtasks.length} completed
                          </span>
                          <span className="text-xs font-semibold text-[#7B68EE]">{subtaskProgress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${subtaskProgress}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Subtask List */}
                      <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2 mb-4">
                        <AnimatePresence>
                          {subtasks.map((st) => (
                            <motion.li
                              key={st.id}
                              variants={fadeInUp}
                              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 group transition-colors"
                            >
                              <button
                                onClick={() => toggleSubtask(st.id)}
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                  st.completed
                                    ? "bg-[#7B68EE] border-[#7B68EE]"
                                    : "border-gray-300 hover:border-[#7B68EE]"
                                }`}
                                aria-label={st.completed ? "Mark incomplete" : "Mark complete"}
                              >
                                {st.completed && <Check className="w-3 h-3 text-white" />}
                              </button>
                              <span className={`flex-1 text-sm ${st.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                                {st.title}
                              </span>
                              <button
                                onClick={() => deleteSubtask(st.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                aria-label="Delete subtask"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </motion.ul>

                      {/* Add Subtask */}
                      <div className="flex items-center gap-2">
                        <input
                          value={newSubtask}
                          onChange={(e) => setNewSubtask(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") addSubtask(); }}
                          placeholder="Add a subtask..."
                          className="flex-1 text-sm px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#7B68EE] focus:ring-2 focus:ring-[#7B68EE]/10 transition-all bg-gray-50 focus:bg-white"
                        />
                        <motion.button
                          whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addSubtask}
                          disabled={!newSubtask.trim()}
                          className="px-4 py-2.5 bg-[#7B68EE] text-white text-sm font-medium rounded-xl hover:bg-[#6A58DD] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Comments Tab ── */}
                  {activeTab === "comments" && (
                    <motion.div
                      key="comments"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="space-y-5"
                    >
                      {comments.map((c) => {
                        const user = MOCK_USERS.find((u) => u.id === c.authorId);
                        return (
                          <motion.div key={c.id} variants={fadeInUp} className="flex gap-3">
                            <Avatar
                              initials={c.authorAvatar}
                              color={user?.color ?? "#7B68EE"}
                              size="md"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-1.5">
                                <span className="text-sm font-semibold text-gray-900">{c.authorName}</span>
                                <span className="text-xs text-gray-400">{formatDate(c.createdAt)} at {formatTime(c.createdAt)}</span>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-3.5 text-sm text-gray-700 leading-relaxed border border-gray-100">
                                {c.content}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Add Comment */}
                      <div className="flex gap-3 pt-2 border-t border-gray-100">
                        <Avatar initials="AR" color="#7B68EE" size="md" />
                        <div className="flex-1">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            rows={3}
                            className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#7B68EE] focus:ring-2 focus:ring-[#7B68EE]/10 transition-all bg-gray-50 focus:bg-white resize-none mb-2"
                          />
                          <div className="flex justify-end">
                            <motion.button
                              whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={addComment}
                              disabled={!newComment.trim()}
                              className="px-4 py-2 bg-[#7B68EE] text-white text-sm font-medium rounded-xl hover:bg-[#6A58DD] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              Post Comment
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Attachments Tab ── */}
                  {activeTab === "attachments" && (
                    <motion.div
                      key="attachments"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3 mb-5">
                        {INITIAL_ATTACHMENTS.map((att) => (
                          <motion.li
                            key={att.id}
                            variants={scaleIn}
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#7B68EE]/30 hover:bg-[#7B68EE]/5 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                              {getFileIcon(att.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{att.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {att.size} · Uploaded by {att.uploadedBy} · {formatDate(att.uploadedAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1.5 text-gray-400 hover:text-[#7B68EE] hover:bg-[#7B68EE]/10 rounded-lg transition-colors" aria-label="View">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" aria-label="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.li>
                        ))}
                      </motion.ul>

                      {/* Upload placeholder */}
                      <motion.div
                        whileHover={{ scale: shouldReduceMotion ? 1 : 1.01 }}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#7B68EE]/40 hover:bg-[#7B68EE]/5 transition-all cursor-pointer"
                      >
                        <Image className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-500">Drop files here or click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">Supports PDF, Figma, images, and documents up to 50 MB</p>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* ── Activity Tab ── */}
                  {activeTab === "activity" && (
                    <motion.div
                      key="activity"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />
                        <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                          {activity.map((item) => (
                            <motion.li key={item.id} variants={fadeInUp} className="flex items-start gap-4 pl-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${getActivityColor(item.type)}`}>
                                {getActivityIcon(item.type)}
                              </div>
                              <div className="flex-1 min-w-0 pb-1">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">{item.user}</span>{" "}
                                  <span className="text-gray-500">{item.description}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {formatDate(item.timestamp)} at {formatTime(item.timestamp)}
                                </p>
                              </div>
                            </motion.li>
                          ))}
                        </motion.ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right: Sidebar ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {/* Status */}
            <motion.div variants={slideInLeft} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Status</h3>
              <div className="relative">
                <button
                  onClick={() => { setStatusOpen((v) => !v); setPriorityOpen(false); setAssigneeOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200 hover:border-[#7B68EE]/40 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusCfg?.color }} />
                    <span className="text-sm font-medium text-gray-700">{statusCfg?.label}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {statusOpen && (
                    <motion.div
                      variants={scaleIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden"
                    >
                      {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((s) => {
                        const cfg = STATUS_CONFIG[s];
                        return (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors ${status === s ? "bg-gray-50" : ""}`}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                            <span className="font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
                            {status === s && <Check className="w-3.5 h-3.5 ml-auto text-[#7B68EE]" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Priority */}
            <motion.div variants={slideInLeft} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Priority</h3>
              <div className="relative">
                <button
                  onClick={() => { setPriorityOpen((v) => !v); setStatusOpen(false); setAssigneeOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200 hover:border-[#7B68EE]/40 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityCfg?.color }} />
                    <span className="text-sm font-medium text-gray-700">{priorityCfg?.label}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${priorityOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {priorityOpen && (
                    <motion.div
                      variants={scaleIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden"
                    >
                      {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => {
                        const cfg = PRIORITY_CONFIG[p];
                        return (
                          <button
                            key={p}
                            onClick={() => handlePriorityChange(p)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors ${priority === p ? "bg-gray-50" : ""}`}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                            <span className="font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
                            {priority === p && <Check className="w-3.5 h-3.5 ml-auto text-[#7B68EE]" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Assignee */}
            <motion.div variants={slideInLeft} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Assignee</h3>
              <div className="relative">
                <button
                  onClick={() => { setAssigneeOpen((v) => !v); setStatusOpen(false); setPriorityOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200 hover:border-[#7B68EE]/40 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Avatar initials={assignee?.avatar ?? "?"} color={assignee?.color ?? "#7B68EE"} size="sm" />
                    <span className="text-sm font-medium text-gray-700">{assignee?.name ?? "Unassigned"}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${assigneeOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {assigneeOpen && (
                    <motion.div
                      variants={scaleIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-