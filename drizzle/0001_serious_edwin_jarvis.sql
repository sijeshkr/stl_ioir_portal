CREATE TABLE `ad_asset_labels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adId` int NOT NULL,
	`assetType` enum('HEADLINE','DESCRIPTION') NOT NULL,
	`assetText` text NOT NULL,
	`performanceLabel` enum('BEST','GOOD','LOW','UNRATED') DEFAULT 'UNRATED',
	`impressions` int DEFAULT 0,
	`daysLow` int DEFAULT 0,
	`dataDate` timestamp NOT NULL,
	CONSTRAINT `ad_asset_labels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ad_groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`campaignId` int NOT NULL,
	`googleAdGroupId` varchar(50),
	`name` varchar(255) NOT NULL,
	`status` enum('ENABLED','PAUSED','REMOVED') NOT NULL DEFAULT 'ENABLED',
	`intentCluster` varchar(100),
	`spend` float DEFAULT 0,
	`impressions` int DEFAULT 0,
	`clicks` int DEFAULT 0,
	`conversions` float DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ad_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`campaignId` int NOT NULL,
	`adGroupId` int NOT NULL,
	`googleAdId` varchar(50),
	`adType` enum('RSA','ETA','PMAX_ASSET') NOT NULL DEFAULT 'RSA',
	`headlines` json NOT NULL,
	`descriptions` json NOT NULL,
	`finalUrl` text,
	`status` enum('DRAFT','PENDING_REVIEW','APPROVED','UPLOADED','LIVE','PAUSED','REMOVED') NOT NULL DEFAULT 'DRAFT',
	`approvedBy` int,
	`approvedAt` timestamp,
	`impressions` int DEFAULT 0,
	`clicks` int DEFAULT 0,
	`conversions` float DEFAULT 0,
	`ctr` float DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agent_outputs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`agentName` varchar(100) NOT NULL,
	`agentType` enum('SIGNAL_MONITOR','INTENT_CLASSIFIER','CREATIVE_ANALYZER','BUDGET_PACER','DRIFT_DETECTOR','COPY_GENERATOR','BRIEF_GENERATOR','ENTITY_SCORER') NOT NULL,
	`outputType` varchar(100),
	`outputData` json,
	`summary` text,
	`requiresDecision` boolean DEFAULT false,
	`linkedDecisionId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agent_outputs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `budget_pacing` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`campaignId` int NOT NULL,
	`month` int NOT NULL,
	`year` int NOT NULL,
	`monthlyBudget` float NOT NULL,
	`spentToDate` float DEFAULT 0,
	`projectedMonthEnd` float,
	`pacingStatus` enum('ON_TRACK','OVER_PACING','UNDER_PACING') DEFAULT 'ON_TRACK',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `budget_pacing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`googleCampaignId` varchar(50),
	`name` varchar(255) NOT NULL,
	`campaignType` enum('SEARCH','PMAX','DISPLAY','VIDEO') NOT NULL DEFAULT 'SEARCH',
	`status` enum('ENABLED','PAUSED','REMOVED','DRAFT') NOT NULL DEFAULT 'DRAFT',
	`intentCluster` enum('crisis_intent','research_intent','transactional','brand','competitor'),
	`funnelStage` enum('TOF','MOF','BOF'),
	`linkedStrategyId` int,
	`approvedInMeetingDate` timestamp,
	`dailyBudget` float,
	`monthlyBudget` float,
	`biddingStrategy` varchar(100),
	`targetCpa` float,
	`targetRoas` float,
	`spend` float DEFAULT 0,
	`impressions` int DEFAULT 0,
	`clicks` int DEFAULT 0,
	`conversions` float DEFAULT 0,
	`ctr` float DEFAULT 0,
	`cpc` float DEFAULT 0,
	`cpa` float DEFAULT 0,
	`signalHealthScore` int,
	`driftScore` int,
	`lastSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`domain` varchar(255),
	`specialty` varchar(255),
	`city` varchar(100),
	`state` varchar(50),
	`primaryColor` varchar(7),
	`logoUrl` text,
	`phone` varchar(20),
	`googleAdsCustomerId` varchar(50),
	`gscSiteUrl` text,
	`ga4PropertyId` varchar(50),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversion_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`googleConversionId` varchar(50),
	`name` varchar(255) NOT NULL,
	`category` enum('PHONE_CALL','FORM_SUBMIT','APPOINTMENT','OFFLINE') NOT NULL,
	`countingType` enum('ONE_PER_CLICK','MANY_PER_CLICK') DEFAULT 'ONE_PER_CLICK',
	`value` float,
	`isActive` boolean DEFAULT true,
	`gclidCaptureVerified` boolean DEFAULT false,
	`gclidVerifiedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversion_actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversion_imports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`importDate` timestamp NOT NULL,
	`leadsProcessed` int DEFAULT 0,
	`conversionsUploaded` int DEFAULT 0,
	`errors` int DEFAULT 0,
	`status` enum('SUCCESS','PARTIAL','FAILED','PENDING') NOT NULL DEFAULT 'PENDING',
	`errorDetails` json,
	`triggeredBy` enum('SCHEDULED','MANUAL') DEFAULT 'SCHEDULED',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversion_imports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `keywords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`keyword` varchar(500) NOT NULL,
	`intentCluster` enum('crisis_intent','research_intent','transactional','brand','competitor'),
	`funnelStage` enum('TOF','MOF','BOF'),
	`adGroupId` int,
	`avgCpc` float,
	`qualityScore` int,
	`paidImpressions` int,
	`paidClicks` int,
	`paidConversions` float,
	`organicPosition` float,
	`organicImpressions` int,
	`organicClicks` int,
	`hasFeaturedSnippet` boolean DEFAULT false,
	`hasAiOverview` boolean DEFAULT false,
	`hasMapPack` boolean DEFAULT false,
	`isTracked` boolean DEFAULT true,
	`lastUpdated` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `keywords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `knowledge_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`category` enum('AD_CAMPAIGNS','CREATIVE','COMPETITIVE_INTEL','AUDIENCE','LANDING_PAGE','CONVERSION','STRATEGY_RULE') NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`tags` json,
	`source` varchar(255),
	`isStrategyRule` boolean DEFAULT false,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `knowledge_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `landing_pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`campaignId` int,
	`slug` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`h1Text` text NOT NULL,
	`metaDescription` text,
	`status` enum('BUILD_REQUIRED','DRAFT','NEEDS_AUDIT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
	`intentCluster` varchar(100),
	`builderConfig` json,
	`renderedHtmlCache` text,
	`brandHubVersion` varchar(50),
	`gclidCaptureVerified` boolean DEFAULT false,
	`gclidVerifiedAt` timestamp,
	`lcpMs` int,
	`cwvStatus` enum('PASS','NEEDS_IMPROVEMENT','FAIL'),
	`engagementRate` float,
	`formRate` float,
	`qualityScore` float,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `landing_pages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`patientName` varchar(255) NOT NULL,
	`patientPhone` varchar(20),
	`serviceInterest` varchar(255),
	`locationPreference` varchar(100),
	`gclid` varchar(500),
	`utmSource` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(255),
	`landingPageUrl` text,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`outcome` enum('NEW','CONTACTED','SCHEDULED','APPT_COMPLETED','NO_SHOW','NOT_QUALIFIED') DEFAULT 'NEW',
	`outcomeDate` timestamp,
	`conversionValue` float,
	`followUpDate` timestamp,
	`notes` text,
	`importedToAds` boolean DEFAULT false,
	`importTimestamp` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `negative_keywords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`campaignId` int,
	`keyword` varchar(500) NOT NULL,
	`matchType` enum('EXACT','PHRASE','BROAD') NOT NULL DEFAULT 'PHRASE',
	`level` enum('CAMPAIGN','AD_GROUP','LIST') NOT NULL DEFAULT 'CAMPAIGN',
	`addedBy` int,
	`reason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `negative_keywords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ops_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`decisionId` int,
	`action` varchar(255) NOT NULL,
	`entityType` varchar(100),
	`entityId` varchar(100),
	`beforeState` json,
	`afterState` json,
	`reasonCode` varchar(100),
	`notes` text,
	`executedBy` int,
	`executedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ops_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patient_language` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`phrase` text NOT NULL,
	`source` enum('search_term','review','reddit','chat','manual') NOT NULL,
	`usedInAd` boolean DEFAULT false,
	`usedInContent` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `patient_language_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pre_launch_audits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`campaignId` int NOT NULL,
	`checklistData` json NOT NULL,
	`score` int DEFAULT 0,
	`passed` boolean DEFAULT false,
	`auditedBy` int,
	`auditedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pre_launch_audits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `search_terms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`campaignId` int,
	`adGroupId` int,
	`searchTerm` text NOT NULL,
	`matchType` varchar(20),
	`intentLabel` enum('crisis_intent','research_intent','transactional','brand','competitor','irrelevant'),
	`impressions` int DEFAULT 0,
	`clicks` int DEFAULT 0,
	`conversions` float DEFAULT 0,
	`cost` float DEFAULT 0,
	`addedAsKeyword` boolean DEFAULT false,
	`addedAsNegative` boolean DEFAULT false,
	`addedToPatientLanguage` boolean DEFAULT false,
	`dataDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `search_terms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `signal_health` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`campaignId` int,
	`signalType` enum('CONVERSION_TRACKING','GCLID_CAPTURE','BID_STRATEGY','SEARCH_IMPRESSION_SHARE','QUALITY_SCORE','LANDING_PAGE_CWV') NOT NULL,
	`status` enum('HEALTHY','WARNING','CRITICAL') NOT NULL DEFAULT 'HEALTHY',
	`score` int,
	`message` text,
	`recommendation` text,
	`checkedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `signal_health_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strategy_decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`agentOutputId` int,
	`title` varchar(500) NOT NULL,
	`description` text,
	`category` enum('BUDGET','BID_STRATEGY','CAMPAIGN_STRUCTURE','CREATIVE','NEGATIVE_KEYWORDS','LANDING_PAGE','CONVERSION') NOT NULL,
	`priority` enum('HIGH','MEDIUM','LOW') NOT NULL DEFAULT 'MEDIUM',
	`status` enum('PENDING','APPROVED','REJECTED','EXECUTED') NOT NULL DEFAULT 'PENDING',
	`riskLevel` enum('HIGH','MEDIUM','LOW') DEFAULT 'MEDIUM',
	`decidedBy` int,
	`decidedAt` timestamp,
	`rejectionReason` text,
	`executedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `strategy_decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strategy_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`title` varchar(500),
	`messages` json NOT NULL,
	`summary` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `strategy_sessions_id` PRIMARY KEY(`id`)
);
