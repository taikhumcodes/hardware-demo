import { useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, IndianRupee, ShoppingCart, TrendingUp, Receipt } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "@tanstack/react-router";
import { useSales, useDashboard } from "@/lib/api";
import { inr, inrCompact } from "@/lib/format";

export default function Sales() {
  const { data: sales = [] } = useSales();
  const { data: dash } = useDashboard();
  const total = sales.reduce((s, x) => s + Number(x.total), 0);
  const paid = sales.filter((x) => x.payment_status === "paid").reduce((s, x) => s + Number(x.total), 0);
  const week = useMemo(() => (dash?.series ?? []).slice(-7), [dash]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales"
        description="Track invoices, payment status and product-wise sales."
        actions={<Button asChild size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Link to="/invoices"><Plus className="mr-2 h-4 w-4" /> New sale</Link></Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={`Total sales (${sales.length})`} value={inrCompact(total)} icon={IndianRupee} tone="primary" />
        <StatCard label="Paid" value={inrCompact(paid)} icon={Receipt} tone="success" />
        <StatCard label="Revenue (30d)" value={inrCompact(dash?.revenue30 ?? 0)} icon={ShoppingCart} />
        <StatCard label="Avg. invoice" value={inrCompact(total / (sales.length || 1))} icon={TrendingUp} tone="primary" />
      </div>
      <Card className="rounded-2xl border p-5 shadow-none">
        <h3 className="text-[15px] font-semibold tracking-tight">Revenue trend</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Last 7 days</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={week} margin={{ left: -10, right: 8, top: 20 }}>
            <defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F97316" stopOpacity={0.3} /><stop offset="100%" stopColor="#F97316" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => inrCompact(v)} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} formatter={(v: number) => [inr(v), "Sales"]} />
            <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} fill="url(#s)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
        <div className="border-b px-5 py-4">
          <h3 className="text-[15px] font-semibold tracking-tight">Recent invoices</h3>
        </div>
        <div className="divide-y">
          {sales.map((s) => (
            <div key={s.id} className="grid grid-cols-12 items-center gap-3 px-5 py-3 hover:bg-secondary/40 transition">
              <p className="col-span-3 text-[13px] font-medium font-mono">{s.invoice_number}</p>
              <p className="col-span-4 truncate text-[13px]">{s.customer_name ?? s.customers?.name ?? "Walk-in"}</p>
              <p className="col-span-2 text-[12.5px] text-muted-foreground">{s.sale_date}</p>
              <p className="col-span-2 text-right text-[13px] font-semibold tabular-nums">{inr(Number(s.total))}</p>
              <div className="col-span-1 text-right"><StatusBadge status={s.payment_status} /></div>
            </div>
          ))}
          {sales.length === 0 && <div className="p-8 text-center text-[13px] text-muted-foreground">No sales yet</div>}
        </div>
      </Card>
    </div>
  );
}