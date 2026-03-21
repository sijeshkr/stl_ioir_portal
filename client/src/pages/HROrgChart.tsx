// HROrgChart.tsx — STL IO|IR Portal
// Design: Dark Command Center — visual org chart using real staff roster from staffData.ts

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STAFF, displayName, ACCESS_LEVEL_LABEL, type StaffMember } from "@/lib/staffData";

// ─── Dept color map ───────────────────────────────────────────────────────────
const deptColor: Record<string, string> = {
  Leadership:             "text-cyan-400",
  Clinical:               "text-emerald-400",
  "Front Office":         "text-pink-400",
  "Business Development": "text-violet-400",
};

// ─── Org Node type ────────────────────────────────────────────────────────────
type OrgNode = StaffMember & { children: OrgNode[] };

// ─── Build org tree ───────────────────────────────────────────────────────────
function buildTree(): OrgNode {
  const root = STAFF.find(s => s.id === "kv001")!;

  const getChildren = (parentName: string): OrgNode[] =>
    STAFF
      .filter(s => s.reportsTo === parentName && s.id !== root.id)
      .map(s => ({ ...s, children: getChildren(displayName(s)) }));

  return { ...root, children: getChildren(displayName(root)) };
}

// ─── Org Card ─────────────────────────────────────────────────────────────────
function OrgCard({ node, level = 0 }: { node: OrgNode; level?: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-40 rounded-xl border border-border bg-card p-3 text-center shadow-sm hover:border-primary/40 transition-colors cursor-default ${level === 0 ? "border-primary/30 bg-primary/5" : ""}`}>
        <div className={`w-9 h-9 rounded-xl mx-auto flex items-center justify-center text-xs font-bold mb-2 ${node.avatarColor} text-white`}>
          {node.initials}
        </div>
        <p className="text-xs font-semibold leading-tight">{displayName(node)}</p>
        {node.designation && (
          <p className="text-[9px] font-mono text-primary mt-0.5">{node.designation}</p>
        )}
        <p className={`text-[10px] mt-0.5 ${deptColor[node.department] ?? "text-muted-foreground"}`}>
          {node.jobTitle}
        </p>
        <div className="flex items-center justify-center gap-1 mt-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${node.status === "active" ? "bg-emerald-400" : "bg-slate-400"}`} />
          <span className="text-[9px] text-muted-foreground capitalize">{node.status}</span>
        </div>
      </div>

      {/* Children */}
      {node.children.length > 0 && (
        <div className="flex flex-col items-center mt-0">
          <div className="w-px h-6 bg-border" />
          <div className="relative flex items-start gap-0">
            {node.children.length > 1 && (
              <div
                className="absolute top-0 h-px bg-border"
                style={{
                  left: `calc(50% - ${(node.children.length - 1) * 44}px)`,
                  width: `${(node.children.length - 1) * 88}px`,
                }}
              />
            )}
            {node.children.map(child => (
              <div key={child.id} className="flex flex-col items-center px-2.5">
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HROrgChart() {
  const tree = buildTree();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Org Chart</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Organizational hierarchy and reporting structure for STL IO|IR Clinics.
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(deptColor).map(([dept, color]) => (
          <div key={dept} className="flex items-center gap-1.5 text-xs">
            <span className={`font-bold ${color}`}>●</span>
            <span className="text-muted-foreground">{dept}</span>
          </div>
        ))}
      </div>

      {/* Visual tree */}
      <Card className="bg-card border-border overflow-x-auto">
        <CardContent className="p-8 flex justify-center" style={{ minWidth: "900px" }}>
          <OrgCard node={tree} />
        </CardContent>
      </Card>

      {/* Summary table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Name</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Title</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Department</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Reports To</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Access</th>
              </tr>
            </thead>
            <tbody>
              {STAFF.map(s => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold ${s.avatarColor} text-white flex-shrink-0`}>
                        {s.initials}
                      </div>
                      <span className="font-medium">{displayName(s)}</span>
                      {s.designation && <span className="text-[10px] font-mono text-primary">{s.designation}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.jobTitle}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${deptColor[s.department] ?? "text-muted-foreground"}`}>{s.department}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.reportsTo}</td>
                  <td className="px-4 py-3">
                    <Badge className="text-[10px] border-0 bg-primary/10 text-primary">
                      {ACCESS_LEVEL_LABEL[s.accessLevel]}
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
