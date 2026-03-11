// IncidentReport.tsx — STL IO|IR Portal
// Design: Dark Command Center — incident log, response steps, report form

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle2, Clock, Plus, Activity, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

const incidents = [
  {
    id: "INC-2026-003",
    type: "Failed Login Attempts",
    severity: "medium",
    status: "investigating",
    reported: "Mar 11, 2026 08:42",
    reportedBy: "System (SIEM Alert)",
    description: "5+ failed login attempts to StreamlineMD from unrecognized IP within 10 minutes.",
    step: 2,
  },
  {
    id: "INC-2026-002",
    type: "Phishing Email Clicked",
    severity: "low",
    status: "remediated",
    reported: "Mar 8, 2026 14:15",
    reportedBy: "James Torres",
    description: "Staff member clicked simulated phishing link. Just-in-time training delivered. No credentials entered.",
    step: 7,
  },
  {
    id: "INC-2026-001",
    type: "Lost Device",
    severity: "high",
    status: "closed",
    reported: "Feb 28, 2026 09:00",
    reportedBy: "Marcus Lee",
    description: "Practice-issued laptop reported lost. Remote wipe executed via MDM within 2 hours. No PHI confirmed exposed.",
    step: 7,
  },
];

const responseSteps = [
  { num: 1, phase: "CONTAIN", desc: "Isolate affected systems from the network. Do not power off. Preserve evidence.", color: "text-red-400", bg: "bg-red-400/10" },
  { num: 2, phase: "REPORT", desc: "Notify COO and Ensemble Digital Labs within 15 minutes. After hours: use emergency contact channel.", color: "text-amber-400", bg: "bg-amber-400/10" },
  { num: 3, phase: "DOCUMENT", desc: "Record: date, time, systems/users affected, how discovered, actions taken so far.", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { num: 4, phase: "ASSESS", desc: "COO + Ensemble determine scope, data exposure, and whether PHI was involved.", color: "text-purple-400", bg: "bg-purple-400/10" },
  { num: 5, phase: "NOTIFY", desc: "If PHI is involved: activate HIPAA Breach Notification. HHS/OCR report within 60 days.", color: "text-amber-400", bg: "bg-amber-400/10" },
  { num: 6, phase: "REMEDIATE", desc: "Eradicate threat, restore from clean backups, and implement corrective controls.", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { num: 7, phase: "REVIEW", desc: "Post-incident review within 5 business days. Document lessons learned and update policy.", color: "text-cyan-400", bg: "bg-cyan-400/10" },
];

const severityBadge = (s: string) => {
  if (s === "critical") return <Badge className="bg-red-500/20 text-red-400 border-0 text-[10px]">Critical</Badge>;
  if (s === "high") return <Badge className="bg-orange-500/20 text-orange-400 border-0 text-[10px]">High</Badge>;
  if (s === "medium") return <Badge className="bg-amber-500/20 text-amber-400 border-0 text-[10px]">Medium</Badge>;
  return <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">Low</Badge>;
};

const statusBadge = (s: string) => {
  if (s === "investigating") return <Badge className="bg-amber-500/15 text-amber-400 border-0 text-[10px]">Investigating</Badge>;
  if (s === "remediated") return <Badge className="bg-cyan-500/15 text-cyan-400 border-0 text-[10px]">Remediated</Badge>;
  return <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-[10px]">Closed</Badge>;
};

export default function IncidentReport() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Incident Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Log, track, and manage security incidents per the IT Policy response protocol.</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => toast.info("Incident report form — coming soon.")}>
          <Plus size={14} /> Report Incident
        </Button>
      </div>

      <Tabs defaultValue="log">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="log">Incident Log</TabsTrigger>
          <TabsTrigger value="protocol">Response Protocol</TabsTrigger>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="mt-4 space-y-4">
          {incidents.map((inc) => (
            <Card key={inc.id} className="bg-card border-border panel-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{inc.id}</span>
                      {severityBadge(inc.severity)}
                      {statusBadge(inc.status)}
                    </div>
                    <h3 className="text-sm font-semibold">{inc.type}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{inc.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground font-mono">
                      <span className="flex items-center gap-1"><Clock size={9} /> {inc.reported}</span>
                      <span>Reported by: {inc.reportedBy}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Response Step</div>
                      <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{inc.step}</span>
                      </div>
                      <div className="text-[9px] text-muted-foreground mt-1">of 7</div>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.info("Incident detail view coming soon.")}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="protocol" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {responseSteps.map((step) => (
              <Card key={step.num} className={`bg-card border-border ${step.bg} panel-hover`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-full border ${step.color.replace("text-", "border-")} flex items-center justify-center`}>
                      <span className={`text-xs font-bold ${step.color}`}>{step.num}</span>
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${step.color}`}>{step.phase}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Emergency Contact Directory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { role: "Primary IT Contact", name: "Ensemble Digital Labs LLC — Senthil (Principal)", note: "First call for all technical incidents" },
                { role: "COO / HIPAA Privacy Officer", name: "Designated COO of STL IO|IR Clinics", note: "Breach reporting authority; notify within 15 min" },
                { role: "StreamlineMD Support", name: "Via vendor support portal / emergency line", note: "For EHR-specific incidents" },
                { role: "Legal / Breach Counsel", name: "To be designated — retain prior to any breach event", note: "Activate for HIPAA breach events" },
                { role: "Cyber Insurance Carrier", name: "Carrier to be confirmed upon policy issuance", note: "Notify for ransomware or major breach events" },
              ].map((c) => (
                <div key={c.role} className="flex items-start justify-between gap-4 py-2.5 border-b border-border last:border-0">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{c.role}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.name}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-right max-w-[200px]">{c.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
