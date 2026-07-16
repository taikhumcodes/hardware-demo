import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/products";
export const Route = createFileRoute("/products")({ component: Page });