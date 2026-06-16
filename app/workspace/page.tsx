"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Users, LayoutGrid, List, Search, ChevronRight, Star, MoreHorizontal, CheckCircle, Clock, AlertCircle, Folder, Sparkles, TrendingUp, Activity } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { BRAND_COLORS } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const WORKSPACE = {
  id: "ws-1",
  name: "Acme Corp",
  description: "Product & Engineering workspace",
  memberCount: 14,
  totalProjects: 9,
  completedTasks: 87,
  totalTasks: 134,
};

const MEMBERS = [
  { id: "u1", name: "Alice Chen", avatar: "AC", color: "#7B68EE" },
  { id: "u2", name: "Bob Martinez", avatar: "BM", color: "#00C896" },
  { id: "u3", name: "Carol Kim", avatar: "CK", color: "#FFA500" },
  { id: "u4", name: "David Lee", avatar: "DL", color: "#FF4D4D" },
  { id: "u5", name: "Eva Patel", avatar: "EP", color: "#7B68EE" },
];

interface ProjectCard {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  spaceId: string;
  spaceName: string;
  completedTasks: number;
  totalTasks: number;
  memberIds: string[];
  dueDate: string;
  starred: boolean;
  status: "on_track" | "at_risk" | "off_track";
}

interface SpaceData {
  id: string;
  name: string;
  color: string;
  description: string;
  projects: ProjectCard[];
}

const SPACES: SpaceData[] = [
  {
    id: "sp-1",
    name: "Product Design",
    color: "#7B68EE",
    description: "UI/UX design, prototyping, and design systems",
    projects: [
      {
        id: "p-1",
        name: "Design System v2",
        description: "Rebuild component library with new brand tokens and accessibility improvements.",
        color: "#7B68EE",
        icon: "🎨",
        spaceId: "sp-1",
        spaceName: "Product Design",
        completedTasks: 24,
        totalTasks: 30,
        memberIds: ["u1", "u3", "u5"],
        dueDate: "Dec 15, 2024",
        starred: true,
        status: "on_track",
      },
      {
        id: "p-2",
        name: "Mobile App Redesign",
        description: "Revamp the iOS and Android apps with a modern, intuitive interface.",
        color: "#9B8FFF",
        icon: "📱",
        spaceId: "sp-1",
        spaceName: "Product Design",
        completedTasks: 11,
        totalTasks: 28,
        memberIds: ["u1", "u2"],
        dueDate: "Jan 20, 2025",
        starred: false,
        status: "at_risk",
      },
    ],
  },
  {
    id: "sp-2",
    name: "Engineering",
    color: "#00C896",
    description: "Backend services, APIs, and infrastructure",
    projects: [
      {
        id: "p-3",
        name: "API Gateway Migration",
        description: "Migrate legacy REST endpoints to GraphQL with improved rate limiting.",
        color: "#00C896",
        icon: "⚙️",
        spaceId: "sp-2",
        spaceName: "Engineering",
        completedTasks: 18,
        totalTasks: 22,
        memberIds: ["u2", "u4"],
        dueDate: "Nov 30, 2024",
        starred: true,
        status: "on_track",
      },
      {
        id: "p-4",
        name: "Auth & Permissions",
        description: "Implement role-based access control and OAuth 2.0 integration.",
        color: "#34D399",
        icon: "🔐",
        spaceId: "sp-2",
        spaceName: "Engineering",
        completedTasks: 5,
        totalTasks: 19,
        memberIds: ["u2", "u3", "u4"],
        dueDate: "Feb 10, 2025",
        starred: false,
        status: "off_track",
      },
      {
        id: "p-5",
        name: "Performance Optimization",
        description: "Reduce p95 latency by 40% through caching and query optimization.",
        color: "#10B981",
        icon: "⚡",
        spaceId: "sp-2",
        spaceName: "Engineering",
        completedTasks: 9,
        totalTasks: 14,
        memberIds: ["u4", "u5"],
        dueDate: "Dec 5, 2024",
        starred: false,
        status: "on_track",
      },
    ],
  },
  {
    id: "sp-3",
    name: "Marketing",
    color: "#FFA500",
    description: "Campaigns, content, and growth initiatives",
    projects: [
      {
        id: "p-6",
        name: "Q4 Launch Campaign",
        description: "Multi-channel campaign for the v3.0 product launch across social and email.",
        color: "#FFA500",
        icon: "🚀",
        spaceId: "sp-3",
        spaceName: "Marketing",
        completedTasks: 14,
        totalTasks: 18,
        memberIds: ["u1", "u3"],
        dueDate: "Dec 1, 2024",
        starred: true,
        status: "on_track",
      },
      {
        id: "p-7",
        name: "SEO Content Refresh",
        description: "Update 50+ blog posts and landing pages to improve organic search rankings.",
        color: "#F59E0B",
        icon: "✍️",
        spaceId: "sp-3",
        spaceName: "Marketing",
        completedTasks: 6,
        totalTasks: 25,
        memberIds: ["u3", "u5"],
        dueDate: "Jan 31, 2025",
        starred: false,
        status: "at_risk",
      },
    ],
  },
  {
    id: "sp-4",
    name: "Operations",
    color: "#FF4D4D",
    description: "Process improvements, tooling, and team ops",
    projects: [
      {
        id: "p-8",
        name: "Onboarding Revamp",
        description: "Streamline new hire onboarding with automated workflows and documentation.",
        color: "#FF4D4D",
        icon: "🤝",
        spaceId: "sp-4",
        spaceName: "Operations",
        completedTasks: 0,
        totalTasks: 12,
        memberIds: ["u1", "u2", "u4", "u5"],
        dueDate: "Mar 1, 2025",
        starred: false,
        status: "off_track",
      },
      {
        id: "p-9",
        name: "Vendor Management",
        description: "Consolidate SaaS subscriptions and negotiate enterprise contracts.",
        color: "#F87171",
        icon: "📋",
        spaceId: "sp-4",
        spaceName: "Operations",
        completedTasks: 0,
        totalTasks: 8,
        memberIds: ["u2"],
        dueDate: "Feb 28, 2025",
        starred: false,
        status: "on_track",
      },
    ],
  },
];

