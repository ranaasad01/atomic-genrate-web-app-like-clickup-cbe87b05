"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { User, Settings, Palette, Camera, Save, Mail, Building2, Users, UserPlus, Shield, Eye, Crown, Check, ChevronRight, Bell, Lock, Globe, Trash2, AlertCircle } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { BRAND_COLORS } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USER = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex.johnson@flowup.io",
  role: "Admin",
  bio: "Product designer & team lead. Passionate about building great tools for modern teams.",
  location: "San Francisco, CA",
  timezone: "America/Los_Angeles",
  avatar: "/images/user-avatar-alex.jpg",
};

const MOCK_WORKSPACE = {
  name: "FlowUp HQ",
  description: "Central workspace for all product and engineering teams.",
  url: "flowup-hq",
  plan: "Pro",
};

const MOCK_MEMBERS = [
  { id: "u1", name: "Alex Johnson", email: "alex.johnson@flowup.io", role: "admin", avatar: "/images/avatar-alex.jpg", status: "active" },
  { id: "u2", name: "Priya Sharma", email: "priya.sharma@flowup.io", role: "admin", avatar: "/images/avatar-priya.jpg", status: "active" },
  { id: "u3", name: "Marcus Lee", email: "marcus.lee@flowup.io", role: "member", avatar: "/images/avatar-marcus.jpg", status: "active" },
  { id: "u4", name: "Sofia Reyes", email: "sofia.reyes@flowup.io", role: "member", avatar: "/images/avatar-sofia.jpg", status: "active" },
  { id: "u5", name: "James Okafor", email: "james.okafor@flowup.io", role: "viewer", avatar: "/images/avatar-james.jpg", status: "invited" },
];

