import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/inventory";
export const Route = createFileRoute("/inventory")({ component: Page });