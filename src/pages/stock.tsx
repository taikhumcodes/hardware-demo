import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Boxes, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, PackagePlus, PackageMinus, RefreshCw } from "lucide-react";
import { useProducts, useStockMovements } from "@/lib/api";
import { inr, fmtDate } from "@/lib/format";

export default function Stock() {
  const { data: products = [] } = useProducts();
  const { data: movements = [] } = useStockMovements();
  const total = products.reduce((s, p) => s + Number(p.stock) * Number(p.purchase_price), 0);
  const low = products.filter((p) => Number(p.stock) <= Number(p.min_stock) && Number(p.stock) > 0).length;
  const out = products.filter((p) => Number(p.stock) === 0).length;
  const inward = movements.filter((m) => m.movement_type === "inward").reduce((s, m) => s + Number(m.quantity), 0);
  const outward = movements.filter((m) => m.movement_type === "outward").reduce((s, m) => s + Number(m.quantity), 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Management"
        description="Real-time stock ledger with inward, outward, adjustments and transfers."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-9 rounded-lg"><PackagePlus className="mr-2 h-4 w-4" /> Stock In</Button>
            <Button size="sm" variant="outline" className="h-9 rounded-lg"><PackageMinus className="mr-2 h-4 w-4" /> Stock Out</Button>
            <Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><RefreshCw className="mr-2 h-4 w-4" /> Adjust</Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Stock value" value={inr(total)} icon={Boxes} tone="primary" />
        <StatCard label="Inward units" value={inward.toLocaleString("en-IN")} icon={ArrowDownToLine} tone="success" />
        <StatCard label="Outward units" value={outward.toLocaleString("en-IN")} icon={ArrowUpFromLine} tone="warning" />
        <StatCard label="Low / Out" value={`${low} / ${out}`} icon={AlertTriangle} tone="danger" />
      </div>
      <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
        <div className="grid grid-cols-12 gap-3 bg-secondary/40 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="col-span-2">Ref</span>
          <span className="col-span-4">Product</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-1 text-right">Qty</span>
          <span className="col-span-2">Doc</span>
          <span className="col-span-1 text-right">Date</span>
        </div>
        {movements.map((m) => (
          <div key={m.id} className="grid grid-cols-12 gap-3 border-t px-5 py-3 text-[13px] items-center hover:bg-secondary/20">
            <span className="col-span-2 font-mono text-[12px] text-muted-foreground">{m.reference}</span>
            <span className="col-span-4 font-medium truncate">{m.product_name}</span>
            <span className="col-span-2"><StatusBadge status={m.movement_type} /></span>
            <span className={`col-span-1 text-right tabular-nums font-semibold ${m.movement_type === "outward" ? "text-destructive" : "text-success"}`}>{m.movement_type === "outward" ? "-" : "+"}{m.quantity}</span>
            <span className="col-span-2 font-mono text-[12px] text-muted-foreground">{m.doc_ref ?? "—"}</span>
            <span className="col-span-1 text-right text-[12px] text-muted-foreground">{fmtDate(m.created_at)}</span>
          </div>
        ))}
        {movements.length === 0 && <div className="border-t p-8 text-center text-[13px] text-muted-foreground">No stock movements yet</div>}
      </Card>
    </div>
  );
}