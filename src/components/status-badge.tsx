import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const map: Record<string, string> = {
    paid: "bg-success/10 text-success ring-success/20",
    delivered: "bg-success/10 text-success ring-success/20",
    active: "bg-success/10 text-success ring-success/20",
    "in transit": "bg-primary/10 text-primary ring-primary/20",
    pending: "bg-warning/15 text-warning ring-warning/25",
    overdue: "bg-destructive/10 text-destructive ring-destructive/20",
    inactive: "bg-muted text-muted-foreground ring-border",
    "out of stock": "bg-destructive/10 text-destructive ring-destructive/20",
    "low stock": "bg-warning/15 text-warning ring-warning/25",
    "in stock": "bg-success/10 text-success ring-success/20",
  };
  const dot = s === "paid" || s === "delivered" || s === "active" || s === "in stock" ? "bg-success"
    : s === "pending" || s === "low stock" ? "bg-warning"
    : s === "overdue" || s === "out of stock" ? "bg-destructive"
    : s === "in transit" ? "bg-primary" : "bg-muted-foreground";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset", map[s] ?? "bg-secondary text-foreground ring-border")}>
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", dot)} />
      {status}
    </span>
  );
}