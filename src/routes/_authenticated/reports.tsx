import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/reports";
export const Route = createFileRoute("/reports")({ component: Page });