import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Training from "./pages/Training";
import Onboarding from "./pages/Onboarding";
import AccessControl from "./pages/AccessControl";
import IncidentReport from "./pages/IncidentReport";
import PolicyAcknowledgment from "./pages/PolicyAcknowledgment";
import VendorManagement from "./pages/VendorManagement";
import ComplianceTracker from "./pages/ComplianceTracker";
import HRPeople from "./pages/HRPeople";
import HRCredentialing from "./pages/HRCredentialing";
import HROrgChart from "./pages/HROrgChart";
import HRTimeOff from "./pages/HRTimeOff";
import ReferralInbox from "./pages/ReferralInbox";
import { AdsClientProvider } from "./contexts/AdsClientContext";
import A1CampaignPlanner from "./pages/ads/A1CampaignPlanner";
import A2IntelligenceHub from "./pages/ads/A2IntelligenceHub";
import A3StrategyWorkspace from "./pages/ads/A3StrategyWorkspace";
import A4AdAssetStudio from "./pages/ads/A4AdAssetStudio";
import A5LandingPageEngine from "./pages/ads/A5LandingPageEngine";
import A6ExecutionCenter from "./pages/ads/A6ExecutionCenter";
import A7OfflineConversion from "./pages/ads/A7OfflineConversion";
import A8KnowledgeRoom from "./pages/ads/A8KnowledgeRoom";

function Router() {
  return (
    <DashboardLayout>
      <AdsClientProvider>
        <Switch>
          {/* Main dashboard */}
          <Route path="/" component={Dashboard} />
          {/* IT & Compliance */}
          <Route path="/training" component={Training} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/access-control" component={AccessControl} />
          <Route path="/incidents" component={IncidentReport} />
          <Route path="/policy" component={PolicyAcknowledgment} />
          <Route path="/vendors" component={VendorManagement} />
          <Route path="/compliance" component={ComplianceTracker} />
          {/* HR & People */}
          <Route path="/hr/people" component={HRPeople} />
          <Route path="/hr/credentialing" component={HRCredentialing} />
          <Route path="/hr/org-chart" component={HROrgChart} />
          <Route path="/hr/time-off" component={HRTimeOff} />
          {/* Communications */}
          <Route path="/comms/referrals" component={ReferralInbox} />
          {/* Paid Ads Module */}
          <Route path="/ads/campaign-planner" component={A1CampaignPlanner} />
          <Route path="/ads/intelligence-hub" component={A2IntelligenceHub} />
          <Route path="/ads/strategy-workspace" component={A3StrategyWorkspace} />
          <Route path="/ads/asset-studio" component={A4AdAssetStudio} />
          <Route path="/ads/landing-pages" component={A5LandingPageEngine} />
          <Route path="/ads/execution-center" component={A6ExecutionCenter} />
          <Route path="/ads/offline-conversion" component={A7OfflineConversion} />
          <Route path="/ads/knowledge-room" component={A8KnowledgeRoom} />
          {/* Fallback */}
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </AdsClientProvider>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
