import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCard, AlertTriangle, TrendingUp, IndianRupee, Send } from "lucide-react";
import { inr, inrCompact } from "@/lib/data";

const ledger = [
  { name: "Vikas Builders Pvt Ltd", limit: 500000, outstanding: 342500, overdue: 0, days: 12, status: "Healthy" },
  { name: "Skyline Infra LLP", limit: 800000, outstanding: 712400, overdue: 118400, days: 41, status: "Overdue" },
  { name: "Reddy Enterprises", limit: 300000, outstanding: 148500, overdue: 0, days: 8, status: "Healthy" },
  { name: "Sharma Trading Co.", limit: 250000, outstanding: 245200, overdue: 89100, days: 58, status: "Overdue" },
  { name: "Singh Metal Traders", limit: 400000, outstanding: 178300, overdue: 0, days: 21, status: "Healthy" },
  { name: "Patel Hardware Mart", limit: 200000, outstanding: 92400, overdue: 22000, days: 34, status: "Warning" },
];

export default function Credit() {
  const totalOut = ledger.reduce((s, x) => s + x.outstanding, 0);
  const overdue = ledger.reduce((s, x) => s + x.overdue, 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Credit Management"
        description="Customer credit limits, outstanding balances and ageing analysis."
        actions={<Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Send className="mr-2 h-4 w-4" /> Send reminders</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total receivable" value={inrCompact(totalOut)} icon={IndianRupee} tone="primary" />
        <StatCard label="Overdue" value={inrCompact(overdue)} icon={AlertTriangle} tone="danger" />
        <StatCard label="Avg. collection" value="28 days" icon={TrendingUp} tone="warning" />
        <StatCard label="Credit accounts" value={ledger.length.toString()} icon={CreditCard} tone="success" />
      </div>
      <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
        <div className="grid grid-cols-12 gap-3 bg-secondary/40 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="col-span-3">Customer</span>
          <span className="col-span-3">Utilization</span>
          <span className="col-span-2 text-right">Outstanding</span>
          <span className="col-span-2 text-right">Overdue</span>
          <span className="col-span-1 text-right">Days</span>
          <span className="col-span-1 text-right">Status</span>
        </div>
        {ledger.map((l) => {
          const util = Math.min(100, Math.round((l.outstanding / l.limit) * 100));
          return (
            <div key={l.name} className="grid grid-cols-12 gap-3 border-t px-5 py-3 items-center text-[13px] hover:bg-secondary/20">
              <div className="col-span-3">
                <p className="font-medium truncate">{l.name}</p>
                <p className="text-[11.5px] text-muted-foreground">Limit {inr(l.limit)}</p>
              </div>
              <div className="col-span-3">
                <Progress value={util} className="h-2" />
                <p className="mt-1 text-[11px] text-muted-foreground">{util}% used</p>
              </div>
              <span className="col-span-2 text-right tabular-nums font-semibold">{inr(l.outstanding)}</span>
              <span className={`col-span-2 text-right tabular-nums font-semibold ${l.overdue > 0 ? "text-destructive" : "text-muted-foreground"}`}>{l.overdue > 0 ? inr(l.overdue) : "—"}</span>
              <span className="col-span-1 text-right text-[12px] text-muted-foreground">{l.days}d</span>
              <span className="col-span-1 text-right"><StatusBadge status={l.status} /></span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}