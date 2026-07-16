import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/credit";
export const Route = createFileRoute("/_authenticated/credit")({ component: Page });