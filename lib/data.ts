// ─── Brand Constants ──────────────────────────────────────────────────────────
export const APP_NAME = "FlowUp";
export const APP_TAGLINE = "Project management for modern teams.";
export const APP_DESCRIPTION =
  "Organize tasks, track progress, and collaborate across workspaces — all in one place.";

// ─── Color Palette ────────────────────────────────────────────────────────────
export const BRAND_COLORS = {
  primary: "#7B68EE",
  dark: "#1E1E2E",
  white: "#FFFFFF",
  surface: "#F4F4F8",
  danger: "#FF4D4D",
  warning: "#FFA500",
  success: "#00C896",
} as const;

// ─── Navigation Links (single source of truth) ───────────────────────────────
export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const navLinks: NavLink[] = [
  { label: "Dashboard", href: "/" },
  { label: "Workspace", href: "/workspace" },
  { label: "Inbox", href: "/inbox" },
  { label: "Settings", href: "/settings" },
];

// ─── Shared TypeScript Types ──────────────────────────────────────────────────

export type Priority = "urgent" | "high" | "normal" | "low";
export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";
export type ViewMode = "list" | "board" | "calendar";

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: "admin" | "member" | "viewer";
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string | null;
  projectId: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
  comments: Comment[];
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  spaceId: string;
  taskIds: string[];
  progress: number;
  createdAt: string;
}

export interface Space {
  id: string;
  name: string;
  color: string;
  projectIds: string[];
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  spaceIds: string[];
  memberIds: string[];
}

export interface Notification {
  id: string;
  type: "mention" | "assignment" | "comment" | "status_change" | "due_date";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  taskId?: string;
}

// ─── Priority Config ──────────────────────────────────────────────────────────
export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bg: string }
> = {
  urgent: { label: "Urgent", color: "#FF4D4D", bg: "#FFF0F0" },
  high: { label: "High", color: "#FFA500", bg: "#FFF8EC" },
  normal: { label: "Normal", color: "#7B68EE", bg: "#F0EEFF" },
  low: { label: "Low", color: "#00C896", bg: "#EDFFF9" },
};

// ─── Status Config ────────────────────────────────────────────────────────────
export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bg: string }
> = {
  todo: { label: "To Do", color: "#6B7280", bg: "#F3F4F6" },
  in_progress: { label: "In Progress", color: "#7B68EE", bg: "#F0EEFF" },
  in_review: { label: "In Review", color: "#FFA500", bg: "#FFF8EC" },
  done: { label: "Done", color: "#00C896", bg: "#EDFFF9" },
};