// ─── Helper Components ────────────────────────────────────────────────────────

function AvatarGroup({ memberIds, max = 3 }: { memberIds: string[]; max?: number }) {
  const visible = memberIds.slice(0, max);
  const overflow = memberIds.length - max;
  return (
    <div className="flex items-center -space-x-2">
      {visible.map((id) => {
        const member = MEMBERS.find((m) => m.id === id);
        if (!member) return null;
        return (
          <div
            key={id}
            title={member.name}
            className="w-6 h-6 rounded-full border-2 border-[#1E1E2E] flex items-center justify-center text-[9px] font-bold text-white"
            style={{ backgroundColor: member.color }}
          >
            {member.avatar}
          </div>
        );
      })}
      {overflow > 0 && (
        <div className="w-6 h-6 rounded-full border-2 border-[#1E1E2E] bg-white/10 flex items-center justify-center text-[9px] font-medium text-gray-400">
          +{overflow}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectCard["status"] }) {
  const config = {
    on_track: { label: "On Track", color: "#00C896", bg: "rgba(0,200,150,0.12)", icon: CheckCircle },
    at_risk: { label: "At Risk", color: "#FFA500", bg: "rgba(255,165,0,0.12)", icon: AlertCircle },
    off_track: { label: "Off Track", color: "#FF4D4D", bg: "rgba(255,77,77,0.12)", icon: Clock },
  };
  const cfg = config[status];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <Icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  );
}

function ProgressBar({ completed, total, color }: { completed: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{completed}/{total} tasks</span>
        <span className="font-medium" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

function ProjectCardItem({ project, index }: { project: ProjectCard; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  const [starred, setStarred] = useState(project.starred);

  return (
    <motion.div
      variants={scaleIn}
      whileHover={shouldReduceMotion ? {} : { y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}
      className="group relative bg-[#252535] border border-white/8 rounded-2xl p-5 cursor-pointer flex flex-col gap-4 transition-colors hover:border-white/15"
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md flex-shrink-0"
            style={{ backgroundColor: `${project.color}22`, border: `1px solid ${project.color}44` }}
          >
            {project.icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-sm leading-tight truncate max-w-[140px]">
              {project.name}
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">{project.spaceName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setStarred((s) => !s)}
            className="p-1 rounded-lg hover:bg-white/8 transition-colors"
            aria-label={starred ? "Unstar project" : "Star project"}
          >
            <Star
              className="w-3.5 h-3.5 transition-colors"
              style={{ color: starred ? "#FFA500" : "#6B7280", fill: starred ? "#FFA500" : "none" }}
            />
          </motion.button>
          <button className="p-1 rounded-lg hover:bg-white/8 transition-colors opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 flex-1">
        {project.description}
      </p>

      {/* Progress */}
      <ProgressBar
        completed={project.completedTasks}
        total={project.totalTasks}
        color={project.color}
      />

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/6">
        <AvatarGroup memberIds={project.memberIds} />
        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Due date */}
      <div className="flex items-center gap-1 text-[10px] text-gray-600">
        <Clock className="w-3 h-3" />
        <span>Due {project.dueDate}</span>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const shouldReduceMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSpace, setActiveSpace] = useState<string>("all");

  const allProjects = SPACES.flatMap((s) => s.projects);
  const filteredSpaces = SPACES.map((space) => ({
    ...space,
    projects: space.projects.filter(
      (p) =>
        (activeSpace === "all" || space.id === activeSpace) &&
        (searchQuery === "" ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter((s) => s.projects.length > 0);

  const overallPct =
    WORKSPACE.totalTasks > 0
      ? Math.round((WORKSPACE.completedTasks / WORKSPACE.totalTasks) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-[#16162A] text-white">
      {/* ── Hero Header ── */}
      <section className="bg-gradient-to-br from-[#1E1E2E] via-[#1a1a2e] to-[#16162A] border-b border-white/8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
          >
            {/* Workspace Info */}
            <motion.div variants={fadeInUp} className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center shadow-lg shadow-[#7B68EE]/30 flex-shrink-0">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {WORKSPACE.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-[#7B68EE]/20 text-[#7B68EE] text-xs font-semibold border border-[#7B68EE]/30">
                    Pro
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{WORKSPACE.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <Users className="w-4 h-4 text-[#7B68EE]" />
                    <span>{WORKSPACE.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <Folder className="w-4 h-4 text-[#00C896]" />
                    <span>{WORKSPACE.totalProjects} projects</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <Activity className="w-4 h-4 text-[#FFA500]" />
                    <span>{overallPct}% complete</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stat Cards */}
            <motion.div
              variants={staggerContainer}
              className="flex items-center gap-3 flex-wrap"
            >
              {[
                { label: "Total Tasks", value: WORKSPACE.totalTasks, color: "#7B68EE", icon: CheckCircle },
                { label: "Completed", value: WORKSPACE.completedTasks, color: "#00C896", icon: TrendingUp },
                { label: "In Progress", value: WORKSPACE.totalTasks - WORKSPACE.completedTasks, color: "#FFA500", icon: Clock },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={scaleIn}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-w-[110px]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                    <span className="text-gray-500 text-xs">{stat.label}</span>
                  </div>
                  <p className="text-white text-xl font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          {/* Space Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveSpace("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeSpace === "all"
                  ? "bg-[#7B68EE] text-white shadow-md shadow-[#7B68EE]/30"
                  : "text-gray-400 hover:text-white hover:bg-white/8"
              }`}
            >
              All Spaces
            </button>
            {SPACES.map((space) => (
              <button
                key={space.id}
                onClick={() => setActiveSpace(activeSpace === space.id ? "all" : space.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeSpace === space.id
                    ? "text-white shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/8"
                }`}
                style={
                  activeSpace === space.id
                    ? { backgroundColor: `${space.color}33`, color: space.color, boxShadow: `0 4px 12px ${space.color}22` }
                    : {}
                }
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: space.color }}
                />
                {space.name}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search projects…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#7B68EE]/60 focus:bg-white/8 transition-all w-44"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-[#7B68EE] text-white" : "text-gray-500 hover:text-white"}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-[#7B68EE] text-white" : "text-gray-500 hover:text-white"}`}
                aria-label="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add Space */}
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] text-white text-sm font-semibold rounded-lg shadow-md shadow-[#7B68EE]/30 hover:shadow-[#7B68EE]/50 transition-shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Space
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── Spaces & Projects ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10">
        {filteredSpaces.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-gray-600" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No projects found</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </motion.div>
        ) : (
          filteredSpaces.map((space) => (
            <motion.section
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
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: space.color, boxShadow: `0 0 8px ${space.color}66` }}
                  />
                  <h2 className="text-white font-bold text-lg">{space.name}</h2>
                  <span className="text-gray-600 text-sm">·</span>
                  <span className="text-gray-500 text-sm">{space.description}</span>
                  <span
                    className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: `${space.color}22`, color: space.color }}
                  >
                    {space.projects.length} project{space.projects.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-white px-2 py-1 rounded-lg hover:bg-white/8 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    Add Project
                  </motion.button>
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-white px-2 py-1 rounded-lg hover:bg-white/8 transition-all">
                    View all
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Projects Grid or List */}
              {viewMode === "grid" ? (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {space.projects.map((project, idx) => (
                    <ProjectCardItem key={project.id} project={project} index={idx} />
                  ))}

                  {/* Add Project Card */}
                  <motion.button
                    variants={scaleIn}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 border-dashed border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-gray-400 hover:border-white/20 transition-all min-h-[200px] group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">New Project</span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className="space-y-2"
                >
                  {space.projects.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      variants={fadeInUp}
                      whileHover={shouldReduceMotion ? {} : { x: 4 }}
                      className="bg-[#252535] border border-white/8 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-white/15 transition-colors cursor-pointer group"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ backgroundColor: `${project.color}22`, border: `1px solid ${project.color}44` }}
                      >
                        {project.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-white font-semibold text-sm truncate">{project.name}</h3>
                          <StatusBadge status={project.status} />
                        </div>
                        <p className="text-gray-500 text-xs truncate">{project.description}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
                        <div className="w-32">
                          <ProgressBar
                            completed={project.completedTasks}
                            total={project.totalTasks}
                            color={project.color}
                          />
                        </div>
                        <AvatarGroup memberIds={project.memberIds} />
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{project.dueDate}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.section>
          ))
        )}

        {/* ── Overall Progress Banner ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="bg-gradient-to-r from-[#7B68EE]/15 via-[#9B8FFF]/10 to-[#7B68EE]/5 border border-[#7B68EE]/25 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#7B68EE]/20 border border-[#7B68EE]/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#7B68EE]" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Workspace Progress</h3>
              <p className="text-gray-400 text-sm">
                {WORKSPACE.completedTasks} of {WORKSPACE.totalTasks} tasks completed across all spaces
              </p>
            </div>
          </div>
          <div className="w-full sm:w-64">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">Overall completion</span>
              <span className="text-[#7B68EE] font-bold">{overallPct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF]"
                initial={{ width: 0 }}
                whileInView={{ width: `${overallPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}