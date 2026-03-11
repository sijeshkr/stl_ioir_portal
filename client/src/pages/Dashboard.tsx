// Dashboard.tsx — STL IO|IR Portal
// Design: Dark Command Center — KPI widgets, compliance ring, training progress, activity feed

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ShieldCheck, GraduationCap, AlertTriangle, Users, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const trainingTrend = [
  { month: "Oct", completed: 62 },
  { month: "Nov", completed: 71 },
  { month: "Dec", completed: 68 },
  { month: "Jan", completed: 79 },
  { month: "Feb", completed: 85 },
  { month: "Mar", completed: 91 },
];

const complianceData = [
  { name: "Compliant", value: 87, color: "oklch(0.72 0.16 145)" },
  { name: "Pending", value: 9, color: "oklch(0.78 0.16 80)" },
  { name: "Overdue", value: 4, color: "oklch(0.65 0.22 25)" },
];

const recentActivity = [
  { id: 1, type: "success", user: "Sarah M.", action: "Completed HIPAA Privacy Fundamentals", time: "12 min ago" },
  { id: 2, type: "warning", user: "James T.", action: "Password rotation overdue — StreamlineMD", time: "1 hr ago" },
  { id: 3, type: "success", user: "Priya K.", action: "Signed IT Policy v1.1 acknowledgment", time: "2 hr ago" },
  { id: 4, type: "danger", user: "System", action: "Failed login attempt — 3 occurrences detected", time: "3 hr ago" },
  { id: 5, type: "success", user: "Marcus L.", action: "Device enrolled in MDM — MacBook Pro", time: "5 hr ago" },
  { id: 6, type: "warning", user: "COO Review", action: "Quarterly access review due in 5 days", time: "Today" },
];

const pendingTasks = [
  { id: 1, task: "Ransomware Response Training", user: "3 staff", due: "Mar 15", status: "overdue" },
  { id: 2, task: "StreamlineMD Secure Use", user: "New hire: A. Chen", due: "Mar 13", status: "pending" },
  { id: 3, task: "Phishing Simulation Q1", user: "All staff", due: "Mar 20", status: "upcoming" },
  { id: 4, task: "Vendor Access Review", user: "COO", due: "Mar 25", status: "upcoming" },
];

const kpis = [
  {
    label: "Overall Compliance",
    value: "87%",
    sub: "+4% from last quarter",
    icon: ShieldCheck,
    trend: "up",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    label: "Training Completion",
    value: "91%",
    sub: "22 of 24 staff current",
    icon: GraduationCap,
    trend: "up",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    label: "Open Incidents",
    value: "2",
    sub: "1 critical, 1 low severity",
    icon: AlertTriangle,
    trend: "neutral",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    label: "Active Staff",
    value: "24",
    sub: "3 contractors, 21 employees",
    icon: Users,
    trend: "neutral",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const activityIcon = (type: string) => {
  if (type === "success") return <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />;
  if (type === "warning") return <AlertCircle size={14} className="text-amber-400 flex-shrink-0" />;
  return <XCircle size={14} className="text-red-400 flex-shrink-0" />;
};

const statusBadge = (status: string) => {
  if (status === "overdue") return <Badge className="bg-red-500/15 text-red-400 border-0 text-[10px]">Overdue</Badge>;
  if (status === "pending") return <Badge className="bg-amber-500/15 text-amber-400 border-0 text-[10px]">Pending</Badge>;
  return <Badge className="bg-cyan-500/15 text-cyan-400 border-0 text-[10px]">Upcoming</Badge>;
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div
        className="relative rounded-xl overflow-hidden h-36 flex items-end p-6"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/96543224/it8C3yuYbZLexGfydZUH9K/stlioir_hero_bg-kfzpZGuBiyFUjayvWTKpEu.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white leading-tight">Good morning, Dr. Vaheesan</h1>
          <p className="text-sm text-slate-300 mt-0.5">
            STL IO|IR Clinics — IT Security & Compliance Portal &nbsp;·&nbsp;
            <span className="font-mono text-cyan-400">v1.1 Active</span>
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="bg-card border-border panel-hover">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
                  <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                    {kpi.trend === "up" && <TrendingUp size={10} className="text-emerald-400" />}
                    {kpi.sub}
                  </p>
                </div>
                <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon size={16} className={kpi.color} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Training trend */}
        <Card className="lg:col-span-2 bg-card border-border panel-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Training Completion Trend</CardTitle>
            <p className="text-xs text-muted-foreground">6-month rolling average across all staff</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={trainingTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.55 0.012 220)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "oklch(0.55 0.012 220)", fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ background: "oklch(0.16 0.014 240)", border: "1px solid oklch(1 0 0 / 8%)", borderRadius: "8px", fontSize: 12 }}
                  labelStyle={{ color: "oklch(0.92 0.008 210)" }}
                  itemStyle={{ color: "#06B6D4" }}
                  formatter={(v: number) => [`${v}%`, "Completion"]}
                />
                <Area type="monotone" dataKey="completed" stroke="#06B6D4" strokeWidth={2} fill="url(#cyanGrad)" dot={{ fill: "#06B6D4", r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compliance donut */}
        <Card className="bg-card border-border panel-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Compliance Status</CardTitle>
            <p className="text-xs text-muted-foreground">Current policy period</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative">
              <PieChart width={140} height={140}>
                <Pie data={complianceData} cx={65} cy={65} innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {complianceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-emerald-400">87%</span>
                <span className="text-[10px] text-muted-foreground">Compliant</span>
              </div>
            </div>
            <div className="w-full space-y-1.5 mt-2">
              {complianceData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-mono text-foreground">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activity feed */}
        <Card className="bg-card border-border panel-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                {activityIcon(item.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug">
                    <span className="font-semibold">{item.user}</span> — {item.action}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending tasks */}
        <Card className="bg-card border-border panel-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{task.task}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{task.user}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                    <Clock size={9} /> {task.due}
                  </span>
                  {statusBadge(task.status)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
