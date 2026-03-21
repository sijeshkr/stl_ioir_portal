// Onboarding.tsx — STL IO|IR Portal
// Design: Dark Command Center — full onboarding checklist with client's exact fields
// Phases: Pre-Start, IT & System Access, Day 1 Orientation, Profile & Credentials, 90-Day Follow-Up

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
  CheckCircle2, Circle, Clock, Users, Plus, Search,
  ChevronDown, ChevronRight, Download, FileText, Laptop,
  Shield, User,
} from "lucide-react";
import { toast } from "sonner";
import { STAFF, displayName, type StaffMember } from "@/lib/staffData";

// ─── Types ────────────────────────────────────────────────────────────────────
type CheckStatus = "complete" | "pending" | "na";

type CheckItem = {
  id: string;
  label: string;
  status: CheckStatus;
  value?: string;
};

type Phase = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  items: CheckItem[];
};

// ─── Checklist builder (client's exact fields, organized into phases) ─────────
function buildChecklist(staff?: StaffMember): Phase[] {
  const name = staff ? displayName(staff) : "";
  return [
    {
      id: "pre_start",
      label: "Pre-Start Setup",
      icon: FileText,
      color: "text-violet-400",
      items: [
        { id: "offer_sent",        label: "Offer Letter / Contract Sent",                                    status: staff ? "complete" : "pending" },
        { id: "offer_signed",      label: "Offer Letter / Contract Signed",                                  status: staff ? "complete" : "pending" },
        { id: "ee_file",           label: "Create Employee File in Drive",                                   status: staff ? "complete" : "pending" },
        { id: "contact_card",      label: "Create Contact Card",                                             status: staff ? "complete" : "pending" },
        { id: "training_plan",     label: "Training Plan Created",                                           status: "pending" },
        { id: "onboard_docs_sent", label: "Emailed Onboarding Documents to Employee",                       status: staff ? "complete" : "pending" },
        { id: "onboard_docs_rcvd", label: "Received Completed Onboarding Documents",                        status: "pending" },
        { id: "creds_in_file",     label: "Copies of Relevant Credentials in Employee File",                 status: "pending" },
        { id: "name_tag",          label: "Name Tag / ID Ordered",                                           status: "pending" },
        { id: "biz_cards",         label: "Business Cards Ordered",                                          status: "pending" },
        { id: "payroll",           label: "Payroll Setup",                                                   status: staff ? "complete" : "pending" },
        { id: "health_ins",        label: "Health Insurance Setup",                                          status: "pending" },
        { id: "onboard_email",     label: "Onboarding Email Sent (report time, location, parking, WiFi password, dress code, lunch plan for first day)", status: "pending" },
        { id: "intro_email",       label: "Email to Staff — Intro New Hire (brief bio + brief plan)",        status: "pending" },
        { id: "roster_updated",    label: "Company Roster Updated",                                          status: "pending" },
        { id: "hipaa_osha",        label: "HIPAA / OSHA Training Assigned",                                  status: "pending" },
      ],
    },
    {
      id: "profile",
      label: "Profile & HR Details",
      icon: User,
      color: "text-amber-400",
      items: [
        { id: "name_designation",  label: "Name & Designation Confirmed",      status: staff ? "complete" : "pending", value: staff ? `${name}${staff.designation ? ", " + staff.designation : ""}` : "" },
        { id: "job_title",         label: "Job Title Confirmed",               status: staff ? "complete" : "pending", value: staff?.jobTitle },
        { id: "credentials_ver",   label: "Credentials Verified",              status: "pending" },
        { id: "work_location",     label: "Work Location Confirmed",           status: staff ? "complete" : "pending", value: staff?.workLocation },
        { id: "reports_to",        label: "Reports To Confirmed",              status: staff ? "complete" : "pending", value: staff?.reportsTo },
        { id: "home_address",      label: "Home Address on File",              status: staff ? "complete" : "pending" },
        { id: "hire_date",         label: "Hire Date Recorded",                status: staff ? "complete" : "pending", value: staff?.hireDate },
        { id: "start_date",        label: "Start Date Recorded",               status: staff ? "complete" : "pending", value: staff?.startDate },
        { id: "birthday",          label: "Birthday (mm/dd) on File",          status: staff ? "complete" : "pending", value: staff?.birthday },
        { id: "pers_email",        label: "Personal Email on File",            status: staff ? "complete" : "pending" },
        { id: "pers_phone",        label: "Personal Phone on File",            status: staff ? "complete" : "pending" },
        { id: "pic_bio",           label: "Photo and Bio for Website",         status: "pending" },
        { id: "pos_desc_sig",      label: "Position Description Signed",       status: "pending" },
        { id: "handbook_sig",      label: "Employee Handbook Signed",          status: "pending" },
      ],
    },
    {
      id: "it_access",
      label: "IT & System Access",
      icon: Laptop,
      color: "text-cyan-400",
      items: [
        { id: "email_setup",       label: "Email Setup",                       status: "pending", value: staff?.companyEmail },
        { id: "work_email",        label: "Work Email Confirmed",              status: "pending", value: staff?.companyEmail },
        { id: "work_ext",          label: "Work Extension Assigned",           status: "pending" },
        { id: "dashboard_access",  label: "Dashboard Access",                  status: "pending" },
        { id: "crm_access",        label: "CRM Access",                        status: staff?.accessLevel === "manager" || staff?.accessLevel === "admin" ? "pending" : "na" },
        { id: "emr_access",        label: "EMR Access",                        status: "pending" },
        { id: "emr_login",         label: "EMR Login Credentials Provided",    status: "pending" },
        { id: "hardware",          label: "Add Hardware to Asset Log",         status: "pending" },
        { id: "building_access",   label: "Building Access / Key Card",        status: "pending" },
        { id: "credit_card",       label: "Company Credit Card (if applicable)", status: staff?.accessLevel === "admin" ? "pending" : "na" },
        { id: "bank_logins",       label: "Bank Account Logins (if applicable)", status: staff?.accessLevel === "admin" ? "pending" : "na" },
        { id: "smartphone_apps",   label: "Smartphone App(s) Installed",       status: "pending" },
        { id: "all_apps",          label: "All Apps and Logins Available",     status: "pending" },
        { id: "logins_demo",       label: "Logins Demonstrated",               status: "pending" },
        { id: "email_sig",         label: "Email Signature(s) Reviewed",       status: "pending" },
      ],
    },
    {
      id: "day1",
      label: "Day 1 Orientation",
      icon: Users,
      color: "text-emerald-400",
      items: [
        { id: "reporting_struct",  label: "Reporting Structure Reviewed",      status: "pending" },
        { id: "org_chart",         label: "Org Chart Review",                  status: "pending" },
        { id: "first_day_checkin", label: "First Day Check-In Completed",      status: "pending" },
        { id: "core_competency",   label: "Core Competency Checklist Reviewed", status: "pending" },
      ],
    },
    {
      id: "compliance",
      label: "Compliance & Security",
      icon: Shield,
      color: "text-rose-400",
      items: [
        { id: "hipaa_osha_done",   label: "HIPAA / OSHA Training Completed",   status: "pending" },
        { id: "it_policy_ack",     label: "IT Policy v1.1 Acknowledgment Signed", status: "pending" },
      ],
    },
    {
      id: "followup",
      label: "90-Day Follow-Up",
      icon: Clock,
      color: "text-sky-400",
      items: [
        { id: "checkin_90",        label: "90-Day Check-In Scheduled / Completed", status: "pending" },
      ],
    },
  ];
}

