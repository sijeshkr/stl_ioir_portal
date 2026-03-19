// ReferralInbox.tsx — STL IO|IR Portal
// Design: Dark Command Center — shared referral inbox with Kanban pipeline, detail drawer, analytics
// Sections: Pipeline (Kanban), List view, Provider Directory, Analytics

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Plus, Phone, Mail, Printer, Clock, User, ChevronRight,
  AlertCircle, CheckCircle2, Calendar, FileText, MessageSquare,
  BarChart3, TrendingUp, Filter, RefreshCw,
  Building2, Stethoscope, ClipboardList, Inbox,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type ReferralStatus =
  | "new"
  | "reviewed"
  | "pa_submitted"
  | "pa_approved"
  | "scheduled"
  | "complete"
  | "declined";

type Priority = "urgent" | "routine" | "elective";

type Referral = {
  id: string;
  patientInitials: string;
  patientDOB: string;
  procedure: string;
  procedureCode: string;
  diagnosis: string;
  icd10: string;
  referringProvider: string;
  referringPractice: string;
  referringPhone: string;
  referringFax: string;
  payer: string;
  memberId: string;
  receivedDate: string;
  receivedVia: "fax" | "phone" | "web" | "email";
  status: ReferralStatus;
  priority: Priority;
  assignedTo: string;
  notes: string;
  activityLog: { date: string; user: string; action: string }[];
  paNumber?: string;
  scheduledDate?: string;
};

