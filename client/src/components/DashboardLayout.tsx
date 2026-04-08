// DashboardLayout.tsx
// Design: Dark Command Center — persistent left sidebar (240px), grouped nav sections, top header
// Colors: Near-black bg, cyan accent, amber warnings, slate panels

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LayoutDashboard,
  GraduationCap,
  UserCheck,
  ShieldAlert,
  FileText,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
  Bell,
  LogOut,
  Activity,
  Award,
  GitBranch,
  CalendarDays,
  Shield,
  MessageSquare,
  Inbox,
  TrendingUp,
  Zap,
  Brain,
  Layers,
  Globe,
  PlayCircle,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
};

type NavSection = {
  section: string;
  icon: React.ElementType;
  color: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    section: "IT & Compliance",
    icon: Shield,
    color: "text-cyan-400",
    items: [
      { path: "/", label: "Dashboard", icon: LayoutDashboard },
      { path: "/training", label: "Training Center", icon: GraduationCap, badge: 3 },
      { path: "/onboarding", label: "Onboarding", icon: UserCheck },
      { path: "/access-control", label: "Access Control", icon: ShieldAlert, badge: 2 },
      { path: "/incidents", label: "Incident Reports", icon: Activity },
      { path: "/policy", label: "Policy Hub", icon: FileText },
      { path: "/vendors", label: "Vendor Access", icon: Users },
      { path: "/compliance", label: "Compliance", icon: BarChart3 },
    ],
  },
  {
    section: "HR & People",
    icon: Users,
    color: "text-emerald-400",
    items: [
      { path: "/hr/people", label: "Staff Directory", icon: Users },
      { path: "/hr/credentialing", label: "Credentialing", icon: Award },
      { path: "/hr/org-chart", label: "Org Chart", icon: GitBranch },
      { path: "/hr/time-off", label: "Time Off", icon: CalendarDays },
    ],
  },
  {
    section: "Communications",
    icon: MessageSquare,
    color: "text-purple-400",
    items: [
      { path: "/comms/referrals", label: "Referral Inbox", icon: Inbox, badge: 2 },
    ],
  },
  {
    section: "Paid Ads",
    icon: TrendingUp,
    color: "text-amber-400",
    items: [
      { path: "/ads/campaign-planner", label: "Campaign Planner", icon: Layers },
      { path: "/ads/intelligence-hub", label: "Intelligence Hub", icon: Zap, badge: 3 },
      { path: "/ads/strategy-workspace", label: "Strategy Workspace", icon: Brain },
      { path: "/ads/asset-studio", label: "Ad Asset Studio", icon: TrendingUp },
      { path: "/ads/landing-pages", label: "Landing Pages", icon: Globe },
      { path: "/ads/execution-center", label: "Execution Center", icon: PlayCircle },
      { path: "/ads/offline-conversion", label: "Offline Conversion", icon: RefreshCw },
      { path: "/ads/knowledge-room", label: "Knowledge Room", icon: BookOpen },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "IT & Compliance": true,
    "HR & People": true,
    "Communications": true,
    "Paid Ads": true,
  });
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Find current page label across all sections
  const currentLabel = navSections
    .flatMap((s) => s.items)
    .find((n) => n.path === location)?.label ?? "Portal";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out flex-shrink-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-border", collapsed && "justify-center px-0")}>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-primary leading-tight tracking-wide">STL IO|IR</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Staff Portal</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-xs font-bold">IO</span>
            </div>
          )}
        </div>

        {/* Nav Sections */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navSections.map(({ section, icon: SectionIcon, color, items }) => {
            const isExpanded = expandedSections[section] ?? true;
            return (
              <div key={section} className="mb-1">
                {/* Section header */}
                {!collapsed && (
                  <button
                    onClick={() => toggleSection(section)}
                    className="w-full flex items-center gap-2 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <SectionIcon size={10} className={color} />
                    <span className="flex-1 text-left">{section}</span>
                    <ChevronDown
                      size={10}
                      className={cn("transition-transform duration-200", isExpanded ? "rotate-0" : "-rotate-90")}
                    />
                  </button>
                )}
                {collapsed && (
                  <div className="mx-2 my-1 h-px bg-border" />
                )}

                {/* Nav items */}
                {(isExpanded || collapsed) && items.map(({ path, label, icon: Icon, badge }) => {
                  const isActive = location === path;
                  return (
                    <Link key={path} href={path}>
                      <div
                        className={cn(
                          "flex items-center gap-3 mx-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-150 group relative",
                          isActive
                            ? "bg-primary/15 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                          collapsed && "justify-center px-0 mx-1"
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                        )}
                        <Icon size={15} className={cn("flex-shrink-0", isActive && "text-primary")} />
                        {!collapsed && (
                          <span className="text-xs font-medium flex-1">{label}</span>
                        )}
                        {!collapsed && badge && (
                          <Badge className="bg-primary/20 text-primary border-0 text-[10px] h-4 px-1.5 font-mono">
                            {badge}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className={cn("border-t border-border p-3 flex flex-col gap-1.5", collapsed && "items-center")}>
          <button
            onClick={toggleTheme}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm w-full",
              collapsed && "justify-center w-9 h-9 px-0"
            )}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            {!collapsed && <span className="text-xs">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>
          <button
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-sm w-full",
              collapsed && "justify-center w-9 h-9 px-0"
            )}
          >
            <LogOut size={15} />
            {!collapsed && <span className="text-xs">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-50 w-5 h-10 flex items-center justify-center bg-card border border-border rounded-r-md text-muted-foreground hover:text-primary transition-colors"
        style={{ left: collapsed ? "3.5rem" : "14.5rem", transition: "left 0.3s ease" }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
              {currentLabel}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Live status */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono">Systems Nominal</span>
            </div>
            {/* Notifications */}
            <button className="relative w-8 h-8 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />
            </button>
            {/* User avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-xs font-bold">KV</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-medium leading-tight">Dr. Vaheesan</span>
                <span className="text-[10px] text-muted-foreground">Medical Director</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