// ─── Active onboarding records ────────────────────────────────────────────────
type OnboardingRecord = {
  staffId: string;
  startDate: string;
  currentPhase: string;
  phases: Phase[];
};

const ACTIVE_ONBOARDING: OnboardingRecord[] = [
  {
    staffId: "es010",
    startDate: "Mar 3, 2026",
    currentPhase: "IT & System Access",
    phases: (() => {
      const p = buildChecklist(STAFF.find(s => s.id === "es010"));
      // Mark pre-start as mostly done
      p[0].items.forEach(i => {
        if (["offer_sent","offer_signed","ee_file","contact_card","onboard_docs_sent","payroll"].includes(i.id)) i.status = "complete";
      });
      // Mark profile as mostly done
      p[1].items.forEach(i => {
        if (["name_designation","job_title","work_location","reports_to","home_address","hire_date","start_date","birthday","pers_email","pers_phone"].includes(i.id)) i.status = "complete";
      });
      return p;
    })(),
  },
  {
    staffId: "am011",
    startDate: "Mar 17, 2026",
    currentPhase: "Pre-Start Setup",
    phases: (() => {
      const p = buildChecklist(STAFF.find(s => s.id === "am011"));
      p[0].items.forEach(i => {
        if (["offer_sent","offer_signed","ee_file","payroll"].includes(i.id)) i.status = "complete";
      });
      p[1].items.forEach(i => {
        if (["name_designation","job_title","work_location","reports_to","hire_date","start_date","birthday"].includes(i.id)) i.status = "complete";
      });
      return p;
    })(),
  },
];

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, color = "bg-primary" }: { value: number; color?: string }) {
  return (
    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
    </div>
  );
}