// ─── Static Data ──────────────────────────────────────────────────────────────
const referrals: Referral[] = [
  {
    id: "REF-2026-0041",
    patientInitials: "M.R.",
    patientDOB: "1958-04-12",
    procedure: "Uterine Fibroid Embolization",
    procedureCode: "37243",
    diagnosis: "Uterine Leiomyoma",
    icd10: "D25.9",
    referringProvider: "Dr. Anita Sharma",
    referringPractice: "Midwest Women's Health",
    referringPhone: "(314) 555-2201",
    referringFax: "(314) 555-2202",
    payer: "Anthem BCBS",
    memberId: "XYZ123456789",
    receivedDate: "Mar 18, 2026",
    receivedVia: "fax",
    status: "new",
    priority: "routine",
    assignedTo: "James Torres",
    notes: "Patient has been symptomatic for 6 months. Requesting UFE evaluation.",
    activityLog: [
      { date: "Mar 18, 2026 9:14 AM", user: "System", action: "Referral received via fax" },
    ],
  },
  {
    id: "REF-2026-0040",
    patientInitials: "T.B.",
    patientDOB: "1971-09-03",
    procedure: "Peripheral Arterial Angioplasty",
    procedureCode: "37220",
    diagnosis: "Peripheral Artery Disease — Left Lower Extremity",
    icd10: "I70.212",
    referringProvider: "Dr. James Holloway",
    referringPractice: "Gateway Vascular Surgery",
    referringPhone: "(314) 555-3301",
    referringFax: "(314) 555-3302",
    payer: "Medicare Part B",
    memberId: "1EG4-TE5-MK72",
    receivedDate: "Mar 17, 2026",
    receivedVia: "phone",
    status: "reviewed",
    priority: "urgent",
    assignedTo: "Priya Kapoor",
    notes: "Urgent — patient has rest pain. Dr. Holloway requesting expedited scheduling.",
    activityLog: [
      { date: "Mar 17, 2026 2:30 PM", user: "System", action: "Referral received via phone" },
      { date: "Mar 17, 2026 3:05 PM", user: "James Torres", action: "Reviewed referral, assigned to Priya Kapoor for PA" },
    ],
    paNumber: undefined,
  },
  {
    id: "REF-2026-0039",
    patientInitials: "C.W.",
    patientDOB: "1965-01-22",
    procedure: "Hepatic Chemoembolization (TACE)",
    procedureCode: "37243",
    diagnosis: "Hepatocellular Carcinoma",
    icd10: "C22.0",
    referringProvider: "Dr. Robert Kim",
    referringPractice: "Barnes-Jewish Oncology",
    referringPhone: "(314) 555-4401",
    referringFax: "(314) 555-4402",
    payer: "Cigna",
    memberId: "U1234567",
    receivedDate: "Mar 15, 2026",
    receivedVia: "fax",
    status: "pa_submitted",
    priority: "urgent",
    assignedTo: "Priya Kapoor",
    notes: "Multidisciplinary tumor board recommendation. PA submitted Mar 16.",
    activityLog: [
      { date: "Mar 15, 2026 10:00 AM", user: "System", action: "Referral received via fax" },
      { date: "Mar 15, 2026 11:30 AM", user: "James Torres", action: "Reviewed and assigned to Priya Kapoor" },
      { date: "Mar 16, 2026 9:00 AM", user: "Priya Kapoor", action: "Prior authorization submitted to Cigna" },
    ],
    paNumber: "PA-2026-CIG-88821",
  },
  {
    id: "REF-2026-0038",
    patientInitials: "L.P.",
    patientDOB: "1952-07-14",
    procedure: "Kyphoplasty — T12",
    procedureCode: "22513",
    diagnosis: "Osteoporotic Compression Fracture T12",
    icd10: "M80.08XA",
    referringProvider: "Dr. Susan Patel",
    referringPractice: "St. Louis Spine & Orthopedics",
    referringPhone: "(314) 555-5501",
    referringFax: "(314) 555-5502",
    payer: "Humana",
    memberId: "H9876543",
    receivedDate: "Mar 12, 2026",
    receivedVia: "fax",
    status: "pa_approved",
    priority: "routine",
    assignedTo: "James Torres",
    notes: "PA approved Mar 14. Patient available Mon/Wed/Fri mornings.",
    activityLog: [
      { date: "Mar 12, 2026 8:45 AM", user: "System", action: "Referral received via fax" },
      { date: "Mar 12, 2026 2:00 PM", user: "Priya Kapoor", action: "PA submitted to Humana" },
      { date: "Mar 14, 2026 10:30 AM", user: "Priya Kapoor", action: "PA approved — Auth #HUM-2026-44312" },
      { date: "Mar 14, 2026 11:00 AM", user: "James Torres", action: "Contacted patient to schedule" },
    ],
    paNumber: "HUM-2026-44312",
  },
  {
    id: "REF-2026-0037",
    patientInitials: "D.M.",
    patientDOB: "1979-11-30",
    procedure: "Varicocele Embolization",
    procedureCode: "37241",
    diagnosis: "Varicocele — Left",
    icd10: "I86.1",
    referringProvider: "Dr. Kevin Walsh",
    referringPractice: "Midwest Urology Associates",
    referringPhone: "(314) 555-6601",
    referringFax: "(314) 555-6602",
    payer: "UnitedHealthcare",
    memberId: "UHC44556677",
    receivedDate: "Mar 10, 2026",
    receivedVia: "web",
    status: "scheduled",
    priority: "elective",
    assignedTo: "James Torres",
    notes: "Scheduled for Mar 25, 2026 at 10:00 AM. Pre-procedure instructions sent.",
    activityLog: [
      { date: "Mar 10, 2026 3:00 PM", user: "System", action: "Referral received via web form" },
      { date: "Mar 11, 2026 9:00 AM", user: "Priya Kapoor", action: "PA submitted to UHC" },
      { date: "Mar 12, 2026 4:00 PM", user: "Priya Kapoor", action: "PA approved — Auth #UHC-2026-77123" },
      { date: "Mar 13, 2026 10:00 AM", user: "James Torres", action: "Scheduled for Mar 25, 2026" },
      { date: "Mar 13, 2026 10:30 AM", user: "System", action: "Pre-procedure instructions sent to patient" },
    ],
    paNumber: "UHC-2026-77123",
    scheduledDate: "Mar 25, 2026 — 10:00 AM",
  },
  {
    id: "REF-2026-0036",
    patientInitials: "F.A.",
    patientDOB: "1944-03-08",
    procedure: "Inferior Vena Cava Filter Placement",
    procedureCode: "37191",
    diagnosis: "Deep Vein Thrombosis with PE Risk",
    icd10: "I82.401",
    referringProvider: "Dr. James Holloway",
    referringPractice: "Gateway Vascular Surgery",
    referringPhone: "(314) 555-3301",
    referringFax: "(314) 555-3302",
    payer: "Medicare Part B",
    memberId: "2HG5-TF6-NL83",
    receivedDate: "Mar 5, 2026",
    receivedVia: "phone",
    status: "complete",
    priority: "urgent",
    assignedTo: "James Torres",
    notes: "Procedure completed Mar 8. Report sent to Dr. Holloway.",
    activityLog: [
      { date: "Mar 5, 2026 11:00 AM", user: "System", action: "Referral received via phone" },
      { date: "Mar 5, 2026 11:30 AM", user: "James Torres", action: "Scheduled for Mar 8 (Medicare — no PA required)" },
      { date: "Mar 8, 2026 2:00 PM", user: "Dr. K. Vaheesan", action: "Procedure completed successfully" },
      { date: "Mar 8, 2026 4:00 PM", user: "James Torres", action: "Report faxed to Dr. Holloway" },
    ],
    scheduledDate: "Mar 8, 2026",
  },
  {
    id: "REF-2026-0035",
    patientInitials: "N.O.",
    patientDOB: "1967-06-19",
    procedure: "Percutaneous Nephrostomy",
    procedureCode: "50432",
    diagnosis: "Ureteral Obstruction — Right",
    icd10: "N13.5",
    referringProvider: "Dr. Michelle Grant",
    referringPractice: "SSM Health Urology",
    referringPhone: "(314) 555-7701",
    referringFax: "(314) 555-7702",
    payer: "Aetna",
    memberId: "AET9988776",
    receivedDate: "Mar 1, 2026",
    receivedVia: "fax",
    status: "declined",
    priority: "routine",
    assignedTo: "James Torres",
    notes: "Declined — patient elected to proceed with surgical ureteroscopy instead.",
    activityLog: [
      { date: "Mar 1, 2026 9:00 AM", user: "System", action: "Referral received via fax" },
      { date: "Mar 3, 2026 2:00 PM", user: "James Torres", action: "Contacted patient — elected surgical option" },
      { date: "Mar 3, 2026 2:30 PM", user: "James Torres", action: "Referral declined — patient preference" },
    ],
  },
];