const ACCENT_COLORS = [
  { name: "Violet", value: "#7B68EE" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Sky", value: "#0EA5E9" },
  { name: "Emerald", value: "#10B981" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Amber", value: "#F59E0B" },
];

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  admin: { label: "Admin", color: "#7B68EE", bg: "#F0EEFF", icon: Crown },
  member: { label: "Member", color: "#0EA5E9", bg: "#EFF6FF", icon: Shield },
  viewer: { label: "Viewer", color: "#6B7280", bg: "#F3F4F6", icon: Eye },
};

type TabId = "profile" | "workspace" | "appearance";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "appearance", label: "Appearance", icon: Palette },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/80 p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/40 focus:border-[#7B68EE] transition-all"
      />
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/40 focus:border-[#7B68EE] transition-all resize-none"
      />
    </div>
  );
}

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        saved
          ? "bg-[#00C896] text-white shadow-md shadow-[#00C896]/30"
          : "bg-[#7B68EE] text-white shadow-md shadow-[#7B68EE]/30 hover:bg-[#6A58DD]"
      }`}
    >
      {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
      {saved ? "Saved!" : "Save Changes"}
    </motion.button>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const shouldReduceMotion = useReducedMotion();
  const [name, setName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [bio, setBio] = useState(MOCK_USER.bio);
  const [location, setLocation] = useState(MOCK_USER.location);
  const [timezone, setTimezone] = useState(MOCK_USER.timezone);
  const [saved, setSaved] = useState(false);
  const [avatarHovered, setAvatarHovered] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Avatar */}
      <SectionCard>
        <SectionTitle title="Profile Photo" description="Upload a photo to personalize your account." />
        <div className="flex items-center gap-5">
          <motion.div
            className="relative w-20 h-20 rounded-2xl overflow-hidden cursor-pointer group"
            onHoverStart={() => setAvatarHovered(true)}
            onHoverEnd={() => setAvatarHovered(false)}
            whileHover={{ scale: shouldReduceMotion ? 1 : 1.04 }}
          >
            <img
              src={MOCK_USER.avatar}
              alt={MOCK_USER.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.style.background = "linear-gradient(135deg, #7B68EE, #9B8FFF)";
                  parent.innerHTML = `<span style="color:white;font-size:1.5rem;font-weight:700;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${(MOCK_USER.name ?? "?").charAt(0)}</span>`;
                }
              }}
            />
            <AnimatePresence>
              {avatarHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <Camera className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <div>
            <motion.button
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-xl border border-[#7B68EE] text-[#7B68EE] text-sm font-medium hover:bg-[#7B68EE]/5 transition-colors"
            >
              Upload new photo
            </motion.button>
            <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or GIF. Max 2MB.</p>
          </div>
        </div>
      </SectionCard>

      {/* Personal Info */}
      <SectionCard>
        <SectionTitle title="Personal Information" description="Update your name, email, and public profile details." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Full Name" value={name} onChange={setName} placeholder="Your full name" />
          <InputField label="Email Address" value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
          <InputField label="Location" value={location} onChange={setLocation} placeholder="City, Country" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/40 focus:border-[#7B68EE] transition-all"
            >
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <TextAreaField label="Bio" value={bio} onChange={setBio} placeholder="Tell your team a bit about yourself..." rows={3} />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <SaveButton onClick={handleSave} saved={saved} />
        </div>
      </SectionCard>

      {/* Password */}
      <SectionCard>
        <SectionTitle title="Password & Security" description="Keep your account secure with a strong password." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Current Password" value="" onChange={() => {}} type="password" placeholder="••••••••" />
          <div />
          <InputField label="New Password" value="" onChange={() => {}} type="password" placeholder="••••••••" hint="Minimum 8 characters" />
          <InputField label="Confirm New Password" value="" onChange={() => {}} type="password" placeholder="••••••••" />
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Two-factor authentication is <span className="text-[#00C896] font-medium">enabled</span></span>
          </div>
          <motion.button
            whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 rounded-xl bg-[#7B68EE] text-white text-sm font-semibold shadow-md shadow-[#7B68EE]/30 hover:bg-[#6A58DD] transition-colors"
          >
            Update Password
          </motion.button>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard>
        <SectionTitle title="Notification Preferences" description="Choose what you want to be notified about." />
        <div className="space-y-3">
          {[
            { label: "Task assignments", description: "When someone assigns a task to you", defaultOn: true },
            { label: "Mentions", description: "When someone @mentions you in a comment", defaultOn: true },
            { label: "Status changes", description: "When a task you're watching changes status", defaultOn: false },
            { label: "Due date reminders", description: "24 hours before a task is due", defaultOn: true },
            { label: "Weekly digest", description: "A summary of your workspace activity", defaultOn: false },
          ].map((item) => (
            <NotificationToggleRow key={item.label} {...item} />
          ))}
        </div>
      </SectionCard>
    </motion.div>
  );
}

function NotificationToggleRow({
  label,
  description,
  defaultOn,
}: {
  label: string;
  description: string;
  defaultOn: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <motion.button
        onClick={() => setOn((v) => !v)}
        whileTap={{ scale: 0.92 }}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${on ? "bg-[#7B68EE]" : "bg-gray-200"}`}
        aria-label={`Toggle ${label}`}
      >
        <motion.span
          animate={{ x: on ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
        />
      </motion.button>
    </div>
  );
}

// ─── Workspace Tab ────────────────────────────────────────────────────────────

function WorkspaceTab() {
  const shouldReduceMotion = useReducedMotion();
  const [wsName, setWsName] = useState(MOCK_WORKSPACE.name);
  const [wsDesc, setWsDesc] = useState(MOCK_WORKSPACE.description);
  const [wsUrl, setWsUrl] = useState(MOCK_WORKSPACE.url);
  const [saved, setSaved] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteSent, setInviteSent] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setInviteSent(true);
    setInviteEmail("");
    setTimeout(() => setInviteSent(false), 2500);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Workspace Info */}
      <SectionCard>
        <SectionTitle title="Workspace Details" description="Manage your workspace name, URL, and description." />
        <div className="space-y-4">
          <InputField label="Workspace Name" value={wsName} onChange={setWsName} placeholder="My Workspace" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Workspace URL</label>
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-[#7B68EE]/40 focus-within:border-[#7B68EE] transition-all">
              <span className="px-3.5 py-2.5 text-sm text-gray-400 bg-gray-100 border-r border-gray-200 select-none">
                flowup.io/
              </span>
              <input
                type="text"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-transparent text-gray-900 text-sm focus:outline-none"
              />
            </div>
            <p className="text-xs text-gray-400">This is your workspace's unique URL slug.</p>
          </div>
          <TextAreaField
            label="Description"
            value={wsDesc}
            onChange={setWsDesc}
            placeholder="What does your workspace do?"
            rows={2}
          />
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F0EEFF] text-[#7B68EE] text-xs font-semibold">
            <Crown className="w-3.5 h-3.5" />
            {MOCK_WORKSPACE.plan} Plan
          </div>
          <SaveButton onClick={handleSave} saved={saved} />
        </div>
      </SectionCard>

      {/* Members */}
      <SectionCard>
        <SectionTitle title="Team Members" description={`${MOCK_MEMBERS.length} members in this workspace`} />
        <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2 mb-5">
          {MOCK_MEMBERS.map((member) => {
            const roleConf = ROLE_CONFIG[member.role] ?? ROLE_CONFIG["member"];
            const RoleIcon = roleConf.icon;
            return (
              <motion.li
                key={member.id}
                variants={fadeInUp}
                whileHover={{ x: shouldReduceMotion ? 0 : 2 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const t = e.currentTarget as HTMLImageElement;
                      t.style.display = "none";
                      const p = t.parentElement;
                      if (p) {
                        p.innerHTML = `<span style="color:white;font-size:0.875rem;font-weight:700;">${(member.name ?? "?").charAt(0)}</span>`;
                      }
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                    {member.status === "invited" && (
                      <span className="text-xs px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 font-medium">Invited</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{member.email}</p>
                </div>
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{ color: roleConf.color, background: roleConf.bg }}
                >
                  <RoleIcon className="w-3 h-3" />
                  {roleConf.label}
                </div>
                <motion.button
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  aria-label="Remove member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Invite */}
        <div className="border-t border-gray-100 pt-5">
          <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#7B68EE]" />
            Invite New Member
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/40 focus:border-[#7B68EE] transition-all"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/40 focus:border-[#7B68EE] transition-all"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <motion.button
              onClick={handleInvite}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                inviteSent
                  ? "bg-[#00C896] text-white"
                  : "bg-[#7B68EE] text-white hover:bg-[#6A58DD]"
              }`}
            >
              {inviteSent ? <Check className="w-4 h-4" /> : "Invite"}
            </motion.button>
          </div>
          {inviteSent && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-[#00C896] mt-2 flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Invitation sent successfully!
            </motion.p>
          )}
        </div>
      </SectionCard>

      {/* Danger Zone */}
      <SectionCard>
        <SectionTitle title="Danger Zone" description="Irreversible actions for your workspace." />
        <div className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">Delete Workspace</p>
              <p className="text-xs text-red-500 mt-0.5">Permanently delete this workspace and all its data. This cannot be undone.</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-xl border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors flex-shrink-0 ml-4"
          >
            Delete
          </motion.button>
        </div>
      </SectionCard>
    </motion.div>
  );
}

// ─── Appearance Tab ───────────────────────────────────────────────────────────

function AppearanceTab() {
  const shouldReduceMotion = useReducedMotion();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");
  const [accentColor, setAccentColor] = useState(BRAND_COLORS.primary);
  const [density, setDensity] = useState<"comfortable" | "compact" | "spacious">("comfortable");
  const [fontScale, setFontScale] = useState("100");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const themeOptions: { id: "light" | "dark" | "system"; label: string; preview: string }[] = [
    {
      id: "light",
      label: "Light",
      preview: "bg-white border-gray-200",
    },
    {
      id: "dark",
      label: "Dark",
      preview: "bg-[#1E1E2E] border-[#7B68EE]/30",
    },
    {
      id: "system",
      label: "System",
      preview: "bg-gradient-to-br from-white to-[#1E1E2E] border-gray-300",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Theme */}
      <SectionCard>
        <SectionTitle title="Color Theme" description="Choose how FlowUp looks for you." />
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((opt) => (
            <motion.button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200 ${
                theme === opt.id
                  ? "border-[#7B68EE] bg-[#F0EEFF]"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              {/* Mini preview */}
              <div className={`w-full h-14 rounded-lg border ${opt.preview} overflow-hidden`}>
                <div className="flex h-full">
                  <div className={`w-1/3 h-full ${opt.id === "dark" ? "bg-[#2A2A3E]" : opt.id === "system" ? "bg-gray-100" : "bg-gray-100"}`} />
                  <div className="flex-1 p-1.5 space-y-1">
                    <div className={`h-1.5 rounded-full w-3/4 ${opt.id === "dark" ? "bg-white/20" : "bg-gray-300"}`} />
                    <div className={`h-1.5 rounded-full w-1/2 ${opt.id === "dark" ? "bg-white/10" : "bg-gray-200"}`} />
                    <div className={`h-1.5 rounded-full w-2/3 ${opt.id === "dark" ? "bg-white/10" : "bg-gray-200"}`} />
                  </div>
                </div>
              </div>
              <span className={`text-sm font-medium ${theme === opt.id ? "text-[#7B68EE]" : "text-gray-600"}`}>
                {opt.label}
              </span>
              {theme === opt.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#7B68EE] flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </SectionCard>

      {/* Accent Color */}
      <SectionCard>
        <SectionTitle title="Accent Color" description="Personalize your interface with a signature color." />
        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map((color) => (
            <motion.button
              key={color.value}
              onClick={() => setAccentColor(color.value)}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.12 }}
              whileTap={{ scale: 0.92 }}
              title={color.name}
              aria-label={`Select ${color.name} accent`}
              className="relative w-10 h-10 rounded-xl shadow-sm transition-all"
              style={{ background: color.value }}
            >
              {accentColor === color.value && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white drop-shadow" />
                </motion.span>
              )}
              {accentColor === color.value && (
                <motion.span
                  layoutId="accent-ring"
                  className="absolute -inset-1 rounded-[14px] border-2 border-current"
                  style={{ borderColor: color.value }}
                />
              )}
            </motion.button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="w-8 h-8 rounded-lg" style={{ background: accentColor }} />
          <div>
            <p className="text-sm font-medium text-gray-800">
              {ACCENT_COLORS.find((c) => c.value === accentColor)?.name ?? "Custom"} accent
            </p>
            <p className="text-xs text-gray-400 font-mono">{accentColor}</p>
          </div>
        </div>
      </SectionCard>

      {/* Layout Density */}
      <SectionCard>
        <SectionTitle title="Layout Density" description="Control how compact or spacious the interface feels." />
        <div className="flex gap-2">
          {(["compact", "comfortable", "spacious"] as const).map((d) => (
            <motion.button
              key={d}
              onClick={() => setDensity(d)}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all capitalize ${
                density === d
                  ? "border-[#7B68EE] bg-[#F0EEFF] text-[#7B68EE]"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
              }`}
            >
              {d}
            </motion.button>
          ))}
        </div>
      </SectionCard>

      {/* Font Scale */}
      <SectionCard>
        <SectionTitle title="Font Size" description="Adjust the base font size across the app." />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Small</span>
            <span className="text-sm font-semibold text-[#7B68EE]">{fontScale}%</span>
            <span className="text-xs text-gray-400">Large</span>
          </div>
          <input
            type="range"
            min="80"
            max="120"
            step="5"
            value={fontScale}
            onChange={(e) => setFontScale(e.target.value)}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#7B68EE]"
            style={{ background: `linear-gradient(to right, #7B68EE ${((Number(fontScale) - 80) / 40) * 100}%, #E5E7EB ${((Number(fontScale) - 80) / 40) * 100}%)` }}
          />
          <div className="flex justify-between text-xs text-gray-400">
            {["80%", "90%", "100%", "110%", "120%"].map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <p className="text-gray-600" style={{ fontSize: `${Number(fontScale) * 0.14}px` }}>
            The quick brown fox jumps over the lazy dog. — Preview text at {fontScale}%
          </p>
        </div>
      </SectionCard>

      {/* Save */}
      <SectionCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Globe className="w-4 h-4" />
            <span>Changes apply to your account across all devices.</span>
          </div>
          <SaveButton onClick={handleSave} saved={saved} />
        </div>
      </SectionCard>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const shouldReduceMotion = useReducedMotion();

  const tabContent: Record<TabId, React.ReactNode> = {
    profile: <ProfileTab />,
    workspace: <WorkspaceTab />,
    appearance: <AppearanceTab />,
  };

  return (
    <main className="min-h-screen bg-[#F4F4F8]">
      {/* Page Header */}
      <div className="bg-[#1E1E2E] border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage your profile, workspace, and appearance preferences.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <motion.aside
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="lg:w-56 flex-shrink-0"
          >
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex flex-row lg:flex-col gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ x: shouldReduceMotion ? 0 : 2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left ${
                      isActive
                        ? "bg-[#7B68EE] text-white shadow-md shadow-[#7B68EE]/25"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:block">{tab.label}</span>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 ml-auto hidden lg:block" />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* User card in sidebar */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="hidden lg:block mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center flex-shrink-0">
                  <img
                    src={MOCK_USER.avatar}
                    alt={MOCK_USER.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const t = e.currentTarget as HTMLImageElement;
                      t.style.display = "none";
                      const p = t.parentElement;
                      if (p) {
                        p.innerHTML = `<span style="color:white;font-size:1rem;font-weight:700;">${(MOCK_USER.name ?? "?").charAt(0)}</span>`;
                      }
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{MOCK_USER.name}</p>
                  <p className="text-xs text-gray-400 truncate">{MOCK_USER.role}</p>
                </div>
              </div>
            </motion.div>
          </motion.aside>

          {/* Tab Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}