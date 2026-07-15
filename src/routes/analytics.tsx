import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/analytics";
import { PremiumLock } from "@/components/premium-lock";
export const Route = createFileRoute("/analytics")({
  component: () => (
    <PremiumLock
      title="Advanced Analytics"
      description="Deep revenue analytics, margin analysis, cohort growth and predictive insights are part of our premium package. Upgrade to Phase 2 or Phase 3 to unlock."
    >
      <Page />
    </PremiumLock>
  ),
});