// Onboarding.tsx — STL IO|IR Portal
// Design: Dark Command Center — new hire onboarding workflow, step-by-step checklist

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, User, AlertCircle } from "lucide-react";

const newHires = [
  {
    id: 1,
    name: "Angela Chen",
    role: "Clinical Coordinator",
    startDate: "Mar 10, 2026",
    progress: 25,
    daysIn: 1,
    steps: [
      { id: 1, label: "IT Security Onboarding (Day 1)", done: true, due: "Day 1" },
      { id: 2, label: "Password Setup & MFA Enrollment", done: true, due: "Day 1" },
      { id: 3, label: "Device Enrolled in MDM", done: false, due: "Day 1" },
      { id: 4, label: "HIPAA Privacy & Security Training", done: false, due: "Day 14" },
      { id: 5, label: "Phishing Awareness Training", done: false, due: "Day 14" },
      { id: 6, label: "AI Tool Usage & PHI Prohibition", done: false, due: "Day 14" },
      { id: 7, label: "StreamlineMD Access Provisioned", done: false, due: "Day 3" },
      { id: 8, label: "IT Policy v1.1 Acknowledgment", done: false, due: "Day 14" },
    ],
  },
];

const onboardingSteps = [
  {
    phase: "Day 1 — Immediate",
    color: "text-cyan-400",
    border: "border-cyan-400/30",
    bg: "bg-cyan-400/5",
    items: [
      { label: "IT Security Onboarding module", required: true },
      { label: "Password setup with approved password manager", required: true },
      { label: "MFA enrollment on all mandatory systems", required: true },
      { label: "Device MDM enrollment", required: true },
      { label: "Clean desk & physical security briefing", required: true },
    ],
  },
  {
    phase: "Day 3 — System Access",
    color: "text-emerald-400",
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/5",
    items: [
      { label: "StreamlineMD account provisioned by COO", required: true },
      { label: "Role-based access configured (RBAC)", required: true },
      { label: "Google Workspace account activated", required: true },
      { label: "CRM access (if applicable — Biz Dev only)", required: false },
    ],
  },
  {
    phase: "Day 14 — Training Completion",
    color: "text-amber-400",
    border: "border-amber-400/30",
    bg: "bg-amber-400/5",
    items: [
      { label: "HIPAA Privacy & Security Fundamentals", required: true },
      { label: "Phishing Awareness training", required: true },
      { label: "Incident Reporting Procedures", required: true },
      { label: "AI Tool Usage & PHI Prohibition", required: true },
      { label: "IT Policy v1.1 digital acknowledgment", required: true },
    ],
  },
  {
    phase: "Day 30 — Full Compliance",
    color: "text-purple-400",
    border: "border-purple-400/30",
    bg: "bg-purple-400/5",
    items: [
      { label: "Ransomware Recognition & Response", required: true },
      { label: "Data Classification & Handling", required: true },
      { label: "StreamlineMD Secure Use training", required: true },
      { label: "BYOD policy acknowledgment (if applicable)", required: false },
    ],
  },
];

export default function Onboarding() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Onboarding</h1>
          <p className="text-sm text-muted-foreground mt-1">New hire IT security onboarding workflow and compliance checklist.</p>
        </div>
        <Button size="sm" className="gap-2">
          <User size={14} /> Add New Hire
        </Button>
      </div>

      {/* Active onboarding */}
      {newHires.map((hire) => (
        <Card key={hire.id} className="bg-card border-border panel-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-400/15 flex items-center justify-center">
                  <span className="text-cyan-400 text-sm font-bold">{hire.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{hire.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{hire.role} · Started {hire.startDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-cyan-500/15 text-cyan-400 border-0 text-[10px]">Day {hire.daysIn}</Badge>
                <span className="text-xs font-mono text-muted-foreground">{hire.progress}% complete</span>
              </div>
            </div>
            <Progress value={hire.progress} className="h-1.5 mt-3" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hire.steps.map((step) => (
                <div key={step.id} className="flex items-center gap-2.5 py-1.5">
                  {step.done
                    ? <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                    : <Circle size={14} className="text-muted-foreground flex-shrink-0" />
                  }
                  <span className={`text-xs ${step.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{step.label}</span>
                  <span className="text-[10px] text-muted-foreground font-mono ml-auto flex-shrink-0">{step.due}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Onboarding timeline */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Standard Onboarding Timeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {onboardingSteps.map((phase) => (
            <Card key={phase.phase} className={`bg-card border ${phase.border} ${phase.bg} panel-hover`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-xs font-bold uppercase tracking-wider ${phase.color}`}>{phase.phase}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {phase.items.map((item) => (
                  <div key={item.label} className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${phase.color.replace("text-", "bg-")}`} />
                    <div className="flex-1">
                      <span className="text-xs text-foreground leading-snug">{item.label}</span>
                      {!item.required && (
                        <span className="text-[9px] text-muted-foreground ml-1">(if applicable)</span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Policy note */}
      <Card className="bg-amber-500/5 border-amber-400/20">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-400">Access Suspension Policy</p>
            <p className="text-xs text-muted-foreground mt-1">
              Staff who do not complete mandatory training within the required window may have system access suspended automatically.
              StreamlineMD accounts must be deactivated within <span className="font-mono text-foreground">4 hours</span> of an employee's departure or role change.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
