// HRCredentialing.tsx — STL IO|IR Portal
// Design: Dark Command Center — license expiry tracker, renewal alerts, compliance matrix

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle, CheckCircle2, Clock, Award,
  Plus, Download, RefreshCw, XCircle
} from "lucide-react";
import { toast } from "sonner";
import { staffData } from "./HRPeople";

// Flatten all licenses and certifications across staff
const allCredentials = staffData.flatMap((s) => [
  ...s.licenses.map((l) => ({ label: l.type, number: l.number, expiry: l.expiry, status: l.status, staffName: s.name, staffInitials: s.initials, staffColor: s.color, credType: "License" as const })),
  ...s.certifications.map((c) => ({ label: c.name, number: "—", expiry: c.expiry, status: c.status, staffName: s.name, staffInitials: s.initials, staffColor: s.color, credType: "Certification" as const })),
]);

const expiring = allCredentials.filter((c) => c.status === "expiring");
const expired = allCredentials.filter((c) => c.status === "expired");
const current = allCredentials.filter((c) => c.status === "current");

const statusIcon = (s: string) => {
  if (s === "current") return <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />;
  if (s === "expiring") return <AlertTriangle size={13} className="text-amber-400 flex-shrink-0" />;
  return <XCircle size={13} className="text-red-400 flex-shrink-0" />;
};

const statusBadge = (s: string) => {
  if (s === "current") return <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-[10px]">Current</Badge>;
  if (s === "expiring") return <Badge className="bg-amber-500/15 text-amber-400 border-0 text-[10px]">Expiring Soon</Badge>;
  return <Badge className="bg-red-500/15 text-red-400 border-0 text-[10px]">Expired</Badge>;
};

// Credentialing compliance per clinical staff
const clinicalStaff = staffData.filter((s) => s.department === "Clinical" && s.licenses.length > 0);

const renewalTimeline = [
  { month: "Mar 2026", items: ["Dr. Vaheesan — Fluoroscopy Permit"] },
  { month: "Jun 2026", items: ["Sarah Mitchell — NP License (MO)", "Sarah Mitchell — RN License (MO)"] },
  { month: "Dec 2026", items: ["Dr. Vaheesan — MD License (MO)", "Priya Kapoor — CPC Certification"] },
  { month: "Aug 2026", items: ["Dr. Vaheesan — ACLS"] },
  { month: "Nov 2026", items: ["Sarah Mitchell — ACLS", "Sarah Mitchell — BLS"] },
];

export default function HRCredentialing() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Credentialing & Licensing</h1>
          <p className="text-sm text-muted-foreground mt-1">Track clinical licenses, certifications, and renewal deadlines across all staff.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => toast.success("Credentialing report exported.")}>
            <Download size={13} /> Export Report
          </Button>
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Add credential — coming soon.")}>
            <Plus size={13} /> Add Credential
          </Button>
        </div>
      </div>

      {/* Alert banner for expiring */}
      {(expiring.length > 0 || expired.length > 0) && (
        <Card className="bg-amber-500/5 border-amber-400/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-400">
                  {expiring.length} credential{expiring.length !== 1 ? "s" : ""} expiring soon
                  {expired.length > 0 && ` · ${expired.length} expired`}
                </p>
                <div className="mt-2 space-y-1">
                  {expiring.map((c, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{c.staffName}</span> — {c.label} expires {c.expiry}
                    </p>
                  ))}
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-xs gap-1 flex-shrink-0" onClick={() => toast.info("Renewal reminders sent.")}>
                <RefreshCw size={11} /> Send Reminders
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Current", count: current.length, color: "text-emerald-400", bg: "bg-emerald-400/10", icon: CheckCircle2 },
          { label: "Expiring Soon", count: expiring.length, color: "text-amber-400", bg: "bg-amber-400/10", icon: AlertTriangle },
          { label: "Expired", count: expired.length, color: "text-red-400", bg: "bg-red-400/10", icon: XCircle },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon size={16} className={s.color} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="all">All Credentials</TabsTrigger>
          <TabsTrigger value="matrix">Compliance Matrix</TabsTrigger>
          <TabsTrigger value="timeline">Renewal Timeline</TabsTrigger>
        </TabsList>

        {/* All Credentials */}
        <TabsContent value="all" className="mt-4">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Staff Member</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Credential</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Type</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Number / ID</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Expiry</th>
                      <th className="text-center px-4 py-3 text-muted-foreground font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCredentials.map((c, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${c.staffColor}`}>
                              {c.staffInitials}
                            </div>
                            <span className="font-medium">{c.staffName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">{c.label}</td>
                        <td className="px-4 py-3">
                          <Badge className={`text-[10px] border-0 ${c.credType === "License" ? "bg-cyan-500/15 text-cyan-400" : "bg-amber-500/15 text-amber-400"}`}>
                            {c.credType}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">{c.number}</td>
                        <td className="px-4 py-3 font-mono">{c.expiry}</td>
                        <td className="px-4 py-3 text-center">{statusBadge(c.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Matrix */}
        <TabsContent value="matrix" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Clinical Staff Credentialing Compliance</CardTitle>
              <p className="text-xs text-muted-foreground">Required credentials per role — current status</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {clinicalStaff.map((staff) => {
                  const allCreds = [...staff.licenses, ...staff.certifications];
                  const issues = allCreds.filter(c => c.status !== "current").length;
                  return (
                    <div key={staff.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${staff.color}`}>
                          {staff.initials}
                        </div>
                        <span className="text-sm font-semibold">{staff.name}</span>
                        <span className="text-xs text-muted-foreground">{staff.role}</span>
                        {issues > 0 ? (
                          <Badge className="bg-amber-500/15 text-amber-400 border-0 text-[10px] ml-auto">{issues} issue{issues > 1 ? "s" : ""}</Badge>
                        ) : (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-[10px] ml-auto">Fully Compliant</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-9">
                        {allCreds.map((c, ci) => (
                          <div key={ci} className={`flex items-center gap-2 p-2 rounded-lg border ${c.status === "current" ? "border-emerald-400/20 bg-emerald-400/5" : c.status === "expiring" ? "border-amber-400/20 bg-amber-400/5" : "border-red-400/20 bg-red-400/5"}`}>
                            {statusIcon(c.status)}
                            <div className="min-w-0">
                              <p className="text-[10px] font-medium truncate">{'type' in c ? (c as any).type : (c as any).name}</p>
                              <p className="text-[9px] text-muted-foreground font-mono">{c.expiry === "N/A" ? "No Expiry" : c.expiry}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Renewal Timeline */}
        <TabsContent value="timeline" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Upcoming Renewal Calendar</CardTitle>
              <p className="text-xs text-muted-foreground">Next 18 months — sorted by urgency</p>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
                {renewalTimeline.map((month) => (
                  <div key={month.month} className="relative">
                    <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
                    <p className="text-xs font-bold text-primary mb-2">{month.month}</p>
                    <div className="space-y-1.5">
                      {month.items.map((item) => (
                        <div key={item} className="flex items-center gap-2 p-2.5 rounded-lg bg-background border border-border">
                          <Award size={12} className="text-amber-400 flex-shrink-0" />
                          <span className="text-xs">{item}</span>
                          <Button size="sm" variant="outline" className="ml-auto h-5 text-[9px] px-2 py-0" onClick={() => toast.info("Renewal workflow — coming soon.")}>
                            Renew
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
