import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/customers";
export const Route = createFileRoute("/customers")({ component: Page });