const referringProviders = [
  { name: "Dr. Anita Sharma", practice: "Midwest Women's Health", specialty: "OB/GYN", phone: "(314) 555-2201", fax: "(314) 555-2202", email: "a.sharma@mwwh.com", referrals: 8, lastReferral: "Mar 18, 2026", topProcedure: "UFE" },
  { name: "Dr. James Holloway", practice: "Gateway Vascular Surgery", specialty: "Vascular Surgery", phone: "(314) 555-3301", fax: "(314) 555-3302", email: "j.holloway@gvs.com", referrals: 14, lastReferral: "Mar 17, 2026", topProcedure: "PAD Interventions" },
  { name: "Dr. Robert Kim", practice: "Barnes-Jewish Oncology", specialty: "Medical Oncology", phone: "(314) 555-4401", fax: "(314) 555-4402", email: "r.kim@bjc.org", referrals: 6, lastReferral: "Mar 15, 2026", topProcedure: "TACE / Y-90" },
  { name: "Dr. Susan Patel", practice: "St. Louis Spine & Orthopedics", specialty: "Orthopedic Surgery", phone: "(314) 555-5501", fax: "(314) 555-5502", email: "s.patel@slso.com", referrals: 5, lastReferral: "Mar 12, 2026", topProcedure: "Kyphoplasty" },
  { name: "Dr. Kevin Walsh", practice: "Midwest Urology Associates", specialty: "Urology", phone: "(314) 555-6601", fax: "(314) 555-6602", email: "k.walsh@mua.com", referrals: 9, lastReferral: "Mar 10, 2026", topProcedure: "Varicocele Embolization" },
  { name: "Dr. Michelle Grant", practice: "SSM Health Urology", specialty: "Urology", phone: "(314) 555-7701", fax: "(314) 555-7702", email: "m.grant@ssmhealth.com", referrals: 3, lastReferral: "Mar 1, 2026", topProcedure: "Nephrostomy" },
];

