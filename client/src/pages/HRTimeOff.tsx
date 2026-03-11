// HRTimeOff.tsx — STL IO|IR Portal
// Design: Dark Command Center — leave requests, approval workflow, balance tracker

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock, Plus, Calendar, Sun } from "lucide-react";
import { toast } from "sonner";

const leaveRequests = [
  { id: 1, name: "Sarah Mitchell", type: "PTO", from: "Mar 20, 2026", to: "Mar 21, 2026", days: 2, status: "pending", note: "Personal appointment" },
  { id: 2, name: "James Torres", type: "Sick", from: "Mar 11, 2026", to: "Mar 11, 2026", days: 1, status: "approved", note: "" },
  { id: 3, name: "Marcus Lee", type: "PTO", from: "Apr 7, 2026", to: "Apr 11, 2026", days: 5, status: "pending", note: "Family vacation" },
  { id: 4, name: "Priya Kapoor", type: "CME", from: "Apr 14, 2026", to: "Apr 16, 2026", days: 3, status: "approved", note: "AAPC Annual Conference" },
];

const balances = [
  { name: "Sarah Mitchell", pto: 18, sick: 8, cme: 40, used_pto: 4, used_sick: 1, used_cme: 8 },
  { name: "James Torres", pto: 10, sick: 8, cme: 0, used_pto: 2, used_sick: 2, used_cme: 0 },
  { name: "Priya Kapoor", pto: 15, sick: 8, cme: 20, used_pto: 3, used_sick: 0, used_cme: 8 },
  { name: "Marcus Lee", pto: 12, sick: 8, cme: 40, used_pto: 0, used_sick: 0, used_cme: 0 },
  { name: "Dr. K. Vaheesan", pto: 20, sick: 10, cme: 80, used_pto: 2, used_sick: 0, used_cme: 16 },
];

const typeConfig: Record<string, string> = {
  PTO: "bg-cyan-500/15 text-cyan-400",
  Sick: "bg-amber-500/15 text-amber-400",
  CME: "bg-purple-500/15 text-purple-400",
  FMLA: "bg-blue-500/15 text-blue-400",
};

export default function HRTimeOff() {
  const [requests, setRequests] = useState(leaveRequests);

  const approve = (id: number) => {
    setRequests(r => r.map(req => req.id === id ? { ...req, status: "approved" } : req));
    toast.success("Leave request approved.");
  };
  const deny = (id: number) => {
    setRequests(r => r.map(req => req.id === id ? { ...req, status: "denied" } : req));
    toast.error("Leave request denied.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Time Off & Leave</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage PTO, sick leave, and CME leave requests and balances.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Leave request form — coming soon.")}>
          <Plus size={13} /> Request Leave
        </Button>
      </div>

      <Tabs defaultValue="requests">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="balances">Leave Balances</TabsTrigger>
          <TabsTrigger value="calendar">Team Calendar</TabsTrigger>
        </TabsList>

        {/* Requests */}
        <TabsContent value="requests" className="mt-4 space-y-3">
          {requests.map((req) => (
            <Card key={req.id} className="bg-card border-border panel-hover">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sun size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{req.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge className={`text-[10px] border-0 ${typeConfig[req.type] ?? "bg-muted text-muted-foreground"}`}>{req.type}</Badge>
                      <span className="text-xs text-muted-foreground font-mono">{req.from} → {req.to}</span>
                      <span className="text-xs text-muted-foreground">({req.days} day{req.days !== 1 ? "s" : ""})</span>
                    </div>
                    {req.note && <p className="text-[10px] text-muted-foreground mt-0.5">{req.note}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {req.status === "pending" ? (
                    <>
                      <Button size="sm" className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0" onClick={() => approve(req.id)}>
                        <CheckCircle2 size={11} /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="h-7 text-xs gap-1" onClick={() => deny(req.id)}>
                        <XCircle size={11} /> Deny
                      </Button>
                    </>
                  ) : req.status === "approved" ? (
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-0">Approved</Badge>
                  ) : (
                    <Badge className="bg-red-500/15 text-red-400 border-0">Denied</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Balances */}
        <TabsContent value="balances" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Leave Balances — 2026</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Staff Member</th>
                    <th className="text-center px-4 py-3 text-muted-foreground font-medium">PTO Remaining</th>
                    <th className="text-center px-4 py-3 text-muted-foreground font-medium">Sick Remaining</th>
                    <th className="text-center px-4 py-3 text-muted-foreground font-medium">CME (hrs)</th>
                  </tr>
                </thead>
                <tbody>
                  {balances.map((b) => (
                    <tr key={b.name} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{b.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono font-semibold text-cyan-400">{b.pto - b.used_pto}</span>
                        <span className="text-muted-foreground"> / {b.pto} days</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono font-semibold text-amber-400">{b.sick - b.used_sick}</span>
                        <span className="text-muted-foreground"> / {b.sick} days</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {b.cme > 0 ? (
                          <>
                            <span className="font-mono font-semibold text-purple-400">{b.cme - b.used_cme}</span>
                            <span className="text-muted-foreground"> / {b.cme} hrs</span>
                          </>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar */}
        <TabsContent value="calendar" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar size={14} /> March–April 2026 — Approved Leave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {requests.filter(r => r.status === "approved").map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                    <div className="w-2 h-8 rounded-full bg-cyan-400/60 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{r.from} — {r.to} · {r.days} day{r.days !== 1 ? "s" : ""}</p>
                    </div>
                    <Badge className={`ml-auto text-[10px] border-0 ${typeConfig[r.type]}`}>{r.type}</Badge>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground text-center pt-2">Full calendar view available after backend integration.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
