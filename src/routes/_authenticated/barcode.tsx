import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/barcode";
export const Route = createFileRoute("/_authenticated/barcode")({ component: Page });