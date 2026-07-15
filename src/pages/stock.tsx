import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Boxes, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, PackagePlus, PackageMinus, RefreshCw } from "lucide-react";
import { products, inr } from "@/lib/data";

const movements = [
  { id: "MV-4021", type: "Inward", product: "Asian Paints Apcolite 20L", qty: 24, ref: "PO-2412", date: "2026-07-14", by: "Ramesh" },
  { id: "MV-4020", type: "Outward", product: "Astral CPVC 1 inch", qty: 60, ref: "INV-8821", date: "2026-07-14", by: "Suresh" },
  { id: "MV-4019", type: "Adjustment", product: "JSW TMT 12mm", qty: -4, ref: "ADJ-118", date: "2026-07-13", by: "Anil" },
  { id: "MV-4018", type: "Inward", product: "UltraTech PPC 50kg", qty: 200, ref: "PO-2409", date: "2026-07-13", by: "Ramesh" },
  { id: "MV-4017", type: "Outward", product: "Havells Modular Switch", qty: 48, ref: "INV-8818", date: "2026-07-12", by: "Priya" },
  { id: "MV-4016", type: "Transfer", product: "Supreme PVC 4 inch", qty: 30, ref: "TR-091", date: "2026-07-12", by: "Anil" },
];

export default function Stock() {
  const total = products.reduce((s, p) => s + p.stock * p.purchasePrice, 0);
  const low = products.filter((p) => p.stock <= p.minStock && p.stock > 0).length;
  const out = products.filter((p) => p.stock === 0).length;
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
        <StatCard label="Inward (7d)" value="₹6.82 L" icon={ArrowDownToLine} tone="success" />
        <StatCard label="Outward (7d)" value="₹5.14 L" icon={ArrowUpFromLine} tone="warning" />
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
            <span className="col-span-2 font-mono text-[12px] text-muted-foreground">{m.id}</span>
            <span className="col-span-4 font-medium truncate">{m.product}</span>
            <span className="col-span-2"><StatusBadge status={m.type} /></span>
            <span className={`col-span-1 text-right tabular-nums font-semibold ${m.qty < 0 ? "text-destructive" : "text-success"}`}>{m.qty > 0 ? `+${m.qty}` : m.qty}</span>
            <span className="col-span-2 font-mono text-[12px] text-muted-foreground">{m.ref}</span>
            <span className="col-span-1 text-right text-[12px] text-muted-foreground">{m.date}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}