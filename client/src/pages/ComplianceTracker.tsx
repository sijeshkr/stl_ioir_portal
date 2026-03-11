// ComplianceTracker.tsx — STL IO|IR Portal
// Design: Dark Command Center — compliance controls grid, patch status, audit log summary

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle, Clock, ShieldCheck } from "lucide-react";

const controlAreas = [
  {
    area: "Identity & Access Management",
    score: 94,
    controls: [
      { label: "MFA enabled on all mandatory systems", status: "ok" },
      { label: "Password manager deployed (all staff)", status: "ok" },
      { label: "RBAC configured in StreamlineMD", status: "ok" },
      { label: "Service account credentials rotated quarterly", status: "warn" },
    ],
  },
  {
    area: "Endpoint Security",
    score: 88,
    controls: [
      { label: "EDR agent installed on all managed devices", status: "ok" },
      { label: "Full-disk encryption (BitLocker/FileVault)", status: "ok" },
      { label: "MDM enrollment — all practice devices", status: "ok" },
      { label: "BYOD MDM compliance — 1 device non-compliant", status: "warn" },
    ],
  },
  {
    area: "Email & Communication Security",
    score: 100,
    controls: [
      { label: "SPF, DKIM, DMARC (reject policy) configured", status: "ok" },
      { label: "Inbound email scanning active", status: "ok" },
      { label: "External email warning banners enabled", status: "ok" },
      { label: "Auto-forwarding to personal email blocked", status: "ok" },
    ],
  },
  {
    area: "Network Security",
    score: 91,
    controls: [
      { label: "Clinical/admin VLANs segmented", status: "ok" },
      { label: "Next-gen firewall with IDS/IPS deployed", status: "ok" },
      { label: "DNS filtering active (Cloudflare Gateway)", status: "ok" },
      { label: "WPA3-Enterprise Wi-Fi configured", status: "warn" },
    ],
  },
  {
    area: "Backup & Recovery",
    score: 85,
    controls: [
      { label: "3-2-1 backup rule implemented", status: "ok" },
      { label: "Immutable backup copy maintained", status: "ok" },
      { label: "Backup encryption (AES-256) verified", status: "ok" },
      { label: "Quarterly restoration test completed", status: "fail" },
    ],
  },
  {
    area: "HIPAA Compliance",
    score: 96,
    controls: [
      { label: "BAA executed with StreamlineMD vendor", status: "ok" },
      { label: "Audit logs retained 6 years (HIPAA)", status: "ok" },
      { label: "Minimum necessary standard enforced", status: "ok" },
      { label: "Annual HIPAA training completed (all staff)", status: "warn" },
    ],
  },
];

const patchStatus = [
  { system: "StreamlineMD EHR", version: "v4.2.1", lastPatch: "Mar 8, 2026", status: "current", severity: null },
  { system: "Windows Workstations (6)", version: "Win 11 23H2", lastPatch: "Mar 7, 2026", status: "current", severity: null },
  { system: "macOS Devices (4)", version: "macOS 15.3", lastPatch: "Mar 5, 2026", status: "current", severity: null },
  { system: "Network Firewall", version: "FW v7.1.2", lastPatch: "Feb 28, 2026", status: "pending", severity: "medium" },
  { system: "MDM Platform", version: "v12.4", lastPatch: "Mar 1, 2026", status: "current", severity: null },
];

const auditEvents = [
  { time: "Mar 11, 08:42", event: "5 failed StreamlineMD logins — IP: 192.168.1.45", type: "alert" },
  { time: "Mar 10, 17:30", event: "New admin account created — Google Workspace", type: "alert" },
  { time: "Mar 10, 14:15", event: "Bulk record access — 47 records by S. Mitchell", type: "info" },
  { time: "Mar 9, 09:00", event: "VPN session expired after 8hr — J. Torres", type: "info" },
  { time: "Mar 8, 16:45", event: "Remote wipe executed — Device: MBP-ML-001", type: "warn" },
  { time: "Mar 7, 11:20", event: "StreamlineMD patch applied — v4.2.1", type: "info" },
];

const statusIcon = (s: string) => {
  if (s === "ok") return <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />;
  if (s === "warn") return <AlertCircle size={13} className="text-amber-400 flex-shrink-0" />;
  return <XCircle size={13} className="text-red-400 flex-shrink-0" />;
};

export default function ComplianceTracker() {
  const overallScore = Math.round(controlAreas.reduce((s, c) => s + c.score, 0) / controlAreas.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Compliance Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time view of security controls, patch status, and audit log activity.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border">
          <ShieldCheck size={18} className="text-emerald-400" />
          <div>
            <p className="text-xs text-muted-foreground">Overall Score</p>
            <p className="text-xl font-bold text-emerald-400">{overallScore}%</p>
          </div>
        </div>
      </div>

      {/* Control areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {controlAreas.map((area) => (
          <Card key={area.area} className="bg-card border-border panel-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold">{area.area}</CardTitle>
                <span className={`text-sm font-bold font-mono ${area.score >= 95 ? "text-emerald-400" : area.score >= 85 ? "text-amber-400" : "text-red-400"}`}>
                  {area.score}%
                </span>
              </div>
              <Progress value={area.score} className="h-1 mt-1" />
            </CardHeader>
            <CardContent className="space-y-2">
              {area.controls.map((c) => (
                <div key={c.label} className="flex items-start gap-2">
                  {statusIcon(c.status)}
                  <span className="text-[11px] text-muted-foreground leading-snug">{c.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Patch status */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Patch & Vulnerability Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {patchStatus.map((p) => (
              <div key={p.system} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-xs font-medium">{p.system}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{p.version} · Patched {p.lastPatch}</p>
                </div>
                <div className="flex items-center gap-2">
                  {p.severity && <Badge className="bg-amber-500/15 text-amber-400 border-0 text-[9px]">{p.severity} pending</Badge>}
                  {p.status === "current"
                    ? <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-[10px]">Current</Badge>
                    : <Badge className="bg-amber-500/15 text-amber-400 border-0 text-[10px]">Pending</Badge>
                  }
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Audit log summary */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Audit Log — Recent Events</CardTitle>
            <p className="text-xs text-muted-foreground">StreamlineMD + network + endpoint events</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {auditEvents.map((e, i) => (
              <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-border last:border-0">
                {e.type === "alert" && <AlertCircle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />}
                {e.type === "warn" && <AlertCircle size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />}
                {e.type === "info" && <CheckCircle2 size={12} className="text-cyan-400 flex-shrink-0 mt-0.5" />}
                <div>
                  <p className="text-[11px] text-foreground leading-snug">{e.event}</p>
                  <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{e.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
