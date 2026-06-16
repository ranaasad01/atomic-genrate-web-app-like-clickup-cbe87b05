"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
} from "@/lib/motion";
import { ChevronDown, ChevronRight, Plus, Search, Filter, MoreHorizontal, Calendar, Clock, User, Tag, CheckCircle, Circle, AlertCircle, ArrowUp, ArrowDown, Layout, List, Star, Paperclip, MessageSquare, Eye, Edit, Trash2, X, Check } from 'lucide-react';
import type { Priority, TaskStatus } from "@/lib/data";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROJECT = {
  id: "proj-001",
  name: "FlowUp 2.0 Launch",
  description:
    "Complete redesign and feature rollout for the next major version of FlowUp, including new Kanban views, AI suggestions, and team collaboration tools.",
  color: "#7B68EE",
  progress: 62,
  dueDate: "2024-08-15",
  members: [
    { id: "u1", name: "Alex Rivera", avatar: "AR", color: "#7B68EE" },
    { id: "u2", name: "Sam Chen", avatar: "SC", color: "#00C896" },
    { id: "u3", name: "Jordan Kim", avatar: "JK", color: "#FFA500" },
    { id: "u4", name: "Morgan Lee", avatar: "ML", color: "#FF4D4D" },
  ],
};

interface MockTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: { id: string; name: string; avatar: string; color: string };
  dueDate: string;
  tags: string[];
  subtasksDone: number;
  subtasksTotal: number;
  comments: number;
  attachments: number;
}

const TASKS: MockTask[] = [
  {
    id: "t1",
    title: "Design new onboarding flow",
    description: "Create wireframes and high-fidelity mockups for the revamped onboarding experience.",
    status: "in_progress",
    priority: "urgent",
    assignee: { id: "u1", name: "Alex Rivera", avatar: "AR", color: "#7B68EE" },
    dueDate: "2024-07-10",
    tags: ["Design", "UX"],
    subtasksDone: 3,
    subtasksTotal: 5,
    comments: 8,
    attachments: 2,
  },
  {
    id: "t2",
    title: "Implement Kanban drag-and-drop",
    description: "Build the drag-and-drop functionality for the board view using dnd-kit.",
    status: "in_progress",
    priority: "high",
    assignee: { id: "u2", name: "Sam Chen", avatar: "SC", color: "#00C896" },
    dueDate: "2024-07-15",
    tags: ["Frontend", "Feature"],
    subtasksDone: 2,
    subtasksTotal: 4,
    comments: 5,
    attachments: 1,
  },
  {
    id: "t3",
    title: "Set up CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing and deployment.",
    status: "done",
    priority: "high",
    assignee: { id: "u3", name: "Jordan Kim", avatar: "JK", color: "#FFA500" },
    dueDate: "2024-07-01",
    tags: ["DevOps", "Backend"],
    subtasksDone: 4,
    subtasksTotal: 4,
    comments: 3,
    attachments: 0,
  },
  {
    id: "t4",
    title: "Write API documentation",
    description: "Document all REST endpoints using OpenAPI spec and Swagger UI.",
    status: "todo",
    priority: "normal",
    assignee: { id: "u4", name: "Morgan Lee", avatar: "ML", color: "#FF4D4D" },
    dueDate: "2024-07-20",
    tags: ["Docs", "Backend"],
    subtasksDone: 0,
    subtasksTotal: 3,
    comments: 1,
    attachments: 0,
  },
  {
    id: "t5",
    title: "User testing sessions",
    description: "Conduct 5 moderated user testing sessions for the new dashboard.",
    status: "in_review",
    priority: "high",
    assignee: { id: "u1", name: "Alex Rivera", avatar: "AR", color: "#7B68EE" },
    dueDate: "2024-07-18",
    tags: ["Research", "UX"],
    subtasksDone: 2,
    subtasksTotal: 5,
    comments: 12,
    attachments: 4,
  },
  {
    id: "t6",
    title: "Performance audit & optimization",
    description: "Run Lighthouse audits and fix Core Web Vitals issues across all pages.",
    status: "todo",
    priority: "normal",
    assignee: { id: "u2", name: "Sam Chen", avatar: "SC", color: "#00C896" },
    dueDate: "2024-07-25",
    tags: ["Performance", "Frontend"],
    subtasksDone: 0,
    subtasksTotal: 6,
    comments: 2,
    attachments: 1,
  },
  {
    id: "t7",
    title: "Accessibility compliance review",
    description: "Ensure WCAG 2.1 AA compliance across all UI components.",
    status: "todo",
    priority: "low",
    assignee: { id: "u4", name: "Morgan Lee", avatar: "ML", color: "#FF4D4D" },
    dueDate: "2024-08-01",
    tags: ["Accessibility", "Design"],
    subtasksDone: 0,
    subtasksTotal: 4,
    comments: 0,
    attachments: 0,
  },
  {
    id: "t8",
    title: "Launch blog post & press kit",
    description: "Write the launch announcement blog post and prepare press materials.",
    status: "in_progress",
    priority: "normal",
    assignee: { id: "u3", name: "Jordan Kim", avatar: "JK", color: "#FFA500" },
    dueDate: "2024-08-10",
    tags: ["Marketing", "Content"],
    subtasksDone: 1,
    subtasksTotal: 3,
    comments: 4,
    attachments: 2,
  },
];

