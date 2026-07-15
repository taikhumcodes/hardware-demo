import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Package, Star, Plus } from "lucide-react";
import { brands, products, inr } from "@/lib/data";

export default function Brands() {
  const rows = brands.map((b) => {
    const items = products.filter((p) => p.brand === b);
    const value = items.reduce((s, p) => s + p.stock * p.purchasePrice, 0);
    return { name: b, count: items.length, value };
  });
  return (
    <div className="space-y-6">
      <PageHeader
        title="Brands"
        description="Manage brands you stock and their inventory contribution."
        actions={<Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Plus className="mr-2 h-4 w-4" /> Add brand</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total brands" value={brands.length.toString()} icon={Bookmark} tone="primary" />
        <StatCard label="Products linked" value={products.length.toString()} icon={Package} tone="success" />
        <StatCard label="Top brand" value={rows.sort((a,b)=>b.count-a.count)[0]?.name ?? "—"} icon={Star} tone="warning" />
        <StatCard label="Featured" value="6" icon={Star} tone="primary" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((b) => (
          <Card key={b.name} className="rounded-2xl border p-5 shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-16px_rgba(15,23,42,0.15)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bookmark className="h-5 w-5" />
            </div>
            <p className="mt-4 text-[15px] font-semibold tracking-tight">{b.name}</p>
            <p className="text-[12px] text-muted-foreground">{b.count} products</p>
            <div className="mt-4 border-t pt-3">
              <p className="text-[11px] text-muted-foreground">Stock value</p>
              <p className="text-[14px] font-semibold tabular-nums">{inr(b.value)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}