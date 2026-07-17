import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Boxes, PackageMinus, PackagePlus, Warehouse } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { useProducts, useStockMovements } from "@/lib/api";
import { inrCompact } from "@/lib/format";

export default function Inventory() {
  const { data: products = [] } = useProducts();
  const { data: movements = [] } = useStockMovements();
  const low = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) < Number(p.min_stock));
  const out = products.filter((p) => Number(p.stock) === 0);
  const totalUnits = products.reduce((s, p) => s + Number(p.stock), 0);
  const totalValue = products.reduce((s, p) => s + Number(p.stock) * Number(p.purchase_price), 0);

  const movement = useMemo(() => {
    const map = new Map<string, { d: string; in: number; out: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(5, 10);
      map.set(d, { d, in: 0, out: 0 });
    }
    movements.forEach((m) => {
      const d = new Date(m.created_at).toISOString().slice(5, 10);
      const row = map.get(d);
      if (!row) return;
      if (m.movement_type === "inward") row.in += Number(m.quantity);
      else if (m.movement_type === "outward") row.out += Number(m.quantity);
    });
    return Array.from(map.values());
  }, [movements]);

  const inward = movements.filter((m) => m.movement_type === "inward").slice(0, 5);
  const outward = movements.filter((m) => m.movement_type === "outward").slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Warehouse overview, stock movement and alerts." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Units" value={totalUnits.toLocaleString("en-IN")} icon={Boxes} tone="primary" />
        <StatCard label="Inventory Value" value={inrCompact(totalValue)} icon={Warehouse} tone="success" />
        <StatCard label="Low Stock" value={low.length.toString()} icon={PackageMinus} tone="warning" />
        <StatCard label="Out of Stock" value={out.length.toString()} icon={PackageMinus} tone="danger" />
      </div>

      <Card className="rounded-2xl border p-5 shadow-none">
        <div className="mb-3">
          <h3 className="text-[15px] font-semibold tracking-tight">Stock movement</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Incoming vs. outgoing (last 7 days, units)</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={movement} margin={{ left: -10, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="in" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16A34A" stopOpacity={0.3} /><stop offset="100%" stopColor="#16A34A" stopOpacity={0} /></linearGradient>
              <linearGradient id="out" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F97316" stopOpacity={0.3} /><stop offset="100%" stopColor="#F97316" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="d" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} />
            <Area type="monotone" dataKey="in" stroke="#16A34A" strokeWidth={2} fill="url(#in)" name="Incoming" />
            <Area type="monotone" dataKey="out" stroke="#F97316" strokeWidth={2} fill="url(#out)" name="Outgoing" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center gap-2">
            <ArrowDownRight className="h-4 w-4 text-success" />
            <h3 className="text-[15px] font-semibold tracking-tight">Recent incoming</h3>
          </div>
          <div className="divide-y">
            {inward.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-3 px-5 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success"><PackagePlus className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{m.product_name}</p><p className="text-[11px] text-muted-foreground">{m.doc_ref ?? m.reference}</p></div>
                <span className="text-[13px] font-semibold tabular-nums text-success">+{m.quantity}</span>
              </motion.div>
            ))}
            {inward.length === 0 && <div className="p-6 text-center text-[12px] text-muted-foreground">No incoming stock</div>}
          </div>
        </Card>

        <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-primary" />
            <h3 className="text-[15px] font-semibold tracking-tight">Recent outgoing</h3>
          </div>
          <div className="divide-y">
            {outward.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-3 px-5 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><PackageMinus className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">{m.product_name}</p><p className="text-[11px] text-muted-foreground">{m.doc_ref ?? m.reference}</p></div>
                <span className="text-[13px] font-semibold tabular-nums text-primary">-{m.quantity}</span>
              </motion.div>
            ))}
            {outward.length === 0 && <div className="p-6 text-center text-[12px] text-muted-foreground">No outgoing stock</div>}
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="text-[15px] font-semibold tracking-tight">Stock alerts</h3>
          <span className="text-[12px] text-muted-foreground">{low.length + out.length} items</span>
        </div>
        <div className="divide-y">
          {[...out, ...low].map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.sku} • {p.brands?.name ?? "—"}</p>
              </div>
              <div className="hidden sm:block text-[12px] text-muted-foreground">Min {p.min_stock} {p.unit}</div>
              <div className="w-28 text-right text-[13px] font-semibold tabular-nums">{p.stock} {p.unit}</div>
              <StatusBadge status={Number(p.stock) === 0 ? "Out of stock" : "Low stock"} />
            </div>
          ))}
          {out.length + low.length === 0 && <div className="p-6 text-center text-[12px] text-muted-foreground">All stock levels healthy</div>}
        </div>
      </Card>
    </div>
  );
}