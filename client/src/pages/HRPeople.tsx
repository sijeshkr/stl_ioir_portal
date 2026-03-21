// HRPeople.tsx — STL IO|IR Portal
// Design: Dark Command Center — staff directory with real roster from staffData.ts

import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Plus, Phone, Mail, MapPin, Calendar,
  Award, Shield, Clock, FileText, ChevronRight,
  AlertTriangle, CheckCircle2, Users, UserCheck,
  Briefcase, Building2,
} from "lucide-react";
import { toast } from "sonner";
import {
  STAFF, displayName, expiryStatus, EXPIRY_STYLE, ACCESS_LEVEL_LABEL, DEPT_COLOR,
  type StaffMember,
} from "@/lib/staffData";

// ─── Cert column definitions ──────────────────────────────────────────────────
type CertKey = keyof StaffMember["certs"];
const CERT_COLUMNS: { key: CertKey; label: string }[] = [
  { key: "mdMoExp",   label: "MD (MO) License" },
  { key: "rnExp",     label: "RN License" },
  { key: "ccrnCert",  label: "CCRN Cert" },
  { key: "arrtExp",   label: "ARRT" },
  { key: "blsExp",    label: "BLS" },
  { key: "aclsExp",   label: "ACLS" },
  { key: "palsExp",   label: "PALS" },
  { key: "hipaaExp",  label: "HIPAA Training" },
  { key: "bbPathExp", label: "BB Path" },
];

// ─── Dept badge config ────────────────────────────────────────────────────────
const DEPT_BADGE: Record<string, string> = {
  Leadership:             "bg-cyan-500/10 text-cyan-400",
  Clinical:               "bg-emerald-500/10 text-emerald-400",
  "Front Office":         "bg-pink-500/10 text-pink-400",
  "Business Development": "bg-violet-500/10 text-violet-400",
};

