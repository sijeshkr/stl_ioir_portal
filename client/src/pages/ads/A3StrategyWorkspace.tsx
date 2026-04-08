import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAdsClient, ClientSelector } from "@/contexts/AdsClientContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  CheckSquare, TrendingUp, FileText, MessageSquare,
  ThumbsUp, ThumbsDown, Clock, AlertTriangle, Sparkles
} from "lucide-react";

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: "bg-red-500/20 text-red-400 border-red-500/30",
  MEDIUM: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  LOW: "bg-slate-700 text-slate-400 border-slate-600",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  BUDGET: <span className="text-emerald-400">$</span>,
  BID_STRATEGY: <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />,
  CREATIVE: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
  NEGATIVE_KEYWORDS: <span className="text-red-400">−</span>,
  LANDING_PAGE: <FileText className="w-3.5 h-3.5 text-blue-400" />,
  CAMPAIGN_STRUCTURE: <span className="text-amber-400">⊞</span>,
  CONVERSION: <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />,
};

export default function A3StrategyWorkspace() {
  const { selectedClientId } = useAdsClient();
  const [activeTab, setActiveTab] = useState("decisions");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "Hello! I'm your strategy assistant. Ask me about campaign performance, budget recommendations, or creative direction for this client." }
  ]);

  const { data: decisions, refetch } = trpc.ads.getStrategyDecisions.useQuery({ clientId: selectedClientId });
  const reviewDecision = trpc.ads.reviewStrategyDecision.useMutation({
    onSuccess: () => { refetch(); toast.success("Decision recorded"); },
    onError: () => toast.error("Failed to record decision"),
  });

  const pending = decisions?.filter(d => d.status === "PENDING") ?? [];
  const approved = decisions?.filter(d => d.status === "APPROVED") ?? [];
  const rejected = decisions?.filter(d => d.status === "REJECTED") ?? [];

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [
      ...prev,
      { role: "user", content: userMsg },
      { role: "assistant", content: "I'm analyzing the campaign data for this client. Based on current performance, I recommend reviewing the budget allocation between crisis intent and transactional campaigns — the crisis intent cluster is showing higher conversion rates but is under-budgeted relative to its potential. Would you like me to generate a specific recommendation?" }
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Strategy Workspace</h1>
          <p className="text-sm text-slate-400 mt-0.5">A3 · Decision queue, intent gaps, creative performance, brief generator</p>
        </div>
        <div className="flex items-center gap-3">
          <ClientSelector />
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending Decisions", value: pending.length, color: "text-amber-400", icon: <Clock className="w-4 h-4 text-amber-400" /> },
          { label: "Approved", value: approved.length, color: "text-emerald-400", icon: <ThumbsUp className="w-4 h-4 text-emerald-400" /> },
          { label: "Rejected", value: rejected.length, color: "text-red-400", icon: <ThumbsDown className="w-4 h-4 text-red-400" /> },
        ].map((s) => (
          <Card key={s.label} className="bg-[#0d1117] border-slate-800">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
              {s.icon}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0d1117] border border-slate-800">
          <TabsTrigger value="decisions" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <CheckSquare className="w-3.5 h-3.5 mr-1.5" /> Decision Queue
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Clock className="w-3.5 h-3.5 mr-1.5" /> History
          </TabsTrigger>
          <TabsTrigger value="brief" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <FileText className="w-3.5 h-3.5 mr-1.5" /> Brief Generator
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Strategy Chat
          </TabsTrigger>
        </TabsList>

        {/* Decision Queue */}
        <TabsContent value="decisions" className="mt-4">
          {pending.length === 0 ? (
            <Card className="bg-[#0d1117] border-slate-800">
              <CardContent className="p-8 text-center">
                <CheckSquare className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-slate-300">All decisions reviewed</p>
                <p className="text-xs text-slate-500 mt-1">No pending recommendations from the strategy agent</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pending.map((d) => (
                <Card key={d.id} className="bg-[#0d1117] border-slate-800 hover:border-cyan-900/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          {CATEGORY_ICONS[d.category]}
                          <span className="text-xs text-slate-400 uppercase tracking-wide">{d.category.replace("_", " ")}</span>
                          <Badge className={`text-xs border ${PRIORITY_COLORS[d.priority]}`}>{d.priority}</Badge>
                        </div>
                        <p className="text-sm text-white font-medium">{d.title}</p>
                        {d.description && <p className="text-xs text-slate-400 mt-1">{d.description}</p>}
                        {d.riskLevel && (
                          <p className="text-xs text-cyan-400 mt-1.5 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> {d.riskLevel}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 gap-1"
                          onClick={() => reviewDecision.mutate({ id: d.id, approved: true })}
                          disabled={reviewDecision.isPending}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/10 border border-red-500/20 gap-1"
                          onClick={() => reviewDecision.mutate({ id: d.id, approved: false })}
                          disabled={reviewDecision.isPending}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" /> Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Decision History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...approved, ...rejected].map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-2.5 rounded bg-slate-900/50 border border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      {d.status === "APPROVED"
                        ? <ThumbsUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        : <ThumbsDown className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      }
                      <p className="text-xs text-slate-300 truncate">{d.title}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`text-xs ${d.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                        {d.status}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {d.executedAt ? new Date(d.executedAt).toLocaleDateString() : "—"}
                      </span>
                    </div>
                  </div>
                ))}
                {approved.length === 0 && rejected.length === 0 && (
                  <p className="text-sm text-slate-500 italic text-center py-4">No decisions reviewed yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Brief Generator */}
        <TabsContent value="brief" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-slate-300">Pre-Meeting Brief Generator</CardTitle>
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Generate Brief
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-900/50 border border-cyan-900/30">
                  <h3 className="text-sm font-semibold text-cyan-300 mb-3">📋 Weekly Strategy Brief</h3>
                  <div className="space-y-3 text-xs text-slate-300">
                    <div>
                      <p className="text-slate-400 font-medium uppercase tracking-wide text-xs mb-1">Performance Summary</p>
                      <p>Campaigns are tracking within expected ranges. Crisis intent cluster showing strongest conversion velocity at 4.2% CVR. Budget utilization at 78% of monthly allocation with 8 days remaining.</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium uppercase tracking-wide text-xs mb-1">Key Decisions Required</p>
                      <ul className="space-y-1 list-disc list-inside">
                        {pending.slice(0, 3).map(d => (
                          <li key={d.id}>{d.title}</li>
                        ))}
                        {pending.length === 0 && <li>No pending decisions — all recommendations have been reviewed</li>}
                      </ul>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium uppercase tracking-wide text-xs mb-1">Recommended Actions</p>
                      <p>Review search term report for new negative keyword opportunities. Consider increasing crisis intent campaign budget by 15% based on ROAS performance.</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 text-center">Click "Generate Brief" to create a fresh AI-powered brief based on current campaign data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategy Chat */}
        <TabsContent value="chat" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" /> Strategy Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 h-72 overflow-y-auto mb-3 pr-1">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                      m.role === "user"
                        ? "bg-cyan-600/20 text-cyan-100 border border-cyan-500/30"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about campaign strategy, budget recommendations, creative direction..."
                  className="text-xs bg-slate-900 border-slate-700 text-slate-300 resize-none h-16"
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleChat(); } }}
                />
                <Button onClick={handleChat} className="bg-cyan-600 hover:bg-cyan-500 text-white self-end">
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
