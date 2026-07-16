import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/categories";
export const Route = createFileRoute("/_authenticated/categories")({ component: Page });