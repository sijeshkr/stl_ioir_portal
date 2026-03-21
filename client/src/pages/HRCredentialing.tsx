// HRCredentialing.tsx — STL IO|IR Portal
// Design: Dark Command Center — real staff credentialing tracker with client's exact fields
// Fields: Birthday, MD (MO) exp, RN exp, CCRN Cert, ARRT exp, BLS Exp, ACLS Exp, PALS Exp, HIPAA Exp, BB Path Exp

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Search, AlertTriangle, CheckCircle2, Clock, Download,
  RefreshCw, Award, ChevronRight, Bell,
} from "lucide-react";
import { toast } from "sonner";
import {
  STAFF, displayName, expiryStatus, EXPIRY_STYLE, type StaffMember, type ExpiryStatus,
} from "@/lib/staffData";

// ─── Cert column definitions (matching client's spreadsheet exactly) ──────────
type CertKey = keyof StaffMember["certs"];

const CERT_COLUMNS: { key: CertKey; label: string; shortLabel: string }[] = [
  { key: "mdMoExp",   label: "MD (MO) License Exp",  shortLabel: "MD (MO)" },
  { key: "rnExp",     label: "RN License Exp",        shortLabel: "RN Exp" },
  { key: "ccrnCert",  label: "CCRN Cert",             shortLabel: "CCRN" },
  { key: "arrtExp",   label: "ARRT Exp",              shortLabel: "ARRT" },
  { key: "blsExp",    label: "BLS Exp",               shortLabel: "BLS" },
  { key: "aclsExp",   label: "ACLS Exp",              shortLabel: "ACLS" },
  { key: "palsExp",   label: "PALS Exp",              shortLabel: "PALS" },
  { key: "hipaaExp",  label: "HIPAA Training Exp",    shortLabel: "HIPAA" },
  { key: "bbPathExp", label: "BB Path Exp",           shortLabel: "BB Path" },
];

// ─── Cert Cell ────────────────────────────────────────────────────────────────
function CertCell({ value }: { value?: string }) {
  const status: ExpiryStatus = expiryStatus(value);
  const style = EXPIRY_STYLE[status];

  if (!value) {
    return <span className="text-muted-foreground text-[11px]">—</span>;
  }

  const isNote = value.toLowerCase().includes("enrolled") ||
    value.toLowerCase().includes("approved") ||
    value.toLowerCase().includes("for ") ||
    value === "req";

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
        <span className={`text-[11px] font-mono ${
          status === "expired" ? "text-red-400" :
          status === "expiring_soon" ? "text-amber-400" :
          status === "valid" ? "text-emerald-400" :
          status === "na" ? "text-slate-500" :
          "text-blue-400"
        }`}>
          {value === "n/a" ? "N/A" : value}
        </span>
      </div>
      {isNote && (
        <span className="text-[9px] text-muted-foreground leading-tight pl-2.5 max-w-[100px]">{value}</span>
      )}
    </div>
  );
}

