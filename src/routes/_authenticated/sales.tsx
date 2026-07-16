import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/sales";
export const Route = createFileRoute("/_authenticated/sales")({ component: Page });