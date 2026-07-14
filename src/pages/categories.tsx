import { Tags, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categories, products, inrCompact } from "@/lib/data";

export default function Categories() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize your catalog into revenue-generating groups."
        actions={<Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Plus className="mr-2 h-4 w-4" /> New category</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((c, i) => {
          const items = products.filter((p) => p.category === c);
          const value = items.reduce((s, p) => s + p.stock * p.sellingPrice, 0);
          return (
            <Card key={c} className="group rounded-2xl border p-5 shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-16px_rgba(15,23,42,0.15)]">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Tags className="h-5 w-5" /></div>
                <span className="text-[11px] font-medium text-muted-foreground">#{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{c}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{items.length} products</p>
              <div className="mt-4 flex items-baseline justify-between border-t pt-3">
                <span className="text-[11px] text-muted-foreground">Est. value</span>
                <span className="text-[13px] font-semibold tabular-nums">{inrCompact(value)}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export const config = {};