// ─── Check Item Row ───────────────────────────────────────────────────────────
function CheckRow({ item, onToggle }: { item: CheckItem; onToggle: (id: string) => void }) {
  return (
    <div
      className={`flex items-start gap-3 py-2 px-3 rounded-lg cursor-pointer transition-colors group ${
        item.status === "complete" ? "hover:bg-emerald-500/10" :
        item.status === "na" ? "opacity-50 cursor-default" :
        "hover:bg-accent/30"
      }`}
      onClick={() => item.status !== "na" && onToggle(item.id)}
    >
      <div className="mt-0.5 flex-shrink-0">
        {item.status === "complete"
          ? <CheckCircle2 size={14} className="text-emerald-400" />
          : item.status === "na"
          ? <Circle size={14} className="text-slate-500" />
          : <Circle size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs leading-snug ${item.status === "complete" ? "line-through text-muted-foreground" : item.status === "na" ? "text-muted-foreground" : ""}`}>
          {item.label}
        </p>
        {item.value && (
          <p className="text-[10px] font-mono text-primary mt-0.5">{item.value}</p>
        )}
      </div>
      {item.status === "na" && (
        <Badge className="text-[9px] bg-slate-500/15 text-slate-400 border-0 flex-shrink-0">N/A</Badge>
      )}
    </div>
  );
}

// ─── Onboarding Detail Modal ──────────────────────────────────────────────────
function OnboardingDetail({ record, onClose }: { record: OnboardingRecord; onClose: () => void }) {
  const staff = STAFF.find(s => s.id === record.staffId)!;
  const [phases, setPhases] = useState<Phase[]>(record.phases);
  const [expandedPhase, setExpandedPhase] = useState<string>(phases[0]?.id);

  const toggleItem = (phaseId: string, itemId: string) => {
    setPhases(prev => prev.map(p =>
      p.id === phaseId ? {
        ...p,
        items: p.items.map(i =>
          i.id === itemId ? { ...i, status: i.status === "complete" ? "pending" : "complete" } : i
        ),
      } : p
    ));
  };

  const totalItems = phases.flatMap(p => p.items).filter(i => i.status !== "na").length;
  const doneItems = phases.flatMap(p => p.items).filter(i => i.status === "complete").length;
  const progress = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${staff.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {staff.initials}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-base">{displayName(staff)}</DialogTitle>
              <p className="text-xs text-muted-foreground">{staff.jobTitle} · Start: {record.startDate}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-bold text-primary">{progress}%</p>
              <p className="text-[10px] text-muted-foreground">{doneItems}/{totalItems} complete</p>
            </div>
          </div>
          <div className="mt-2">
            <ProgressBar value={progress} color={progress === 100 ? "bg-emerald-400" : "bg-primary"} />
          </div>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          {phases.map(phase => {
            const pt = phase.items.filter(i => i.status !== "na").length;
            const pd = phase.items.filter(i => i.status === "complete").length;
            const pp = pt > 0 ? Math.round((pd / pt) * 100) : 0;
            const isExpanded = expandedPhase === phase.id;
            return (
              <div key={phase.id} className="border border-border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/20 transition-colors text-left"
                  onClick={() => setExpandedPhase(isExpanded ? "" : phase.id)}
                >
                  <phase.icon size={14} className={phase.color} />
                  <span className="text-sm font-semibold flex-1">{phase.label}</span>
                  <span className="text-[11px] text-muted-foreground">{pd}/{pt}</span>
                  <div className="w-16">
                    <ProgressBar value={pp} color={pp === 100 ? "bg-emerald-400" : "bg-primary"} />
                  </div>
                  {isExpanded
                    ? <ChevronDown size={13} className="text-muted-foreground flex-shrink-0" />
                    : <ChevronRight size={13} className="text-muted-foreground flex-shrink-0" />
                  }
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-0.5 border-t border-border pt-2">
                    {phase.items.map(item => (
                      <CheckRow key={item.id} item={item} onToggle={(id) => toggleItem(phase.id, id)} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mt-2 pt-3 border-t border-border">
          <Button size="sm" variant="outline" className="flex-1 text-xs gap-1" onClick={() => toast.info("Export checklist PDF — coming soon.")}>
            <Download size={12} /> Export PDF
          </Button>
          <Button size="sm" className="flex-1 text-xs gap-1" onClick={() => { toast.success("Progress saved."); onClose(); }}>
            <CheckCircle2 size={12} /> Save Progress
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Onboarding() {
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<OnboardingRecord | null>(null);

  const filtered = ACTIVE_ONBOARDING.filter(r => {
    const s = STAFF.find(st => st.id === r.staffId);
    if (!s) return false;
    return displayName(s).toLowerCase().includes(search.toLowerCase()) ||
      s.jobTitle.toLowerCase().includes(search.toLowerCase());
  });

  const totalActive = ACTIVE_ONBOARDING.length;
  const avgProgress = Math.round(
    ACTIVE_ONBOARDING.reduce((acc, r) => {
      const total = r.phases.flatMap(p => p.items).filter(i => i.status !== "na").length;
      const done = r.phases.flatMap(p => p.items).filter(i => i.status === "complete").length;
      return acc + (total > 0 ? (done / total) * 100 : 0);
    }, 0) / totalActive
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Onboarding</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Full new hire onboarding checklist — pre-start through 90-day follow-up.
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Start new onboarding — coming soon.")}>
          <Plus size={13} /> New Hire
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { label: "Active Onboardings", value: totalActive,      icon: Users,        color: "text-cyan-400",    bg: "bg-cyan-400/10" },
          { label: "Avg. Completion",    value: `${avgProgress}%`, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Checklist Items",    value: "60+",            icon: FileText,     color: "text-amber-400",   bg: "bg-amber-400/10" },
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

      <Tabs defaultValue="active">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="active">Active Onboardings</TabsTrigger>
          <TabsTrigger value="template">Checklist Template</TabsTrigger>
        </TabsList>

        {/* ── ACTIVE ── */}
        <TabsContent value="active" className="mt-4 space-y-4">
          <div className="relative max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search active onboardings…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs bg-card border-border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(record => {
              const staff = STAFF.find(s => s.id === record.staffId)!;
              const total = record.phases.flatMap(p => p.items).filter(i => i.status !== "na").length;
              const done = record.phases.flatMap(p => p.items).filter(i => i.status === "complete").length;
              const progress = Math.round((done / total) * 100);
              return (
                <Card
                  key={record.staffId}
                  className="bg-card border-border cursor-pointer hover:border-primary/40 transition-all"
                  onClick={() => setSelectedRecord(record)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${staff.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {staff.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{displayName(staff)}</p>
                        <p className="text-xs text-muted-foreground">{staff.jobTitle}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-primary">{progress}%</p>
                        <p className="text-[10px] text-muted-foreground">{done}/{total}</p>
                      </div>
                    </div>
                    <ProgressBar value={progress} color={progress === 100 ? "bg-emerald-400" : "bg-primary"} />
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Start: <span className="text-foreground">{record.startDate}</span></span>
                      <span>Phase: <span className="text-primary">{record.currentPhase}</span></span>
                    </div>
                    {/* Phase mini-bars */}
                    <div className="grid grid-cols-6 gap-1">
                      {record.phases.map(phase => {
                        const pt = phase.items.filter(i => i.status !== "na").length;
                        const pd = phase.items.filter(i => i.status === "complete").length;
                        const pp = pt > 0 ? Math.round((pd / pt) * 100) : 0;
                        return (
                          <div key={phase.id} className="space-y-1">
                            <div className="h-1 bg-border rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${pp === 100 ? "bg-emerald-400" : pp > 0 ? "bg-primary" : ""}`}
                                style={{ width: `${pp}%` }}
                              />
                            </div>
                            <p className="text-[8px] text-muted-foreground truncate">{phase.label.split(" ")[0]}</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ── TEMPLATE ── */}
        <TabsContent value="template" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Standard Onboarding Checklist — All Fields</CardTitle>
              <p className="text-xs text-muted-foreground">Complete list of onboarding steps used for every new hire at STL IO|IR.</p>
            </CardHeader>
            <CardContent className="space-y-5">
              {buildChecklist().map(phase => (
                <div key={phase.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <phase.icon size={14} className={phase.color} />
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${phase.color}`}>{phase.label}</h3>
                    <span className="text-[10px] text-muted-foreground">({phase.items.length} items)</span>
                  </div>
                  <div className="pl-5 space-y-0">
                    {phase.items.map((item, i) => (
                      <div key={item.id} className="flex items-start gap-2 py-1.5 border-b border-border/40 last:border-0">
                        <span className="text-[10px] text-muted-foreground font-mono w-5 flex-shrink-0 mt-0.5">{i + 1}.</span>
                        <p className="text-xs leading-snug">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail modal */}
      {selectedRecord && (
        <OnboardingDetail record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
    </div>
  );
}
