import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Barcode, Printer, Search, Tag, ScanLine } from "lucide-react";
import { useProducts } from "@/lib/api";
import { inr } from "@/lib/format";

function Bars({ code }: { code: string }) {
  // deterministic pseudo-random bars from code
  const bars = Array.from(code).map((c, i) => (c.charCodeAt(0) + i) % 4);
  return (
    <div className="flex h-14 items-end gap-[2px]">
      {bars.concat(bars).map((w, i) => (
        <div key={i} className={`h-full bg-foreground`} style={{ width: w === 0 ? 1 : w === 1 ? 2 : w === 2 ? 3 : 1 }} />
      ))}
    </div>
  );
}

export default function BarcodePage() {
  const [q, setQ] = useState("");
  const [qty, setQty] = useState(4);
  const { data: products = [] } = useProducts();
  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase())).slice(0, 12);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Barcode Management"
        description="Generate, print and scan barcodes for every SKU in your inventory."
        actions={<Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Printer className="mr-2 h-4 w-4" /> Print sheet</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="SKUs with barcode" value={products.length.toString()} icon={Barcode} tone="primary" />
        <StatCard label="Printed today" value="128" icon={Printer} tone="success" />
        <StatCard label="Scans (24h)" value="642" icon={ScanLine} tone="warning" />
        <StatCard label="Label templates" value="5" icon={Tag} tone="primary" />
      </div>
      <Card className="rounded-2xl border p-5 shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <Label className="text-[12px] text-muted-foreground">Search product / SKU</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Apcolite, JSW…" className="h-9 rounded-lg pl-9" />
            </div>
          </div>
          <div>
            <Label className="text-[12px] text-muted-foreground">Labels / sheet</Label>
            <Input type="number" min={1} max={40} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="mt-1 h-9 w-32 rounded-lg" />
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id} className="rounded-2xl border p-5 shadow-none">
            <p className="text-[13px] font-semibold tracking-tight truncate">{p.name}</p>
            <p className="text-[11.5px] text-muted-foreground">{p.brands?.name ?? "—"} • {p.categories?.name ?? "—"}</p>
            <div className="mt-4 rounded-xl border bg-white p-3">
              <Bars code={p.barcode ?? p.sku} />
              <div className="mt-2 flex items-center justify-between text-[11.5px] font-mono">
                <span>{p.barcode ?? p.sku}</span>
                <span className="font-sans font-semibold">{inr(Number(p.selling_price))}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-3 h-8 w-full rounded-lg text-xs">
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print {qty}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}