// Calendar mock events
const CALENDAR_EVENTS: { taskId: string; title: string; date: number; color: string; priority: Priority }[] = [
  { taskId: "t1", title: "Design new onboarding flow", date: 10, color: "#7B68EE", priority: "urgent" },
  { taskId: "t2", title: "Implement Kanban drag-and-drop", date: 15, color: "#00C896", priority: "high" },
  { taskId: "t3", title: "Set up CI/CD pipeline", date: 1, color: "#FFA500", priority: "high" },
  { taskId: "t4", title: "Write API documentation", date: 20, color: "#FF4D4D", priority: "normal" },
  { taskId: "t5", title: "User testing sessions", date: 18, color: "#7B68EE", priority: "high" },
  { taskId: "t6", title: "Performance audit", date: 25, color: "#00C896", priority: "normal" },
  { taskId: "t7", title: "Accessibility review", date: 1, color: "#FF4D4D", priority: "low" },
  { taskId: "t8", title: "Launch blog post", date: 10, color: "#FFA500", priority: "normal" },
];

const CALENDAR_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// July 2024 starts on Monday (index 1)
const JULY_START_DAY = 1;
const JULY_DAYS = 31;

// ─── Sub-components ───────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {priority === "urgent" && <AlertCircle className="w-3 h-3" />}
      {priority === "high" && <ArrowUp className="w-3 h-3" />}
      {priority === "normal" && <ArrowDown className="w-3 h-3" />}
      {priority === "low" && <ArrowDown className="w-3 h-3 opacity-50" />}
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {status === "done" ? (
        <CheckCircle className="w-3 h-3" />
      ) : (
        <Circle className="w-3 h-3" />
      )}
      {cfg.label}
    </span>
  );
}