const monthlyData = [
  { month: "Oct", referrals: 18, completed: 15 },
  { month: "Nov", referrals: 22, completed: 19 },
  { month: "Dec", referrals: 16, completed: 14 },
  { month: "Jan", referrals: 25, completed: 21 },
  { month: "Feb", referrals: 28, completed: 24 },
  { month: "Mar", referrals: 12, completed: 6 },
];

const byProcedure = [
  { name: "UFE", count: 14 },
  { name: "PAD", count: 18 },
  { name: "TACE/Y90", count: 8 },
  { name: "Kyphoplasty", count: 6 },
  { name: "Varicocele", count: 11 },
  { name: "Other", count: 9 },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const PIPELINE_STAGES: { key: ReferralStatus; label: string; color: string; bg: string; border: string }[] = [
  { key: "new",          label: "New",          color: "text-sky-400",     bg: "bg-sky-400/10",     border: "border-sky-400/30" },
  { key: "reviewed",     label: "Reviewed",     color: "text-cyan-400",    bg: "bg-cyan-400/10",    border: "border-cyan-400/30" },
  { key: "pa_submitted", label: "PA Submitted", color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/30" },
  { key: "pa_approved",  label: "PA Approved",  color: "text-lime-400",    bg: "bg-lime-400/10",    border: "border-lime-400/30" },
  { key: "scheduled",    label: "Scheduled",    color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" },
  { key: "complete",     label: "Complete",     color: "text-green-400",   bg: "bg-green-400/10",   border: "border-green-400/30" },
  { key: "declined",     label: "Declined",     color: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/30" },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; className: string }> = {
  urgent:  { label: "Urgent",  className: "bg-red-500/15 text-red-400 border-0" },
  routine: { label: "Routine", className: "bg-amber-500/15 text-amber-400 border-0" },
  elective:{ label: "Elective",className: "bg-slate-500/15 text-slate-400 border-0" },
};

const VIA_ICON: Record<string, React.ReactNode> = {
  fax:   <Printer size={10} />,
  phone: <Phone size={10} />,
  web:   <ClipboardList size={10} />,
  email: <Mail size={10} />,
};

function stageConfig(s: ReferralStatus) {
  return PIPELINE_STAGES.find(p => p.key === s)!;
}

// ─── Referral Detail Drawer ───────────────────────────────────────────────────
function ReferralDetail({ ref: r, onClose, onAdvance }: { ref: Referral; onClose: () => void; onAdvance: (id: string, status: ReferralStatus) => void }) {
  const sc = stageConfig(r.status);
  const nextStages = PIPELINE_STAGES.filter(s => s.key !== r.status && s.key !== "declined");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground">{r.id}</span>
                <Badge className={`text-[10px] ${sc.bg} ${sc.color} border-0`}>{sc.label}</Badge>
                <Badge className={`text-[10px] ${PRIORITY_CONFIG[r.priority].className}`}>{PRIORITY_CONFIG[r.priority].label}</Badge>
              </div>
              <DialogTitle className="text-base font-bold">{r.procedure}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{r.diagnosis} · ICD-10: {r.icd10}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-2">
          {/* Patient */}
          <div className="p-3 rounded-lg bg-background border border-border space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Patient</p>
            <p className="text-sm font-bold">{r.patientInitials}</p>
            <p className="text-xs text-muted-foreground">DOB: {r.patientDOB}</p>
            <p className="text-xs text-muted-foreground">Payer: <span className="text-foreground">{r.payer}</span></p>
            <p className="text-xs font-mono text-muted-foreground">ID: {r.memberId}</p>
          </div>
          {/* Referring */}
          <div className="p-3 rounded-lg bg-background border border-border space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Referring Provider</p>
            <p className="text-sm font-bold">{r.referringProvider}</p>
            <p className="text-xs text-muted-foreground">{r.referringPractice}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground"><Phone size={10} />{r.referringPhone}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground"><Printer size={10} />{r.referringFax}</div>
          </div>
          {/* Procedure */}
          <div className="p-3 rounded-lg bg-background border border-border space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Procedure Details</p>
            <p className="text-xs"><span className="text-muted-foreground">CPT: </span><span className="font-mono">{r.procedureCode}</span></p>
            <p className="text-xs"><span className="text-muted-foreground">Received: </span>{r.receivedDate}</p>
            <p className="text-xs flex items-center gap-1"><span className="text-muted-foreground">Via: </span>{VIA_ICON[r.receivedVia]}<span className="capitalize">{r.receivedVia}</span></p>
            {r.paNumber && <p className="text-xs"><span className="text-muted-foreground">PA #: </span><span className="font-mono text-lime-400">{r.paNumber}</span></p>}
            {r.scheduledDate && <p className="text-xs"><span className="text-muted-foreground">Scheduled: </span><span className="text-emerald-400">{r.scheduledDate}</span></p>}
          </div>
          {/* Assignment */}
          <div className="p-3 rounded-lg bg-background border border-border space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Assignment</p>
            <p className="text-xs"><span className="text-muted-foreground">Assigned to: </span><span className="font-medium">{r.assignedTo}</span></p>
            <div className="mt-2">
              <Select onValueChange={(v) => { toast.success(`Reassigned to ${v}`); }}>
                <SelectTrigger className="h-7 text-xs bg-background border-border">
                  <SelectValue placeholder="Reassign…" />
                </SelectTrigger>
                <SelectContent>
                  {["James Torres", "Priya Kapoor", "Sarah Mitchell"].map(n => (
                    <SelectItem key={n} value={n} className="text-xs">{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="p-3 rounded-lg bg-background border border-border mt-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Notes</p>
          <p className="text-xs leading-relaxed">{r.notes}</p>
        </div>

        {/* Activity log */}
        <div className="mt-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Activity Log</p>
          <div className="relative pl-5 space-y-2">
            <div className="absolute left-1.5 top-0 bottom-0 w-px bg-border" />
            {r.activityLog.map((a, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-primary/60 border border-background" />
                <p className="text-[10px] text-muted-foreground font-mono">{a.date} · <span className="text-primary">{a.user}</span></p>
                <p className="text-xs mt-0.5">{a.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-2 pt-4 border-t border-border flex-wrap">
          {r.status !== "complete" && r.status !== "declined" && (
            <Select onValueChange={(v) => { onAdvance(r.id, v as ReferralStatus); onClose(); }}>
              <SelectTrigger className="h-8 text-xs flex-1 bg-primary/10 border-primary/30 text-primary">
                <SelectValue placeholder="Move to stage…" />
              </SelectTrigger>
              <SelectContent>
                {nextStages.map(s => (
                  <SelectItem key={s.key} value={s.key} className="text-xs">{s.label}</SelectItem>
                ))}
                <SelectItem value="declined" className="text-xs text-red-400">Decline</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => toast.info("Log activity — coming soon.")}>
            <MessageSquare size={12} /> Log Note
          </Button>
          <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => toast.info("Fax report — coming soon.")}>
            <Printer size={12} /> Fax Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────
function KanbanCard({ r, onClick }: { r: Referral; onClick: () => void }) {
  const pc = PRIORITY_CONFIG[r.priority];
  return (
    <div
      onClick={onClick}
      className="bg-background border border-border rounded-lg p-3 cursor-pointer hover:border-primary/40 transition-all group space-y-2"
    >
      <div className="flex items-start justify-between gap-1">
        <span className="text-[10px] font-mono text-muted-foreground">{r.id}</span>
        <Badge className={`text-[9px] ${pc.className} flex-shrink-0`}>{pc.label}</Badge>
      </div>
      <p className="text-xs font-semibold leading-snug group-hover:text-primary transition-colors">{r.procedure}</p>
      <p className="text-[10px] text-muted-foreground">{r.patientInitials} · {r.payer}</p>
      <div className="flex items-center justify-between pt-1 border-t border-border">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          {VIA_ICON[r.receivedVia]}
          <span className="capitalize">{r.receivedVia}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <User size={9} />
          <span>{r.assignedTo.split(" ")[0]}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReferralInbox() {
  const [data, setData] = useState<Referral[]>(referrals);
  const [selected, setSelected] = useState<Referral | null>(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const advance = (id: string, status: ReferralStatus) => {
    setData(d => d.map(r => r.id === id ? { ...r, status } : r));
    toast.success(`Referral moved to "${stageConfig(status).label}"`);
  };

  const filtered = data.filter(r => {
    const matchSearch = r.procedure.toLowerCase().includes(search.toLowerCase()) ||
      r.referringProvider.toLowerCase().includes(search.toLowerCase()) ||
      r.patientInitials.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priorityFilter === "all" || r.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  // KPI stats
  const newCount = data.filter(r => r.status === "new").length;
  const pendingPA = data.filter(r => r.status === "pa_submitted").length;
  const scheduled = data.filter(r => r.status === "scheduled").length;
  const urgent = data.filter(r => r.priority === "urgent" && !["complete","declined"].includes(r.status)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Referral Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">Shared inbox for all incoming patient referrals — track, assign, and manage the full pipeline.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => toast.info("Sync fax inbox — coming soon.")}>
            <RefreshCw size={13} /> Sync Fax
          </Button>
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("New referral form — coming soon.")}>
            <Plus size={13} /> New Referral
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "New Referrals", value: newCount, icon: Inbox, color: "text-sky-400", bg: "bg-sky-400/10" },
          { label: "Pending PA", value: pendingPA, icon: FileText, color: "text-amber-400", bg: "bg-amber-400/10" },
          { label: "Scheduled", value: scheduled, icon: Calendar, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Urgent Active", value: urgent, icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10" },
        ].map(s => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon size={16} className={s.color} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by procedure, provider, patient, or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs bg-card border-border"
          />
        </div>
        <div className="flex gap-1.5 items-center">
          <Filter size={12} className="text-muted-foreground" />
          {["all", "urgent", "routine", "elective"].map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${priorityFilter === p ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="pipeline">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="providers">Provider Directory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ── PIPELINE (Kanban) ── */}
        <TabsContent value="pipeline" className="mt-4">
          <div className="flex gap-3 overflow-x-auto pb-4">
            {PIPELINE_STAGES.map(stage => {
              const stageRefs = filtered.filter(r => r.status === stage.key);
              return (
                <div key={stage.key} className="flex-shrink-0 w-52">
                  <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg border border-b-0 ${stage.border} ${stage.bg}`}>
                    <span className={`text-xs font-semibold ${stage.color}`}>{stage.label}</span>
                    <span className={`text-xs font-mono font-bold ${stage.color}`}>{stageRefs.length}</span>
                  </div>
                  <div className={`min-h-[300px] rounded-b-lg border ${stage.border} p-2 space-y-2`}>
                    {stageRefs.map(r => (
                      <KanbanCard key={r.id} r={r} onClick={() => setSelected(r)} />
                    ))}
                    {stageRefs.length === 0 && (
                      <div className="flex items-center justify-center h-20 text-[10px] text-muted-foreground">
                        No referrals
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ── LIST VIEW ── */}
        <TabsContent value="list" className="mt-4">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">ID</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Procedure</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Patient</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Referring Provider</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Payer</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Received</th>
                      <th className="text-center px-4 py-3 text-muted-foreground font-medium">Priority</th>
                      <th className="text-center px-4 py-3 text-muted-foreground font-medium">Status</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Assigned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => {
                      const sc = stageConfig(r.status);
                      return (
                        <tr
                          key={r.id}
                          className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer"
                          onClick={() => setSelected(r)}
                        >
                          <td className="px-4 py-3 font-mono text-muted-foreground">{r.id}</td>
                          <td className="px-4 py-3 font-medium max-w-[160px] truncate">{r.procedure}</td>
                          <td className="px-4 py-3 font-mono">{r.patientInitials}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.referringProvider}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.payer}</td>
                          <td className="px-4 py-3 text-muted-foreground font-mono">{r.receivedDate}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge className={`text-[10px] ${PRIORITY_CONFIG[r.priority].className}`}>{PRIORITY_CONFIG[r.priority].label}</Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge className={`text-[10px] border-0 ${sc.bg} ${sc.color}`}>{sc.label}</Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{r.assignedTo.split(" ")[0]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── PROVIDER DIRECTORY ── */}
        <TabsContent value="providers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {referringProviders.map(p => (
              <Card key={p.name} className="bg-card border-border panel-hover">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Stethoscope size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.practice}</p>
                      <Badge className="mt-1 text-[10px] border-0 bg-cyan-500/10 text-cyan-400">{p.specialty}</Badge>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2"><Phone size={10} />{p.phone}</div>
                    <div className="flex items-center gap-2"><Printer size={10} />{p.fax}</div>
                    <div className="flex items-center gap-2"><Mail size={10} />{p.email}</div>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                    <span><span className="text-foreground font-semibold">{p.referrals}</span> referrals · Top: {p.topProcedure}</span>
                    <span>Last: {p.lastReferral.split(",")[0]}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px] gap-1" onClick={() => toast.info("Quick message — coming soon.")}>
                      <MessageSquare size={10} /> Message
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px] gap-1" onClick={() => toast.info("View referral history — coming soon.")}>
                      <FileText size={10} /> History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── ANALYTICS ── */}
        <TabsContent value="analytics" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp size={14} className="text-primary" /> Monthly Referral Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
                    <Line type="monotone" dataKey="referrals" stroke="#22d3ee" strokeWidth={2} dot={{ fill: "#22d3ee", r: 3 }} name="Received" />
                    <Line type="monotone" dataKey="completed" stroke="#34d399" strokeWidth={2} dot={{ fill: "#34d399", r: 3 }} name="Completed" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 size={14} className="text-primary" /> Referrals by Procedure Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={byProcedure} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={70} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="count" fill="#22d3ee" radius={[0, 4, 4, 0]} name="Referrals" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top referring providers table */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Top Referring Providers — YTD 2026</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Provider</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Practice</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Specialty</th>
                    <th className="text-center px-4 py-3 text-muted-foreground font-medium">Referrals</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Top Procedure</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Last Referral</th>
                  </tr>
                </thead>
                <tbody>
                  {[...referringProviders].sort((a, b) => b.referrals - a.referrals).map(p => (
                    <tr key={p.name} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.practice}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.specialty}</td>
                      <td className="px-4 py-3 text-center font-bold text-cyan-400">{p.referrals}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.topProcedure}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono">{p.lastReferral}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail modal */}
      {selected && (
        <ReferralDetail
          ref={selected}
          onClose={() => setSelected(null)}
          onAdvance={advance}
        />
      )}
    </div>
  );
}
