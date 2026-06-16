"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
} from "@/lib/motion";
import { Folder, Plus, Search, MoreHorizontal, Users, CheckSquare, TrendingUp, Star, Clock, ChevronRight, Layout, Circle, Activity, Zap, Target, ArrowRight } from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const spaces = [
  {
    id: "s1",
    name: "Engineering",
    color: "#7B68EE",
    icon: "⚙️",
    memberCount: 8,
    projectCount: 4,
    projects: [
      {
        id: "p1",
        name: "API Redesign v3",
        description: "Refactor REST endpoints and introduce GraphQL layer",
        color: "#7B68EE",
        progress: 68,
        taskCount: 24,
        completedTasks: 16,
        dueDate: "Dec 15, 2024",
        priority: "urgent",
        members: ["AK", "JL", "MR"],
        tags: ["backend", "api"],
        status: "in_progress",
      },
      {
        id: "p2",
        name: "Mobile App Launch",
        description: "iOS & Android release for Q4 milestone",
        color: "#9B8FFF",
        progress: 42,
        taskCount: 38,
        completedTasks: 16,
        dueDate: "Jan 10, 2025",
        priority: "high",
        members: ["SR", "TN"],
        tags: ["mobile", "launch"],
        status: "in_progress",
      },
      {
        id: "p3",
        name: "CI/CD Pipeline",
        description: "Automate build, test, and deploy workflows",
        color: "#6C63FF",
        progress: 91,
        taskCount: 12,
        completedTasks: 11,
        dueDate: "Nov 30, 2024",
        priority: "normal",
        members: ["AK", "MR"],
        tags: ["devops"],
        status: "in_review",
      },
      {
        id: "p4",
        name: "Security Audit",
        description: "Penetration testing and vulnerability patching",
        color: "#FF6B6B",
        progress: 15,
        taskCount: 20,
        completedTasks: 3,
        dueDate: "Feb 1, 2025",
        priority: "urgent",
        members: ["JL"],
        tags: ["security"],
        status: "todo",
      },
    ],
  },
  {
    id: "s2",
    name: "Design",
    color: "#FF6B9D",
    icon: "🎨",
    memberCount: 5,
    projectCount: 3,
    projects: [
      {
        id: "p5",
        name: "Design System 2.0",
        description: "Unified component library and token architecture",
        color: "#FF6B9D",
        progress: 55,
        taskCount: 30,
        completedTasks: 17,
        dueDate: "Dec 20, 2024",
        priority: "high",
        members: ["EL", "PK", "SR"],
        tags: ["design", "system"],
        status: "in_progress",
      },
      {
        id: "p6",
        name: "Brand Refresh",
        description: "Updated visual identity, logo, and guidelines",
        color: "#FF8E53",
        progress: 80,
        taskCount: 18,
        completedTasks: 14,
        dueDate: "Nov 28, 2024",
        priority: "normal",
        members: ["EL", "PK"],
        tags: ["branding"],
        status: "in_review",
      },
      {
        id: "p7",
        name: "User Research Q4",
        description: "Interviews, surveys, and usability testing sessions",
        color: "#C084FC",
        progress: 30,
        taskCount: 15,
        completedTasks: 5,
        dueDate: "Jan 20, 2025",
        priority: "normal",
        members: ["SR"],
        tags: ["research", "ux"],
        status: "in_progress",
      },
    ],
  },
  {
    id: "s3",
    name: "Marketing",
    color: "#00C896",
    icon: "📣",
    memberCount: 6,
    projectCount: 3,
    projects: [
      {
        id: "p8",
        name: "Q4 Campaign",
        description: "Holiday season multi-channel marketing push",
        color: "#00C896",
        progress: 72,
        taskCount: 22,
        completedTasks: 16,
        dueDate: "Dec 1, 2024",
        priority: "urgent",
        members: ["BW", "CL", "DM"],
        tags: ["campaign", "social"],
        status: "in_progress",
      },
      {
        id: "p9",
        name: "SEO Overhaul",
        description: "Technical SEO, content strategy, and link building",
        color: "#34D399",
        progress: 48,
        taskCount: 28,
        completedTasks: 13,
        dueDate: "Jan 5, 2025",
        priority: "high",
        members: ["BW", "DM"],
        tags: ["seo", "content"],
        status: "in_progress",
      },
      {
        id: "p10",
        name: "Product Launch PR",
        description: "Press releases, media outreach, and influencer program",
        color: "#10B981",
        progress: 20,
        taskCount: 16,
        completedTasks: 3,
        dueDate: "Feb 14, 2025",
        priority: "high",
        members: ["CL"],
        tags: ["pr", "launch"],
        status: "todo",
      },
    ],
  },
  {
    id: "s4",
    name: "Product",
    color: "#FFA500",
    icon: "🚀",
    memberCount: 4,
    projectCount: 2,
    projects: [
      {
        id: "p11",
        name: "Roadmap Planning 2025",
        description: "Annual product strategy and OKR alignment",
        color: "#FFA500",
        progress: 60,
        taskCount: 14,
        completedTasks: 8,
        dueDate: "Dec 31, 2024",
        priority: "high",
        members: ["NP", "AK"],
        tags: ["strategy", "planning"],
        status: "in_progress",
      },
      {
        id: "p12",
        name: "Feature Prioritization",
        description: "Scoring and ranking backlog items for next sprint",
        color: "#F59E0B",
        progress: 85,
        taskCount: 10,
        completedTasks: 9,
        dueDate: "Nov 25, 2024",
        priority: "normal",
        members: ["NP"],
        tags: ["backlog"],
        status: "in_review",
      },
    ],
  },
];

