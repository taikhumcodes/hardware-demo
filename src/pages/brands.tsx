import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bookmark, Package, Star, Plus, Trash2 } from "lucide-react";
import { useBrands, useProducts, useSaveBrand, useDeleteBrand } from "@/lib/api";
import { inr } from "@/lib/format";

export default function Brands() {
  const { data: brands = [] } = useBrands();
  const { data: products = [] } = useProducts();
  const save = useSaveBrand();
  const del = useDeleteBrand();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const rows = brands.map((b) => {
    const items = products.filter((p) => p.brand_id === b.id);
    const value = items.reduce((s, p) => s + Number(p.stock) * Number(p.purchase_price), 0);
    return { id: b.id, name: b.name, count: items.length, value };
  });
  const top = [...rows].sort((a, b) => b.count - a.count)[0]?.name ?? "—";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brands"
        description="Manage brands you stock and their inventory contribution."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Plus className="mr-2 h-4 w-4" /> Add brand</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-md">
              <DialogHeader><DialogTitle>Add brand</DialogTitle></DialogHeader>
              <div className="space-y-2 py-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={!name || save.isPending} onClick={async () => { await save.mutateAsync({ name }); setName(""); setOpen(false); }} className="bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total brands" value={brands.length.toString()} icon={Bookmark} tone="primary" />
        <StatCard label="Products linked" value={products.length.toString()} icon={Package} tone="success" />
        <StatCard label="Top brand" value={top} icon={Star} tone="warning" />
        <StatCard label="Featured" value={brands.length.toString()} icon={Star} tone="primary" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((b) => (
          <Card key={b.id} className="rounded-2xl border p-5 shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-16px_rgba(15,23,42,0.15)]">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bookmark className="h-5 w-5" />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => del.mutate(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
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