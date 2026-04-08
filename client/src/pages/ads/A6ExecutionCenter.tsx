import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAdsClient, ClientSelector } from "@/contexts/AdsClientContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ClipboardList, History, MinusCircle, CheckSquare, Plus, Trash2 } from "lucide-react";

export default function A6ExecutionCenter() {
  const { selectedClientId } = useAdsClient();
  const [activeTab, setActiveTab] = useState("taskqueue");
  const [newKeyword, setNewKeyword] = useState("");
  const [matchType, setMatchType] = useState<"EXACT" | "PHRASE" | "BROAD">("EXACT");

  const { data: opsLog } = trpc.ads.getOpsLog.useQuery({ clientId: selectedClientId });
  const { data: negKws, refetch: refetchNeg } = trpc.ads.getNegativeKeywords.useQuery({ clientId: selectedClientId });
  const { data: decisions } = trpc.ads.getStrategyDecisions.useQuery({ clientId: selectedClientId });

  const addNegKw = trpc.ads.addNegativeKeyword.useMutation({
    onSuccess: () => { refetchNeg(); setNewKeyword(""); toast.success("Negative keyword added"); },
    onError: () => toast.error("Failed to add keyword"),
  });

  const approvedDecisions = decisions?.filter(d => d.status === "APPROVED") ?? [];

  const prelaunchChecks = [
    { label: "Conversion tracking verified", done: true },
    { label: "GCLID passing on all landing pages", done: true },
    { label: "Negative keyword list applied", done: (negKws?.length ?? 0) > 0 },
    { label: "Ad copy HIPAA reviewed", done: true },
    { label: "Budget caps set on all campaigns", done: true },
    { label: "Geo targeting configured", done: true },
    { label: "Ad schedule set", done: false },
    { label: "Audience exclusions applied", done: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Execution Center</h1>
          <p className="text-sm text-slate-400 mt-0.5">A6 · Task queue, change log, negative keywords, pre-launch audit</p>
        </div>
        <ClientSelector />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0d1117] border border-slate-800">
          <TabsTrigger value="taskqueue" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <ClipboardList className="w-3.5 h-3.5 mr-1.5" /> Task Queue
          </TabsTrigger>
          <TabsTrigger value="changelog" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <History className="w-3.5 h-3.5 mr-1.5" /> Change Log
          </TabsTrigger>
          <TabsTrigger value="negkw" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <MinusCircle className="w-3.5 h-3.5 mr-1.5" /> Negative Keywords
          </TabsTrigger>
          <TabsTrigger value="prelaunch" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <CheckSquare className="w-3.5 h-3.5 mr-1.5" /> Pre-Launch Audit
          </TabsTrigger>
        </TabsList>

        {/* Task Queue — approved decisions ready to execute */}
        <TabsContent value="taskqueue" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Approved Tasks Ready for Execution</CardTitle>
            </CardHeader>
            <CardContent>
              {approvedDecisions.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-6">No approved tasks pending execution. Approve decisions in the Strategy Workspace to populate this queue.</p>
              ) : (
                <div className="space-y-2">
                  {approvedDecisions.map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-emerald-500/20">
                      <div>
                        <p className="text-sm text-white">{d.title}</p>
                        <p className="text-xs text-slate-400">{d.category.replace("_", " ")} · Approved</p>
                      </div>
                      <Button size="sm" className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 h-7 px-3 text-xs">
                        Mark Executed
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Change Log */}
        <TabsContent value="changelog" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Change Log</CardTitle>
            </CardHeader>
            <CardContent>
              {!opsLog || opsLog.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-6">No changes logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {opsLog.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 p-3 rounded bg-slate-900/50 border border-slate-800">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-white font-medium">{entry.action}</p>
                          <span className="text-xs text-slate-500">{new Date(entry.executedAt).toLocaleDateString()}</span>
                        </div>
                        {entry.afterState && <p className="text-xs text-slate-400 mt-0.5">{JSON.stringify(entry.afterState).slice(0, 100)}</p>}
                        {entry.reasonCode && <Badge className="mt-1 text-xs bg-slate-700 text-slate-400">{entry.reasonCode}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Negative Keywords */}
        <TabsContent value="negkw" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-slate-300">Negative Keyword Manager</CardTitle>
                <Badge className="bg-slate-800 text-slate-300">{negKws?.length ?? 0} keywords</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Enter negative keyword..."
                  className="text-xs bg-slate-900 border-slate-700 text-slate-300"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newKeyword.trim()) {
                      addNegKw.mutate({ clientId: selectedClientId, keyword: newKeyword.trim(), matchType, level: "CAMPAIGN" });
                    }
                  }}
                />
                <Select value={matchType} onValueChange={(v) => setMatchType(v as "EXACT" | "PHRASE" | "BROAD")}>
                  <SelectTrigger className="w-28 text-xs bg-slate-900 border-slate-700 text-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXACT">Exact</SelectItem>
                    <SelectItem value="PHRASE">Phrase</SelectItem>
                    <SelectItem value="BROAD">Broad</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white gap-1"
                  onClick={() => {
                    if (newKeyword.trim()) {
                      addNegKw.mutate({ clientId: selectedClientId, keyword: newKeyword.trim(), matchType, level: "CAMPAIGN" });
                    }
                  }}
                  disabled={addNegKw.isPending}
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </div>
              <div className="space-y-1.5">
                {negKws?.map((kw) => (
                  <div key={kw.id} className="flex items-center justify-between p-2.5 rounded bg-slate-900/50 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs bg-red-500/10 text-red-400 border-red-500/20">−</Badge>
                      <span className="text-xs text-slate-300">{kw.keyword}</span>
                      <Badge className="text-xs bg-slate-700 text-slate-400">{kw.matchType}</Badge>
                      <Badge className="text-xs bg-slate-800 text-slate-500">{kw.level}</Badge>
                    </div>
                    {kw.reason && <span className="text-xs text-slate-500">{kw.reason}</span>}
                  </div>
                ))}
                {(!negKws || negKws.length === 0) && (
                  <p className="text-sm text-slate-500 italic text-center py-4">No negative keywords added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pre-Launch Audit */}
        <TabsContent value="prelaunch" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-slate-300">Pre-Launch Audit Checklist</CardTitle>
                <Badge className={`text-xs ${prelaunchChecks.filter(c => c.done).length === prelaunchChecks.length ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                  {prelaunchChecks.filter(c => c.done).length}/{prelaunchChecks.length} Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {prelaunchChecks.map((check, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${check.done ? "border-emerald-500/20 bg-emerald-500/5" : "border-slate-800 bg-slate-900/30"}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${check.done ? "border-emerald-500 bg-emerald-500" : "border-slate-600"}`}>
                      {check.done && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`text-sm ${check.done ? "text-slate-300" : "text-slate-400"}`}>{check.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
