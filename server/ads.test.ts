import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Shared test context ──────────────────────────────────────────────────────
function createTestContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@ensembledigitallabs.com",
      name: "Test User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

// ─── Ads Router Tests ─────────────────────────────────────────────────────────
describe("ads.getClients", () => {
  it("returns an array", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getClients();
    expect(Array.isArray(result)).toBe(true);
  });

  it("each client has id and name", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getClients();
    for (const client of result) {
      expect(client).toHaveProperty("id");
      expect(client).toHaveProperty("name");
    }
  });
});

describe("ads.getCampaigns", () => {
  it("returns an array for clientId 1", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getCampaigns({ clientId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns empty array for non-existent clientId", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getCampaigns({ clientId: 99999 });
    expect(result).toEqual([]);
  });
});

describe("ads.getSignalHealth", () => {
  it("returns an array for clientId 1", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getSignalHealth({ clientId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("ads.getStrategyDecisions", () => {
  it("returns an array for clientId 1", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getStrategyDecisions({ clientId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("each decision has required fields", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getStrategyDecisions({ clientId: 1 });
    for (const d of result) {
      expect(d).toHaveProperty("id");
      expect(d).toHaveProperty("title");
      expect(d).toHaveProperty("status");
      expect(d).toHaveProperty("clientId");
    }
  });
});

describe("ads.getAds", () => {
  it("returns an array for clientId 1", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getAds({ clientId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("ads.getLandingPages", () => {
  it("returns an array for clientId 1", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getLandingPages({ clientId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("ads.getOpsLog", () => {
  it("returns an array for clientId 1", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getOpsLog({ clientId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("ads.getNegativeKeywords", () => {
  it("returns an array for clientId 1", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getNegativeKeywords({ clientId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("ads.getConversionActions", () => {
  it("returns an array for clientId 1", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getConversionActions({ clientId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("ads.getKnowledgeItems", () => {
  it("returns an array for clientId 1", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getKnowledgeItems({ clientId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("ads.getPatientLanguage", () => {
  it("returns an array for clientId 1", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getPatientLanguage({ clientId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("ads.getAgentOutputs", () => {
  it("returns an array for clientId 1", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getAgentOutputs({ clientId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("ads.getBudgetPacing", () => {
  it("returns an array for clientId 1", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getBudgetPacing({ clientId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("ads.getSearchTerms", () => {
  it("returns an array for clientId 1", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.ads.getSearchTerms({ clientId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});
