// VendorManagement.tsx — STL IO|IR Portal
// Design: Dark Command Center — vendor access table, BAA status, onboarding checklist

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const vendors = [
  {
    id: 1,
    name: "Ensemble Digital Labs LLC",
    type: "IT & Digital Partner",
    baa: true,
    nda: true,
    soc2: true,
    access: ["Google Workspace Admin", "Marketing Platforms", "IT Advisory"],
    lastReview: "Mar 2026",
    status: "active",
  },
  {
    id: 2,
    name: "StreamlineMD",
    type: "EHR Vendor",
    baa: true,
    nda: true,
    soc2: true,
    access: ["EHR Platform (Vendor Support)"],
    lastReview: "Mar 2026",
    status: "active",
  },
  {
    id: 3,
    name: "TigerConnect",
    type: "Secure Messaging",
    baa: true,
    nda: true,
    soc2: true,
    access: ["Secure Messaging Platform"],
    lastReview: "Jan 2026",
    status: "active",
  },
  {
    id: 4,
    name: "Salesforce Health Cloud",
    type: "CRM",
    baa: true,
    nda: true,
    soc2: true,
    access: ["CRM — Biz Dev Only (No PHI)"],
    lastReview: "Feb 2026",
    status: "active",
  },
  {
    id: 5,
    name: "Pending Vendor: Lab Integration",
    type: "Lab Results Integration",
    baa: false,
    nda: false,
    soc2: false,
    access: ["StreamlineMD API (Proposed)"],
    lastReview: "—",
    status: "pending",
  },
];

const onboardingChecklist = [
  "Signed BAA (if vendor will handle or access PHI)",
  "Signed NDA for Confidential or Restricted data",
  "COO written authorization for access credential provisioning",
  "SOC 2 Type II or equivalent security certification (high-risk vendors)",
  "Completion of Practice vendor security questionnaire",
  "Access scoped to minimum required (least privilege)",
  "Time-limited access credentials provisioned",
  "Vendor sessions logging enabled",
  "Deactivation plan documented (within 24 hrs of project completion)",
];

export default function VendorManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Vendor Access</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage third-party vendor access, BAA status, and security certifications.</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => toast.info("Vendor onboarding form coming soon.")}>
          <Plus size={14} /> Onboard Vendor
        </Button>
      </div>

      {/* Pending alert */}
      <Card className="bg-amber-500/5 border-amber-400/20">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-400">Pending Vendor Review</p>
            <p className="text-xs text-muted-foreground mt-1">
              1 vendor is pending onboarding approval. BAA, NDA, and SOC 2 certification must be completed before access is provisioned.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Vendor table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Vendor</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">BAA</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">NDA</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">SOC 2</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Access Scope</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Last Review</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{v.name}</p>
                      <p className="text-muted-foreground text-[10px]">{v.type}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {v.baa ? <CheckCircle2 size={13} className="text-emerald-400 mx-auto" /> : <XCircle size={13} className="text-red-400 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {v.nda ? <CheckCircle2 size={13} className="text-emerald-400 mx-auto" /> : <XCircle size={13} className="text-red-400 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {v.soc2 ? <CheckCircle2 size={13} className="text-emerald-400 mx-auto" /> : <XCircle size={13} className="text-red-400 mx-auto" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {v.access.map((a) => (
                          <Badge key={a} className="bg-muted text-muted-foreground border-0 text-[9px]">{a}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{v.lastReview}</td>
                    <td className="px-4 py-3 text-center">
                      {v.status === "active"
                        ? <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-[10px]">Active</Badge>
                        : <Badge className="bg-amber-500/15 text-amber-400 border-0 text-[10px]">Pending</Badge>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding checklist */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Vendor Onboarding Requirements (Section 18)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {onboardingChecklist.map((item) => (
              <div key={item} className="flex items-start gap-2.5 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
