import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/payments";
import { PremiumLock } from "@/components/premium-lock";
export const Route = createFileRoute("/_authenticated/payments")({
  component: () => (
    <PremiumLock
      title="Payments Module"
      description="Online payment collection, reconciliation and UPI/NEFT gateway integrations are part of our premium package. Upgrade to Phase 2 or Phase 3 to unlock."
    >
      <Page />
    </PremiumLock>
  ),
});