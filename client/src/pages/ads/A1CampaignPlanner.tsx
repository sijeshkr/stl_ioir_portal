import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAdsClient, ClientSelector } from "@/contexts/AdsClientContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Target, TrendingUp, DollarSign, Plus, Play, Pause,
  BarChart2, Layers, Settings2, FileText
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  ENABLED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  PAUSED: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  REMOVED: "bg-red-500/20 text-red-400 border-red-500/30",
};

const INTENT_COLORS: Record<string, string> = {
  crisis_intent: "bg-red-500/20 text-red-400",
  transactional: "bg-cyan-500/20 text-cyan-400",
  research_intent: "bg-purple-500/20 text-purple-400",
  brand: "bg-blue-500/20 text-blue-400",
};

export default function A1CampaignPlanner() {
  const { selectedClientId } = useAdsClient();
  const [activeTab, setActiveTab] = useState("overview");
  const { data: campaigns, refetch } = trpc.ads.getCampaigns.useQuery({ clientId: selectedClientId });
  const updateStatus = trpc.ads.updateCampaignStatus.useMutation({
    onSuccess: () => { refetch(); toast.success("Campaign status updated"); },
    onError: () => toast.error("Failed to update status"),
  });

  const totalSpend = campaigns?.reduce((s, c) => s + Number(c.spend || 0), 0) ?? 0;
  const totalConversions = campaigns?.reduce((s, c) => s + Number(c.conversions || 0), 0) ?? 0;
  const totalClicks = campaigns?.reduce((s, c) => s + Number(c.clicks || 0), 0) ?? 0;
  const avgCpa = totalConversions > 0 ? totalSpend / totalConversions : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Campaign Planner</h1>
          <p className="text-sm text-slate-400 mt-0.5">A1 · Translate strategy into campaign structure</p>
        </div>
        <div className="flex items-center gap-3">
          <ClientSelector />
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New Campaign
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Campaigns", value: campaigns?.filter(c => c.status === "ENABLED").length ?? 0, icon: Target, color: "text-cyan-400" },
          { label: "Total Spend", value: `$${totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: "text-emerald-400" },
          { label: "Conversions", value: totalConversions.toFixed(1), icon: TrendingUp, color: "text-purple-400" },
          { label: "Avg CPA", value: `$${avgCpa.toFixed(2)}`, icon: BarChart2, color: "text-amber-400" },
        ].map((kpi) => (
          <Card key={kpi.label} className="bg-[#0d1117] border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">{kpi.label}</span>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0d1117] border border-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Layers className="w-3.5 h-3.5 mr-1.5" /> Overview
          </TabsTrigger>
          <TabsTrigger value="intent" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Target className="w-3.5 h-3.5 mr-1.5" /> Intent Mapping
          </TabsTrigger>
          <TabsTrigger value="budget" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <DollarSign className="w-3.5 h-3.5 mr-1.5" /> Budget Allocation
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Settings2 className="w-3.5 h-3.5 mr-1.5" /> Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">All Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {["Campaign", "Status", "Intent", "Bidding", "Spend", "Clicks", "Conv.", "CPA", "Signal", "Actions"].map(h => (
                        <th key={h} className="text-left text-xs text-slate-500 font-medium pb-2 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns?.map((c) => (
                      <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 pr-4">
                          <p className="text-white font-medium text-xs">{c.name}</p>
                          <p className="text-slate-500 text-xs">{c.googleCampaignId}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge className={`text-xs border ${STATUS_COLORS[c.status] ?? ""}`}>{c.status}</Badge>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge className={`text-xs ${INTENT_COLORS[c.intentCluster ?? ""] ?? "bg-slate-700 text-slate-300"}`}>
                            {c.intentCluster?.replace("_", " ") ?? "—"}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-slate-400 text-xs">{c.biddingStrategy}</td>
                        <td className="py-3 pr-4 text-emerald-400 text-xs font-mono">${Number(c.spend || 0).toLocaleString()}</td>
                        <td className="py-3 pr-4 text-slate-300 text-xs font-mono">{Number(c.clicks || 0).toLocaleString()}</td>
                        <td className="py-3 pr-4 text-purple-400 text-xs font-mono">{Number(c.conversions || 0).toFixed(1)}</td>
                        <td className="py-3 pr-4 text-amber-400 text-xs font-mono">
                          ${Number(c.conversions || 0) > 0 ? (Number(c.spend || 0) / Number(c.conversions || 0)).toFixed(2) : "—"}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-cyan-500"
                                style={{ width: `${Math.min(100, Number(c.signalHealthScore || 0))}%` }}
                              />
                            </div>
                            <span className="text-xs text-cyan-400">{c.signalHealthScore ?? "—"}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-slate-400 hover:text-emerald-400"
                              onClick={() => updateStatus.mutate({ id: c.id, status: "ENABLED" })}
                              disabled={c.status === "ENABLED"}
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-slate-400 hover:text-amber-400"
                              onClick={() => updateStatus.mutate({ id: c.id, status: "PAUSED" })}
                              disabled={c.status === "PAUSED"}
                            >
                              <Pause className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Intent Mapping Tab */}
        <TabsContent value="intent" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { cluster: "crisis_intent", label: "Crisis Intent", desc: "Immediate pain, urgent need", color: "border-red-500/30 bg-red-500/5" },
              { cluster: "transactional", label: "Transactional", desc: "Ready to book or schedule", color: "border-cyan-500/30 bg-cyan-500/5" },
              { cluster: "research_intent", label: "Research Intent", desc: "Comparing options, learning", color: "border-purple-500/30 bg-purple-500/5" },
              { cluster: "brand", label: "Brand", desc: "Searching by practice name", color: "border-blue-500/30 bg-blue-500/5" },
            ].map((cluster) => {
              const clusterCampaigns = campaigns?.filter(c => c.intentCluster === cluster.cluster) ?? [];
              return (
                <Card key={cluster.cluster} className={`bg-[#0d1117] border ${cluster.color}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-white">{cluster.label}</CardTitle>
                      <Badge className="text-xs bg-slate-800 text-slate-300">{clusterCampaigns.length} campaigns</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{cluster.desc}</p>
                  </CardHeader>
                  <CardContent>
                    {clusterCampaigns.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No campaigns mapped to this cluster</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {clusterCampaigns.map(c => (
                          <li key={c.id} className="flex items-center justify-between text-xs">
                            <span className="text-slate-300">{c.name}</span>
                            <span className="text-emerald-400 font-mono">${Number(c.spend || 0).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Budget Allocation Tab */}
        <TabsContent value="budget" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Budget Allocation by Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns?.map((c) => {
                  const pct = totalSpend > 0 ? (Number(c.spend || 0) / totalSpend) * 100 : 0;
                  return (
                    <div key={c.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{c.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">{pct.toFixed(1)}%</span>
                          <span className="text-emerald-400 font-mono">${Number(c.spend || 0).toLocaleString()}</span>
                          {c.dailyBudget && <span className="text-slate-500">/ ${Number(c.dailyBudget).toFixed(0)}/day</span>}
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Campaign Settings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800">
                    {["Campaign", "Bidding Strategy", "Target CPA", "Daily Budget", "Geo Targets", "Ad Schedule"].map(h => (
                      <th key={h} className="text-left text-slate-500 font-medium pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campaigns?.map((c) => (
                    <tr key={c.id} className="border-b border-slate-800/50">
                      <td className="py-2.5 pr-4 text-white font-medium">{c.name}</td>
                      <td className="py-2.5 pr-4 text-slate-300">{c.biddingStrategy}</td>
                      <td className="py-2.5 pr-4 text-amber-400">{c.targetCpa ? `$${c.targetCpa}` : "—"}</td>
                      <td className="py-2.5 pr-4 text-emerald-400">{c.dailyBudget ? `$${Number(c.dailyBudget).toFixed(0)}` : "—"}</td>
                      <td className="py-2.5 pr-4 text-slate-400">{c.intentCluster ?? "—"}</td>
                      <td className="py-2.5 text-slate-400">{c.biddingStrategy ?? "All hours"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
