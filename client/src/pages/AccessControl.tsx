// AccessControl.tsx — STL IO|IR Portal
// Design: Dark Command Center — access management table, pending requests, quarterly review

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock, ShieldAlert, Plus, Eye } from "lucide-react";
import { toast } from "sonner";

const users = [
  { id: 1, name: "Dr. K. Vaheesan", role: "Medical Director", streamline: "Admin", gws: "Admin", crm: "None", vpn: true, mfa: true, lastReview: "Mar 2026" },
  { id: 2, name: "Sarah Mitchell", role: "Nurse Practitioner", streamline: "Clinical", gws: "Standard", crm: "None", vpn: true, mfa: true, lastReview: "Mar 2026" },
  { id: 3, name: "James Torres", role: "Front Office", streamline: "Scheduling", gws: "Standard", crm: "None", vpn: false, mfa: true, lastReview: "Mar 2026" },
  { id: 4, name: "Priya Kapoor", role: "Billing Admin", streamline: "Billing", gws: "Standard", crm: "None", vpn: false, mfa: true, lastReview: "Mar 2026" },
  { id: 5, name: "Marcus Lee", role: "Nurse Practitioner", streamline: "Clinical", gws: "Standard", crm: "None", vpn: true, mfa: true, lastReview: "Mar 2026" },
  { id: 6, name: "Angela Chen", role: "Clinical Coordinator", streamline: "Pending", gws: "Standard", crm: "None", vpn: false, mfa: false, lastReview: "—" },
  { id: 7, name: "David Park", role: "Contractor (Biz Dev)", streamline: "None", gws: "Limited", crm: "Full", vpn: false, mfa: true, lastReview: "Feb 2026" },
];

const pendingRequests = [
  { id: 1, requester: "Angela Chen", system: "StreamlineMD", level: "Clinical", requestedBy: "COO", date: "Mar 11, 2026", status: "pending" },
  { id: 2, requester: "David Park", system: "Google Drive — Clinical Folder", level: "Read-Only", requestedBy: "Biz Dev Lead", date: "Mar 10, 2026", status: "pending" },
  { id: 3, requester: "Temp Staff: R. Nguyen", system: "StreamlineMD", level: "Scheduling", requestedBy: "Front Office Mgr", date: "Mar 9, 2026", status: "review" },
];

const accessColor = (level: string) => {
  if (level === "Admin") return "bg-red-500/15 text-red-400";
  if (level === "Clinical") return "bg-cyan-500/15 text-cyan-400";
  if (level === "Full") return "bg-amber-500/15 text-amber-400";
  if (level === "None" || level === "—") return "bg-muted text-muted-foreground";
  if (level === "Pending") return "bg-amber-500/15 text-amber-400";
  return "bg-emerald-500/15 text-emerald-400";
};

export default function AccessControl() {
  const [requests, setRequests] = useState(pendingRequests);

  const approve = (id: number) => {
    setRequests((r) => r.filter((req) => req.id !== id));
    toast.success("Access request approved and provisioned.");
  };

  const deny = (id: number) => {
    setRequests((r) => r.filter((req) => req.id !== id));
    toast.error("Access request denied.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Access Control</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage system access, review pending requests, and conduct quarterly access reviews.</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => toast.info("Access request form coming soon.")}>
          <Plus size={14} /> New Request
        </Button>
      </div>

      {/* Pending requests */}
      {requests.length > 0 && (
        <Card className="bg-amber-500/5 border-amber-400/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-amber-400 flex items-center gap-2">
              <ShieldAlert size={14} /> Pending Access Requests ({requests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-card border border-border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{req.requester}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Requesting <span className="text-foreground font-medium">{req.level}</span> access to <span className="text-foreground font-medium">{req.system}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">Requested by {req.requestedBy} · {req.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-muted-foreground" onClick={() => toast.info("Review details coming soon.")}>
                    <Eye size={11} /> Review
                  </Button>
                  <Button size="sm" className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0" onClick={() => approve(req.id)}>
                    <CheckCircle2 size={11} /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" className="h-7 text-xs gap-1" onClick={() => deny(req.id)}>
                    <XCircle size={11} /> Deny
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="users">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="users">User Access Matrix</TabsTrigger>
          <TabsTrigger value="review">Quarterly Review</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Staff Member</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">StreamlineMD</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Google WS</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">CRM</th>
                      <th className="text-center px-4 py-3 text-muted-foreground font-medium">VPN</th>
                      <th className="text-center px-4 py-3 text-muted-foreground font-medium">MFA</th>
                      <th className="text-left px-4 py-3 text-muted-foreground font-medium">Last Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} className={`border-b border-border last:border-0 hover:bg-accent/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{u.name}</p>
                            <p className="text-muted-foreground text-[10px]">{u.role}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`text-[10px] border-0 ${accessColor(u.streamline)}`}>{u.streamline}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`text-[10px] border-0 ${accessColor(u.gws)}`}>{u.gws}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`text-[10px] border-0 ${accessColor(u.crm)}`}>{u.crm}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {u.vpn ? <CheckCircle2 size={14} className="text-emerald-400 mx-auto" /> : <XCircle size={14} className="text-muted-foreground mx-auto" />}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {u.mfa ? <CheckCircle2 size={14} className="text-emerald-400 mx-auto" /> : <XCircle size={14} className="text-red-400 mx-auto" />}
                        </td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">{u.lastReview}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quarterly Access Review — Q1 2026</CardTitle>
              <p className="text-xs text-muted-foreground">COO must review all active StreamlineMD accounts quarterly per Section 10.1</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { check: "All active StreamlineMD accounts verified", status: "done" },
                  { check: "Departed/role-changed staff deactivated within 4 hours", status: "done" },
                  { check: "Vendor access logs reviewed", status: "pending" },
                  { check: "BYOD compliance status verified for all enrolled devices", status: "pending" },
                  { check: "Service account credentials rotated", status: "done" },
                  { check: "MFA enrollment confirmed for all mandatory systems", status: "warn" },
                ].map((item) => (
                  <div key={item.check} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm">{item.check}</span>
                    <div className="flex items-center gap-2">
                      {item.status === "done" && <><CheckCircle2 size={14} className="text-emerald-400" /><span className="text-xs text-emerald-400">Complete</span></>}
                      {item.status === "pending" && <><Clock size={14} className="text-amber-400" /><span className="text-xs text-amber-400">Pending</span></>}
                      {item.status === "warn" && <><ShieldAlert size={14} className="text-red-400" /><span className="text-xs text-red-400">Action Required</span></>}
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4 w-full" variant="outline" onClick={() => toast.success("Review submitted and logged.")}>
                Submit Quarterly Review
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
