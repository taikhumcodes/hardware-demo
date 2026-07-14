import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/purchase-orders";
export const Route = createFileRoute("/purchase-orders")({ component: Page });