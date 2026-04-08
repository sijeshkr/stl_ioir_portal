import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  clients, campaigns, adGroups, ads, adAssetLabels, keywords,
  searchTerms, negativeKeywords, conversionActions, landingPages,
  leads, signalHealth, agentOutputs, strategyDecisions, opsLog,
  knowledgeItems, strategySessions, budgetPacing, patientLanguage,
} from "../../drizzle/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export const adsRouter = router({
  // ── Clients ──────────────────────────────────────────────────────────────
  getClients: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(clients).where(eq(clients.isActive, true)).orderBy(asc(clients.name));
  }),

  // ── Campaigns ─────────────────────────────────────────────────────────────
  getCampaigns: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(campaigns).where(eq(campaigns.clientId, input.clientId)).orderBy(asc(campaigns.name));
    }),

  updateCampaignStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.enum(["ENABLED", "PAUSED", "REMOVED"]) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      await db.update(campaigns).set({ status: input.status }).where(eq(campaigns.id, input.id));
      return { success: true };
    }),

  // ── Ad Groups ─────────────────────────────────────────────────────────────
  getAdGroups: protectedProcedure
    .input(z.object({ campaignId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(adGroups).where(eq(adGroups.campaignId, input.campaignId));
    }),

  // ── Ads / RSAs ────────────────────────────────────────────────────────────
  getAds: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(ads).where(eq(ads.clientId, input.clientId)).orderBy(desc(ads.impressions));
    }),

  getAdAssetLabels: protectedProcedure
    .input(z.object({ adId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(adAssetLabels).where(eq(adAssetLabels.adId, input.adId));
    }),

  updateAdStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.enum(["PAUSED", "REMOVED", "DRAFT", "PENDING_REVIEW", "APPROVED", "UPLOADED", "LIVE"]) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      await db.update(ads).set({ status: input.status }).where(eq(ads.id, input.id));
      return { success: true };
    }),

  // ── Keywords ──────────────────────────────────────────────────────────────
  getKeywords: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(keywords).where(eq(keywords.clientId, input.clientId)).orderBy(desc(keywords.paidConversions));
    }),

  // ── Search Terms ──────────────────────────────────────────────────────────
  getSearchTerms: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(searchTerms).where(eq(searchTerms.clientId, input.clientId)).orderBy(desc(searchTerms.impressions));
    }),

  promoteSearchTerm: protectedProcedure
    .input(z.object({ id: z.number(), action: z.enum(["addAsKeyword", "addAsNegative", "addToPatientLanguage"]) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const update = input.action === "addAsKeyword"
        ? { addedAsKeyword: true }
        : input.action === "addAsNegative"
        ? { addedAsNegative: true }
        : { addedToPatientLanguage: true };
      await db.update(searchTerms).set(update).where(eq(searchTerms.id, input.id));
      return { success: true };
    }),

  // ── Negative Keywords ─────────────────────────────────────────────────────
  getNegativeKeywords: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(negativeKeywords).where(eq(negativeKeywords.clientId, input.clientId));
    }),

  addNegativeKeyword: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      campaignId: z.number().optional(),
      keyword: z.string(),
      matchType: z.enum(["EXACT", "PHRASE", "BROAD"]),
      level: z.enum(["CAMPAIGN", "AD_GROUP", "LIST"]),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      await db.insert(negativeKeywords).values(input);
      return { success: true };
    }),

  // ── Conversion Actions ────────────────────────────────────────────────────
  getConversionActions: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(conversionActions).where(eq(conversionActions.clientId, input.clientId));
    }),

  // ── Landing Pages ─────────────────────────────────────────────────────────
  getLandingPages: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(landingPages).where(eq(landingPages.clientId, input.clientId)).orderBy(desc(landingPages.updatedAt));
    }),

  updateLandingPageStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.enum(["BUILD_REQUIRED", "DRAFT", "NEEDS_AUDIT", "PUBLISHED"]) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      await db.update(landingPages).set({ status: input.status }).where(eq(landingPages.id, input.id));
      return { success: true };
    }),

  // ── Leads ─────────────────────────────────────────────────────────────────
  getLeads: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(leads).where(eq(leads.clientId, input.clientId)).orderBy(desc(leads.createdAt));
    }),

  updateLeadOutcome: protectedProcedure
    .input(z.object({ id: z.number(), outcome: z.enum(["NEW", "CONTACTED", "SCHEDULED", "APPT_COMPLETED", "NO_SHOW", "NOT_QUALIFIED"]) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      await db.update(leads).set({ outcome: input.outcome }).where(eq(leads.id, input.id));
      return { success: true };
    }),

  // ── Signal Health ─────────────────────────────────────────────────────────
  getSignalHealth: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(signalHealth).where(eq(signalHealth.clientId, input.clientId)).orderBy(desc(signalHealth.checkedAt));
    }),

  // ── Budget Pacing ─────────────────────────────────────────────────────────
  getBudgetPacing: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(budgetPacing).where(eq(budgetPacing.clientId, input.clientId));
    }),

  // ── Agent Outputs ─────────────────────────────────────────────────────────
  getAgentOutputs: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(agentOutputs).where(eq(agentOutputs.clientId, input.clientId)).orderBy(desc(agentOutputs.createdAt));
    }),

  // ── Strategy Decisions ────────────────────────────────────────────────────
  getStrategyDecisions: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(strategyDecisions).where(eq(strategyDecisions.clientId, input.clientId)).orderBy(desc(strategyDecisions.createdAt));
    }),

  approveDecision: protectedProcedure
    .input(z.object({ id: z.number(), approved: z.boolean(), notes: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      await db.update(strategyDecisions).set({
        status: input.approved ? "APPROVED" : "REJECTED",
        executedAt: new Date(),
      }).where(eq(strategyDecisions.id, input.id));
      return { success: true };
    }),

  // ── Ops Log ───────────────────────────────────────────────────────────────
  getOpsLog: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(opsLog).where(eq(opsLog.clientId, input.clientId)).orderBy(desc(opsLog.executedAt));
    }),

  // ── Knowledge Items ───────────────────────────────────────────────────────
  getKnowledgeItems: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(knowledgeItems).where(eq(knowledgeItems.clientId, input.clientId)).orderBy(desc(knowledgeItems.updatedAt));
    }),

  // ── Strategy Sessions ─────────────────────────────────────────────────────
  getStrategySessions: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(strategySessions).where(eq(strategySessions.clientId, input.clientId)).orderBy(desc(strategySessions.createdAt));
    }),

  // ── Patient Language ──────────────────────────────────────────────────────
  getPatientLanguage: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(patientLanguage).where(eq(patientLanguage.clientId, input.clientId)).orderBy(desc(patientLanguage.createdAt));
    }),

  // ── Dashboard Summary ─────────────────────────────────────────────────────
  getDashboardSummary: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [clientData] = await db.select().from(clients).where(eq(clients.id, input.clientId)).limit(1);
      const allCampaigns = await db.select().from(campaigns).where(eq(campaigns.clientId, input.clientId));
      const activeCampaigns = allCampaigns.filter(c => c.status === "ENABLED");
      const totalSpend = allCampaigns.reduce((s, c) => s + Number(c.spend || 0), 0);
      const totalConversions = allCampaigns.reduce((s, c) => s + Number(c.conversions || 0), 0);
      const totalClicks = allCampaigns.reduce((s, c) => s + Number(c.clicks || 0), 0);
      const totalImpressions = allCampaigns.reduce((s, c) => s + Number(c.impressions || 0), 0);
      const pendingDecisions = await db.select().from(strategyDecisions)
        .where(and(eq(strategyDecisions.clientId, input.clientId), eq(strategyDecisions.status, "PENDING")));
      const recentAlerts = await db.select().from(agentOutputs)
        .where(eq(agentOutputs.clientId, input.clientId))
        .orderBy(desc(agentOutputs.createdAt)).limit(5);
      return {
        client: clientData,
        metrics: {
          activeCampaigns: activeCampaigns.length,
          totalCampaigns: allCampaigns.length,
          totalSpend: Math.round(totalSpend * 100) / 100,
          totalConversions: Math.round(totalConversions * 10) / 10,
          totalClicks,
          totalImpressions,
          avgCtr: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0,
          avgCpa: totalConversions > 0 ? Math.round((totalSpend / totalConversions) * 100) / 100 : 0,
        },
        pendingDecisions: pendingDecisions.length,
        recentAlerts,
      };
    }),

  // alias for frontend
  reviewStrategyDecision: protectedProcedure
    .input(z.object({ id: z.number(), approved: z.boolean(), notes: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      await db.update(strategyDecisions).set({
        status: input.approved ? "APPROVED" : "REJECTED",
        executedAt: new Date(),
      }).where(eq(strategyDecisions.id, input.id));
      return { success: true };
    }),

  generateAdCopy: protectedProcedure
    .input(z.object({ clientId: z.number(), context: z.string().optional() }))
    .mutation(async ({ input }) => {
      const headlines = [
        "Expert IR Care — Book Today",
        "Minimally Invasive Procedures",
        "UFE Specialists Near You",
        "PAD Treatment Without Surgery",
        "Same-Day Consultations Available",
        "Board-Certified IR Physicians",
        "Advanced Vascular Care",
        "Stop Living With Pain",
        "Insurance Accepted — Call Now",
        "Leading IO|IR Practice",
      ];
      return { headlines, descriptions: [] };
    }),

  getPrompts: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const items = await db.select().from(knowledgeItems)
        .where(and(eq(knowledgeItems.clientId, input.clientId)))
        .orderBy(desc(knowledgeItems.updatedAt));
      return items.map(item => ({
        id: item.id,
        name: item.title,
        category: (item.tags as string[])?.[0] ?? "COPY_GENERATION",
        promptText: item.content,
        variables: item.tags ?? [],
        isFavorite: false,
        isGlobal: false,
      }));
    }),
});

// ── end ────────────────────────────────────────────────────────────────────
