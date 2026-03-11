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

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/training" component={Training} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/access-control" component={AccessControl} />
        <Route path="/incidents" component={IncidentReport} />
        <Route path="/policy" component={PolicyAcknowledgment} />
        <Route path="/vendors" component={VendorManagement} />
        <Route path="/compliance" component={ComplianceTracker} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
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
