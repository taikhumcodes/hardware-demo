import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/inventory";
export const Route = createFileRoute("/_authenticated/inventory")({ component: Page });