"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, Check, ChevronRight, Clock, Edit, FileText, GitBranch, Plus, Settings, Star, Users, Activity, AlertCircle, Bell, Circle } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  type Priority,
  type TaskStatus,
} from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  initials: string;
  color: string;
  name: string;
  role: string;
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  color: string;
  progress: number;
  dueDate: string;
  createdAt: string;
  space: string;
  members: Member[];
  tags: string[];
}

interface TaskData {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  assignee: { initials: string; color: string };
  due: string;
  subtasks: { done: number; total: number };
  tags: string[];
}

interface ActivityItem {
  id: string;
  actor: { initials: string; color: string };
  action: string;
  target: string;
  detail: string;
  time: string;
}

interface Milestone {
  label: string;
  date: string;
  done: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const PROJECTS: Record<string, ProjectData> = {
  "1": {
    id: "1",
    name: "Q4 Product Launch",
    description:
      "End-to-end coordination for the Q4 feature release — covering design, engineering, QA, and marketing deliverables. Target ship date is December 31st.",
    color: "#7B68EE",
    progress: 65,
    dueDate: "Dec 31, 2024",
    createdAt: "Oct 1, 2024",
    space: "Product",
    members: [
      { initials: "SC", color: "#7B68EE", name: "Sarah Chen", role: "Lead" },
      { initials: "MR", color: "#FF4D4D", name: "Marcus Rivera", role: "Dev" },
      { initials: "PN", color: "#00C896", name: "Priya Nair", role: "Design" },
      { initials: "JK", color: "#FFA500", name: "James Kim", role: "QA" },
    ],
    tags: ["Launch", "Q4", "Cross-functional"],
  },
  "2": {
    id: "2",
    name: "API v3 Migration",
    description:
      "Migrate all internal and external API consumers from v2 to v3. Includes deprecation notices, backward-compat shims, and updated SDK documentation.",
    color: "#FF4D4D",
    progress: 42,
    dueDate: "Jan 15, 2025",
    createdAt: "Nov 5, 2024",
    space: "Engineering",
    members: [
      { initials: "MR", color: "#FF4D4D", name: "Marcus Rivera", role: "Lead" },
      { initials: "SC", color: "#7B68EE", name: "Sarah Chen", role: "Arch" },
    ],
    tags: ["Backend", "API", "Migration"],
  },
};

const TASKS: TaskData[] = [
  {
    id: "t1",
    title: "Finalize onboarding flow wireframes",
    status: "done",
    priority: "high",
    assignee: { initials: "PN", color: "#00C896" },
    due: "Dec 10",
    subtasks: { done: 4, total: 4 },
    tags: ["Design"],
  },
  {
    id: "t2",
    title: "Implement feature flag system for staged rollout",
    status: "in_progress",
    priority: "urgent",
    assignee: { initials: "MR", color: "#FF4D4D" },
    due: "Dec 20",
    subtasks: { done: 2, total: 5 },
    tags: ["Backend", "Infra"],
  },
  {
    id: "t3",
    title: "Write API changelog and migration guide",
    status: "in_progress",
    priority: "high",
    assignee: { initials: "SC", color: "#7B68EE" },
    due: "Dec 22",
    subtasks: { done: 1, total: 3 },
    tags: ["Docs"],
  },
  {
    id: "t4",
    title: "End-to-end regression test suite",
    status: "todo",
    priority: "high",
    assignee: { initials: "JK", color: "#FFA500" },
    due: "Dec 26",
    subtasks: { done: 0, total: 6 },
    tags: ["QA"],
  },
  {
    id: "t5",
    title: "Launch email campaign to existing users",
    status: "todo",
    priority: "normal",
    assignee: { initials: "PN", color: "#00C896" },
    due: "Dec 28",
    subtasks: { done: 0, total: 2 },
    tags: ["Marketing"],
  },
  {
    id: "t6",
    title: "Performance benchmarking — p95 latency targets",
    status: "in_review",
    priority: "high",
    assignee: { initials: "MR", color: "#FF4D4D" },
    due: "Dec 18",
    subtasks: { done: 3, total: 3 },
    tags: ["Backend"],
  },
];

const ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    actor: { initials: "SC", color: "#7B68EE" },
    action: "moved",
    target: "Finalize onboarding flow wireframes",
    detail: "to Done",
    time: "2 hours ago",
  },
  {
    id: "a2",
    actor: { initials: "MR", color: "#FF4D4D" },
    action: "commented on",
    target: "Feature flag system",
    detail: "Staging env is ready for testing.",
    time: "4 hours ago",
  },
  {
    id: "a3",
    actor: { initials: "JK", color: "#FFA500" },
    action: "created",
    target: "End-to-end regression test suite",
    detail: "with 6 subtasks",
    time: "Yesterday",
  },
  {
    id: "a4",
    actor: { initials: "PN", color: "#00C896" },
    action: "updated priority on",
    target: "Launch email campaign",
    detail: "from Low to Normal",
    time: "Yesterday",
  },
];