// ─── Staff Detail Modal ───────────────────────────────────────────────────────
function StaffCertModal({ staff, onClose }: { staff: StaffMember; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${staff.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {staff.initials}
            </div>
            <div>
              <DialogTitle className="text-base">{displayName(staff)}</DialogTitle>
              <p className="text-xs text-muted-foreground">{staff.jobTitle} · {staff.department}</p>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-1 mt-2">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-xs text-muted-foreground">Birthday</span>
            <span className="text-xs font-mono">{staff.birthday}</span>
          </div>
          {CERT_COLUMNS.map(col => {
            const val = staff.certs[col.key];
            const status = expiryStatus(val);
            const style = EXPIRY_STYLE[status];
            return (
              <div key={col.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground">{col.label}</span>
                <div className="flex items-center gap-2">
                  {val ? (
                    <>
                      <Badge className={`text-[10px] ${style.className}`}>{style.label}</Badge>
                      <span className="text-xs font-mono">{val === "n/a" ? "N/A" : val}</span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not on file</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 mt-2 pt-3 border-t border-border">
          <Button size="sm" variant="outline" className="flex-1 text-xs gap-1" onClick={() => toast.info("Send renewal reminder — coming soon.")}>
            <Bell size={12} /> Send Reminder
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs gap-1" onClick={() => toast.info("Upload credential — coming soon.")}>
            <Download size={12} /> Upload Credential
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HRCredentialing() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<StaffMember | null>(null);

  const filtered = STAFF.filter(s =>
    displayName(s).toLowerCase().includes(search.toLowerCase()) ||
    s.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  // Compute alert counts across all cert fields
  const allCertValues = STAFF.flatMap(s => CERT_COLUMNS.map(c => s.certs[c.key]));
  const expiredCount = allCertValues.filter(v => expiryStatus(v) === "expired").length;
  const expiringSoonCount = allCertValues.filter(v => expiryStatus(v) === "expiring_soon").length;
  const pendingCount = allCertValues.filter(v => expiryStatus(v) === "pending").length;
  const naCount = allCertValues.filter(v => expiryStatus(v) === "na").length;

  // Staff with at least one expired or expiring cert
  const staffWithIssues = STAFF.filter(s =>
    CERT_COLUMNS.some(c => {
      const st = expiryStatus(s.certs[c.key]);
      return st === "expired" || st === "expiring_soon";
    })
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Credentialing</h1>
          <p className="text-sm text-muted-foreground mt-1">
            License and certification tracker for all STL IO|IR staff.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => toast.info("Export to CSV — coming soon.")}>
            <Download size={13} /> Export
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => toast.info("Send all renewal reminders — coming soon.")}>
            <Bell size={13} /> Send Reminders
          </Button>
        </div>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Expired",       value: expiredCount,      icon: AlertTriangle, color: "text-red-400",     bg: "bg-red-400/10" },
          { label: "Expiring Soon", value: expiringSoonCount, icon: Clock,         color: "text-amber-400",   bg: "bg-amber-400/10" },
          { label: "Pending / Req", value: pendingCount,      icon: RefreshCw,     color: "text-blue-400",    bg: "bg-blue-400/10" },
          { label: "N/A Fields",    value: naCount,           icon: CheckCircle2,  color: "text-slate-400",   bg: "bg-slate-400/10" },
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

      {/* Alerts panel */}
      {staffWithIssues.length > 0 && (
        <Card className="bg-card border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-400">
              <AlertTriangle size={14} /> Action Required — Expired or Expiring Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {staffWithIssues.map(s => {
              const issues = CERT_COLUMNS.filter(c => {
                const st = expiryStatus(s.certs[c.key]);
                return st === "expired" || st === "expiring_soon";
              });
              return (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${s.avatarColor} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                      {s.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{displayName(s)}</p>
                      <p className="text-[10px] text-muted-foreground">{s.jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {issues.map(c => {
                      const st = expiryStatus(s.certs[c.key]);
                      return (
                        <Badge key={c.key} className={`text-[9px] ${EXPIRY_STYLE[st].className}`}>
                          {c.shortLabel}: {st === "expired" ? "Expired" : "Expiring Soon"}
                        </Badge>
                      );
                    })}
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setSelected(s)}>
                      <ChevronRight size={12} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Search + Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative max-w-sm flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search staff…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs bg-card border-border"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap text-[11px] text-muted-foreground">
          {Object.entries(EXPIRY_STYLE).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${val.dot}`} />
              <span>{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main credentialing grid */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ minWidth: "1200px" }}>
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium sticky left-0 bg-background/95 z-10" style={{ minWidth: "200px" }}>
                    Staff Member
                  </th>
                  <th className="text-left px-3 py-3 text-muted-foreground font-medium" style={{ minWidth: "70px" }}>
                    Birthday
                  </th>
                  {CERT_COLUMNS.map(col => (
                    <th key={col.key} className="text-left px-3 py-3 text-muted-foreground font-medium" style={{ minWidth: "115px" }}>
                      {col.shortLabel}
                    </th>
                  ))}
                  <th className="text-center px-3 py-3 text-muted-foreground font-medium" style={{ minWidth: "60px" }}>
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr
                    key={s.id}
                    className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors group"
                  >
                    {/* Name */}
                    <td className="px-4 py-3 sticky left-0 bg-card group-hover:bg-accent/20 transition-colors z-10">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg ${s.avatarColor} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                          {s.initials}
                        </div>
                        <div>
                          <p className="font-semibold leading-tight">{displayName(s)}</p>
                          <p className="text-[10px] text-muted-foreground">{s.designation || s.jobTitle}</p>
                        </div>
                      </div>
                    </td>
                    {/* Birthday */}
                    <td className="px-3 py-3 font-mono text-muted-foreground">{s.birthday}</td>
                    {/* Cert columns */}
                    {CERT_COLUMNS.map(col => (
                      <td key={col.key} className="px-3 py-3">
                        <CertCell value={s.certs[col.key]} />
                      </td>
                    ))}
                    {/* Detail */}
                    <td className="px-3 py-3 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setSelected(s)}
                      >
                        <ChevronRight size={13} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Staff cert detail modal */}
      {selected && (
        <StaffCertModal staff={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
