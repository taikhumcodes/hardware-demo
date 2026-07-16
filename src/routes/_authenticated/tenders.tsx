import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/tenders";
export const Route = createFileRoute("/_authenticated/tenders")({ component: Page });