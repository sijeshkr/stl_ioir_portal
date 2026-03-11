// HROrgChart.tsx — STL IO|IR Portal
// Design: Dark Command Center — visual org chart with role hierarchy

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { staffData } from "./HRPeople";

type OrgNode = {
  id: number;
  name: string;
  initials: string;
  role: string;
  department: string;
  color: string;
  type: string;
  status: string;
  children?: OrgNode[];
};

// Build org tree
const buildTree = (): OrgNode => {
  const dr = staffData.find(s => s.id === 1)!;
  return {
    ...dr,
    children: staffData
      .filter(s => s.reportsTo === "Dr. Karthik Vaheesan")
      .map(s => ({ ...s, children: [] })),
  };
};

const deptColor: Record<string, string> = {
  Clinical: "text-cyan-400",
  Administration: "text-amber-400",
  Finance: "text-purple-400",
  "Business Development": "text-blue-400",
};

function OrgCard({ node, level = 0 }: { node: OrgNode; level?: number }) {
  const statusColors: Record<string, string> = {
    active: "bg-emerald-400",
    onboarding: "bg-cyan-400",
    leave: "bg-amber-400",
    inactive: "bg-slate-400",
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`relative group`}>
        <div className={`w-44 rounded-xl border border-border bg-card p-3 text-center shadow-sm hover:border-primary/40 transition-colors cursor-default ${level === 0 ? "border-primary/30 bg-primary/5" : ""}`}>
          <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center text-sm font-bold mb-2 ${node.color}`}>
            {node.initials}
          </div>
          <p className="text-xs font-semibold leading-tight">{node.name}</p>
          <p className={`text-[10px] mt-0.5 ${deptColor[node.department] ?? "text-muted-foreground"}`}>{node.role.split("/")[0].trim()}</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className={`w-1.5 h-1.5 rounded-full ${statusColors[node.status]}`} />
            <span className="text-[9px] text-muted-foreground capitalize">{node.status}</span>
            {node.type === "contractor" && (
              <Badge className="text-[8px] border-0 bg-slate-500/15 text-slate-400 px-1 py-0 h-3">Contractor</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {node.children && node.children.length > 0 && (
        <div className="flex flex-col items-center mt-0">
          {/* Vertical connector */}
          <div className="w-px h-6 bg-border" />
          {/* Horizontal bar */}
          <div className="relative flex items-start gap-0">
            {node.children.length > 1 && (
              <div
                className="absolute top-0 left-0 right-0 h-px bg-border"
                style={{ left: `calc(50% - ${(node.children.length - 1) * 48}px)`, right: `calc(50% - ${(node.children.length - 1) * 48}px)`, width: `${(node.children.length - 1) * 96}px`, marginLeft: "auto", marginRight: "auto" }}
              />
            )}
            {node.children.map((child, i) => (
              <div key={child.id} className="flex flex-col items-center px-3">
                <div className="w-px h-6 bg-border" />
                <OrgCard node={child} level={level + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HROrgChart() {
  const tree = buildTree();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Org Chart</h1>
        <p className="text-sm text-muted-foreground mt-1">Organizational hierarchy and reporting structure for STL IO|IR Clinics.</p>
      </div>

      {/* Department legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(deptColor).map(([dept, color]) => (
          <div key={dept} className="flex items-center gap-1.5 text-xs">
            <span className={`font-medium ${color}`}>●</span>
            <span className="text-muted-foreground">{dept}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs ml-4 pl-4 border-l border-border">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-muted-foreground">Active</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 ml-2" />
          <span className="text-muted-foreground">Onboarding</span>
        </div>
      </div>

      <Card className="bg-card border-border overflow-x-auto">
        <CardContent className="p-8 flex justify-center min-w-[800px]">
          <OrgCard node={tree} />
        </CardContent>
      </Card>

      {/* Summary table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Name</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Role</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Department</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Reports To</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {staffData.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.role.split("/")[0].trim()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${deptColor[s.department] ?? "text-muted-foreground"}`}>{s.department}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.reportsTo}</td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[10px] border-0 ${s.type === "employee" ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>
                      {s.type === "employee" ? "Employee" : "Contractor"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
