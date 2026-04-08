import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAdsClient, ClientSelector } from "@/contexts/AdsClientContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BookOpen, MessageSquare, Brain, Bot, Search, Copy, Star } from "lucide-react";

export default function A8KnowledgeRoom() {
  const { selectedClientId } = useAdsClient();
  const [activeTab, setActiveTab] = useState("prompts");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: prompts } = trpc.ads.getPrompts.useQuery({ clientId: selectedClientId });
  const { data: patientLanguage } = trpc.ads.getPatientLanguage.useQuery({ clientId: selectedClientId });
  const { data: agentOutputs } = trpc.ads.getAgentOutputs.useQuery({ clientId: selectedClientId });

  const filteredPrompts = prompts?.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const filteredLanguage = patientLanguage?.filter(p =>
    !searchQuery || p.phrase.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const CATEGORY_COLORS: Record<string, string> = {
    COPY_GENERATION: "bg-purple-500/20 text-purple-400",
    STRATEGY: "bg-cyan-500/20 text-cyan-400",
    ANALYSIS: "bg-blue-500/20 text-blue-400",
    REPORTING: "bg-emerald-500/20 text-emerald-400",
    BRIEF: "bg-amber-500/20 text-amber-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Knowledge Room</h1>
          <p className="text-sm text-slate-400 mt-0.5">A8 · Prompt library, patient language, entity brain, agent outputs</p>
        </div>
        <div className="flex items-center gap-3">
          <ClientSelector />
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge..."
              className="pl-8 text-xs bg-slate-900 border-slate-700 text-slate-300 w-48"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Prompts", value: prompts?.length ?? 0, color: "text-purple-400", icon: <MessageSquare className="w-4 h-4 text-purple-400" /> },
          { label: "Patient Language Pairs", value: patientLanguage?.length ?? 0, color: "text-cyan-400", icon: <Brain className="w-4 h-4 text-cyan-400" /> },
          { label: "Agent Outputs", value: agentOutputs?.length ?? 0, color: "text-blue-400", icon: <Bot className="w-4 h-4 text-blue-400" /> },
          { label: "Knowledge Items", value: (prompts?.length ?? 0) + (patientLanguage?.length ?? 0), color: "text-emerald-400", icon: <BookOpen className="w-4 h-4 text-emerald-400" /> },
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
          <TabsTrigger value="prompts" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Prompt Library
          </TabsTrigger>
          <TabsTrigger value="language" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Brain className="w-3.5 h-3.5 mr-1.5" /> Patient Language
          </TabsTrigger>
          <TabsTrigger value="outputs" className="data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300">
            <Bot className="w-3.5 h-3.5 mr-1.5" /> Agent Outputs
          </TabsTrigger>
        </TabsList>

        {/* Prompt Library */}
        <TabsContent value="prompts" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-slate-300">Prompt Library</CardTitle>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white gap-1.5 h-7 px-3 text-xs">
                  + New Prompt
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredPrompts.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-6">No prompts found</p>
              ) : (
                <div className="space-y-3">
                  {filteredPrompts.map((p) => (
                    <div key={p.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-purple-500/20 transition-colors group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${CATEGORY_COLORS[p.category] ?? "bg-slate-700 text-slate-400"}`}>
                            {p.category.replace("_", " ")}
                          </Badge>
                          {p.isFavorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                          {p.isGlobal && <Badge className="text-xs bg-slate-700 text-slate-400">Global</Badge>}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-slate-400"
                          onClick={() => { navigator.clipboard.writeText(p.promptText); toast.success("Prompt copied!"); }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-white font-medium mb-1">{p.name}</p>
                      <p className="text-xs text-slate-400 line-clamp-2">{p.promptText}</p>
                      {p.variables && Array.isArray(p.variables) && p.variables.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {(p.variables as string[]).map((v, i) => (
                            <Badge key={i} className="text-xs bg-slate-800 text-slate-400 font-mono">{`{{${v}}}`}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patient Language */}
        <TabsContent value="language" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Patient Language Pairs</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800">
                    {["Clinical Term", "Patient Phrase", "Search Volume", "Intent", "Ad Copy Use"].map(h => (
                      <th key={h} className="text-left text-slate-500 font-medium p-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLanguage.map((pl) => (
                    <tr key={pl.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                      <td className="p-3 text-slate-400 font-mono">{pl.source}</td>
                      <td className="p-3 text-white font-medium">{pl.phrase}</td>
                      <td className="p-3 text-cyan-400">—</td>
                      <td className="p-3">
                        <Badge className="text-xs bg-slate-800 text-slate-300">{pl.source}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={`text-xs ${pl.usedInAd ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>
                          {pl.usedInAd ? "Yes" : "No"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {filteredLanguage.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic">No patient language data found</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agent Outputs */}
        <TabsContent value="outputs" className="mt-4">
          <Card className="bg-[#0d1117] border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-300">Agent Output Log</CardTitle>
            </CardHeader>
            <CardContent>
              {!agentOutputs || agentOutputs.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-6">No agent outputs recorded yet</p>
              ) : (
                <div className="space-y-3">
                  {agentOutputs.map((ao) => (
                    <div key={ao.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-white font-medium">{ao.agentName}</span>
                          <Badge className="text-xs bg-blue-500/20 text-blue-400">{ao.outputType}</Badge>
                        </div>
                        <span className="text-xs text-slate-500">{new Date(ao.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-3">
                        {typeof ao.outputData === "string" ? ao.outputData : JSON.stringify(ao.outputData).slice(0, 200)}
                      </p>
                      {false && (
                        <Badge className="mt-2 text-xs bg-emerald-500/20 text-emerald-400">Used in Decision</Badge>
                      )}
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
