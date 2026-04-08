import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAdsClient, ClientSelector } from "@/contexts/AdsClientContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  FileText, Sparkles, Image, CheckCircle, Clock,
  AlertTriangle, XCircle, TrendingUp, Copy
} from "lucide-react";

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  DRAFT: { color: "bg-slate-700 text-slate-300", icon: <Clock className="w-3 h-3" />, label: "Draft" },
  PENDING_REVIEW: { color: "bg-amber-500/20 text-amber-400", icon: <Clock className="w-3 h-3" />, label: "Pending Review" },
  APPROVED: { color: "bg-emerald-500/20 text-emerald-400", icon: <CheckCircle className="w-3 h-3" />, label: "Approved" },
  UPLOADED: { color: "bg-blue-500/20 text-blue-400", icon: <TrendingUp className="w-3 h-3" />, label: "Uploaded" },
  LIVE: { color: "bg-cyan-500/20 text-cyan-400", icon: <CheckCircle className="w-3 h-3" />, label: "Live" },
  PAUSED: { color: "bg-amber-500/20 text-amber-400", icon: <AlertTriangle className="w-3 h-3" />, label: "Paused" },
  REMOVED: { color: "bg-red-500/20 text-red-400", icon: <XCircle className="w-3 h-3" />, label: "Removed" },
};

const PERF_COLORS: Record<string, string> = {
  BEST: "text-emerald-400",
  GOOD: "text-cyan-400",
  LOW: "text-amber-400",
  LEARNING: "text-purple-400",
};

