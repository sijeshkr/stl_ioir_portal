import {
  boolean,
  float,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Core Users ───────────────────────────────────────────────────────────────

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Clients (multi-tenant) ───────────────────────────────────────────────────

export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }),
  specialty: varchar("specialty", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  primaryColor: varchar("primaryColor", { length: 7 }),
  logoUrl: text("logoUrl"),
  phone: varchar("phone", { length: 20 }),
  googleAdsCustomerId: varchar("googleAdsCustomerId", { length: 50 }),
  gscSiteUrl: text("gscSiteUrl"),
  ga4PropertyId: varchar("ga4PropertyId", { length: 50 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

// ─── Shared Keyword Brain ─────────────────────────────────────────────────────

export const keywords = mysqlTable("keywords", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  keyword: varchar("keyword", { length: 500 }).notNull(),
  intentCluster: mysqlEnum("intentCluster", [
    "crisis_intent",
    "research_intent",
    "transactional",
    "brand",
    "competitor",
  ]),
  funnelStage: mysqlEnum("funnelStage", ["TOF", "MOF", "BOF"]),
  // Paid signals
  adGroupId: int("adGroupId"),
  avgCpc: float("avgCpc"),
  qualityScore: int("qualityScore"),
  paidImpressions: int("paidImpressions"),
  paidClicks: int("paidClicks"),
  paidConversions: float("paidConversions"),
  // Organic signals
  organicPosition: float("organicPosition"),
  organicImpressions: int("organicImpressions"),
  organicClicks: int("organicClicks"),
  hasFeaturedSnippet: boolean("hasFeaturedSnippet").default(false),
  hasAiOverview: boolean("hasAiOverview").default(false),
  hasMapPack: boolean("hasMapPack").default(false),
  // Meta
  isTracked: boolean("isTracked").default(true),
  lastUpdated: timestamp("lastUpdated").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Keyword = typeof keywords.$inferSelect;
export type InsertKeyword = typeof keywords.$inferInsert;

// ─── Patient Language ─────────────────────────────────────────────────────────

export const patientLanguage = mysqlTable("patient_language", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  phrase: text("phrase").notNull(),
  source: mysqlEnum("source", ["search_term", "review", "reddit", "chat", "manual"]).notNull(),
  usedInAd: boolean("usedInAd").default(false),
  usedInContent: boolean("usedInContent").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Campaigns ────────────────────────────────────────────────────────────────

export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  googleCampaignId: varchar("googleCampaignId", { length: 50 }),
  name: varchar("name", { length: 255 }).notNull(),
  campaignType: mysqlEnum("campaignType", ["SEARCH", "PMAX", "DISPLAY", "VIDEO"]).default("SEARCH").notNull(),
  status: mysqlEnum("status", ["ENABLED", "PAUSED", "REMOVED", "DRAFT"]).default("DRAFT").notNull(),
  intentCluster: mysqlEnum("intentCluster", ["crisis_intent", "research_intent", "transactional", "brand", "competitor"]),
  funnelStage: mysqlEnum("funnelStage", ["TOF", "MOF", "BOF"]),
  linkedStrategyId: int("linkedStrategyId"),
  approvedInMeetingDate: timestamp("approvedInMeetingDate"),
  dailyBudget: float("dailyBudget"),
  monthlyBudget: float("monthlyBudget"),
  biddingStrategy: varchar("biddingStrategy", { length: 100 }),
  targetCpa: float("targetCpa"),
  targetRoas: float("targetRoas"),
  // Live metrics (synced from Google Ads API)
  spend: float("spend").default(0),
  impressions: int("impressions").default(0),
  clicks: int("clicks").default(0),
  conversions: float("conversions").default(0),
  ctr: float("ctr").default(0),
  cpc: float("cpc").default(0),
  cpa: float("cpa").default(0),
  signalHealthScore: int("signalHealthScore"),
  driftScore: int("driftScore"),
  lastSyncedAt: timestamp("lastSyncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

// ─── Ad Groups ────────────────────────────────────────────────────────────────

export const adGroups = mysqlTable("ad_groups", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  campaignId: int("campaignId").notNull(),
  googleAdGroupId: varchar("googleAdGroupId", { length: 50 }),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["ENABLED", "PAUSED", "REMOVED"]).default("ENABLED").notNull(),
  intentCluster: varchar("intentCluster", { length: 100 }),
  spend: float("spend").default(0),
  impressions: int("impressions").default(0),
  clicks: int("clicks").default(0),
  conversions: float("conversions").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Ads (RSAs) ───────────────────────────────────────────────────────────────

export const ads = mysqlTable("ads", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  campaignId: int("campaignId").notNull(),
  adGroupId: int("adGroupId").notNull(),
  googleAdId: varchar("googleAdId", { length: 50 }),
  adType: mysqlEnum("adType", ["RSA", "ETA", "PMAX_ASSET"]).default("RSA").notNull(),
  headlines: json("headlines").$type<string[]>().notNull(),
  descriptions: json("descriptions").$type<string[]>().notNull(),
  finalUrl: text("finalUrl"),
  status: mysqlEnum("status", ["DRAFT", "PENDING_REVIEW", "APPROVED", "UPLOADED", "LIVE", "PAUSED", "REMOVED"]).default("DRAFT").notNull(),
  approvedBy: int("approvedBy"),
  approvedAt: timestamp("approvedAt"),
  impressions: int("impressions").default(0),
  clicks: int("clicks").default(0),
  conversions: float("conversions").default(0),
  ctr: float("ctr").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ad = typeof ads.$inferSelect;
export type InsertAd = typeof ads.$inferInsert;

// ─── Ad Asset Performance Labels ─────────────────────────────────────────────

export const adAssetLabels = mysqlTable("ad_asset_labels", {
  id: int("id").autoincrement().primaryKey(),
  adId: int("adId").notNull(),
  assetType: mysqlEnum("assetType", ["HEADLINE", "DESCRIPTION"]).notNull(),
  assetText: text("assetText").notNull(),
  performanceLabel: mysqlEnum("performanceLabel", ["BEST", "GOOD", "LOW", "UNRATED"]).default("UNRATED"),
  impressions: int("impressions").default(0),
  daysLow: int("daysLow").default(0),
  dataDate: timestamp("dataDate").notNull(),
});

// ─── Search Terms ─────────────────────────────────────────────────────────────

export const searchTerms = mysqlTable("search_terms", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  campaignId: int("campaignId"),
  adGroupId: int("adGroupId"),
  searchTerm: text("searchTerm").notNull(),
  matchType: varchar("matchType", { length: 20 }),
  intentLabel: mysqlEnum("intentLabel", ["crisis_intent", "research_intent", "transactional", "brand", "competitor", "irrelevant"]),
  impressions: int("impressions").default(0),
  clicks: int("clicks").default(0),
  conversions: float("conversions").default(0),
  cost: float("cost").default(0),
  addedAsKeyword: boolean("addedAsKeyword").default(false),
  addedAsNegative: boolean("addedAsNegative").default(false),
  addedToPatientLanguage: boolean("addedToPatientLanguage").default(false),
  dataDate: timestamp("dataDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Negative Keywords ────────────────────────────────────────────────────────

export const negativeKeywords = mysqlTable("negative_keywords", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  campaignId: int("campaignId"),
  keyword: varchar("keyword", { length: 500 }).notNull(),
  matchType: mysqlEnum("matchType", ["EXACT", "PHRASE", "BROAD"]).default("PHRASE").notNull(),
  level: mysqlEnum("level", ["CAMPAIGN", "AD_GROUP", "LIST"]).default("CAMPAIGN").notNull(),
  addedBy: int("addedBy"),
  reason: text("reason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Conversion Actions ───────────────────────────────────────────────────────

export const conversionActions = mysqlTable("conversion_actions", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  googleConversionId: varchar("googleConversionId", { length: 50 }),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["PHONE_CALL", "FORM_SUBMIT", "APPOINTMENT", "OFFLINE"]).notNull(),
  countingType: mysqlEnum("countingType", ["ONE_PER_CLICK", "MANY_PER_CLICK"]).default("ONE_PER_CLICK"),
  value: float("value"),
  isActive: boolean("isActive").default(true),
  gclidCaptureVerified: boolean("gclidCaptureVerified").default(false),
  gclidVerifiedAt: timestamp("gclidVerifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Landing Pages ────────────────────────────────────────────────────────────

export const landingPages = mysqlTable("landing_pages", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  campaignId: int("campaignId"),
  slug: varchar("slug", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  h1Text: text("h1Text").notNull(),
  metaDescription: text("metaDescription"),
  status: mysqlEnum("status", ["BUILD_REQUIRED", "DRAFT", "NEEDS_AUDIT", "PUBLISHED"]).default("DRAFT").notNull(),
  intentCluster: varchar("intentCluster", { length: 100 }),
  // Builder config
  builderConfig: json("builderConfig").$type<Record<string, unknown>>(),
  renderedHtmlCache: text("renderedHtmlCache"),
  brandHubVersion: varchar("brandHubVersion", { length: 50 }),
  // Performance
  gclidCaptureVerified: boolean("gclidCaptureVerified").default(false),
  gclidVerifiedAt: timestamp("gclidVerifiedAt"),
  lcpMs: int("lcpMs"),
  cwvStatus: mysqlEnum("cwvStatus", ["PASS", "NEEDS_IMPROVEMENT", "FAIL"]),
  engagementRate: float("engagementRate"),
  formRate: float("formRate"),
  qualityScore: float("qualityScore"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LandingPage = typeof landingPages.$inferSelect;
export type InsertLandingPage = typeof landingPages.$inferInsert;

// ─── Leads ────────────────────────────────────────────────────────────────────

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  patientName: varchar("patientName", { length: 255 }).notNull(),
  patientPhone: varchar("patientPhone", { length: 20 }),
  serviceInterest: varchar("serviceInterest", { length: 255 }),
  locationPreference: varchar("locationPreference", { length: 100 }),
  gclid: varchar("gclid", { length: 500 }),
  utmSource: varchar("utmSource", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 255 }),
  landingPageUrl: text("landingPageUrl"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  outcome: mysqlEnum("outcome", ["NEW", "CONTACTED", "SCHEDULED", "APPT_COMPLETED", "NO_SHOW", "NOT_QUALIFIED"]).default("NEW"),
  outcomeDate: timestamp("outcomeDate"),
  conversionValue: float("conversionValue"),
  followUpDate: timestamp("followUpDate"),
  notes: text("notes"),
  importedToAds: boolean("importedToAds").default(false),
  importTimestamp: timestamp("importTimestamp"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ─── Signal Health ────────────────────────────────────────────────────────────

export const signalHealth = mysqlTable("signal_health", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  campaignId: int("campaignId"),
  signalType: mysqlEnum("signalType", [
    "CONVERSION_TRACKING",
    "GCLID_CAPTURE",
    "BID_STRATEGY",
    "SEARCH_IMPRESSION_SHARE",
    "QUALITY_SCORE",
    "LANDING_PAGE_CWV",
  ]).notNull(),
  status: mysqlEnum("status", ["HEALTHY", "WARNING", "CRITICAL"]).default("HEALTHY").notNull(),
  score: int("score"),
  message: text("message"),
  recommendation: text("recommendation"),
  checkedAt: timestamp("checkedAt").defaultNow().notNull(),
});

// ─── Agent Outputs ────────────────────────────────────────────────────────────

export const agentOutputs = mysqlTable("agent_outputs", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  agentName: varchar("agentName", { length: 100 }).notNull(),
  agentType: mysqlEnum("agentType", [
    "SIGNAL_MONITOR",
    "INTENT_CLASSIFIER",
    "CREATIVE_ANALYZER",
    "BUDGET_PACER",
    "DRIFT_DETECTOR",
    "COPY_GENERATOR",
    "BRIEF_GENERATOR",
    "ENTITY_SCORER",
  ]).notNull(),
  outputType: varchar("outputType", { length: 100 }),
  outputData: json("outputData").$type<Record<string, unknown>>(),
  summary: text("summary"),
  requiresDecision: boolean("requiresDecision").default(false),
  linkedDecisionId: int("linkedDecisionId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Strategy Decisions (Human-in-the-loop gate) ──────────────────────────────

export const strategyDecisions = mysqlTable("strategy_decisions", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  agentOutputId: int("agentOutputId"),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "BUDGET",
    "BID_STRATEGY",
    "CAMPAIGN_STRUCTURE",
    "CREATIVE",
    "NEGATIVE_KEYWORDS",
    "LANDING_PAGE",
    "CONVERSION",
  ]).notNull(),
  priority: mysqlEnum("priority", ["HIGH", "MEDIUM", "LOW"]).default("MEDIUM").notNull(),
  status: mysqlEnum("status", ["PENDING", "APPROVED", "REJECTED", "EXECUTED"]).default("PENDING").notNull(),
  riskLevel: mysqlEnum("riskLevel", ["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  decidedBy: int("decidedBy"),
  decidedAt: timestamp("decidedAt"),
  rejectionReason: text("rejectionReason"),
  executedAt: timestamp("executedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StrategyDecision = typeof strategyDecisions.$inferSelect;
export type InsertStrategyDecision = typeof strategyDecisions.$inferInsert;

// ─── Ops Log ──────────────────────────────────────────────────────────────────

export const opsLog = mysqlTable("ops_log", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  decisionId: int("decisionId"),
  action: varchar("action", { length: 255 }).notNull(),
  entityType: varchar("entityType", { length: 100 }),
  entityId: varchar("entityId", { length: 100 }),
  beforeState: json("beforeState").$type<Record<string, unknown>>(),
  afterState: json("afterState").$type<Record<string, unknown>>(),
  reasonCode: varchar("reasonCode", { length: 100 }),
  notes: text("notes"),
  executedBy: int("executedBy"),
  executedAt: timestamp("executedAt").defaultNow().notNull(),
});

// ─── Knowledge Items ──────────────────────────────────────────────────────────

export const knowledgeItems = mysqlTable("knowledge_items", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  category: mysqlEnum("category", [
    "AD_CAMPAIGNS",
    "CREATIVE",
    "COMPETITIVE_INTEL",
    "AUDIENCE",
    "LANDING_PAGE",
    "CONVERSION",
    "STRATEGY_RULE",
  ]).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  tags: json("tags").$type<string[]>(),
  source: varchar("source", { length: 255 }),
  isStrategyRule: boolean("isStrategyRule").default(false),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KnowledgeItem = typeof knowledgeItems.$inferSelect;
export type InsertKnowledgeItem = typeof knowledgeItems.$inferInsert;

// ─── AI Strategy Sessions ─────────────────────────────────────────────────────

export const strategySessions = mysqlTable("strategy_sessions", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  title: varchar("title", { length: 500 }),
  messages: json("messages").$type<Array<{ role: string; content: string; timestamp: string }>>().notNull(),
  summary: text("summary"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Offline Conversion Import Log ───────────────────────────────────────────

export const conversionImports = mysqlTable("conversion_imports", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  importDate: timestamp("importDate").notNull(),
  leadsProcessed: int("leadsProcessed").default(0),
  conversionsUploaded: int("conversionsUploaded").default(0),
  errors: int("errors").default(0),
  status: mysqlEnum("status", ["SUCCESS", "PARTIAL", "FAILED", "PENDING"]).default("PENDING").notNull(),
  errorDetails: json("errorDetails").$type<string[]>(),
  triggeredBy: mysqlEnum("triggeredBy", ["SCHEDULED", "MANUAL"]).default("SCHEDULED"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Budget Pacing ────────────────────────────────────────────────────────────

export const budgetPacing = mysqlTable("budget_pacing", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  campaignId: int("campaignId").notNull(),
  month: int("month").notNull(),
  year: int("year").notNull(),
  monthlyBudget: float("monthlyBudget").notNull(),
  spentToDate: float("spentToDate").default(0),
  projectedMonthEnd: float("projectedMonthEnd"),
  pacingStatus: mysqlEnum("pacingStatus", ["ON_TRACK", "OVER_PACING", "UNDER_PACING"]).default("ON_TRACK"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Pre-Launch Audit Checklist ───────────────────────────────────────────────

export const preLaunchAudits = mysqlTable("pre_launch_audits", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  campaignId: int("campaignId").notNull(),
  checklistData: json("checklistData").$type<Array<{ item: string; tier: string; passed: boolean; notes?: string }>>().notNull(),
  score: int("score").default(0),
  passed: boolean("passed").default(false),
  auditedBy: int("auditedBy"),
  auditedAt: timestamp("auditedAt").defaultNow().notNull(),
});