const recentActivity = [
  { id: "a1", user: "AK", action: "completed task", target: "Set up GraphQL schema", project: "API Redesign v3", time: "2m ago", color: "#7B68EE" },
  { id: "a2", user: "EL", action: "added comment on", target: "Button component variants", project: "Design System 2.0", time: "15m ago", color: "#FF6B9D" },
  { id: "a3", user: "BW", action: "moved task to In Review", target: "Instagram ad creatives", project: "Q4 Campaign", time: "1h ago", color: "#00C896" },
  { id: "a4", user: "JL", action: "created task", target: "XSS vulnerability patch", project: "Security Audit", time: "2h ago", color: "#FF6B6B" },
  { id: "a5", user: "SR", action: "updated due date on", target: "Prototype testing session", project: "User Research Q4", time: "3h ago", color: "#C084FC" },
];

const stats = [
  { label: "Total Projects", value: 12, icon: Folder, color: "#7B68EE", bg: "#F0EEFF", change: "+2 this month" },
  { label: "Active Tasks", value: 147, icon: CheckSquare, color: "#00C896", bg: "#EDFFF9", change: "34 due soon" },
  { label: "Team Members", value: 23, icon: Users, color: "#FFA500", bg: "#FFF8EC", change: "4 spaces" },
  { label: "Completion Rate", value: "64%", icon: TrendingUp, color: "#FF6B9D", bg: "#FFF0F6", change: "+8% vs last month" },
];

const PRIORITY_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  urgent: { color: "#FF4D4D", bg: "#FFF0F0", label: "Urgent" },
  high: { color: "#FFA500", bg: "#FFF8EC", label: "High" },
  normal: { color: "#7B68EE", bg: "#F0EEFF", label: "Normal" },
  low: { color: "#00C896", bg: "#EDFFF9", label: "Low" },
};

