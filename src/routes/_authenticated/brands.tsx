import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/brands";
export const Route = createFileRoute("/_authenticated/brands")({ component: Page });