export default function A4AdAssetStudio() {
  const { selectedClientId } = useAdsClient();
  const [activeTab, setActiveTab] = useState("rsa");
  const [generating, setGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<string[]>([]);

  const { data: ads, refetch } = trpc.ads.getAds.useQuery({ clientId: selectedClientId });
  const updateAdStatus = trpc.ads.updateAdStatus.useMutation({
    onSuccess: () => { refetch(); toast.success("Ad status updated"); },
    onError: () => toast.error("Failed to update status"),
  });

  const generateCopy = trpc.ads.generateAdCopy.useMutation({
    onSuccess: (data) => {
      setGeneratedCopy(data.headlines ?? []);
      setGenerating(false);
      toast.success("Copy generated successfully");
    },
    onError: () => { setGenerating(false); toast.error("Copy generation failed"); },
  });

  const liveAds = ads?.filter(a => a.status === "LIVE") ?? [];
  const pendingAds = ads?.filter(a => a.status === "PENDING_REVIEW") ?? [];
  const draftAds = ads?.filter(a => a.status === "DRAFT") ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Ad Asset Studio</h1>
          <p className="text-sm text-slate-400 mt-0.5">A4 · RSA management, AI copy generator, HIPAA-safe approval workflow</p>
        </div>
        <div className="flex items-center gap-3">
          <ClientSelector />
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-500 text-white gap-1.5"
            onClick={() => {
              setGenerating(true);
              generateCopy.mutate({ clientId: selectedClientId, context: "Generate RSA headlines for this healthcare client" });
            }}
            disabled={generating}
          >
            <Sparkles className="w-3.5 h-3.5" /> {generating ? "Generating…" : "AI Generate Copy"}
          </Button>
        </div>
      </div>

      {/* Asset Pipeline Summary */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Draft", count: draftAds.length, color: "text-slate-400" },
          { label: "Pending Review", count: pendingAds.length, color: "text-amber-400" },
          { label: "Approved", count: ads?.filter(a => a.status === "APPROVED").length ?? 0, color: "text-emerald-400" },
          { label: "Uploaded", count: ads?.filter(a => a.status === "UPLOADED").length ?? 0, color: "text-blue-400" },
          { label: "Live", count: liveAds.length, color: "text-cyan-400" },
        ].map((s) => (
          <Card key={s.label} className="bg-[#0d1117] border-slate-800">
            <CardContent className="p-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0d1117] border border-slate-800">
          <TabsTrigger value="rsa" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <FileText className="w-3.5 h-3.5 mr-1.5" /> RSA Library
          </TabsTrigger>
          <TabsTrigger value="review" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Review Queue
          </TabsTrigger>
          <TabsTrigger value="generator" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Copy Generator
          </TabsTrigger>
          <TabsTrigger value="assets" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Image className="w-3.5 h-3.5 mr-1.5" /> Image Assets
          </TabsTrigger>
        </TabsList>

        {/* RSA Library */}
        <TabsContent value="rsa" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Responsive Search Ads</CardTitle>
            </CardHeader>
            <CardContent>
              {!ads || ads.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-6">No ads found. Create your first RSA using the AI Copy Generator.</p>
              ) : (
                <div className="space-y-4">
                  {ads.map((ad) => {
                    const statusInfo = STATUS_CONFIG[ad.status] ?? STATUS_CONFIG.DRAFT;
                    const headlines = Array.isArray(ad.headlines) ? ad.headlines as string[] : [];
                    const descriptions = Array.isArray(ad.descriptions) ? ad.descriptions as string[] : [];
                    return (
                      <div key={ad.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`text-xs flex items-center gap-1 ${statusInfo.color}`}>
                                {statusInfo.icon} {statusInfo.label}
                              </Badge>
                              {ad.status && (
                                <Badge className={`text-xs ${PERF_COLORS[ad.status] ?? "text-slate-400"} bg-transparent`}>
                                  {ad.status}
                                </Badge>
                              )}
                            </div>
                            {ad.finalUrl && (
                              <p className="text-xs text-slate-500">{ad.finalUrl}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {ad.status === "DRAFT" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs text-amber-400 hover:bg-amber-500/10"
                                onClick={() => updateAdStatus.mutate({ id: ad.id, status: "PENDING_REVIEW" })}
                              >
                                Submit for Review
                              </Button>
                            )}
                            {ad.status === "PENDING_REVIEW" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs text-emerald-400 hover:bg-emerald-500/10"
                                  onClick={() => updateAdStatus.mutate({ id: ad.id, status: "APPROVED" })}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs text-red-400 hover:bg-red-500/10"
                                  onClick={() => updateAdStatus.mutate({ id: ad.id, status: "REMOVED" })}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wide">Headlines ({headlines.length}/15)</p>
                            <div className="space-y-1">
                              {headlines.slice(0, 5).map((h, i) => (
                                <p key={i} className="text-xs text-slate-300 bg-slate-800/50 rounded px-2 py-1">{h}</p>
                              ))}
                              {headlines.length > 5 && <p className="text-xs text-slate-500">+{headlines.length - 5} more</p>}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wide">Descriptions ({descriptions.length}/4)</p>
                            <div className="space-y-1">
                              {descriptions.slice(0, 3).map((d, i) => (
                                <p key={i} className="text-xs text-slate-300 bg-slate-800/50 rounded px-2 py-1">{d}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                        {ad.approvedAt && (
                          <div className="mt-2 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                            <p className="text-xs text-amber-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> HIPAA Note: {ad.approvedAt ? new Date(ad.approvedAt).toLocaleDateString() : ""}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Review Queue */}
        <TabsContent value="review" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">HIPAA-Safe Approval Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingAds.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-300">No ads pending review</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingAds.map((ad) => {
                    const headlines = Array.isArray(ad.headlines) ? ad.headlines as string[] : [];
                    return (
                      <div key={ad.id} className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-amber-500/20 text-amber-400 text-xs">Awaiting Review</Badge>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 h-7 px-3 text-xs"
                              onClick={() => updateAdStatus.mutate({ id: ad.id, status: "APPROVED" })}>
                              Approve
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-400 border border-red-500/20 h-7 px-3 text-xs"
                              onClick={() => updateAdStatus.mutate({ id: ad.id, status: "REMOVED" })}>
                              Reject
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {headlines.slice(0, 3).map((h, i) => (
                            <p key={i} className="text-xs text-white">{h}</p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Copy Generator */}
        <TabsContent value="generator" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-slate-300">AI Copy Generator</CardTitle>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-500 text-white gap-1.5"
                  onClick={() => {
                    setGenerating(true);
                    generateCopy.mutate({ clientId: selectedClientId, context: "Generate HIPAA-compliant RSA copy for healthcare services" });
                  }}
                  disabled={generating}
                >
                  <Sparkles className="w-3.5 h-3.5" /> {generating ? "Generating…" : "Generate"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {generatedCopy.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
                  <p className="text-sm text-slate-300">Click Generate to create HIPAA-compliant ad copy</p>
                  <p className="text-xs text-slate-500">The AI will use patient language patterns and campaign context to generate relevant headlines and descriptions</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 mb-3">Generated Headlines — click to copy</p>
                  {generatedCopy.map((line, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 transition-colors group">
                      <p className="text-xs text-slate-300">{line}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 text-slate-400"
                        onClick={() => { navigator.clipboard.writeText(line); toast.success("Copied!"); }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Image Assets */}
        <TabsContent value="assets" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardContent className="p-8 text-center">
              <Image className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-300">Image Asset Library</p>
              <p className="text-xs text-slate-500 mt-1">Upload and manage display and Performance Max image assets</p>
              <Button size="sm" className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white">Upload Assets</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
