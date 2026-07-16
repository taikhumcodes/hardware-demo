import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/customers";
export const Route = createFileRoute("/_authenticated/customers")({ component: Page });