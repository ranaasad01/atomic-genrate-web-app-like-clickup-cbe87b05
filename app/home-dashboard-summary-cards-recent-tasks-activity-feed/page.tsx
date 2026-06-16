"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertCircle, TrendingUp, Users, FolderOpen, Activity, ArrowRight, MoreHorizontal, Circle, Star, MessageSquare, Bell, ChevronRight, Zap, Target, Calendar } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const summaryCards = [
  {
    id: "total-tasks",
    label: "Total Tasks",
    value: 142,
    change: "+12 this week",
    positive: true,
    icon: CheckCircle,
    color: "#7B68EE",
    bg: "from-[#7B68EE]/20 to-[#7B68EE]/5",
    border: "border-[#7B68EE]/30",
  },
  {
    id: "in-progress",
    label: "In Progress",
    value: 38,
    change: "+5 since yesterday",
    positive: true,
    icon: Clock,
    color: "#FFA500",
    bg: "from-[#FFA500]/20 to-[#FFA500]/5",
    border: "border-[#FFA500]/30",
  },
  {
    id: "overdue",
    label: "Overdue",
    value: 7,
    change: "-2 resolved today",
    positive: true,
    icon: AlertCircle,
    color: "#FF4D4D",
    bg: "from-[#FF4D4D]/20 to-[#FF4D4D]/5",
    border: "border-[#FF4D4D]/30",
  },
  {
    id: "completed",
    label: "Completed",
    value: 97,
    change: "68% completion rate",
    positive: true,
    icon: TrendingUp,
    color: "#00C896",
    bg: "from-[#00C896]/20 to-[#00C896]/5",
    border: "border-[#00C896]/30",
  },
  {
    id: "team-members",
    label: "Team Members",
    value: 14,
    change: "2 active now",
    positive: true,
    icon: Users,
    color: "#9B8FFF",
    bg: "from-[#9B8FFF]/20 to-[#9B8FFF]/5",
    border: "border-[#9B8FFF]/30",
  },
  {
    id: "projects",
    label: "Active Projects",
    value: 6,
    change: "3 due this month",
    positive: false,
    icon: FolderOpen,
    color: "#7B68EE",
    bg: "from-[#7B68EE]/20 to-[#7B68EE]/5",
    border: "border-[#7B68EE]/30",
  },
];

const weeklyData = [
  { day: "Mon", completed: 8, created: 12 },
  { day: "Tue", completed: 14, created: 10 },
  { day: "Wed", completed: 11, created: 15 },
  { day: "Thu", completed: 18, created: 9 },
  { day: "Fri", completed: 22, created: 14 },
  { day: "Sat", completed: 7, created: 5 },
  { day: "Sun", completed: 4, created: 3 },
];

const statusDistribution = [
  { name: "Done", value: 97, color: "#00C896" },
  { name: "In Progress", value: 38, color: "#7B68EE" },
  { name: "In Review", value: 12, color: "#FFA500" },
  { name: "To Do", value: 45, color: "#6B7280" },
];

const recentTasks = [
  {
    id: "t1",
    title: "Redesign onboarding flow for new users",
    status: "in_progress" as const,
    priority: "high" as const,
    project: "Product Redesign",
    projectColor: "#7B68EE",
    assignee: "Sarah K.",
    avatar: "SK",
    avatarColor: "#7B68EE",
    dueDate: "Dec 28",
    comments: 4,
  },
  {
    id: "t2",
    title: "Fix authentication bug on mobile Safari",
    status: "in_review" as const,
    priority: "urgent" as const,
    project: "Bug Fixes",
    projectColor: "#FF4D4D",
    assignee: "Marcus T.",
    avatar: "MT",
    avatarColor: "#FF4D4D",
    dueDate: "Dec 26",
    comments: 7,
  },
  {
    id: "t3",
    title: "Write API documentation for v2 endpoints",
    status: "todo" as const,
    priority: "normal" as const,
    project: "Developer Docs",
    projectColor: "#00C896",
    assignee: "Priya M.",
    avatar: "PM",
    avatarColor: "#00C896",
    dueDate: "Jan 3",
    comments: 1,
  },
  {
    id: "t4",
    title: "Set up CI/CD pipeline for staging environment",
    status: "in_progress" as const,
    priority: "high" as const,
    project: "DevOps",
    projectColor: "#FFA500",
    assignee: "James L.",
    avatar: "JL",
    avatarColor: "#FFA500",
    dueDate: "Dec 30",
    comments: 3,
  },
  {
    id: "t5",
    title: "Conduct user interviews for Q1 roadmap",
    status: "done" as const,
    priority: "normal" as const,
    project: "Research",
    projectColor: "#9B8FFF",
    assignee: "Aisha R.",
    avatar: "AR",
    avatarColor: "#9B8FFF",
    dueDate: "Dec 24",
    comments: 9,
  },
  {
    id: "t6",
    title: "Optimize database queries for reports page",
    status: "todo" as const,
    priority: "low" as const,
    project: "Performance",
    projectColor: "#7B68EE",
    assignee: "Chen W.",
    avatar: "CW",
    avatarColor: "#7B68EE",
    dueDate: "Jan 7",
    comments: 0,
  },
];