const STATUS_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  todo: { color: "#6B7280", bg: "#F3F4F6", label: "To Do" },
  in_progress: { color: "#7B68EE", bg: "#F0EEFF", label: "In Progress" },
  in_review: { color: "#FFA500", bg: "#FFF8EC", label: "In Review" },
  done: { color: "#00C896", bg: "#EDFFF9", label: "Done" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function AvatarGroup({ initials, color }: { initials: string[]; color: string }) {
  return (
    <div className="flex -space-x-2">
      {(initials ?? []).slice(0, 3).map((init, i) => (
        <div
          key={i}
          className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white"
          style={{ backgroundColor: color, zIndex: 3 - i }}
        >
          {init ?? "?"}
        </div>
      ))}
      {(initials ?? []).length > 3 && (
        <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-600">
          +{(initials.length - 3)}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  const safeValue = Math.min(100, Math.max(0, value ?? 0));
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${safeValue}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function ProjectCard({ project, spaceColor }: { project: (typeof spaces)[0]["projects"][0]; spaceColor: string }) {
  const priority = PRIORITY_COLORS[project.priority] ?? PRIORITY_COLORS.normal;
  const status = STATUS_COLORS[project.status] ?? STATUS_COLORS.todo;

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: project.color }}
          />
          <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-[#7B68EE] transition-colors">
            {project.name}
          </h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-gray-100"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </motion.button>
      </div>

      <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">
        {project.description}
      </p>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs font-semibold text-gray-700">{project.progress ?? 0}%</span>
        </div>
        <ProgressBar value={project.progress} color={project.color} />
      </div>

      {/* Tags row */}
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ color: priority.color, backgroundColor: priority.bg }}
        >
          {priority.label}
        </span>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ color: status.color, backgroundColor: status.bg }}
        >
          {status.label}
        </span>
        {(project.tags ?? []).slice(0, 1).map((tag) => (
          <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <AvatarGroup initials={project.members ?? []} color={spaceColor} />
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <CheckSquare className="w-3 h-3" />
            {project.completedTasks ?? 0}/{project.taskCount ?? 0}
          </span>
          {project.dueDate && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {project.dueDate}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WorkspaceOverviewPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSpaceFilter, setActiveSpaceFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredSpaces = spaces
    .filter((space) =>
      activeSpaceFilter === "all" ? true : space.id === activeSpaceFilter
    )
    .map((space) => ({
      ...space,
      projects: space.projects.filter(
        (p) =>
          searchQuery.trim() === "" ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((space) => space.projects.length > 0);

  const totalProjects = spaces.reduce((acc, s) => acc + s.projects.length, 0);

  return (
    <div className="min-h-screen bg-[#F4F4F8]">
      {/* Page Header */}
      <div className="bg-[#1E1E2E] border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>FlowUp</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#7B68EE] font-medium">Workspace</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">
                My Workspace
              </h1>
              <p className="text-gray-400 text-sm">
                {totalProjects} projects across {spaces.length} spaces · {spaces.reduce((a, s) => a + s.memberCount, 0)} members
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm font-medium hover:bg-white/15 transition-colors"
              >
                <Folder className="w-4 h-4" />
                New Space
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7B68EE] text-white text-sm font-semibold hover:bg-[#6A58DD] transition-colors shadow-lg shadow-[#7B68EE]/30"
              >
                <Plus className="w-4 h-4" />
                New Project
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl border border-gray-100 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <span className="text-xs text-gray-400">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left: Spaces + Projects */}
          <div className="xl:col-span-3 space-y-6">
            {/* Toolbar */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
            >
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] transition-all"
                />
              </div>

              {/* Space Filter + View Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => setActiveSpaceFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeSpaceFilter === "all"
                        ? "bg-[#7B68EE] text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    All
                  </button>
                  {spaces.map((space) => (
                    <button
                      key={space.id}
                      onClick={() => setActiveSpaceFilter(space.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeSpaceFilter === space.id
                          ? "text-white"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      style={
                        activeSpaceFilter === space.id
                          ? { backgroundColor: space.color }
                          : {}
                      }
                    >
                      {space.icon}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-[#7B68EE] text-white" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Layout className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-[#7B68EE] text-white" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Spaces */}
            {filteredSpaces.length === 0 ? (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl border border-gray-100 p-12 text-center"
              >
                <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No projects found</p>
                <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
              </motion.div>
            ) : (
              filteredSpaces.map((space) => (
                <motion.div
                  key={space.id}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                >
                  {/* Space Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                        style={{ backgroundColor: `${space.color}20` }}
                      >
                        {space.icon}
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900 text-base">{space.name}</h2>
                        <p className="text-xs text-gray-400">
                          {space.projects.length} projects · {space.memberCount} members
                        </p>
                      </div>
                      <div
                        className="w-2 h-2 rounded-full ml-1"
                        style={{ backgroundColor: space.color }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-[#7B68EE] hover:text-[#7B68EE] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Project
                      </motion.button>
                      <Link
                        href="/workspace"
                        className="flex items-center gap-1 text-xs text-[#7B68EE] font-medium hover:underline"
                      >
                        View all <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Projects Grid / List */}
                  {viewMode === "grid" ? (
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4"
                    >
                      {space.projects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          spaceColor={space.color}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                    >
                      {space.projects.map((project, idx) => {
                        const priority = PRIORITY_COLORS[project.priority] ?? PRIORITY_COLORS.normal;
                        const status = STATUS_COLORS[project.status] ?? STATUS_COLORS.todo;
                        return (
                          <motion.div
                            key={project.id}
                            variants={fadeInUp}
                            className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
                              idx !== space.projects.length - 1 ? "border-b border-gray-100" : ""
                            }`}
                          >
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: project.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-900 group-hover:text-[#7B68EE] transition-colors truncate">
                                {project.name}
                              </p>
                              <p className="text-xs text-gray-400 truncate">{project.description}</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-3">
                              <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                style={{ color: priority.color, backgroundColor: priority.bg }}
                              >
                                {priority.label}
                              </span>
                              <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                style={{ color: status.color, backgroundColor: status.bg }}
                              >
                                {status.label}
                              </span>
                            </div>
                            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 w-28">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${project.progress ?? 0}%`,
                                    backgroundColor: project.color,
                                  }}
                                />
                              </div>
                              <span className="font-medium text-gray-600 w-8 text-right">{project.progress ?? 0}%</span>
                            </div>
                            <AvatarGroup initials={project.members ?? []} color={space.color} />
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#7B68EE] transition-colors" />
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-5">
            {/* Quick Stats */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#7B68EE]" />
                Space Overview
              </h3>
              <div className="space-y-3">
                {spaces.map((space) => {
                  const totalTasks = space.projects.reduce((a, p) => a + (p.taskCount ?? 0), 0);
                  const doneTasks = space.projects.reduce((a, p) => a + (p.completedTasks ?? 0), 0);
                  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
                  return (
                    <div key={space.id} className="group cursor-pointer">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{space.icon}</span>
                          <span className="text-xs font-semibold text-gray-700">{space.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{doneTasks}/{totalTasks}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: space.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Starred Projects */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-[#FFA500]" />
                Starred Projects
              </h3>
              <div className="space-y-2.5">
                {[spaces[0].projects[0], spaces[1].projects[0], spaces[2].projects[0]].map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${project.color}20` }}
                    >
                      <Circle className="w-3 h-3" style={{ color: project.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 group-hover:text-[#7B68EE] transition-colors truncate">
                        {project.name}
                      </p>
                      <p className="text-[10px] text-gray-400">{project.progress ?? 0}% complete</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#7B68EE] transition-colors" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#7B68EE]" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 2 }}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.user}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <span className="font-semibold text-gray-800">{item.user}</span>{" "}
                        {item.action}{" "}
                        <span className="font-medium text-[#7B68EE]">"{item.target}"</span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {item.project} · {item.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-2 text-xs font-medium text-[#7B68EE] hover:bg-[#F0EEFF] rounded-xl transition-colors"
              >
                View all activity →
              </motion.button>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] rounded-2xl p-5 text-white"
            >
              <h3 className="font-bold text-sm mb-1">Upgrade to Pro</h3>
              <p className="text-xs text-white/70 mb-4 leading-relaxed">
                Unlock unlimited projects, advanced analytics, and priority support.
              </p>
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.25)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 rounded-xl bg-white/20 border border-white/30 text-xs font-semibold transition-colors"
              >
                Explore Plans →
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}