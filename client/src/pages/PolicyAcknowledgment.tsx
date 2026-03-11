// PolicyAcknowledgment.tsx — STL IO|IR Portal
// Design: Dark Command Center — policy documents, digital signature, acknowledgment tracking

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, FileText, Download, Eye } from "lucide-react";
import { toast } from "sonner";

const policies = [
  {
    id: 1,
    title: "IT Policy & Cybersecurity Guidelines v1.1",
    version: "v1.1",
    effective: "March 2026",
    required: true,
    description: "Comprehensive IT security, HIPAA compliance, and acceptable use policy covering all staff and systems.",
    acknowledgedBy: 21,
    totalStaff: 24,
  },
  {
    id: 2,
    title: "Acceptable Use Policy (AUP)",
    version: "v1.0",
    effective: "March 2026",
    required: true,
    description: "Permitted and prohibited uses of Practice IT systems, devices, and data.",
    acknowledgedBy: 22,
    totalStaff: 24,
  },
  {
    id: 3,
    title: "BYOD Policy",
    version: "v1.0",
    effective: "March 2026",
    required: false,
    description: "Requirements for personal devices used to access Practice systems or data.",
    acknowledgedBy: 8,
    totalStaff: 12,
  },
];

const staffAcknowledgments = [
  { name: "Dr. K. Vaheesan", role: "Medical Director", signed: true, date: "Mar 1, 2026", systems: ["StreamlineMD", "Google Workspace"] },
  { name: "Sarah Mitchell", role: "Nurse Practitioner", signed: true, date: "Mar 2, 2026", systems: ["StreamlineMD", "Google Workspace"] },
  { name: "James Torres", role: "Front Office", signed: true, date: "Mar 3, 2026", systems: ["StreamlineMD", "Google Workspace"] },
  { name: "Priya Kapoor", role: "Billing Admin", signed: true, date: "Mar 3, 2026", systems: ["StreamlineMD", "Google Workspace"] },
  { name: "Marcus Lee", role: "Nurse Practitioner", signed: true, date: "Mar 4, 2026", systems: ["StreamlineMD", "Google Workspace"] },
  { name: "Angela Chen", role: "Clinical Coordinator", signed: false, date: "—", systems: ["StreamlineMD"] },
  { name: "David Park", role: "Contractor", signed: false, date: "—", systems: ["Google Workspace", "CRM"] },
];

export default function PolicyAcknowledgment() {
  const [signed, setSigned] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Policy Hub</h1>
        <p className="text-sm text-muted-foreground mt-1">Review, acknowledge, and track compliance with all STL IO|IR IT policies.</p>
      </div>

      {/* Policy documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {policies.map((p) => (
          <Card key={p.id} className="bg-card border-border panel-hover">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                  <FileText size={16} className="text-cyan-400" />
                </div>
                <div className="flex gap-1">
                  <Badge className="bg-muted text-muted-foreground border-0 text-[10px] font-mono">{p.version}</Badge>
                  {p.required && <Badge className="bg-red-500/15 text-red-400 border-0 text-[10px]">Required</Badge>}
                </div>
              </div>
              <h3 className="text-sm font-semibold leading-snug">{p.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Effective: {p.effective}</span>
                <span className="font-mono">{p.acknowledgedBy}/{p.totalStaff} signed</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 flex-1" onClick={() => toast.info("Policy document viewer coming soon.")}>
                  <Eye size={10} /> View
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => toast.success("Policy document downloaded.")}>
                  <Download size={10} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My acknowledgment */}
      <Card className={`border ${signed ? "border-emerald-400/30 bg-emerald-400/5" : "border-amber-400/30 bg-amber-400/5"}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {signed
                ? <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                : <Clock size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              }
              <div>
                <h3 className={`text-sm font-semibold ${signed ? "text-emerald-400" : "text-amber-400"}`}>
                  {signed ? "IT Policy v1.1 — Acknowledged" : "Action Required: Sign IT Policy v1.1"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {signed
                    ? "You have acknowledged the IT Policy & Cybersecurity Guidelines v1.1. Your signature has been recorded."
                    : "You must review and sign the IT Policy & Cybersecurity Guidelines before accessing clinical systems."
                  }
                </p>
              </div>
            </div>
            {!signed && (
              <Button size="sm" className="flex-shrink-0" onClick={() => { setSigned(true); toast.success("Policy acknowledged and signature recorded."); }}>
                Sign & Acknowledge
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Staff acknowledgment table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Staff Acknowledgment Status — IT Policy v1.1</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Staff Member</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Role</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Systems</th>
                <th className="text-center px-4 py-3 text-muted-foreground font-medium">Status</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Date Signed</th>
              </tr>
            </thead>
            <tbody>
              {staffAcknowledgments.map((s) => (
                <tr key={s.name} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.systems.map(sys => (
                        <Badge key={sys} className="bg-muted text-muted-foreground border-0 text-[9px]">{sys}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.signed
                      ? <CheckCircle2 size={14} className="text-emerald-400 mx-auto" />
                      : <Clock size={14} className="text-amber-400 mx-auto" />
                    }
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