const activityFeed = [
  {
    id: "a1",
    type: "comment",
    user: "Sarah K.",
    avatar: "SK",
    avatarColor: "#7B68EE",
    action: "commented on",
    target: "Redesign onboarding flow",
    time: "2 min ago",
    icon: MessageSquare,
    iconColor: "#7B68EE",
  },
  {
    id: "a2",
    type: "status_change",
    user: "Marcus T.",
    avatar: "MT",
    avatarColor: "#FF4D4D",
    action: "moved to In Review",
    target: "Fix authentication bug",
    time: "18 min ago",
    icon: Activity,
    iconColor: "#FFA500",
  },
  {
    id: "a3",
    type: "assignment",
    user: "Priya M.",
    avatar: "PM",
    avatarColor: "#00C896",
    action: "was assigned to",
    target: "Write API documentation",
    time: "1 hr ago",
    icon: Star,
    iconColor: "#00C896",
  },
  {
    id: "a4",
    type: "mention",
    user: "James L.",
    avatar: "JL",
    avatarColor: "#FFA500",
    action: "mentioned you in",
    target: "CI/CD pipeline setup",
    time: "2 hr ago",
    icon: Bell,
    iconColor: "#FF4D4D",
  },
  {
    id: "a5",
    type: "completed",
    user: "Aisha R.",
    avatar: "AR",
    avatarColor: "#9B8FFF",
    action: "completed",
    target: "User interviews for Q1",
    time: "3 hr ago",
    icon: CheckCircle,
    iconColor: "#00C896",
  },
  {
    id: "a6",
    type: "comment",
    user: "Chen W.",
    avatar: "CW",
    avatarColor: "#7B68EE",
    action: "added a subtask to",
    target: "Optimize database queries",
    time: "5 hr ago",
    icon: Zap,
    iconColor: "#9B8FFF",
  },
];

const projects = [
  {
    id: "p1",
    name: "Product Redesign",
    color: "#7B68EE",
    progress: 72,
    tasks: 24,
    done: 17,
    members: ["SK", "MT", "PM"],
    memberColors: ["#7B68EE", "#FF4D4D", "#00C896"],
    dueDate: "Jan 15",
  },
  {
    id: "p2",
    name: "Mobile App v2",
    color: "#00C896",
    progress: 45,
    tasks: 31,
    done: 14,
    members: ["JL", "AR"],
    memberColors: ["#FFA500", "#9B8FFF"],
    dueDate: "Feb 1",
  },
  {
    id: "p3",
    name: "Developer Docs",
    color: "#FFA500",
    progress: 88,
    tasks: 12,
    done: 11,
    members: ["PM", "CW"],
    memberColors: ["#00C896", "#7B68EE"],
    dueDate: "Dec 31",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({
  card,
  index,
}: {
  card: (typeof summaryCards)[0];
  index: number;
}) {
  const Icon = card.icon;
  return (
    <motion.div
      variants={scaleIn}
      custom={index}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.bg} p-5 cursor-pointer group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${card.color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: card.color }} />
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-white/10"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </motion.button>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-white">
          {(card.value ?? 0).toLocaleString()}
        </p>
        <p className="text-sm text-gray-400">{card.label}</p>
        <p
          className="text-xs font-medium"
          style={{ color: card.positive ? "#00C896" : "#FFA500" }}
        >
          {card.change}
        </p>
      </div>
      <div
        className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10"
        style={{ backgroundColor: card.color }}
      />
    </motion.div>
  );
}

function TaskRow({ task }: { task: (typeof recentTasks)[0] }) {
  const statusCfg = STATUS_CONFIG[task.status];
  const priorityCfg = PRIORITY_CONFIG[task.priority];

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
      className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors cursor-pointer group"
    >
      <Circle className="w-4 h-4 flex-shrink-0" style={{ color: statusCfg.color }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate group-hover:text-[#7B68EE] transition-colors">
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: task.projectColor }}
          />
          <span className="text-xs text-gray-500 truncate">{task.project}</span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ color: priorityCfg.color, backgroundColor: priorityCfg.bg }}
        >
          {priorityCfg.label}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
        >
          {statusCfg.label}
        </span>
      </div>
      <div className="hidden md:flex items-center gap-1 text-gray-500 flex-shrink-0">
        <MessageSquare className="w-3.5 h-3.5" />
        <span className="text-xs">{task.comments}</span>
      </div>
      <div className="hidden lg:flex items-center gap-1 text-gray-500 flex-shrink-0">
        <Calendar className="w-3.5 h-3.5" />
        <span className="text-xs">{task.dueDate}</span>
      </div>
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: task.avatarColor }}
        title={task.assignee}
      >
        {task.avatar}
      </div>
    </motion.div>
  );
}

