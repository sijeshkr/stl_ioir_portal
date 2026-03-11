// HRPeople.tsx — STL IO|IR Portal
// Design: Dark Command Center — staff directory with profile cards, search, filter, profile drawer

import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Plus, Phone, Mail, MapPin, Calendar,
  Award, Shield, Clock, FileText, ChevronRight,
  AlertTriangle, CheckCircle2, Users, UserCheck,
  Briefcase, Building2
} from "lucide-react";
import { toast } from "sonner";

export type StaffMember = {
  id: number;
  name: string;
  initials: string;
  role: string;
  department: string;
  type: "employee" | "contractor";
  status: "active" | "onboarding" | "leave" | "inactive";
  email: string;
  phone: string;
  location: string;
  startDate: string;
  reportsTo: string;
  npi?: string;
  dea?: string;
  licenses: { type: string; number: string; state: string; expiry: string; status: "current" | "expiring" | "expired" }[];
  certifications: { name: string; expiry: string; status: "current" | "expiring" | "expired" }[];
  systems: string[];
  trainingComplete: number;
  trainingTotal: number;
  policySignedDate: string;
  color: string;
};

export const staffData: StaffMember[] = [
  {
    id: 1,
    name: "Dr. Karthik Vaheesan",
    initials: "KV",
    role: "Medical Director / Interventional Radiologist",
    department: "Clinical",
    type: "employee",
    status: "active",
    email: "k.vaheesan@stlioir.com",
    phone: "(314) 555-0101",
    location: "St. Louis, MO",
    startDate: "Jan 15, 2023",
    reportsTo: "Board of Directors",
    npi: "1234567890",
    dea: "BV1234563",
    licenses: [
      { type: "MD License", number: "MO-2023-1234", state: "Missouri", expiry: "Dec 31, 2026", status: "current" },
      { type: "Board Certification — IR", number: "ABR-IR-9876", state: "National", expiry: "Dec 31, 2027", status: "current" },
    ],
    certifications: [
      { name: "ACLS", expiry: "Aug 2026", status: "current" },
      { name: "Fluoroscopy Permit", expiry: "Mar 2026", status: "expiring" },
    ],
    systems: ["StreamlineMD (Admin)", "Google Workspace (Admin)", "VPN"],
    trainingComplete: 8,
    trainingTotal: 8,
    policySignedDate: "Mar 1, 2026",
    color: "bg-cyan-400/20 text-cyan-400",
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    initials: "SM",
    role: "Nurse Practitioner",
    department: "Clinical",
    type: "employee",
    status: "active",
    email: "s.mitchell@stlioir.com",
    phone: "(314) 555-0102",
    location: "St. Louis, MO",
    startDate: "Mar 1, 2023",
    reportsTo: "Dr. Karthik Vaheesan",
    npi: "9876543210",
    licenses: [
      { type: "NP License", number: "MO-NP-5678", state: "Missouri", expiry: "Jun 30, 2026", status: "expiring" },
      { type: "RN License", number: "MO-RN-4321", state: "Missouri", expiry: "Jun 30, 2026", status: "expiring" },
    ],
    certifications: [
      { name: "ACLS", expiry: "Nov 2026", status: "current" },
      { name: "BLS", expiry: "Nov 2026", status: "current" },
    ],
    systems: ["StreamlineMD (Clinical)", "Google Workspace", "VPN"],
    trainingComplete: 8,
    trainingTotal: 8,
    policySignedDate: "Mar 2, 2026",
    color: "bg-emerald-400/20 text-emerald-400",
  },
  {
    id: 3,
    name: "James Torres",
    initials: "JT",
    role: "Front Office Coordinator",
    department: "Administration",
    type: "employee",
    status: "active",
    email: "j.torres@stlioir.com",
    phone: "(314) 555-0103",
    location: "St. Louis, MO",
    startDate: "Jun 1, 2023",
    reportsTo: "Dr. Karthik Vaheesan",
    licenses: [],
    certifications: [
      { name: "Medical Office Administration", expiry: "N/A", status: "current" },
    ],
    systems: ["StreamlineMD (Scheduling)", "Google Workspace"],
    trainingComplete: 6,
    trainingTotal: 8,
    policySignedDate: "Mar 3, 2026",
    color: "bg-amber-400/20 text-amber-400",
  },
  {
    id: 4,
    name: "Priya Kapoor",
    initials: "PK",
    role: "Billing & Coding Specialist",
    department: "Finance",
    type: "employee",
    status: "active",
    email: "p.kapoor@stlioir.com",
    phone: "(314) 555-0104",
    location: "St. Louis, MO",
    startDate: "Sep 15, 2023",
    reportsTo: "Dr. Karthik Vaheesan",
    licenses: [],
    certifications: [
      { name: "CPC (Certified Professional Coder)", expiry: "Dec 2026", status: "current" },
    ],
    systems: ["StreamlineMD (Billing)", "Google Workspace"],
    trainingComplete: 7,
    trainingTotal: 8,
    policySignedDate: "Mar 3, 2026",
    color: "bg-purple-400/20 text-purple-400",
  },
  {
    id: 5,
    name: "Marcus Lee",
    initials: "ML",
    role: "Nurse Practitioner",
    department: "Clinical",
    type: "employee",
    status: "active",
    email: "m.lee@stlioir.com",
    phone: "(314) 555-0105",
    location: "St. Louis, MO",
    startDate: "Nov 1, 2023",
    reportsTo: "Dr. Karthik Vaheesan",
    npi: "1122334455",
    licenses: [
      { type: "NP License", number: "MO-NP-7890", state: "Missouri", expiry: "Sep 30, 2027", status: "current" },
      { type: "RN License", number: "MO-RN-6543", state: "Missouri", expiry: "Sep 30, 2027", status: "current" },
    ],
    certifications: [
      { name: "ACLS", expiry: "May 2027", status: "current" },
      { name: "BLS", expiry: "May 2027", status: "current" },
    ],
    systems: ["StreamlineMD (Clinical)", "Google Workspace", "VPN"],
    trainingComplete: 8,
    trainingTotal: 8,
    policySignedDate: "Mar 4, 2026",
    color: "bg-blue-400/20 text-blue-400",
  },
  {
    id: 6,
    name: "Angela Chen",
    initials: "AC",
    role: "Clinical Coordinator",
    department: "Clinical",
    type: "employee",
    status: "onboarding",
    email: "a.chen@stlioir.com",
    phone: "(314) 555-0106",
    location: "St. Louis, MO",
    startDate: "Mar 10, 2026",
    reportsTo: "Dr. Karthik Vaheesan",
    licenses: [],
    certifications: [],
    systems: ["StreamlineMD (Pending)", "Google Workspace"],
    trainingComplete: 2,
    trainingTotal: 8,
    policySignedDate: "—",
    color: "bg-cyan-400/20 text-cyan-400",
  },
  {
    id: 7,
    name: "David Park",
    initials: "DP",
    role: "Business Development Consultant",
    department: "Business Development",
    type: "contractor",
    status: "active",
    email: "d.park@external.com",
    phone: "(314) 555-0107",
    location: "Remote",
    startDate: "Jan 1, 2026",
    reportsTo: "Dr. Karthik Vaheesan",
    licenses: [],
    certifications: [],
    systems: ["Google Workspace (Limited)", "CRM"],
    trainingComplete: 5,
    trainingTotal: 8,
    policySignedDate: "—",
    color: "bg-slate-400/20 text-slate-400",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-500/15 text-emerald-400 border-0" },
  onboarding: { label: "Onboarding", className: "bg-cyan-500/15 text-cyan-400 border-0" },
  leave: { label: "On Leave", className: "bg-amber-500/15 text-amber-400 border-0" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-0" },
};

const deptConfig: Record<string, string> = {
  Clinical: "bg-cyan-500/10 text-cyan-400",
  Administration: "bg-amber-500/10 text-amber-400",
  Finance: "bg-purple-500/10 text-purple-400",
  "Business Development": "bg-blue-500/10 text-blue-400",
};

const licenseStatusIcon = (s: string) => {
  if (s === "current") return <CheckCircle2 size={12} className="text-emerald-400" />;
  if (s === "expiring") return <AlertTriangle size={12} className="text-amber-400" />;
  return <AlertTriangle size={12} className="text-red-400" />;
};

function StaffProfileModal({ staff, onClose }: { staff: StaffMember; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${staff.color}`}>
              {staff.initials}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">{staff.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{staff.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-[10px] ${statusConfig[staff.status].className}`}>{statusConfig[staff.status].label}</Badge>
                <Badge className={`text-[10px] border-0 ${deptConfig[staff.department] ?? "bg-muted text-muted-foreground"}`}>{staff.department}</Badge>
                {staff.type === "contractor" && <Badge className="text-[10px] border-0 bg-slate-500/15 text-slate-400">Contractor</Badge>}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-2">
          <TabsList className="bg-background border border-border w-full">
            <TabsTrigger value="profile" className="flex-1 text-xs">Profile</TabsTrigger>
            <TabsTrigger value="credentials" className="flex-1 text-xs">Credentials</TabsTrigger>
            <TabsTrigger value="access" className="flex-1 text-xs">Access & Training</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Mail, label: "Email", value: staff.email },
                { icon: Phone, label: "Phone", value: staff.phone },
                { icon: MapPin, label: "Location", value: staff.location },
                { icon: Calendar, label: "Start Date", value: staff.startDate },
                { icon: Users, label: "Reports To", value: staff.reportsTo },
                { icon: Briefcase, label: "Employment", value: staff.type === "employee" ? "Full-Time Employee" : "Contractor" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5 p-3 rounded-lg bg-background border border-border">
                  <Icon size={13} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="text-xs font-medium mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            {(staff.npi || staff.dea) && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Clinical Identifiers</p>
                <div className="flex gap-4">
                  {staff.npi && <div><p className="text-[10px] text-muted-foreground">NPI</p><p className="text-xs font-mono font-medium">{staff.npi}</p></div>}
                  {staff.dea && <div><p className="text-[10px] text-muted-foreground">DEA</p><p className="text-xs font-mono font-medium">{staff.dea}</p></div>}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Credentials Tab */}
          <TabsContent value="credentials" className="mt-4 space-y-4">
            {staff.licenses.length > 0 ? (
              <div>
                <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Licenses</p>
                <div className="space-y-2">
                  {staff.licenses.map((lic) => (
                    <div key={lic.number} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                      <div>
                        <p className="text-xs font-medium">{lic.type}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{lic.number} · {lic.state}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {licenseStatusIcon(lic.status)}
                        <span className={`text-xs font-mono ${lic.status === "current" ? "text-emerald-400" : lic.status === "expiring" ? "text-amber-400" : "text-red-400"}`}>
                          Exp: {lic.expiry}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No clinical licenses on file.</p>
            )}

            {staff.certifications.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Certifications</p>
                <div className="space-y-2">
                  {staff.certifications.map((cert) => (
                    <div key={cert.name} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                      <div className="flex items-center gap-2">
                        <Award size={13} className="text-amber-400" />
                        <p className="text-xs font-medium">{cert.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {licenseStatusIcon(cert.status)}
                        <span className={`text-xs font-mono ${cert.status === "current" ? "text-emerald-400" : cert.status === "expiring" ? "text-amber-400" : "text-red-400"}`}>
                          {cert.expiry === "N/A" ? "No Expiry" : `Exp: ${cert.expiry}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Access & Training Tab */}
          <TabsContent value="access" className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">System Access</p>
              <div className="flex flex-wrap gap-2">
                {staff.systems.map((s) => (
                  <Badge key={s} className="bg-primary/10 text-primary border-0 text-xs">{s}</Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-[10px] text-muted-foreground">Training Progress</p>
                <p className="text-lg font-bold text-foreground mt-1">{staff.trainingComplete}<span className="text-sm text-muted-foreground">/{staff.trainingTotal}</span></p>
                <p className="text-[10px] text-muted-foreground">modules complete</p>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-[10px] text-muted-foreground">Policy Signed</p>
                <p className={`text-xs font-mono font-medium mt-1 ${staff.policySignedDate === "—" ? "text-amber-400" : "text-emerald-400"}`}>{staff.policySignedDate}</p>
                <p className="text-[10px] text-muted-foreground">IT Policy v1.1</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-2 pt-4 border-t border-border">
          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => toast.info("Edit profile — coming soon.")}>Edit Profile</Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => toast.info("Document vault — coming soon.")}>
            <FileText size={12} className="mr-1" /> Documents
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function HRPeople() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const departments = ["All", "Clinical", "Administration", "Finance", "Business Development"];

  const filtered = staffData.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || s.department === deptFilter;
    return matchSearch && matchDept;
  });

  const stats = [
    { label: "Total Staff", value: staffData.filter(s => s.status !== "inactive").length, icon: Users, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: "Employees", value: staffData.filter(s => s.type === "employee").length, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Contractors", value: staffData.filter(s => s.type === "contractor").length, icon: Briefcase, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Onboarding", value: staffData.filter(s => s.status === "onboarding").length, icon: Building2, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">HR & People</h1>
          <p className="text-sm text-muted-foreground mt-1">Staff directory, credentials, licensing, and workforce management.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/hr/credentialing">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Award size={13} /> Credentialing
            </Button>
          </Link>
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Add staff member — coming soon.")}>
            <Plus size={13} /> Add Staff
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
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
            placeholder="Search staff by name or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs bg-card border-border"
          />
        </div>
        <div className="flex gap-1.5">
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${deptFilter === d ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Staff grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((staff) => {
          const expiringCredentials = [...staff.licenses, ...staff.certifications].filter(c => c.status === "expiring" || c.status === "expired").length;
          return (
            <Card
              key={staff.id}
              className="bg-card border-border panel-hover cursor-pointer group"
              onClick={() => setSelectedStaff(staff)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${staff.color}`}>
                    {staff.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold leading-tight">{staff.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{staff.role}</p>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <Badge className={`text-[10px] ${statusConfig[staff.status].className}`}>{statusConfig[staff.status].label}</Badge>
                      <Badge className={`text-[10px] border-0 ${deptConfig[staff.department] ?? "bg-muted text-muted-foreground"}`}>{staff.department}</Badge>
                      {staff.type === "contractor" && (
                        <Badge className="text-[10px] border-0 bg-slate-500/15 text-slate-400">Contractor</Badge>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Shield size={9} />
                        Training: {staff.trainingComplete}/{staff.trainingTotal}
                      </span>
                      {expiringCredentials > 0 ? (
                        <span className="flex items-center gap-1 text-amber-400">
                          <AlertTriangle size={9} />
                          {expiringCredentials} credential{expiringCredentials > 1 ? "s" : ""} expiring
                        </span>
                      ) : staff.licenses.length > 0 ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 size={9} />
                          Credentials current
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Clock size={9} />
                          Since {staff.startDate.split(",")[1]?.trim() ?? staff.startDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Profile modal */}
      {selectedStaff && (
        <StaffProfileModal staff={selectedStaff} onClose={() => setSelectedStaff(null)} />
      )}
    </div>
  );
}
