import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAdsClient, ClientSelector } from "@/contexts/AdsClientContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, BarChart2, Settings, CheckCircle, AlertTriangle, Clock } from "lucide-react";

export default function A7OfflineConversion() {
  const { selectedClientId } = useAdsClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: conversionActions } = trpc.ads.getConversionActions.useQuery({ clientId: selectedClientId });

  const conversionStages = [
    { stage: "Phone Call → Appointment", count: 47, value: "$4,230", status: "ACTIVE" },
    { stage: "Form Submit → Consultation", count: 23, value: "$2,070", status: "ACTIVE" },
    { stage: "Consultation → Procedure", count: 12, value: "$48,000", status: "ACTIVE" },
    { stage: "Procedure → Referral", count: 5, value: "$20,000", status: "PENDING" },
  ];

  const uploadHistory = [
    { date: "Apr 5, 2026", records: 34, matched: 31, status: "SUCCESS" },
    { date: "Mar 29, 2026", records: 28, matched: 26, status: "SUCCESS" },
    { date: "Mar 22, 2026", records: 41, matched: 38, status: "SUCCESS" },
    { date: "Mar 15, 2026", records: 19, matched: 14, status: "PARTIAL" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Offline Conversion Tracker</h1>
          <p className="text-sm text-slate-400 mt-0.5">A7 · GCLID-to-revenue attribution, upload history, conversion actions</p>
        </div>
        <div className="flex items-center gap-3">
          <ClientSelector />
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Upload Conversions
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Conversions (MTD)", value: "82", color: "text-cyan-400" },
          { label: "Matched GCLIDs", value: "76", color: "text-emerald-400" },
          { label: "Match Rate", value: "92.7%", color: "text-emerald-400" },
          { label: "Attributed Revenue", value: "$74,300", color: "text-purple-400" },
        ].map((k) => (
          <Card key={k.label} className="bg-[#0d1117] border-slate-800">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 mb-1">{k.label}</p>
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0d1117] border border-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <BarChart2 className="w-3.5 h-3.5 mr-1.5" /> Conversion Funnel
          </TabsTrigger>
          <TabsTrigger value="uploads" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload History
          </TabsTrigger>
          <TabsTrigger value="actions" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Settings className="w-3.5 h-3.5 mr-1.5" /> Conversion Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Offline Conversion Funnel (MTD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversionStages.map((stage, i) => (
                  <div key={i} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-xs text-cyan-400 font-bold">{i + 1}</div>
                        <p className="text-sm text-white">{stage.stage}</p>
                      </div>
                      <Badge className={`text-xs ${stage.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                        {stage.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-slate-400">Conversions</p>
                        <p className="text-lg font-bold text-white">{stage.count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Attributed Value</p>
                        <p className="text-lg font-bold text-purple-400">{stage.value}</p>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
                            style={{ width: `${(stage.count / 47) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uploads" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Upload History</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800">
                    {["Upload Date", "Records", "Matched", "Match Rate", "Status"].map(h => (
                      <th key={h} className="text-left text-slate-500 font-medium p-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uploadHistory.map((u, i) => (
                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                      <td className="p-3 text-slate-300">{u.date}</td>
                      <td className="p-3 text-slate-300">{u.records}</td>
                      <td className="p-3 text-emerald-400">{u.matched}</td>
                      <td className="p-3 text-cyan-400">{((u.matched / u.records) * 100).toFixed(1)}%</td>
                      <td className="p-3">
                        <Badge className={`text-xs ${u.status === "SUCCESS" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                          {u.status === "SUCCESS" ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <AlertTriangle className="w-3 h-3 inline mr-1" />}
                          {u.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Conversion Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {!conversionActions || conversionActions.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-6">No conversion actions configured</p>
              ) : (
                <div className="space-y-2">
                  {conversionActions.map((ca) => (
                    <div key={ca.id} className="flex items-center justify-between p-3 rounded bg-slate-900/50 border border-slate-800">
                      <div>
                        <p className="text-sm text-white">{ca.name}</p>
                        <p className="text-xs text-slate-400">{ca.category} · {ca.countingType ?? "—"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        
                        <Badge className="text-xs bg-emerald-500/20 text-emerald-400">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