function ActivityItem({ item }: { item: (typeof activityFeed)[0] }) {
  const Icon = item.icon;
  return (
    <motion.div
      variants={fadeInUp}
      className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0"
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
        style={{ backgroundColor: item.avatarColor }}
      >
        {item.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-300 leading-snug">
          <span className="text-white font-medium">{item.user}</span>{" "}
          {item.action}{" "}
          <span className="text-[#7B68EE] font-medium">{item.target}</span>
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
      </div>
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${item.iconColor}20` }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: item.iconColor }} />
      </div>
    </motion.div>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -3 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-[#7B68EE]/40 transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <span className="text-sm font-semibold text-white group-hover:text-[#7B68EE] transition-colors">
            {project.name}
          </span>
        </div>
        <span className="text-xs text-gray-500">{project.dueDate}</span>
      </div>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">
            {project.done}/{project.tasks} tasks
          </span>
          <span className="text-xs font-bold" style={{ color: project.color }}>
            {project.progress}%
          </span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${project.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="h-full rounded-full"
            style={{ backgroundColor: project.color }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {(project.members ?? []).map((m, i) => (
            <div
              key={m}
              className="w-6 h-6 rounded-full border-2 border-[#1E1E2E] flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: project.memberColors?.[i] ?? "#7B68EE" }}
            >
              {m}
            </div>
          ))}
        </div>
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#7B68EE] transition-colors" />
      </div>
    </motion.div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-[#2A2A3E] border border-white/10 rounded-xl p-3 shadow-xl">
      <p className="text-xs text-gray-400 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-xs text-gray-300 capitalize">{p.name}:</span>
          <span className="text-xs font-bold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomeDashboardPage() {
  const [activeTab, setActiveTab] = useState<"all" | "mine" | "overdue">("all");

  const filteredTasks =
    activeTab === "overdue"
      ? recentTasks.filter((t) => t.status !== "done")
      : activeTab === "mine"
      ? recentTasks.slice(0, 4)
      : recentTasks;

  return (
    <main className="min-h-screen bg-[#13131F] text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page Header ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Good morning, Alex 👋
              </h1>
              <p className="text-gray-400 mt-1 text-sm">
                Here's what's happening across your workspace today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400"
              >
                <Target className="w-4 h-4 text-[#7B68EE]" />
                <span>Sprint 14 — Week 3</span>
              </motion.div>
              <Link href="/workspace">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-[#7B68EE] hover:bg-[#6A5AE0] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-[#7B68EE]/30"
                >
                  <Zap className="w-4 h-4" />
                  Open Workspace
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Summary Cards ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {summaryCards.map((card, i) => (
            <SummaryCard key={card.id} card={card} index={i} />
          ))}
        </motion.div>

        {/* ── Charts Row ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Area Chart */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Task Activity
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tasks created vs completed this week
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7B68EE]" />
                  Completed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00C896]" />
                  Created
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B68EE" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7B68EE" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C896" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00C896" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#6B7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6B7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#7B68EE"
                  strokeWidth={2}
                  fill="url(#colorCompleted)"
                />
                <Area
                  type="monotone"
                  dataKey="created"
                  stroke="#00C896"
                  strokeWidth={2}
                  fill="url(#colorCreated)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            variants={fadeInUp}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="mb-4">
              <h2 className="text-base font-semibold text-white">
                Status Breakdown
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">All tasks by status</p>
            </div>
            <div className="flex justify-center mb-4">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2A2A3E",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {statusDistribution.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-xs text-gray-400">{s.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Main Content Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Recent Tasks */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5">
              <h2 className="text-base font-semibold text-white">Recent Tasks</h2>
              <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                {(["all", "mine", "overdue"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
                      activeTab === tab
                        ? "bg-[#7B68EE] text-white shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="p-2"
            >
              {filteredTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </motion.div>
            <div className="px-5 py-3 border-t border-white/5">
              <Link href="/workspace">
                <motion.span
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-1.5 text-xs text-[#7B68EE] font-medium cursor-pointer w-fit"
                >
                  View all tasks
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.span>
              </Link>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5">
              <h2 className="text-base font-semibold text-white">Activity Feed</h2>
              <Link href="/inbox">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-xs text-[#7B68EE] font-medium cursor-pointer"
                >
                  View all
                </motion.span>
              </Link>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="px-5 py-2"
            >
              {activityFeed.map((item) => (
                <ActivityItem key={item.id} item={item} />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Projects Row ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Active Projects</h2>
            <Link href="/workspace">
              <motion.span
                whileHover={{ x: 4 }}
                className="flex items-center gap-1 text-xs text-[#7B68EE] font-medium cursor-pointer"
              >
                All projects <ArrowRight className="w-3.5 h-3.5" />
              </motion.span>
            </Link>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </motion.div>

        {/* ── Quick Stats Banner ── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="bg-gradient-to-r from-[#7B68EE]/20 via-[#9B8FFF]/10 to-[#7B68EE]/5 border border-[#7B68EE]/30 rounded-2xl p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#7B68EE]/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#7B68EE]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base">
                  Your team is on a roll! 🚀
                </h3>
                <p className="text-gray-400 text-sm mt-0.5">
                  68% completion rate this week — up 12% from last week.
                </p>
              </div>
            </div>
            <Link href="/workspace">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-[#7B68EE] hover:bg-[#6A5AE0] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#7B68EE]/30 whitespace-nowrap"
              >
                Keep the momentum
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>
    </main>
  );
}