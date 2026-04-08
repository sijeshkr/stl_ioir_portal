import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

import { sql } from "drizzle-orm";
import {
  clients,
  campaigns,
  adGroups,
  ads,
  adAssetLabels,
  keywords,
  searchTerms,
  negativeKeywords,
  conversionActions,
  landingPages,
  leads,
  signalHealth,
  agentOutputs,
  strategyDecisions,
  opsLog,
  knowledgeItems,
  strategySessions,
  conversionImports,
  budgetPacing,
  patientLanguage,
} from "../drizzle/schema";

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  console.log("🌱 Seeding database...");

  // ── Clients ──────────────────────────────────────────────────────────────────
  await db.insert(clients).values([
    {
      id: 1,
      name: "Smart Pain Solutions",
      domain: "smartpainsolutions.com",
      specialty: "Chiropractic & Pain Management",
      city: "Bridgeton",
      state: "MO",
      primaryColor: "#3B40D4",
      phone: "(314) 721-5390",
      googleAdsCustomerId: "123-456-7890",
      gscSiteUrl: "https://smartpainsolutions.com",
      ga4PropertyId: "GA4-123456",
      isActive: true,
    },
    {
      id: 2,
      name: "STL IO|IR Clinics",
      domain: "stlioir.com",
      specialty: "Interventional Radiology",
      city: "St. Louis",
      state: "MO",
      primaryColor: "#00B4D8",
      phone: "(314) 555-0100",
      googleAdsCustomerId: "987-654-3210",
      gscSiteUrl: "https://stlioir.com",
      ga4PropertyId: "GA4-654321",
      isActive: true,
    },
  ]).onDuplicateKeyUpdate({ set: { name: sql`values(name)` } });

  // ── Campaigns ─────────────────────────────────────────────────────────────────
  await db.insert(campaigns).values([
    {
      id: 1, clientId: 1, googleCampaignId: "C-10001",
      name: "Pain in Crisis — Bridgeton", campaignType: "SEARCH", status: "ENABLED",
      intentCluster: "crisis_intent", funnelStage: "BOF",
      dailyBudget: 45, monthlyBudget: 1350,
      biddingStrategy: "TARGET_CPA", targetCpa: 38,
      spend: 1187.42, impressions: 14820, clicks: 412, conversions: 31.2,
      ctr: 2.78, cpc: 2.88, cpa: 38.06, signalHealthScore: 87, driftScore: 12,
    },
    {
      id: 2, clientId: 1, googleCampaignId: "C-10002",
      name: "Pain in Crisis — Clayton", campaignType: "SEARCH", status: "ENABLED",
      intentCluster: "crisis_intent", funnelStage: "BOF",
      dailyBudget: 35, monthlyBudget: 1050,
      biddingStrategy: "TARGET_CPA", targetCpa: 42,
      spend: 892.10, impressions: 9640, clicks: 287, conversions: 21.4,
      ctr: 2.98, cpc: 3.11, cpa: 41.69, signalHealthScore: 79, driftScore: 28,
    },
    {
      id: 3, clientId: 1, googleCampaignId: "C-10003",
      name: "DOT Physicals", campaignType: "SEARCH", status: "ENABLED",
      intentCluster: "transactional", funnelStage: "BOF",
      dailyBudget: 20, monthlyBudget: 600,
      biddingStrategy: "MAXIMIZE_CLICKS",
      spend: 521.88, impressions: 6200, clicks: 198, conversions: 14.1,
      ctr: 3.19, cpc: 2.64, cpa: 37.01, signalHealthScore: 92, driftScore: 5,
    },
    {
      id: 4, clientId: 1, googleCampaignId: "C-10004",
      name: "Condition Research — Brand", campaignType: "SEARCH", status: "ENABLED",
      intentCluster: "research_intent", funnelStage: "MOF",
      dailyBudget: 15, monthlyBudget: 450,
      biddingStrategy: "TARGET_CPA", targetCpa: 65,
      spend: 388.20, impressions: 18200, clicks: 521, conversions: 6.0,
      ctr: 2.86, cpc: 0.75, cpa: 64.70, signalHealthScore: 74, driftScore: 18,
    },
    {
      id: 5, clientId: 1, googleCampaignId: "C-10005",
      name: "Performance Max — SPS", campaignType: "PMAX", status: "ENABLED",
      intentCluster: "transactional", funnelStage: "BOF",
      dailyBudget: 25, monthlyBudget: 750,
      biddingStrategy: "TARGET_ROAS", targetRoas: 4.2,
      spend: 698.44, impressions: 42100, clicks: 892, conversions: 18.7,
      ctr: 2.12, cpc: 0.78, cpa: 37.35, signalHealthScore: 81, driftScore: 22,
    },
    // STL IO|IR campaigns
    {
      id: 6, clientId: 2, googleCampaignId: "C-20001",
      name: "UFE — Uterine Fibroid Embolization", campaignType: "SEARCH", status: "ENABLED",
      intentCluster: "research_intent", funnelStage: "MOF",
      dailyBudget: 60, monthlyBudget: 1800,
      biddingStrategy: "TARGET_CPA", targetCpa: 120,
      spend: 1542.80, impressions: 8900, clicks: 312, conversions: 12.8,
      ctr: 3.51, cpc: 4.95, cpa: 120.53, signalHealthScore: 83, driftScore: 15,
    },
    {
      id: 7, clientId: 2, googleCampaignId: "C-20002",
      name: "PAD — Peripheral Artery Disease", campaignType: "SEARCH", status: "ENABLED",
      intentCluster: "crisis_intent", funnelStage: "BOF",
      dailyBudget: 50, monthlyBudget: 1500,
      biddingStrategy: "TARGET_CPA", targetCpa: 95,
      spend: 1288.40, impressions: 6700, clicks: 241, conversions: 13.5,
      ctr: 3.60, cpc: 5.35, cpa: 95.44, signalHealthScore: 88, driftScore: 8,
    },
  ]).onDuplicateKeyUpdate({ set: { name: sql`values(name)` } });

  // ── Ad Groups ─────────────────────────────────────────────────────────────────
  await db.insert(adGroups).values([
    { id: 1, clientId: 1, campaignId: 1, googleAdGroupId: "AG-1001", name: "Back Pain Bridgeton", status: "ENABLED", intentCluster: "crisis_intent", spend: 412.10, impressions: 5200, clicks: 148, conversions: 11.2 },
    { id: 2, clientId: 1, campaignId: 1, googleAdGroupId: "AG-1002", name: "Sciatica Bridgeton", status: "ENABLED", intentCluster: "crisis_intent", spend: 388.80, impressions: 4800, clicks: 132, conversions: 9.8 },
    { id: 3, clientId: 1, campaignId: 1, googleAdGroupId: "AG-1003", name: "Neck Pain Bridgeton", status: "ENABLED", intentCluster: "crisis_intent", spend: 386.52, impressions: 4820, clicks: 132, conversions: 10.2 },
    { id: 4, clientId: 1, campaignId: 2, googleAdGroupId: "AG-1004", name: "Back Pain Clayton", status: "ENABLED", intentCluster: "crisis_intent", spend: 445.20, impressions: 4900, clicks: 144, conversions: 10.8 },
    { id: 5, clientId: 1, campaignId: 3, googleAdGroupId: "AG-1005", name: "DOT Physical Near Me", status: "ENABLED", intentCluster: "transactional", spend: 521.88, impressions: 6200, clicks: 198, conversions: 14.1 },
  ]).onDuplicateKeyUpdate({ set: { name: sql`values(name)` } });

  // ── Ads ───────────────────────────────────────────────────────────────────────
  await db.insert(ads).values([
    {
      id: 1, clientId: 1, campaignId: 1, adGroupId: 1,
      googleAdId: "AD-5001",
      adType: "RSA",
      headlines: ["Back Pain Relief in Bridgeton", "Same-Day Chiropractic Care", "Get Out of Pain Today", "Bridgeton's Top Pain Clinic", "Walk-Ins Welcome — Call Now"],
      descriptions: ["Severe back pain? Our Bridgeton clinic offers same-day appointments. Relief starts today.", "Don't let pain control your life. Expert chiropractic care in Bridgeton MO. Call (314) 721-5390."],
      finalUrl: "https://smartpainsolutions.com/back-pain-bridgeton",
      status: "LIVE",
      impressions: 5200, clicks: 148, conversions: 11.2, ctr: 2.85,
    },
    {
      id: 2, clientId: 1, campaignId: 1, adGroupId: 2,
      googleAdId: "AD-5002",
      adType: "RSA",
      headlines: ["Sciatica Pain Relief Today", "Stop Sciatica — See Us Today", "Bridgeton Sciatica Specialist", "Same-Day Sciatica Treatment", "Sciatica Relief Without Surgery"],
      descriptions: ["Sharp shooting leg pain? Our sciatica specialists in Bridgeton can help. Same-day appointments available.", "Sciatica doesn't have to be permanent. Expert care in Bridgeton MO. Call today for fast relief."],
      finalUrl: "https://smartpainsolutions.com/sciatica",
      status: "LIVE",
      impressions: 4800, clicks: 132, conversions: 9.8, ctr: 2.75,
    },
    {
      id: 3, clientId: 1, campaignId: 3, adGroupId: 5,
      googleAdId: "AD-5003",
      adType: "RSA",
      headlines: ["DOT Physical Near Bridgeton", "Same-Day DOT Physicals", "FMCSA Certified DOT Exams", "CDL Physical — Walk-Ins OK", "Fast DOT Physicals in St. Louis"],
      descriptions: ["Need a DOT physical fast? Our FMCSA-certified clinic in Bridgeton offers same-day CDL physicals.", "Walk-in DOT physicals available. Certified medical examiner on staff. Bridgeton & Clayton locations."],
      finalUrl: "https://smartpainsolutions.com/dot-physicals",
      status: "LIVE",
      impressions: 6200, clicks: 198, conversions: 14.1, ctr: 3.19,
    },
  ]).onDuplicateKeyUpdate({ set: { status: sql`values(status)` } });

  // ── Asset Labels ──────────────────────────────────────────────────────────────
  await db.insert(adAssetLabels).values([
    { id: 1, adId: 1, assetType: "HEADLINE", assetText: "Back Pain Relief in Bridgeton", performanceLabel: "BEST", impressions: 2100, daysLow: 0, dataDate: new Date("2026-04-01") },
    { id: 2, adId: 1, assetType: "HEADLINE", assetText: "Same-Day Chiropractic Care", performanceLabel: "GOOD", impressions: 1800, daysLow: 0, dataDate: new Date("2026-04-01") },
    { id: 3, adId: 1, assetType: "HEADLINE", assetText: "Get Out of Pain Today", performanceLabel: "LOW", impressions: 420, daysLow: 18, dataDate: new Date("2026-04-01") },
    { id: 4, adId: 1, assetType: "HEADLINE", assetText: "Bridgeton's Top Pain Clinic", performanceLabel: "LOW", impressions: 380, daysLow: 21, dataDate: new Date("2026-04-01") },
    { id: 5, adId: 1, assetType: "HEADLINE", assetText: "Walk-Ins Welcome — Call Now", performanceLabel: "GOOD", impressions: 500, daysLow: 0, dataDate: new Date("2026-04-01") },
  ]).onDuplicateKeyUpdate({ set: { performanceLabel: sql`values(performanceLabel)` } });

  // ── Keywords ──────────────────────────────────────────────────────────────────
  await db.insert(keywords).values([
    { id: 1, clientId: 1, keyword: "chiropractor near me", intentCluster: "crisis_intent", funnelStage: "BOF", adGroupId: 1, avgCpc: 3.20, qualityScore: 8, paidImpressions: 4200, paidClicks: 142, paidConversions: 10.8, organicPosition: 4.2, organicImpressions: 8800, organicClicks: 312, hasMapPack: true },
    { id: 2, clientId: 1, keyword: "back pain chiropractor", intentCluster: "crisis_intent", funnelStage: "BOF", adGroupId: 1, avgCpc: 2.85, qualityScore: 9, paidImpressions: 3100, paidClicks: 98, paidConversions: 7.4, organicPosition: 6.1, organicImpressions: 5200, organicClicks: 188 },
    { id: 3, clientId: 1, keyword: "sciatica treatment near me", intentCluster: "crisis_intent", funnelStage: "BOF", adGroupId: 2, avgCpc: 3.45, qualityScore: 7, paidImpressions: 2800, paidClicks: 88, paidConversions: 6.2, organicPosition: 8.4, organicImpressions: 3900, organicClicks: 102 },
    { id: 4, clientId: 1, keyword: "DOT physical near me", intentCluster: "transactional", funnelStage: "BOF", adGroupId: 5, avgCpc: 2.10, qualityScore: 10, paidImpressions: 3800, paidClicks: 128, paidConversions: 9.8, organicPosition: 2.1, organicImpressions: 6200, organicClicks: 410, hasMapPack: true },
    { id: 5, clientId: 1, keyword: "neck pain chiropractor", intentCluster: "crisis_intent", funnelStage: "BOF", adGroupId: 3, avgCpc: 2.95, qualityScore: 8, paidImpressions: 2400, paidClicks: 76, paidConversions: 5.8, organicPosition: 5.8, organicImpressions: 4100, organicClicks: 148 },
    { id: 6, clientId: 1, keyword: "what causes sciatica", intentCluster: "research_intent", funnelStage: "TOF", avgCpc: 0.85, qualityScore: 6, paidImpressions: 5800, paidClicks: 210, paidConversions: 2.1, organicPosition: 3.2, organicImpressions: 12400, organicClicks: 820, hasAiOverview: true },
    { id: 7, clientId: 2, keyword: "uterine fibroid embolization", intentCluster: "research_intent", funnelStage: "MOF", avgCpc: 5.20, qualityScore: 8, paidImpressions: 2100, paidClicks: 88, paidConversions: 4.2, organicPosition: 7.1, organicImpressions: 3800, organicClicks: 142 },
    { id: 8, clientId: 2, keyword: "UFE vs hysterectomy", intentCluster: "research_intent", funnelStage: "MOF", avgCpc: 4.80, qualityScore: 7, paidImpressions: 1800, paidClicks: 72, paidConversions: 3.1, organicPosition: 9.2, organicImpressions: 2900, organicClicks: 88, hasAiOverview: true },
    { id: 9, clientId: 2, keyword: "peripheral artery disease treatment", intentCluster: "research_intent", funnelStage: "MOF", avgCpc: 5.80, qualityScore: 8, paidImpressions: 1600, paidClicks: 68, paidConversions: 3.8, organicPosition: 6.4, organicImpressions: 2800, organicClicks: 98 },
  ]).onDuplicateKeyUpdate({ set: { keyword: sql`values(keyword)` } });

  const d = new Date("2026-04-01");
  // ── Search Terms ──────────────────────────────────────────────────────────────
  await db.insert(searchTerms).values([
    { id: 1, clientId: 1, campaignId: 1, adGroupId: 1, searchTerm: "chiropractor bridgeton mo", matchType: "BROAD", intentLabel: "crisis_intent", impressions: 820, clicks: 32, conversions: 2.8, cost: 91.20, addedAsKeyword: true, dataDate: d },
    { id: 2, clientId: 1, campaignId: 1, adGroupId: 1, searchTerm: "back pain doctor near me", matchType: "BROAD", intentLabel: "crisis_intent", impressions: 640, clicks: 24, conversions: 1.9, cost: 68.40, addedAsKeyword: false, dataDate: d },
    { id: 3, clientId: 1, campaignId: 1, adGroupId: 2, searchTerm: "sciatica pain shooting down leg", matchType: "PHRASE", intentLabel: "crisis_intent", impressions: 480, clicks: 18, conversions: 1.4, cost: 62.10, addedToPatientLanguage: true, dataDate: d },
    { id: 4, clientId: 1, campaignId: 1, adGroupId: 1, searchTerm: "free chiropractor consultation", matchType: "BROAD", intentLabel: "research_intent", impressions: 320, clicks: 12, conversions: 0.2, cost: 34.20, addedAsNegative: true, dataDate: d },
    { id: 5, clientId: 1, campaignId: 3, adGroupId: 5, searchTerm: "dot physical exam near me", matchType: "PHRASE", intentLabel: "transactional", impressions: 1200, clicks: 48, conversions: 3.8, cost: 100.80, addedAsKeyword: true, dataDate: d },
    { id: 6, clientId: 1, campaignId: 3, adGroupId: 5, searchTerm: "cdl medical exam bridgeton", matchType: "BROAD", intentLabel: "transactional", impressions: 680, clicks: 28, conversions: 2.1, cost: 58.80, addedAsKeyword: false, dataDate: d },
    { id: 7, clientId: 1, campaignId: 1, adGroupId: 1, searchTerm: "chiropractic school near me", matchType: "BROAD", intentLabel: "irrelevant", impressions: 280, clicks: 8, conversions: 0, cost: 22.40, addedAsNegative: true, dataDate: d },
    { id: 8, clientId: 2, campaignId: 6, searchTerm: "fibroid treatment without surgery", matchType: "BROAD", intentLabel: "research_intent", impressions: 520, clicks: 22, conversions: 1.2, cost: 108.90, addedToPatientLanguage: true, dataDate: d },
    { id: 9, clientId: 2, campaignId: 7, searchTerm: "leg pain walking peripheral artery", matchType: "BROAD", intentLabel: "crisis_intent", impressions: 380, clicks: 16, conversions: 1.8, cost: 85.60, addedAsKeyword: true, dataDate: d },
    { id: 10, clientId: 2, campaignId: 6, searchTerm: "UFE recovery time", matchType: "PHRASE", intentLabel: "research_intent", impressions: 420, clicks: 18, conversions: 0.9, cost: 86.40, addedToPatientLanguage: true, dataDate: d },
  ]).onDuplicateKeyUpdate({ set: { searchTerm: sql`values(searchTerm)` } });

  // ── Negative Keywords ─────────────────────────────────────────────────────────
  await db.insert(negativeKeywords).values([
    { id: 1, clientId: 1, campaignId: 1, keyword: "chiropractic school", matchType: "PHRASE", level: "CAMPAIGN", reason: "Irrelevant — education intent" },
    { id: 2, clientId: 1, campaignId: 1, keyword: "free", matchType: "BROAD", level: "CAMPAIGN", reason: "Low-quality intent, high bounce rate" },
    { id: 3, clientId: 1, campaignId: 1, keyword: "jobs", matchType: "BROAD", level: "CAMPAIGN", reason: "Employment intent" },
    { id: 4, clientId: 1, campaignId: 1, keyword: "salary", matchType: "BROAD", level: "CAMPAIGN", reason: "Employment intent" },
    { id: 5, clientId: 1, campaignId: 3, keyword: "online dot physical", matchType: "PHRASE", level: "CAMPAIGN", reason: "DOT physicals cannot be done online — irrelevant" },
    { id: 6, clientId: 2, campaignId: 6, keyword: "fibroid diet", matchType: "PHRASE", level: "CAMPAIGN", reason: "Research/lifestyle intent, not procedure intent" },
    { id: 7, clientId: 2, campaignId: 6, keyword: "fibroid surgery", matchType: "PHRASE", level: "CAMPAIGN", reason: "Surgical intent — we offer non-surgical UFE" },
  ]).onDuplicateKeyUpdate({ set: { keyword: sql`values(keyword)` } });

  // ── Conversion Actions ────────────────────────────────────────────────────────
  await db.insert(conversionActions).values([
    { id: 1, clientId: 1, googleConversionId: "CV-1001", name: "APPT_COMPLETED_SPS", category: "OFFLINE", countingType: "ONE_PER_CLICK", value: 180, isActive: true, gclidCaptureVerified: true, gclidVerifiedAt: new Date("2026-03-15") },
    { id: 2, clientId: 1, googleConversionId: "CV-1002", name: "PHONE_CALL_SPS", category: "PHONE_CALL", countingType: "ONE_PER_CLICK", value: 45, isActive: true, gclidCaptureVerified: true },
    { id: 3, clientId: 1, googleConversionId: "CV-1003", name: "FORM_SUBMIT_SPS", category: "FORM_SUBMIT", countingType: "ONE_PER_CLICK", value: 25, isActive: true, gclidCaptureVerified: true },
    { id: 4, clientId: 2, googleConversionId: "CV-2001", name: "APPT_COMPLETED_STLIOIR", category: "OFFLINE", countingType: "ONE_PER_CLICK", value: 450, isActive: true, gclidCaptureVerified: true },
    { id: 5, clientId: 2, googleConversionId: "CV-2002", name: "CONSULTATION_REQUEST_STLIOIR", category: "FORM_SUBMIT", countingType: "ONE_PER_CLICK", value: 80, isActive: true, gclidCaptureVerified: false },
  ]).onDuplicateKeyUpdate({ set: { name: sql`values(name)` } });

  // ── Landing Pages ─────────────────────────────────────────────────────────────
  await db.insert(landingPages).values([
    { id: 1, clientId: 1, campaignId: 1, slug: "back-pain-bridgeton", title: "Fast Back Pain Relief in Bridgeton MO | Smart Pain Solutions", h1Text: "Fast Back Pain Relief in Bridgeton, MO", metaDescription: "Same-day chiropractic care for back pain in Bridgeton MO. Walk-ins welcome. Call (314) 721-5390.", status: "PUBLISHED", intentCluster: "crisis_intent", gclidCaptureVerified: true, lcpMs: 1800, cwvStatus: "PASS", engagementRate: 0.44, formRate: 0.068, qualityScore: 8.1, publishedAt: new Date("2026-01-15") },
    { id: 2, clientId: 1, campaignId: 1, slug: "sciatica-bridgeton", title: "Sciatica Pain Relief in Bridgeton MO | Smart Pain Solutions", h1Text: "Sciatica Relief Without Surgery in Bridgeton", metaDescription: "Sharp shooting leg pain? Our sciatica specialists in Bridgeton offer same-day care.", status: "PUBLISHED", intentCluster: "crisis_intent", gclidCaptureVerified: true, lcpMs: 2100, cwvStatus: "PASS", engagementRate: 0.38, formRate: 0.055, qualityScore: 7.4, publishedAt: new Date("2026-01-20") },
    { id: 3, clientId: 1, campaignId: 3, slug: "dot-physicals", title: "Same-Day DOT Physicals in Bridgeton & Clayton MO | Smart Pain Solutions", h1Text: "Same-Day DOT Physicals — Walk-Ins Welcome", metaDescription: "FMCSA-certified DOT physicals in Bridgeton and Clayton MO. Fast, affordable CDL medical exams.", status: "PUBLISHED", intentCluster: "transactional", gclidCaptureVerified: true, lcpMs: 1600, cwvStatus: "PASS", engagementRate: 0.51, formRate: 0.082, qualityScore: 9.2, publishedAt: new Date("2026-02-01") },
    { id: 4, clientId: 1, campaignId: 2, slug: "back-pain-clayton", title: "Back Pain Relief in Clayton MO | Smart Pain Solutions", h1Text: "Back Pain Relief in Clayton, MO", metaDescription: "Expert chiropractic care for back pain in Clayton MO. Same-day appointments available.", status: "NEEDS_AUDIT", intentCluster: "crisis_intent", gclidCaptureVerified: true, lcpMs: 3200, cwvStatus: "NEEDS_IMPROVEMENT", engagementRate: 0.31, formRate: 0.041, qualityScore: 6.8 },
    { id: 5, clientId: 2, campaignId: 6, slug: "ufe-st-louis", title: "Uterine Fibroid Embolization in St. Louis | STL IO|IR", h1Text: "Non-Surgical Fibroid Treatment in St. Louis", metaDescription: "UFE is a minimally invasive alternative to hysterectomy. Expert interventional radiologists in St. Louis.", status: "PUBLISHED", intentCluster: "research_intent", gclidCaptureVerified: true, lcpMs: 1900, cwvStatus: "PASS", engagementRate: 0.48, formRate: 0.062, qualityScore: 8.4, publishedAt: new Date("2026-02-15") },
    { id: 6, clientId: 2, campaignId: 7, slug: "pad-treatment-st-louis", title: "PAD Treatment in St. Louis | STL IO|IR Clinics", h1Text: "Peripheral Artery Disease Treatment — Restore Blood Flow", metaDescription: "Minimally invasive PAD treatment in St. Louis. Avoid amputation with expert interventional radiology care.", status: "BUILD_REQUIRED", intentCluster: "crisis_intent", gclidCaptureVerified: false },
  ]).onDuplicateKeyUpdate({ set: { status: sql`values(status)` } });

  // ── Leads ─────────────────────────────────────────────────────────────────────
  await db.insert(leads).values([
    { id: 1, clientId: 1, patientName: "James Whitfield", patientPhone: "(314) 555-0142", serviceInterest: "Back Pain", locationPreference: "Bridgeton", gclid: "EAIaIQobChMI_abc123", utmSource: "google", utmMedium: "cpc", utmCampaign: "Pain in Crisis — Bridgeton", landingPageUrl: "https://smartpainsolutions.com/back-pain-bridgeton", outcome: "APPT_COMPLETED", outcomeDate: new Date("2026-03-28"), conversionValue: 180, importedToAds: true },
    { id: 2, clientId: 1, patientName: "Maria Santos", patientPhone: "(314) 555-0198", serviceInterest: "Sciatica", locationPreference: "Bridgeton", gclid: "EAIaIQobChMI_def456", utmSource: "google", utmMedium: "cpc", utmCampaign: "Pain in Crisis — Bridgeton", landingPageUrl: "https://smartpainsolutions.com/sciatica", outcome: "SCHEDULED", outcomeDate: new Date("2026-04-02"), importedToAds: false },
    { id: 3, clientId: 1, patientName: "Robert Chen", patientPhone: "(314) 555-0267", serviceInterest: "DOT Physical", locationPreference: "Bridgeton", gclid: "EAIaIQobChMI_ghi789", utmSource: "google", utmMedium: "cpc", utmCampaign: "DOT Physicals", landingPageUrl: "https://smartpainsolutions.com/dot-physicals", outcome: "APPT_COMPLETED", outcomeDate: new Date("2026-04-01"), conversionValue: 180, importedToAds: true },
    { id: 4, clientId: 1, patientName: "Linda Thompson", patientPhone: "(314) 555-0312", serviceInterest: "Neck Pain", locationPreference: "Clayton", gclid: "EAIaIQobChMI_jkl012", utmSource: "google", utmMedium: "cpc", utmCampaign: "Pain in Crisis — Clayton", landingPageUrl: "https://smartpainsolutions.com/neck-pain", outcome: "CONTACTED", importedToAds: false },
    { id: 5, clientId: 1, patientName: "David Park", patientPhone: "(314) 555-0445", serviceInterest: "Back Pain", locationPreference: "Bridgeton", gclid: null, utmSource: "organic", utmMedium: "organic", outcome: "NEW", importedToAds: false },
    { id: 6, clientId: 2, patientName: "Patricia Williams", patientPhone: "(314) 555-0521", serviceInterest: "UFE", locationPreference: "St. Louis", gclid: "EAIaIQobChMI_mno345", utmSource: "google", utmMedium: "cpc", utmCampaign: "UFE — Uterine Fibroid Embolization", landingPageUrl: "https://stlioir.com/ufe-st-louis", outcome: "SCHEDULED", outcomeDate: new Date("2026-04-05"), importedToAds: false },
    { id: 7, clientId: 2, patientName: "Michael Johnson", patientPhone: "(314) 555-0634", serviceInterest: "PAD Treatment", locationPreference: "St. Louis", gclid: "EAIaIQobChMI_pqr678", utmSource: "google", utmMedium: "cpc", utmCampaign: "PAD — Peripheral Artery Disease", landingPageUrl: "https://stlioir.com/pad-treatment-st-louis", outcome: "APPT_COMPLETED", outcomeDate: new Date("2026-04-03"), conversionValue: 450, importedToAds: true },
    { id: 8, clientId: 1, patientName: "Susan Martinez", patientPhone: "(314) 555-0789", serviceInterest: "DOT Physical", locationPreference: "Bridgeton", gclid: "EAIaIQobChMI_stu901", utmSource: "google", utmMedium: "cpc", utmCampaign: "DOT Physicals", landingPageUrl: "https://smartpainsolutions.com/dot-physicals", outcome: "APPT_COMPLETED", outcomeDate: new Date("2026-04-04"), conversionValue: 180, importedToAds: true },
    { id: 9, clientId: 1, patientName: "Kevin Brown", patientPhone: "(314) 555-0856", serviceInterest: "Sciatica", locationPreference: "Clayton", gclid: null, utmSource: "google", utmMedium: "cpc", utmCampaign: "Pain in Crisis — Clayton", outcome: "NO_SHOW", outcomeDate: new Date("2026-04-01"), importedToAds: false },
    { id: 10, clientId: 2, patientName: "Angela Davis", patientPhone: "(314) 555-0912", serviceInterest: "TACE", locationPreference: "St. Louis", gclid: "EAIaIQobChMI_vwx234", utmSource: "google", utmMedium: "cpc", utmCampaign: "UFE — Uterine Fibroid Embolization", outcome: "NEW", importedToAds: false },
  ]).onDuplicateKeyUpdate({ set: { outcome: sql`values(outcome)` } });

  // ── Signal Health ─────────────────────────────────────────────────────────────
  await db.insert(signalHealth).values([
    { id: 1, clientId: 1, campaignId: 1, signalType: "CONVERSION_TRACKING", status: "HEALTHY", score: 95, message: "All conversion actions firing correctly", checkedAt: new Date() },
    { id: 2, clientId: 1, campaignId: 1, signalType: "GCLID_CAPTURE", status: "HEALTHY", score: 98, message: "GCLID captured on 98% of form submissions", checkedAt: new Date() },
    { id: 3, clientId: 1, campaignId: 2, signalType: "BID_STRATEGY", status: "WARNING", score: 62, message: "Target CPA campaign has fewer than 30 conversions in 30 days", recommendation: "Consider switching to Maximize Conversions until conversion volume increases", checkedAt: new Date() },
    { id: 4, clientId: 1, campaignId: 5, signalType: "SEARCH_IMPRESSION_SHARE", status: "WARNING", score: 58, message: "Search IS lost to budget: 28%. Increase daily budget or tighten targeting.", recommendation: "Increase daily budget from $25 to $35 or reduce geographic radius", checkedAt: new Date() },
    { id: 5, clientId: 2, campaignId: 6, signalType: "CONVERSION_TRACKING", status: "CRITICAL", score: 22, message: "Offline conversion import failed last 3 nights — no APPT_COMPLETED signals in 72 hours", recommendation: "Check n8n workflow — CRM API token may have expired", checkedAt: new Date() },
    { id: 6, clientId: 2, campaignId: 7, signalType: "QUALITY_SCORE", status: "HEALTHY", score: 88, message: "Average QS 8.2 across active keywords", checkedAt: new Date() },
  ]).onDuplicateKeyUpdate({ set: { status: sql`values(status)` } });

  // ── Strategy Decisions ────────────────────────────────────────────────────────
  await db.insert(strategyDecisions).values([
    { id: 1, clientId: 1, title: "Switch OSC campaign to Max Clicks — remove Scroll 50% conversion action", description: "Signal quality issues flagged overnight. Scroll 50% is diluting conversion data and causing bid strategy instability. Switch to Max Clicks temporarily while we rebuild conversion quality.", category: "BID_STRATEGY", priority: "HIGH", status: "APPROVED", riskLevel: "MEDIUM", decidedAt: new Date("2026-04-06") },
    { id: 2, clientId: 1, title: "Add 'chiropractic school' and 'chiropractic jobs' as exact match negatives — all campaigns", description: "These terms are appearing in search terms report with 0 conversions and $48 wasted spend this month.", category: "NEGATIVE_KEYWORDS", priority: "MEDIUM", status: "EXECUTED", riskLevel: "LOW", decidedAt: new Date("2026-04-05"), executedAt: new Date("2026-04-05") },
    { id: 3, clientId: 1, title: "Increase DOT Physicals daily budget from $20 to $28", description: "Campaign is consistently hitting budget cap by 2pm. Search IS lost to budget is 34%. High-intent, high-conversion campaign — budget increase is justified.", category: "BUDGET", priority: "HIGH", status: "PENDING", riskLevel: "LOW" },
    { id: 4, clientId: 1, title: "Replace 3 LOW-performing headlines in Back Pain Bridgeton RSA", description: "'Get Out of Pain Today', 'Bridgeton's Top Pain Clinic', and 'Relief Starts Here' have been LOW for 18+ days. Replace with patient language from search terms: 'Sharp Back Pain Relief', 'Bridgeton Same-Day Appointments', 'Back Pain Stopping You?'", category: "CREATIVE", priority: "MEDIUM", status: "PENDING", riskLevel: "LOW" },
    { id: 5, clientId: 2, title: "Fix offline conversion import — CRM API token renewal required", description: "n8n workflow failing for 72 hours. APPT_COMPLETED signals not reaching Google Ads. Bid strategies are operating blind. URGENT.", category: "CONVERSION", priority: "HIGH", status: "PENDING", riskLevel: "HIGH" },
    { id: 6, clientId: 2, title: "Build PAD landing page — currently sending to homepage", description: "PAD campaign is sending traffic to homepage with no relevant content. Build dedicated landing page at /pad-treatment-st-louis with procedure info, before/after outcomes, and consultation CTA.", category: "LANDING_PAGE", priority: "HIGH", status: "PENDING", riskLevel: "MEDIUM" },
  ]).onDuplicateKeyUpdate({ set: { status: sql`values(status)` } });

  // ── Ops Log ───────────────────────────────────────────────────────────────────
  await db.insert(opsLog).values([
    { id: 1, clientId: 1, decisionId: 2, action: "Added negative keyword: 'chiropractic school' [EXACT] — Campaign: Pain in Crisis Bridgeton", entityType: "NEGATIVE_KEYWORD", entityId: "1", reasonCode: "IRRELEVANT_INTENT", notes: "0 conversions, $22.40 wasted spend", executedAt: new Date("2026-04-05T14:22:00") },
    { id: 2, clientId: 1, decisionId: 2, action: "Added negative keyword: 'chiropractic jobs' [BROAD] — All campaigns", entityType: "NEGATIVE_KEYWORD", entityId: "2", reasonCode: "IRRELEVANT_INTENT", notes: "Employment intent, $25.60 wasted spend", executedAt: new Date("2026-04-05T14:24:00") },
    { id: 3, clientId: 1, decisionId: 1, action: "Switched OSC campaign bid strategy: TARGET_CPA → MAXIMIZE_CLICKS", entityType: "CAMPAIGN", entityId: "5", beforeState: { biddingStrategy: "TARGET_CPA", targetCpa: 65 }, afterState: { biddingStrategy: "MAXIMIZE_CLICKS" }, reasonCode: "SIGNAL_QUALITY", executedAt: new Date("2026-04-06T09:15:00") },
    { id: 4, clientId: 2, action: "Offline conversion import completed — 7 APPT_COMPLETED events uploaded", entityType: "CONVERSION_IMPORT", entityId: "1", notes: "Nightly n8n workflow", executedAt: new Date("2026-04-03T23:05:00") },
  ]).onDuplicateKeyUpdate({ set: { action: sql`values(action)` } });

  // ── Knowledge Items ───────────────────────────────────────────────────────────
  await db.insert(knowledgeItems).values([
    { id: 1, clientId: 1, category: "AD_CAMPAIGNS", title: "DOT Physicals — What Works", content: "DOT Physical campaigns consistently outperform other campaigns in QS (avg 9.2) and conversion rate (7.1%). Key insight: 'walk-in' and 'same-day' in headlines drive 40% higher CTR than location-only headlines. FMCSA-certified is a strong trust signal — include in every ad.", tags: ["DOT", "headlines", "CTR"], source: "Campaign analysis Q1 2026", isStrategyRule: false },
    { id: 2, clientId: 1, category: "COMPETITIVE_INTEL", title: "Competitor: Midwest Spine & Pain — Ad Strategy", content: "Running aggressive brand bidding on 'Smart Pain Solutions' keyword. Using 'No Wait Times' as primary differentiator. Their landing pages have no GCLID capture — opportunity to outperform on offline conversion data quality. Their DOT Physical ads use '$59 DOT Physical' — price-focused, not quality-focused.", tags: ["competitor", "brand bidding", "DOT"], source: "DataForSEO Ads API — Apr 2026" },
    { id: 3, clientId: 1, category: "CREATIVE", title: "Patient Language — Crisis Intent Phrases That Convert", content: "High-converting phrases from search terms and reviews: 'sharp shooting pain down my leg', 'can't sit or stand', 'pain woke me up at night', 'been suffering for weeks', 'tried everything'. Use these in description copy, not headlines. Headlines should be solution-focused; descriptions should acknowledge the pain.", tags: ["patient language", "copy", "crisis intent"], source: "Search terms analysis + review mining", isStrategyRule: false },
    { id: 4, clientId: 1, category: "STRATEGY_RULE", title: "Rule: Never run Target CPA with fewer than 30 conversions/30 days", content: "Google's smart bidding requires minimum 30 conversions per 30 days to exit learning mode. Below this threshold, bid strategy is unstable and CPA will spike. Use Maximize Conversions until threshold is met, then switch to Target CPA.", tags: ["bidding", "smart bidding", "learning mode"], source: "Google Ads best practices", isStrategyRule: true },
    { id: 5, clientId: 2, category: "AD_CAMPAIGNS", title: "UFE Campaign — Research Intent Requires Longer Consideration Path", content: "UFE is a high-consideration procedure. Patients research for 2-6 weeks before scheduling. Mid-funnel keywords ('UFE vs hysterectomy', 'fibroid treatment options') should target informational landing pages, not direct consultation CTAs. Retargeting is critical for this campaign.", tags: ["UFE", "consideration", "retargeting"], source: "Campaign analysis Q1 2026" },
    { id: 6, clientId: 2, category: "STRATEGY_RULE", title: "Rule: All IO|IR procedures require pre-consultation landing pages, not direct scheduling CTAs", content: "Interventional radiology procedures require physician consultation and imaging review before scheduling. Landing pages should CTA to 'Request Consultation' or 'Learn If You're a Candidate' — never 'Book Now' or 'Schedule Today'. Direct scheduling CTAs increase unqualified leads and waste clinical staff time.", tags: ["IO|IR", "CTA", "landing page"], source: "Client feedback — Dr. Vaheesan", isStrategyRule: true },
  ]).onDuplicateKeyUpdate({ set: { title: sql`values(title)` } });

  // ── Patient Language ──────────────────────────────────────────────────────────
  await db.insert(patientLanguage).values([
    { id: 1, clientId: 1, phrase: "sharp shooting pain down my leg", source: "search_term", usedInAd: false, usedInContent: true },
    { id: 2, clientId: 1, phrase: "can't sit or stand without pain", source: "review", usedInAd: true, usedInContent: true },
    { id: 3, clientId: 1, phrase: "pain woke me up at night", source: "review", usedInAd: false, usedInContent: false },
    { id: 4, clientId: 1, phrase: "tried everything nothing works", source: "reddit", usedInAd: false, usedInContent: false },
    { id: 5, clientId: 1, phrase: "walk in same day appointment", source: "search_term", usedInAd: true, usedInContent: false },
    { id: 6, clientId: 2, phrase: "fibroid treatment without surgery", source: "search_term", usedInAd: false, usedInContent: true },
    { id: 7, clientId: 2, phrase: "legs hurt when walking", source: "review", usedInAd: false, usedInContent: false },
    { id: 8, clientId: 2, phrase: "avoid hysterectomy natural options", source: "reddit", usedInAd: false, usedInContent: false },
  ]).onDuplicateKeyUpdate({ set: { phrase: sql`values(phrase)` } });

  // ── Conversion Imports ────────────────────────────────────────────────────────
  await db.insert(conversionImports).values([
    { id: 1, clientId: 1, importDate: new Date("2026-04-06T23:05:00"), leadsProcessed: 12, conversionsUploaded: 9, errors: 0, status: "SUCCESS", triggeredBy: "SCHEDULED" },
    { id: 2, clientId: 1, importDate: new Date("2026-04-05T23:05:00"), leadsProcessed: 10, conversionsUploaded: 8, errors: 0, status: "SUCCESS", triggeredBy: "SCHEDULED" },
    { id: 3, clientId: 1, importDate: new Date("2026-04-04T23:05:00"), leadsProcessed: 14, conversionsUploaded: 11, errors: 1, status: "PARTIAL", errorDetails: ["Lead ID 42: GCLID expired (>90 days)"], triggeredBy: "SCHEDULED" },
    { id: 4, clientId: 2, importDate: new Date("2026-04-06T23:05:00"), leadsProcessed: 0, conversionsUploaded: 0, errors: 1, status: "FAILED", errorDetails: ["CRM API authentication failed — token expired"], triggeredBy: "SCHEDULED" },
    { id: 5, clientId: 2, importDate: new Date("2026-04-05T23:05:00"), leadsProcessed: 0, conversionsUploaded: 0, errors: 1, status: "FAILED", errorDetails: ["CRM API authentication failed — token expired"], triggeredBy: "SCHEDULED" },
    { id: 6, clientId: 2, importDate: new Date("2026-04-03T23:05:00"), leadsProcessed: 8, conversionsUploaded: 7, errors: 0, status: "SUCCESS", triggeredBy: "SCHEDULED" },
  ]).onDuplicateKeyUpdate({ set: { status: sql`values(status)` } });

  // ── Budget Pacing ─────────────────────────────────────────────────────────────
  await db.insert(budgetPacing).values([
    { id: 1, clientId: 1, campaignId: 1, month: 4, year: 2026, monthlyBudget: 1350, spentToDate: 1187.42, projectedMonthEnd: 1420, pacingStatus: "OVER_PACING" },
    { id: 2, clientId: 1, campaignId: 2, month: 4, year: 2026, monthlyBudget: 1050, spentToDate: 892.10, projectedMonthEnd: 1068, pacingStatus: "ON_TRACK" },
    { id: 3, clientId: 1, campaignId: 3, month: 4, year: 2026, monthlyBudget: 600, spentToDate: 521.88, projectedMonthEnd: 626, pacingStatus: "OVER_PACING" },
    { id: 4, clientId: 1, campaignId: 4, month: 4, year: 2026, monthlyBudget: 450, spentToDate: 388.20, projectedMonthEnd: 466, pacingStatus: "ON_TRACK" },
    { id: 5, clientId: 1, campaignId: 5, month: 4, year: 2026, monthlyBudget: 750, spentToDate: 698.44, projectedMonthEnd: 838, pacingStatus: "OVER_PACING" },
    { id: 6, clientId: 2, campaignId: 6, month: 4, year: 2026, monthlyBudget: 1800, spentToDate: 1542.80, projectedMonthEnd: 1851, pacingStatus: "ON_TRACK" },
    { id: 7, clientId: 2, campaignId: 7, month: 4, year: 2026, monthlyBudget: 1500, spentToDate: 1288.40, projectedMonthEnd: 1546, pacingStatus: "ON_TRACK" },
  ]).onDuplicateKeyUpdate({ set: { spentToDate: sql`values(spentToDate)` } });

  // ── Agent Outputs ─────────────────────────────────────────────────────────────
  await db.insert(agentOutputs).values([
    { id: 1, clientId: 1, agentName: "Signal Monitor", agentType: "SIGNAL_MONITOR", outputType: "ALERT", summary: "OSC campaign: Scroll 50% conversion action detected as primary — diluting bid strategy signals. Recommend removal.", requiresDecision: true, linkedDecisionId: 1, createdAt: new Date("2026-04-06T06:00:00") },
    { id: 2, clientId: 1, agentName: "Intent Classifier", agentType: "INTENT_CLASSIFIER", outputType: "SEARCH_TERM_LABELS", summary: "Classified 48 new search terms. Found 6 irrelevant terms ($48 wasted spend). Flagged 3 patient language phrases for library.", requiresDecision: false, createdAt: new Date("2026-04-06T06:15:00") },
    { id: 3, clientId: 1, agentName: "Budget Pacer", agentType: "BUDGET_PACER", outputType: "PACING_ALERT", summary: "DOT Physicals campaign projected to overspend by $26 this month. Hitting daily cap by 2pm consistently. Recommend budget increase.", requiresDecision: true, linkedDecisionId: 3, createdAt: new Date("2026-04-06T07:00:00") },
    { id: 4, clientId: 1, agentName: "Creative Analyzer", agentType: "CREATIVE_ANALYZER", outputType: "ASSET_REVIEW", summary: "3 headlines in Back Pain Bridgeton RSA have been LOW for 18+ days. Replacement suggestions generated from patient language library.", requiresDecision: true, linkedDecisionId: 4, createdAt: new Date("2026-04-06T07:30:00") },
    { id: 5, clientId: 2, agentName: "Signal Monitor", agentType: "SIGNAL_MONITOR", outputType: "CRITICAL_ALERT", summary: "CRITICAL: Offline conversion import failed for 72 hours. n8n workflow error — CRM API token expired. Bid strategies operating without offline signals.", requiresDecision: true, linkedDecisionId: 5, createdAt: new Date("2026-04-06T06:00:00") },
  ]).onDuplicateKeyUpdate({ set: { summary: sql`values(summary)` } });

  // ── Strategy Sessions ─────────────────────────────────────────────────────────
  await db.insert(strategySessions).values([
    {
      id: 1, clientId: 1, title: "Q2 2026 Campaign Strategy Review",
      messages: [
        { role: "user", content: "What's the biggest opportunity for SPS this quarter?", timestamp: "2026-04-01T10:00:00Z" },
        { role: "assistant", content: "Based on the current account data, the DOT Physicals campaign is your highest-ROI opportunity. It has the best QS (9.2 avg), highest conversion rate (7.1%), and is consistently hitting budget cap by 2pm. Increasing the daily budget from $20 to $28 would capture an estimated 40% more conversions at the same CPA. The second opportunity is replacing the 3 LOW-performing headlines in the Back Pain Bridgeton RSA — those have been dragging down the RSA strength score.", timestamp: "2026-04-01T10:00:15Z" },
        { role: "user", content: "What about the Clayton campaign underperformance?", timestamp: "2026-04-01T10:02:00Z" },
        { role: "assistant", content: "The Clayton campaign has two issues: (1) The landing page LCP is 3.2s — above the 2.5s threshold — which is hurting Quality Score and form rate. The Bridgeton page converts at 6.8% vs Clayton's 4.1%. (2) The bid strategy has fewer than 30 conversions in 30 days, so Target CPA is in extended learning mode. I'd recommend switching to Maximize Conversions temporarily and prioritizing the landing page CWV fix.", timestamp: "2026-04-01T10:02:20Z" },
      ],
      summary: "Identified DOT budget increase and Clayton landing page CWV fix as top Q2 priorities.",
    },
  ]).onDuplicateKeyUpdate({ set: { title: sql`values(title)` } });

  console.log("✅ Seed complete!");
  await connection.end();
}

seed().catch(console.error);