const MILESTONES: Milestone[] = [
  { label: "Design sign-off", date: "Dec 12", done: true },
  { label: "Feature freeze", date: "Dec 22", done: false },
  { label: "QA complete", date: "Dec 27", done: false },
  { label: "Production deploy", date: "Dec 31", done: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusCounts(tasks: TaskData[]) {
  return {
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    in_review: tasks.filter((t) => t.status === "in_review").length,
    done: tasks.filter((t) => t.status === "done").length,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId ?? "1");
  const project: ProjectData = PROJECTS[id] ?? PROJECTS["1"];
  const counts = getStatusCounts(TASKS);

  const statRows = [
    { key: "todo" as const, Icon: Circle, label: "To Do" },
    { key: "in_progress" as const, Icon: Activity, label: "In Progress" },
    { key: "in_review" as const, Icon: AlertCircle, label: "In Review" },
    { key: "done" as const, Icon: Check, label: "Done" },
  ];

  return (
    <main className="min-h-screen bg-[#F4F4F8]">
      {/* ── Breadcrumb nav ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
            <Link
              href="/workspace"
              className="flex items-center gap-1.5 hover:text-[#7B68EE] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Workspace</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            <span className="text-gray-400">{project.space}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            <span className="font-semibold text-[#1E1E2E] truncate">
              {project.name}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Subscribe</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] px-3 py-1.5 rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add task
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Project header card ────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div
            className="h-2 w-full"
            style={{ background: "linear-gradient(90deg, " + project.color + ", " + project.color + "88)" }}
          />
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <motion.div
                variants={scaleIn}
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
                style={{ backgroundColor: project.color + "22" }}
              >
                <GitBranch className="w-7 h-7" style={{ color: project.color }} />
              </motion.div>

              <div className="flex-1 min-w-0">
                <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E2E] leading-tight">
                    {project.name}
                  </h1>
                  <Star className="w-5 h-5 text-gray-300 hover:text-[#FFA500] cursor-pointer transition-colors" />
                </motion.div>

                <motion.p variants={fadeInUp} className="text-gray-500 text-sm leading-relaxed mb-4 max-w-2xl">
                  {project.description}
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: project.color + "18", color: project.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>

                <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Due <strong className="text-[#1E1E2E]">{project.dueDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Started <strong className="text-[#1E1E2E]">{project.createdAt}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div className="flex -space-x-1.5">
                      {project.members.map((m) => (
                        <div
                          key={m.initials}
                          title={m.name + " — " + m.role}
                          className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white cursor-pointer"
                          style={{ backgroundColor: m.color }}
                        >
                          {m.initials}
                        </div>
                      ))}
                    </div>
                    <span>{project.members.length} members</span>
                  </div>
                </motion.div>
              </div>

              <motion.button
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 border border-gray-200 hover:border-[#7B68EE]/40 hover:text-[#7B68EE] px-3 py-2 rounded-xl transition-all self-start"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </motion.button>
            </div>

            {/* Progress bar */}
            <motion.div variants={fadeInUp} className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Overall progress
                </span>
                <span className="text-sm font-bold" style={{ color: project.color }}>
                  {project.progress}%
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: project.progress + "%" }}
                  transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, " + project.color + ", " + project.color + "99)" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Status stat cards ──────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {statRows.map(({ key, Icon, label }) => {
            const cfg = STATUS_CONFIG[key];
            return (
              <motion.div
                key={key}
                variants={scaleIn}
                whileHover={{ y: -3 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:border-[#7B68EE]/20 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: cfg.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#1E1E2E]">{counts[key]}</p>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Tasks + Sidebar ────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Task list */}
          <div className="lg:col-span-2">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#7B68EE]" />
                  <h2 className="text-sm font-bold text-[#1E1E2E]">Tasks</h2>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {TASKS.length}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1 text-xs font-semibold text-[#7B68EE] hover:bg-[#F0EEFF] px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add task
                </motion.button>
              </div>

              <div className="divide-y divide-gray-50">
                {TASKS.map((task, i) => {
                  const statusCfg = STATUS_CONFIG[task.status];
                  const priorityCfg = PRIORITY_CONFIG[task.priority];
                  const isDone = task.status === "done";
                  return (
                    <motion.div
                      key={task.id}
                      variants={fadeInUp}
                      custom={i}
                      whileHover={{ backgroundColor: "#FAFAFA" }}
                      className="flex items-center gap-3 px-6 py-4 cursor-pointer group transition-colors"
                    >
                      <div
                        className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                        style={{
                          borderColor: statusCfg.color,
                          backgroundColor: isDone ? statusCfg.color : "transparent",
                        }}
                      >
                        {isDone && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={
                            "text-sm font-medium truncate transition-colors " +
                            (isDone
                              ? "line-through text-gray-400"
                              : "text-[#1E1E2E] group-hover:text-[#7B68EE]")
                          }
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {task.subtasks.total > 0 && (
                            <span className="text-[10px] text-gray-400">
                              {task.subtasks.done}/{task.subtasks.total} subtasks
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:inline-block"
                        style={{ color: priorityCfg.color, backgroundColor: priorityCfg.bg }}
                      >
                        {priorityCfg.label}
                      </span>

                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 hidden md:inline-block"
                        style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
                      >
                        {statusCfg.label}
                      </span>

                      <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 flex-shrink-0">
                        <Calendar className="w-3 h-3" />
                        {task.due}
                      </div>

                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: task.assignee.color }}
                      >
                        {task.assignee.initials}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Milestones */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-[#FFA500]" />
                <h3 className="text-sm font-bold text-[#1E1E2E]">Milestones</h3>
              </div>
              <div className="space-y-3">
                {MILESTONES.map((m) => (
                  <div key={m.label} className="flex items-center gap-3">
                    <div
                      className={
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 " +
                        (m.done ? "border-[#00C896] bg-[#00C896]" : "border-gray-200")
                      }
                    >
                      {m.done && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <p
                      className={
                        "flex-1 text-sm font-medium truncate " +
                        (m.done ? "line-through text-gray-400" : "text-[#1E1E2E]")
                      }
                    >
                      {m.label}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0">{m.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Team */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#7B68EE]" />
                  <h3 className="text-sm font-bold text-[#1E1E2E]">Team</h3>
                </div>
                <button className="text-xs text-[#7B68EE] font-semibold hover:underline">
                  Manage
                </button>
              </div>
              <div className="space-y-3">
                {project.members.map((m) => (
                  <div key={m.initials} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: m.color }}
                    >
                      {m.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1E1E2E] truncate">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.role}</p>
                    </div>
                    <Settings className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 cursor-pointer transition-colors" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Activity */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-[#7B68EE]" />
                <h3 className="text-sm font-bold text-[#1E1E2E]">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {ACTIVITY.map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: a.actor.color }}
                    >
                      {a.actor.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <span className="font-semibold text-[#1E1E2E]">{a.actor.initials}</span>{" "}
                        {a.action}{" "}
                        <span className="font-medium text-[#1E1E2E]">{a.target}</span>{" "}
                        <span className="text-gray-400">{a.detail}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
