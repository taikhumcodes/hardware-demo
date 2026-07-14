import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/payments";
export const Route = createFileRoute("/payments")({ component: Page });