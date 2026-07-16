import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/users";
export const Route = createFileRoute("/users")({ component: Page });