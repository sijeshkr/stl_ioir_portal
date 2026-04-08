import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAdsClient, ClientSelector } from "@/contexts/AdsClientContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Activity, AlertTriangle, TrendingUp, Search, DollarSign,
  CheckCircle, XCircle, Clock, Zap, Brain
} from "lucide-react";

const SIGNAL_STATUS: Record<string, { color: string; icon: React.ReactNode }> = {
  HEALTHY: { color: "text-emerald-400", icon: <CheckCircle className="w-4 h-4 text-emerald-400" /> },
  WARNING: { color: "text-amber-400", icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
  CRITICAL: { color: "text-red-400", icon: <XCircle className="w-4 h-4 text-red-400" /> },
  UNKNOWN: { color: "text-slate-400", icon: <Clock className="w-4 h-4 text-slate-400" /> },
};

const INTENT_BADGE: Record<string, string> = {
  crisis_intent: "bg-red-500/20 text-red-400",
  transactional: "bg-cyan-500/20 text-cyan-400",
  research_intent: "bg-purple-500/20 text-purple-400",
  irrelevant: "bg-slate-700 text-slate-400",
};

export default function A2IntelligenceHub() {
  const { selectedClientId } = useAdsClient();
  const [activeTab, setActiveTab] = useState("signals");

  const { data: signals } = trpc.ads.getSignalHealth.useQuery({ clientId: selectedClientId });
  const { data: pacing } = trpc.ads.getBudgetPacing.useQuery({ clientId: selectedClientId });
  const { data: alerts } = trpc.ads.getAgentOutputs.useQuery({ clientId: selectedClientId });
  const { data: searchTermsData, refetch: refetchTerms } = trpc.ads.getSearchTerms.useQuery({ clientId: selectedClientId });

  const promoteTermMutation = trpc.ads.promoteSearchTerm.useMutation({
    onSuccess: () => { refetchTerms(); toast.success("Search term action applied"); },
    onError: () => toast.error("Failed to apply action"),
  });

  const healthyCount = signals?.filter(s => s.status === "HEALTHY").length ?? 0;
  const warningCount = signals?.filter(s => s.status === "WARNING").length ?? 0;
  const criticalCount = signals?.filter(s => s.status === "CRITICAL").length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Intelligence Hub</h1>
          <p className="text-sm text-slate-400 mt-0.5">A2 · Daily ops: signals, drift, pacing, alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <ClientSelector />
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Healthy Signals", value: healthyCount, color: "text-emerald-400", bg: "border-emerald-500/20" },
          { label: "Warnings", value: warningCount, color: "text-amber-400", bg: "border-amber-500/20" },
          { label: "Critical", value: criticalCount, color: "text-red-400", bg: "border-red-500/20" },
          { label: "Agent Alerts", value: alerts?.length ?? 0, color: "text-cyan-400", bg: "border-cyan-500/20" },
        ].map((s) => (
          <Card key={s.label} className={`bg-[#0d1117] border ${s.bg}`}>
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0d1117] border border-slate-800">
          <TabsTrigger value="signals" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Activity className="w-3.5 h-3.5 mr-1.5" /> Signal Health
          </TabsTrigger>
          <TabsTrigger value="pacing" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <DollarSign className="w-3.5 h-3.5 mr-1.5" /> Budget Pacing
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Zap className="w-3.5 h-3.5 mr-1.5" /> Agent Alerts
          </TabsTrigger>
          <TabsTrigger value="searchterms" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Search className="w-3.5 h-3.5 mr-1.5" /> Search Terms
          </TabsTrigger>
        </TabsList>

        {/* Signal Health */}
        <TabsContent value="signals" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Signal Health Monitor</CardTitle>
            </CardHeader>
            <CardContent>
              {!signals || signals.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No signal data available. Signals are generated by the monitoring agent.</p>
              ) : (
                <div className="space-y-3">
                  {signals.map((s) => {
                    const info = SIGNAL_STATUS[s.status] ?? SIGNAL_STATUS.UNKNOWN;
                    return (
                      <div key={s.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                        {info.icon}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-white font-medium">{s.signalType}</p>
                            <Badge className={`text-xs ${info.color} bg-transparent border-current`}>{s.status}</Badge>
                          </div>
                          {s.message && <p className="text-xs text-slate-400 mt-0.5">{s.message}</p>}
                          {s.score !== null && s.score !== undefined && (
                            <p className="text-xs text-slate-500 mt-0.5">Value: <span className="text-cyan-400 font-mono">{String(s.score)}</span></p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Pacing */}
        <TabsContent value="pacing" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Budget Pacing by Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              {!pacing || pacing.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No pacing data available.</p>
              ) : (
                <div className="space-y-4">
                  {pacing.map((p) => {
                    const pct = Number(p.monthlyBudget) > 0
                      ? (Number(p.spentToDate) / Number(p.monthlyBudget)) * 100
                      : 0;
                    const barColor = pct > 90 ? "bg-red-500" : pct > 75 ? "bg-amber-500" : "bg-cyan-500";
                    return (
                      <div key={p.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300">Campaign #{p.campaignId}</span>
                          <div className="flex items-center gap-3">
                            <span className={pct > 90 ? "text-red-400" : pct > 75 ? "text-amber-400" : "text-emerald-400"}>
                              {pct.toFixed(1)}% used
                            </span>
                            <span className="text-slate-400 font-mono">
                              ${Number(p.spentToDate).toLocaleString()} / ${Number(p.monthlyBudget).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${Math.min(100, pct)}%` }} />
                        </div>
                        {p.pacingStatus && (
                          <p className="text-xs text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {p.pacingStatus}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agent Alerts */}
        <TabsContent value="alerts" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Agent Alert Feed</CardTitle>
            </CardHeader>
            <CardContent>
              {!alerts || alerts.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No agent outputs yet.</p>
              ) : (
                <div className="space-y-3">
                  {alerts.map((a) => (
                    <div key={a.id} className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Brain className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-xs font-medium text-white">{a.agentName}</span>
                          <Badge className="text-xs bg-slate-800 text-slate-400">{a.agentType}</Badge>
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {a.summary && <p className="text-xs text-slate-300">{a.summary}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Terms */}
        <TabsContent value="searchterms" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Search Term Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {["Search Term", "Match", "Intent", "Impr.", "Clicks", "Conv.", "Cost", "Action"].map(h => (
                        <th key={h} className="text-left text-slate-500 font-medium pb-2 pr-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {searchTermsData?.map((t) => (
                      <tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        <td className="py-2.5 pr-3">
                          <p className="text-white font-medium">{t.searchTerm}</p>
                          {t.addedAsKeyword && <span className="text-emerald-400 text-xs">✓ Added as keyword</span>}
                          {t.addedAsNegative && <span className="text-red-400 text-xs">✗ Added as negative</span>}
                          {t.addedToPatientLanguage && <span className="text-purple-400 text-xs">★ In patient language</span>}
                        </td>
                        <td className="py-2.5 pr-3 text-slate-400">{t.matchType}</td>
                        <td className="py-2.5 pr-3">
                          <Badge className={`text-xs ${INTENT_BADGE[t.intentLabel ?? ""] ?? "bg-slate-700 text-slate-400"}`}>
                            {t.intentLabel?.replace("_", " ") ?? "—"}
                          </Badge>
                        </td>
                        <td className="py-2.5 pr-3 text-slate-300 font-mono">{t.impressions?.toLocaleString()}</td>
                        <td className="py-2.5 pr-3 text-slate-300 font-mono">{t.clicks?.toLocaleString()}</td>
                        <td className="py-2.5 pr-3 text-purple-400 font-mono">{Number(t.conversions || 0).toFixed(1)}</td>
                        <td className="py-2.5 pr-3 text-emerald-400 font-mono">${Number(t.cost || 0).toFixed(2)}</td>
                        <td className="py-2.5">
                          {!t.addedAsKeyword && !t.addedAsNegative && !t.addedToPatientLanguage && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 px-1.5 text-xs text-emerald-400 hover:bg-emerald-500/10"
                                onClick={() => promoteTermMutation.mutate({ id: t.id, action: "addAsKeyword" })}
                              >+KW</Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 px-1.5 text-xs text-red-400 hover:bg-red-500/10"
                                onClick={() => promoteTermMutation.mutate({ id: t.id, action: "addAsNegative" })}
                              >-NEG</Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 px-1.5 text-xs text-purple-400 hover:bg-purple-500/10"
                                onClick={() => promoteTermMutation.mutate({ id: t.id, action: "addToPatientLanguage" })}
                              >★PL</Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
