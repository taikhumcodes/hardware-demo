import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/stock";
export const Route = createFileRoute("/_authenticated/stock")({ component: Page });