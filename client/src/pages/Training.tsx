// Training.tsx — STL IO|IR Portal
// Design: Dark Command Center — training modules grid, completion tracking, phishing simulation stats

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, CheckCircle2, Clock, AlertCircle, ExternalLink, Shield, Lock, Wifi, FileWarning, Cpu, BookOpen } from "lucide-react";

const modules = [
  {
    id: 1,
    title: "HIPAA Privacy & Security Fundamentals",
    type: "external",
    provider: "HHS / ONC HealthIT",
    url: "https://www.healthit.gov/topic/privacy-security-and-hipaa/security-risk-assessment-tool",
    audience: "All Staff",
    duration: "45 min",
    dueAt: "Day 14",
    annual: true,
    icon: Shield,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    completionRate: 92,
    status: "active",
    description: "Covers the HIPAA Privacy Rule, Security Rule, and Breach Notification Rule. Mandatory for all staff within 14 days of hire.",
  },
  {
    id: 2,
    title: "IT Security Onboarding",
    type: "internal",
    provider: "Ensemble Digital Labs",
    audience: "All Staff",
    duration: "30 min",
    dueAt: "Day 1",
    annual: false,
    icon: Lock,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    completionRate: 100,
    status: "active",
    description: "STL IO|IR-specific security onboarding: password setup, MFA enrollment, clean desk policy, and incident reporting channels.",
  },
  {
    id: 3,
    title: "Phishing Awareness",
    type: "external",
    provider: "KnowBe4 / Proofpoint",
    audience: "All Staff",
    duration: "20 min",
    dueAt: "Day 14 + Quarterly Sims",
    annual: true,
    icon: FileWarning,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    completionRate: 88,
    status: "active",
    description: "Identifying phishing attempts, social engineering tactics, and proper reporting procedures. Includes quarterly simulated phishing exercises.",
  },
  {
    id: 4,
    title: "StreamlineMD Secure Use & Access Controls",
    type: "internal",
    provider: "Ensemble Digital Labs",
    audience: "Clinical & Admin",
    duration: "40 min",
    dueAt: "Before First Access",
    annual: true,
    icon: Cpu,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    completionRate: 79,
    status: "active",
    description: "Role-based access controls, documentation standards, prohibited actions, and audit log awareness within StreamlineMD EHR.",
  },
  {
    id: 5,
    title: "Ransomware Recognition & Response",
    type: "internal",
    provider: "Ensemble Digital Labs",
    audience: "All Staff",
    duration: "25 min",
    dueAt: "Day 30",
    annual: true,
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-400/10",
    completionRate: 71,
    status: "overdue",
    description: "Recognizing ransomware precursors, STL IO|IR's 6-step response protocol (ISOLATE → NOTIFY), and backup recovery procedures.",
  },
  {
    id: 6,
    title: "AI Tool Usage & PHI Prohibition",
    type: "internal",
    provider: "Ensemble Digital Labs",
    audience: "All Staff",
    duration: "15 min",
    dueAt: "Day 14",
    annual: false,
    icon: Wifi,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    completionRate: 95,
    status: "active",
    description: "Approved AI tool usage, the absolute prohibition on entering PHI into any AI chatbot, and consequences of violations.",
  },
  {
    id: 7,
    title: "Password Security & MFA Setup",
    type: "internal",
    provider: "Ensemble Digital Labs",
    audience: "All Staff",
    duration: "20 min",
    dueAt: "Day 1",
    annual: false,
    icon: Lock,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    completionRate: 100,
    status: "active",
    description: "12-character password standards, approved password manager setup, MFA enrollment for all mandatory systems.",
  },
  {
    id: 8,
    title: "Data Classification & Handling",
    type: "external",
    provider: "SANS Security Awareness",
    audience: "All Staff",
    duration: "30 min",
    dueAt: "Day 30",
    annual: true,
    icon: BookOpen,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    completionRate: 83,
    status: "active",
    description: "Understanding Restricted, Confidential, Internal, and Public data tiers. Proper handling, storage, and disposal procedures.",
  },
];

const phishingStats = [
  { month: "Oct 2025", sent: 24, clicked: 5, reported: 19, rate: 79 },
  { month: "Nov 2025", sent: 24, clicked: 3, reported: 21, rate: 88 },
  { month: "Dec 2025", sent: 24, clicked: 4, reported: 20, rate: 83 },
  { month: "Jan 2026", sent: 24, clicked: 2, reported: 22, rate: 92 },
];

const staffProgress = [
  { name: "Sarah Mitchell", role: "NP", completed: 8, total: 8, status: "current" },
  { name: "James Torres", role: "Front Office", completed: 6, total: 8, status: "pending" },
  { name: "Priya Kapoor", role: "Admin", completed: 7, total: 8, status: "pending" },
  { name: "Marcus Lee", role: "NP", completed: 8, total: 8, status: "current" },
  { name: "Angela Chen", role: "New Hire", completed: 2, total: 8, status: "onboarding" },
  { name: "David Park", role: "Contractor", completed: 5, total: 8, status: "pending" },
];