function AvatarBubble({
  name,
  avatar,
  color,
  size = "sm",
}: {
  name: string;
  avatar: string;
  color: string;
  size?: "sm" | "md";
}) {
  const sz = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm";
  return (
    <div
      title={name}
      className={`${sz} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-[#1E1E2E]`}
      style={{ backgroundColor: color }}
    >
      {avatar}
    </div>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────

function ListView({ tasks }: { tasks: MockTask[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const grouped: Record<TaskStatus, MockTask[]> = {
    todo: [],
    in_progress: [],
    in_review: [],
    done: [],
  };
  tasks.forEach((t) => grouped[t.status].push(t));

  const statusOrder: TaskStatus[] = ["in_progress", "in_review", "todo", "done"];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {statusOrder.map((status) => {
        const group = grouped[status] ?? [];
        const cfg = STATUS_CONFIG[status];
        return (
          <motion.div key={status} variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cfg.color }}
              />
              <span className="text-sm font-semibold text-white">{cfg.label}</span>
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                {group.length}
              </span>
            </div>
            <div className="rounded-xl border border-white/10 overflow-hidden bg-[#252535]">
              {group.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 italic">No tasks</div>
              ) : (
                group.map((task, idx) => (
                  <motion.div
                    key={task.id}
                    variants={fadeInUp}
                    className={`group ${idx !== group.length - 1 ? "border-b border-white/5" : ""}`}
                  >
                    <div
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors"
                      onClick={() =>
                        setExpandedId(expandedId === task.id ? null : task.id)
                      }
                    >
                      {/* Status icon */}
                      <button
                        className="flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {task.status === "done" ? (
                          <CheckCircle className="w-4 h-4 text-[#00C896]" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-500 hover:text-[#7B68EE] transition-colors" />
                        )}
                      </button>

                      {/* Title */}
                      <span
                        className={`flex-1 text-sm font-medium ${
                          task.status === "done"
                            ? "line-through text-gray-500"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </span>

                      {/* Meta */}
                      <div className="hidden md:flex items-center gap-3">
                        <PriorityBadge priority={task.priority} />
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {task.dueDate}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MessageSquare className="w-3 h-3" />
                          {task.comments}
                        </div>
                        <AvatarBubble
                          name={task.assignee.name}
                          avatar={task.assignee.avatar}
                          color={task.assignee.color}
                        />
                      </div>

                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          expandedId === task.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    <AnimatePresence>
                      {expandedId === task.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-11 pb-4 pt-1 border-t border-white/5 bg-white/[0.02]">
                            <p className="text-sm text-gray-400 mb-3">
                              {task.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {(task.tags ?? []).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 rounded-full bg-[#7B68EE]/10 text-[#7B68EE] border border-[#7B68EE]/20"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Check className="w-3 h-3 text-[#00C896]" />
                                {task.subtasksDone}/{task.subtasksTotal} subtasks
                              </span>
                              <span className="flex items-center gap-1">
                                <Paperclip className="w-3 h-3" />
                                {task.attachments} files
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {task.assignee.name}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── Board View ───────────────────────────────────────────────────────────────

function BoardView({ tasks }: { tasks: MockTask[] }) {
  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: "todo", label: "To Do", color: "#6B7280" },
    { status: "in_progress", label: "In Progress", color: "#7B68EE" },
    { status: "in_review", label: "In Review", color: "#FFA500" },
    { status: "done", label: "Done", color: "#00C896" },
  ];

  const grouped: Record<TaskStatus, MockTask[]> = {
    todo: [],
    in_progress: [],
    in_review: [],
    done: [],
  };
  tasks.forEach((t) => grouped[t.status].push(t));

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]"
    >
      {columns.map((col) => {
        const colTasks = grouped[col.status] ?? [];
        return (
          <motion.div
            key={col.status}
            variants={fadeInUp}
            className="flex-shrink-0 w-72"
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <span className="text-sm font-semibold text-white">
                  {col.label}
                </span>
                <span className="text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {colTasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={scaleIn}
                  whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
                  className="bg-[#252535] border border-white/10 rounded-xl p-4 cursor-pointer hover:border-[#7B68EE]/40 transition-colors"
                >
                  {/* Tags */}
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {task.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 rounded bg-[#7B68EE]/10 text-[#7B68EE]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <p className="text-sm font-medium text-white mb-3 leading-snug">
                    {task.title}
                  </p>

                  {/* Priority */}
                  <div className="mb-3">
                    <PriorityBadge priority={task.priority} />
                  </div>

                  {/* Subtask progress */}
                  {task.subtasksTotal > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Subtasks</span>
                        <span>
                          {task.subtasksDone}/{task.subtasksTotal}
                        </span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              task.subtasksTotal > 0
                                ? (task.subtasksDone / task.subtasksTotal) * 100
                                : 0
                            }%`,
                          }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: col.color }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {task.dueDate.slice(5)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {task.comments}
                      </span>
                    </div>
                    <AvatarBubble
                      name={task.assignee.name}
                      avatar={task.assignee.avatar}
                      color={task.assignee.color}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Add task button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 rounded-xl border border-dashed border-white/10 text-sm text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add task
              </motion.button>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── Calendar View ────────────────────────────────────────────────────────────

function CalendarView() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Build grid: July 2024 starts on Monday (day index 1 in Sun-Mon-...-Sat)
  const totalCells = JULY_START_DAY + JULY_DAYS;
  const weeks = Math.ceil(totalCells / 7);

  const getEventsForDay = (day: number) =>
    CALENDAR_EVENTS.filter((e) => e.date === day);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Month header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">July 2024</h3>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            Today
          </motion.button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {CALENDAR_DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-gray-500 py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: weeks * 7 }).map((_, cellIdx) => {
          const dayNum = cellIdx - JULY_START_DAY + 1;
          const isValid = dayNum >= 1 && dayNum <= JULY_DAYS;
          const events = isValid ? getEventsForDay(dayNum) : [];
          const isSelected = selectedDay === dayNum;
          const isToday = dayNum === 15; // mock "today"

          return (
            <motion.div
              key={cellIdx}
              whileHover={isValid ? { scale: 1.02 } : {}}
              onClick={() => isValid && setSelectedDay(isSelected ? null : dayNum)}
              className={`min-h-[80px] rounded-xl p-2 border transition-all cursor-pointer ${
                !isValid
                  ? "opacity-0 pointer-events-none"
                  : isSelected
                  ? "border-[#7B68EE] bg-[#7B68EE]/10"
                  : isToday
                  ? "border-[#7B68EE]/40 bg-[#7B68EE]/5"
                  : "border-white/5 bg-[#252535] hover:border-white/15 hover:bg-white/5"
              }`}
            >
              <div
                className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday
                    ? "bg-[#7B68EE] text-white"
                    : "text-gray-400"
                }`}
              >
                {isValid ? dayNum : ""}
              </div>
              <div className="space-y-0.5">
                {events.slice(0, 2).map((ev) => (
                  <div
                    key={ev.taskId}
                    className="text-xs px-1.5 py-0.5 rounded truncate font-medium"
                    style={{
                      backgroundColor: `${ev.color}20`,
                      color: ev.color,
                    }}
                  >
                    {ev.title}
                  </div>
                ))}
                {events.length > 2 && (
                  <div className="text-xs text-gray-500 px-1">
                    +{events.length - 2} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected day detail */}
      <AnimatePresence>
        {selectedDay !== null && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="mt-4 p-4 rounded-xl bg-[#252535] border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">
                July {selectedDay}, 2024
              </h4>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {getEventsForDay(selectedDay).length === 0 ? (
              <p className="text-sm text-gray-500">No tasks due on this day.</p>
            ) : (
              <div className="space-y-2">
                {getEventsForDay(selectedDay).map((ev) => {
                  const task = TASKS.find((t) => t.id === ev.taskId);
                  return (
                    <div
                      key={ev.taskId}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: ev.color }}
                      />
                      <span className="text-sm text-white flex-1">{ev.title}</span>
                      {task && <PriorityBadge priority={task.priority} />}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type ViewTab = "list" | "board" | "calendar";

export default function ProjectDetailPage() {
  const [activeView, setActiveView] = useState<ViewTab>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");

  const filteredTasks = TASKS.filter((task) => {
    const matchesSearch =
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const views: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: "list", label: "List", icon: <List className="w-4 h-4" /> },
    { id: "board", label: "Board", icon: <Layout className="w-4 h-4" /> },
    {
      id: "calendar",
      label: "Calendar",
      icon: <Calendar className="w-4 h-4" />,
    },
  ];

  const doneTasks = TASKS.filter((t) => t.status === "done").length;
  const progressPct = TASKS.length > 0 ? Math.round((doneTasks / TASKS.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#1E1E2E] text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <motion.nav
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 text-sm text-gray-500 mb-6"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/workspace" className="hover:text-white transition-colors">
            Workspace
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium">{PROJECT.name}</span>
        </motion.nav>

        {/* Project Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-[#252535] rounded-2xl border border-white/10 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Project icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: `${PROJECT.color}20`, border: `1px solid ${PROJECT.color}40` }}
              >
                🚀
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {PROJECT.name}
                </h1>
                <p className="text-sm text-gray-400 max-w-xl">
                  {PROJECT.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Star className="w-4 h-4" />
                Star
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Watch
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7B68EE] text-white text-sm font-medium hover:bg-[#6a58d6] transition-colors shadow-lg shadow-[#7B68EE]/25"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </motion.button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            {/* Progress */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF]"
                  />
                </div>
                <span className="text-sm font-semibold text-white">
                  {progressPct}%
                </span>
              </div>
            </div>

            {/* Tasks */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Tasks</p>
              <p className="text-sm font-semibold text-white">
                {doneTasks}/{TASKS.length} done
              </p>
            </div>

            {/* Due date */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Due Date</p>
              <p className="text-sm font-semibold text-white flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#7B68EE]" />
                {PROJECT.dueDate}
              </p>
            </div>

            {/* Members */}
            <div>
              <p className="text-xs text-gray-500 mb-1">Members</p>
              <div className="flex items-center gap-1">
                {PROJECT.members.map((m) => (
                  <AvatarBubble
                    key={m.id}
                    name={m.name}
                    avatar={m.avatar}
                    color={m.color}
                    size="sm"
                  />
                ))}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5"
        >
          {/* View tabs */}
          <div className="flex items-center gap-1 bg-[#252535] border border-white/10 rounded-xl p-1">
            {views.map((v) => (
              <motion.button
                key={v.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveView(v.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === v.id
                    ? "bg-[#7B68EE] text-white shadow-md shadow-[#7B68EE]/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {v.icon}
                {v.label}
              </motion.button>
            ))}
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search tasks…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[#252535] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#7B68EE]/50 focus:ring-1 focus:ring-[#7B68EE]/30 transition-all w-48"
              />
            </div>

            <select
              value={filterPriority}
              onChange={(e) =>
                setFilterPriority(e.target.value as Priority | "all")
              }
              className="px-3 py-2 bg-[#252535] border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-[#7B68EE]/50 transition-all cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
        </motion.div>

        {/* View Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {activeView === "list" && <ListView tasks={filteredTasks} />}
            {activeView === "board" && <BoardView tasks={filteredTasks} />}
            {activeView === "calendar" && <CalendarView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}