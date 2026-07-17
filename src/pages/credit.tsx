import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCard, AlertTriangle, TrendingUp, IndianRupee, Send } from "lucide-react";
import { useCustomers } from "@/lib/api";
import { inr, inrCompact } from "@/lib/format";

export default function Credit() {
  const { data: customers = [] } = useCustomers();
  const ledger = customers
    .filter((c) => Number(c.credit_limit) > 0 || Number(c.outstanding) > 0)
    .map((c) => {
      const outstanding = Number(c.outstanding);
      const limit = Number(c.credit_limit) || outstanding * 1.5;
      const status = outstanding === 0 ? "Healthy" : outstanding > limit * 0.9 ? "Overdue" : outstanding > limit * 0.6 ? "Warning" : "Healthy";
      return { id: c.id, name: c.name, limit, outstanding, status };
    });
  const totalOut = ledger.reduce((s, x) => s + x.outstanding, 0);
  const overdue = ledger.filter((l) => l.status === "Overdue").reduce((s, l) => s + l.outstanding, 0);
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
        <StatCard label="At-risk accounts" value={ledger.filter((l) => l.status !== "Healthy").length.toString()} icon={TrendingUp} tone="warning" />
        <StatCard label="Credit accounts" value={ledger.length.toString()} icon={CreditCard} tone="success" />
      </div>
      <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
        <div className="grid grid-cols-12 gap-3 bg-secondary/40 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="col-span-4">Customer</span>
          <span className="col-span-3">Utilization</span>
          <span className="col-span-2 text-right">Outstanding</span>
          <span className="col-span-2 text-right">Limit</span>
          <span className="col-span-1 text-right">Status</span>
        </div>
        {ledger.map((l) => {
          const util = Math.min(100, Math.round((l.outstanding / (l.limit || 1)) * 100));
          return (
            <div key={l.id} className="grid grid-cols-12 gap-3 border-t px-5 py-3 items-center text-[13px] hover:bg-secondary/20">
              <div className="col-span-4">
                <p className="font-medium truncate">{l.name}</p>
              </div>
              <div className="col-span-3">
                <Progress value={util} className="h-2" />
                <p className="mt-1 text-[11px] text-muted-foreground">{util}% used</p>
              </div>
              <span className="col-span-2 text-right tabular-nums font-semibold">{inr(l.outstanding)}</span>
              <span className="col-span-2 text-right tabular-nums text-muted-foreground">{inr(l.limit)}</span>
              <span className="col-span-1 text-right"><StatusBadge status={l.status} /></span>
            </div>
          );
        })}
        {ledger.length === 0 && <div className="border-t p-8 text-center text-[13px] text-muted-foreground">No credit accounts</div>}
      </Card>
    </div>
  );
}