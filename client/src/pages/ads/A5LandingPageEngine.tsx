import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAdsClient, ClientSelector } from "@/contexts/AdsClientContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Globe, Zap, Link, BarChart2, Plus, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  BUILD_REQUIRED: "bg-slate-700 text-slate-400",
  DRAFT: "bg-amber-500/20 text-amber-400",
  NEEDS_AUDIT: "bg-orange-500/20 text-orange-400",
  PUBLISHED: "bg-emerald-500/20 text-emerald-400",
};

export default function A5LandingPageEngine() {
  const { selectedClientId } = useAdsClient();
  const [activeTab, setActiveTab] = useState("library");

  const { data: pages, refetch } = trpc.ads.getLandingPages.useQuery({ clientId: selectedClientId });
  const updateStatus = trpc.ads.updateLandingPageStatus.useMutation({
    onSuccess: () => { refetch(); toast.success("Page status updated"); },
    onError: () => toast.error("Failed to update status"),
  });

  const published = pages?.filter(p => p.status === "PUBLISHED") ?? [];
  const needsAudit = pages?.filter(p => p.status === "NEEDS_AUDIT") ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Landing Page Engine</h1>
          <p className="text-sm text-slate-400 mt-0.5">A5 · Page library, CWV audit, GCLID verification</p>
        </div>
        <div className="flex items-center gap-3">
          <ClientSelector />
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white gap-1.5">
            <Plus className="w-3.5 h-3.5" /> New Page
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Pages", value: pages?.length ?? 0, color: "text-white" },
          { label: "Published", value: published.length, color: "text-emerald-400" },
          { label: "Needs Audit", value: needsAudit.length, color: "text-orange-400" },
          { label: "Build Required", value: pages?.filter(p => p.status === "BUILD_REQUIRED").length ?? 0, color: "text-slate-400" },
        ].map((s) => (
          <Card key={s.label} className="bg-[#0d1117] border-slate-800">
            <CardContent className="p-4">
              <p className="text-xs text-slate-400 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0d1117] border border-slate-800">
          <TabsTrigger value="library" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Globe className="w-3.5 h-3.5 mr-1.5" /> Page Library
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Zap className="w-3.5 h-3.5 mr-1.5" /> CWV Audit
          </TabsTrigger>
          <TabsTrigger value="gclid" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Link className="w-3.5 h-3.5 mr-1.5" /> GCLID Verify
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800">
                    {["Page", "Status", "Intent", "CVR", "CWV Score", "GCLID", "Actions"].map(h => (
                      <th key={h} className="text-left text-slate-500 font-medium p-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pages?.map((p) => (
                    <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                      <td className="p-3 pr-4">
                        <p className="text-white font-medium">{p.h1Text ?? p.slug}</p>
                        <p className="text-slate-500 text-xs">/{p.slug}</p>
                      </td>
                      <td className="p-3 pr-4">
                        <Badge className={`text-xs ${STATUS_COLORS[p.status] ?? ""}`}>{p.status.replace("_", " ")}</Badge>
                      </td>
                      <td className="p-3 pr-4 text-slate-400">{p.intentCluster ?? "—"}</td>
                      <td className="p-3 pr-4 text-purple-400 font-mono">
                        {p.formRate ? `${Number(p.formRate).toFixed(1)}%` : "—"}
                      </td>
                      <td className="p-3 pr-4">
                        {p.cwvStatus ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-10 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${Number(p.cwvStatus) >= 80 ? "bg-emerald-500" : Number(p.cwvStatus) >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                                style={{ width: `${p.cwvStatus}%` }} />
                            </div>
                            <span className="text-slate-300">{p.cwvStatus}</span>
                          </div>
                        ) : "—"}
                      </td>
                      <td className="p-3 pr-4">
                        {p.gclidVerifiedAt
                          ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                          : <AlertTriangle className="w-4 h-4 text-amber-400" />
                        }
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {p.status === "DRAFT" && (
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-emerald-400 hover:bg-emerald-500/10"
                              onClick={() => updateStatus.mutate({ id: p.id, status: "PUBLISHED" })}>
                              Publish
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-cyan-400">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!pages || pages.length === 0) && (
                    <tr><td colSpan={7} className="p-8 text-center text-slate-500 text-sm italic">No landing pages found</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Core Web Vitals Audit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "LCP", desc: "Largest Contentful Paint", value: "2.1s", status: "GOOD", color: "text-emerald-400" },
                  { label: "FID", desc: "First Input Delay", value: "45ms", status: "GOOD", color: "text-emerald-400" },
                  { label: "CLS", desc: "Cumulative Layout Shift", value: "0.08", status: "NEEDS IMPROVEMENT", color: "text-amber-400" },
                ].map((m) => (
                  <div key={m.label} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 text-center">
                    <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-sm text-white mt-1">{m.label}</p>
                    <p className="text-xs text-slate-400">{m.desc}</p>
                    <Badge className={`mt-2 text-xs ${m.color} bg-transparent`}>{m.status}</Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 text-center">Run a new audit to get fresh Core Web Vitals data for all published pages</p>
              <div className="flex justify-center mt-3">
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Run Audit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gclid" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">GCLID Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pages?.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded bg-slate-900/50 border border-slate-800">
                    <div className="flex items-center gap-2">
                      {p.gclidVerifiedAt
                        ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                        : <AlertTriangle className="w-4 h-4 text-amber-400" />
                      }
                      <span className="text-xs text-slate-300">/{p.slug}</span>
                    </div>
                    <Badge className={`text-xs ${p.gclidVerifiedAt ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                      {p.gclidVerifiedAt ? "Verified" : "Not Verified"}
                    </Badge>
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