export default function Training() {
  const [filter, setFilter] = useState<"all" | "internal" | "external">("all");

  const filtered = modules.filter((m) => filter === "all" || m.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Training Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and track all mandatory IT security and HIPAA training modules.</p>
      </div>

      <Tabs defaultValue="modules">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="modules">Training Modules</TabsTrigger>
          <TabsTrigger value="staff">Staff Progress</TabsTrigger>
          <TabsTrigger value="phishing">Phishing Simulations</TabsTrigger>
        </TabsList>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-4 mt-4">
          {/* Filter */}
          <div className="flex items-center gap-2">
            {(["all", "internal", "external"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                  filter === f
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {f === "all" ? "All Modules" : f === "internal" ? "Internal (Custom)" : "External (Vendor)"}
              </button>
            ))}
          </div>

          {/* Module grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((mod) => (
              <Card key={mod.id} className="bg-card border-border panel-hover">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${mod.bg} flex items-center justify-center flex-shrink-0`}>
                      <mod.icon size={18} className={mod.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold leading-snug">{mod.title}</h3>
                        <div className="flex gap-1 flex-shrink-0">
                          <Badge className={`text-[10px] border-0 ${mod.type === "internal" ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"}`}>
                            {mod.type === "internal" ? "Internal" : "External"}
                          </Badge>
                          {mod.status === "overdue" && (
                            <Badge className="text-[10px] border-0 bg-red-500/15 text-red-400">Overdue</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{mod.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground font-mono">
                        <span className="flex items-center gap-1"><Clock size={9} /> {mod.duration}</span>
                        <span>·</span>
                        <span>{mod.audience}</span>
                        <span>·</span>
                        <span>Due: {mod.dueAt}</span>
                        {mod.annual && <Badge className="text-[9px] border-0 bg-muted text-muted-foreground">Annual</Badge>}
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground">Staff Completion</span>
                          <span className={`text-[11px] font-mono font-semibold ${mod.completionRate >= 90 ? "text-emerald-400" : mod.completionRate >= 75 ? "text-amber-400" : "text-red-400"}`}>
                            {mod.completionRate}%
                          </span>
                        </div>
                        <Progress value={mod.completionRate} className="h-1.5" />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-muted-foreground">Provider: {mod.provider}</span>
                        {mod.type === "external" && mod.url ? (
                          <a href={mod.url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 px-2">
                              <ExternalLink size={9} /> Launch
                            </Button>
                          </a>
                        ) : (
                          <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 px-2">
                            <PlayCircle size={9} /> Start
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Staff Progress Tab */}
        <TabsContent value="staff" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Individual Training Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffProgress.map((s) => (
                  <div key={s.name} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-xs font-bold">{s.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-sm font-medium">{s.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{s.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{s.completed}/{s.total}</span>
                          <Badge className={`text-[10px] border-0 ${s.status === "current" ? "bg-emerald-500/15 text-emerald-400" : s.status === "onboarding" ? "bg-cyan-500/15 text-cyan-400" : "bg-amber-500/15 text-amber-400"}`}>
                            {s.status === "current" ? "Current" : s.status === "onboarding" ? "Onboarding" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={(s.completed / s.total) * 100} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phishing Tab */}
        <TabsContent value="phishing" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Quarterly Simulation Results</CardTitle>
                <p className="text-xs text-muted-foreground">Simulated phishing exercises — all staff</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {phishingStats.map((s) => (
                    <div key={s.month} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{s.month}</span>
                        <span className={`font-mono font-semibold ${s.rate >= 90 ? "text-emerald-400" : s.rate >= 80 ? "text-amber-400" : "text-red-400"}`}>
                          {s.rate}% reported
                        </span>
                      </div>
                      <div className="flex gap-1 h-2">
                        <div className="bg-emerald-500/60 rounded-sm" style={{ width: `${(s.reported / s.sent) * 100}%` }} />
                        <div className="bg-red-500/60 rounded-sm" style={{ width: `${(s.clicked / s.sent) * 100}%` }} />
                      </div>
                      <div className="flex gap-4 text-[10px] text-muted-foreground font-mono">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500/60 rounded-sm inline-block" /> {s.reported} reported</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500/60 rounded-sm inline-block" /> {s.clicked} clicked</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Policy Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Simulations per year", value: "Quarterly (4x)", status: "ok" },
                  { label: "Training at hire", value: "Within 14 days", status: "ok" },
                  { label: "Failure threshold (retraining)", value: "3+ failures / 12 months", status: "ok" },
                  { label: "Just-in-time training", value: "On click detection", status: "ok" },
                  { label: "Staff with 2+ failures (YTD)", value: "1 staff member", status: "warn" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-xs text-muted-foreground">{r.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono">{r.value}</span>
                      {r.status === "ok" ? <CheckCircle2 size={12} className="text-emerald-400" /> : <AlertCircle size={12} className="text-amber-400" />}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
