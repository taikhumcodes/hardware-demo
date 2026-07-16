import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/invoices";
export const Route = createFileRoute("/invoices")({ component: Page });