// ─── Staff Profile Modal ──────────────────────────────────────────────────────
function StaffProfileModal({ staff, onClose }: { staff: StaffMember; onClose: () => void }) {
  const certIssues = CERT_COLUMNS.filter(c => {
    const st = expiryStatus(staff.certs[c.key]);
    return st === "expired" || st === "expiring_soon";
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${staff.avatarColor} text-white flex-shrink-0`}>
              {staff.initials}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">{displayName(staff)}</DialogTitle>
              {staff.designation && (
                <p className="text-xs text-primary font-mono">{staff.designation}</p>
              )}
              <p className="text-sm text-muted-foreground">{staff.jobTitle}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className={`text-[10px] border-0 ${DEPT_BADGE[staff.department] ?? "bg-muted text-muted-foreground"}`}>{staff.department}</Badge>
                <Badge className={`text-[10px] border-0 bg-slate-500/10 text-slate-400`}>{ACCESS_LEVEL_LABEL[staff.accessLevel]}</Badge>
                <Badge className={`text-[10px] border-0 ${staff.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                  {staff.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-2">
          <TabsList className="bg-background border border-border w-full">
            <TabsTrigger value="profile" className="flex-1 text-xs">Profile</TabsTrigger>
            <TabsTrigger value="credentials" className="flex-1 text-xs">
              Credentials {certIssues.length > 0 && <span className="ml-1 text-amber-400">({certIssues.length})</span>}
            </TabsTrigger>
            <TabsTrigger value="access" className="flex-1 text-xs">Access & Training</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Mail,     label: "Company Email",  value: staff.companyEmail },
                { icon: Phone,    label: "Personal Phone", value: staff.persPhone },
                { icon: MapPin,   label: "Work Location",  value: staff.workLocation },
                { icon: Calendar, label: "Start Date",     value: staff.startDate },
                { icon: Users,    label: "Reports To",     value: staff.reportsTo },
                { icon: Calendar, label: "Birthday",       value: staff.birthday },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5 p-3 rounded-lg bg-background border border-border">
                  <Icon size={13} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="text-xs font-medium mt-0.5">{value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-background border border-border">
              <p className="text-[10px] text-muted-foreground mb-1">Personal Email</p>
              <p className="text-xs font-mono">{staff.persEmail || "—"}</p>
            </div>
          </TabsContent>

          {/* Credentials Tab */}
          <TabsContent value="credentials" className="mt-4 space-y-2">
            {CERT_COLUMNS.map(col => {
              const val = staff.certs[col.key];
              const status = expiryStatus(val);
              const style = EXPIRY_STYLE[status];
              return (
                <div key={col.key} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                  <div className="flex items-center gap-2">
                    <Award size={12} className="text-muted-foreground flex-shrink-0" />
                    <p className="text-xs font-medium">{col.label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {val ? (
                      <>
                        <Badge className={`text-[10px] ${style.className}`}>{style.label}</Badge>
                        <span className="text-xs font-mono text-muted-foreground">{val === "n/a" ? "N/A" : val}</span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not on file</span>
                    )}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* Access & Training Tab */}
          <TabsContent value="access" className="mt-4 space-y-3">
            <div className="p-3 rounded-lg bg-background border border-border">
              <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Access Level</p>
              <Badge className="bg-primary/10 text-primary border-0">{ACCESS_LEVEL_LABEL[staff.accessLevel]}</Badge>
            </div>
            <div className="p-3 rounded-lg bg-background border border-border">
              <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">System Access</p>
              <div className="flex flex-wrap gap-2">
                {staff.accessLevel === "admin" && ["StreamlineMD (Admin)", "Google Workspace (Admin)", "VPN", "CRM", "Dashboard (Admin)"].map(s => (
                  <Badge key={s} className="bg-primary/10 text-primary border-0 text-xs">{s}</Badge>
                ))}
                {staff.accessLevel === "manager" && ["StreamlineMD", "Google Workspace", "CRM", "Dashboard"].map(s => (
                  <Badge key={s} className="bg-primary/10 text-primary border-0 text-xs">{s}</Badge>
                ))}
                {staff.accessLevel === "clinical" && ["StreamlineMD (Clinical)", "Google Workspace", "VPN"].map(s => (
                  <Badge key={s} className="bg-primary/10 text-primary border-0 text-xs">{s}</Badge>
                ))}
                {staff.accessLevel === "front_office" && ["StreamlineMD (Scheduling)", "Google Workspace"].map(s => (
                  <Badge key={s} className="bg-primary/10 text-primary border-0 text-xs">{s}</Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-2 pt-4 border-t border-border">
          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => toast.info("Edit profile — coming soon.")}>
            Edit Profile
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => toast.info("Document vault — coming soon.")}>
            <FileText size={12} className="mr-1" /> Documents
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HRPeople() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const departments = ["All", "Leadership", "Clinical", "Front Office", "Business Development"];

  const filtered = STAFF.filter(s => {
    const matchSearch =
      displayName(s).toLowerCase().includes(search.toLowerCase()) ||
      s.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || s.department === deptFilter;
    return matchSearch && matchDept;
  });

  const stats = [
    { label: "Total Staff",   value: STAFF.filter(s => s.status === "active").length,                    icon: Users,    color: "text-cyan-400",    bg: "bg-cyan-400/10" },
    { label: "Clinical",      value: STAFF.filter(s => s.department === "Clinical").length,              icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Leadership",    value: STAFF.filter(s => s.department === "Leadership").length,            icon: Briefcase, color: "text-amber-400",   bg: "bg-amber-400/10" },
    { label: "Front Office",  value: STAFF.filter(s => s.department === "Front Office").length,          icon: Building2, color: "text-pink-400",    bg: "bg-pink-400/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">HR & People</h1>
          <p className="text-sm text-muted-foreground mt-1">Staff directory, credentials, and workforce management for STL IO|IR.</p>
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
        {stats.map(s => (
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
            placeholder="Search by name, role, or department…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs bg-card border-border"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {departments.map(d => (
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
        {filtered.map(staff => {
          const certIssues = CERT_COLUMNS.filter(c => {
            const st = expiryStatus(staff.certs[c.key]);
            return st === "expired" || st === "expiring_soon";
          }).length;

          return (
            <Card
              key={staff.id}
              className="bg-card border-border cursor-pointer hover:border-primary/40 transition-all group"
              onClick={() => setSelectedStaff(staff)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${staff.avatarColor} text-white`}>
                    {staff.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold leading-tight">{displayName(staff)}</p>
                        {staff.designation && (
                          <p className="text-[10px] text-primary font-mono">{staff.designation}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{staff.jobTitle}</p>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <Badge className={`text-[10px] border-0 ${DEPT_BADGE[staff.department] ?? "bg-muted text-muted-foreground"}`}>
                        {staff.department}
                      </Badge>
                      <Badge className="text-[10px] border-0 bg-slate-500/10 text-slate-400">
                        {ACCESS_LEVEL_LABEL[staff.accessLevel]}
                      </Badge>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail size={9} />
                        {staff.companyEmail}
                      </span>
                      {certIssues > 0 ? (
                        <span className="flex items-center gap-1 text-amber-400">
                          <AlertTriangle size={9} />
                          {certIssues} cert{certIssues > 1 ? "s" : ""} expiring
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 size={9} />
                          Credentials OK
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
