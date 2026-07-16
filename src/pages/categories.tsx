import { Tags, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCategories, useSaveCategory, useDeleteCategory, useProducts, type Category } from "@/lib/api";
import { inrCompact } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";

export default function Categories() {
  const { data: cats = [], isLoading } = useCategories();
  const { data: products = [] } = useProducts();
  const save = useSaveCategory();
  const del = useDeleteCategory();
  const { canWrite } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize your catalog into revenue-generating groups."
        actions={canWrite && <Button size="sm" onClick={() => { setEditing({ name: "" }); setOpen(true); }} className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Plus className="mr-2 h-4 w-4" /> New category</Button>}
      />
      {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cats.map((c, i) => {
            const items = products.filter((p) => p.category_id === c.id);
            const value = items.reduce((s, p) => s + Number(p.stock) * Number(p.selling_price), 0);
            return (
              <Card key={c.id} className="group rounded-2xl border p-5 shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-16px_rgba(15,23,42,0.15)]">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Tags className="h-5 w-5" /></div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-muted-foreground">#{String(i + 1).padStart(2, "0")}</span>
                    {canWrite && (
                      <>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => confirm("Delete?") && del.mutate(c.id)}><Trash2 className="h-3 w-3" /></Button>
                      </>
                    )}
                  </div>
                </div>
                <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{c.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{items.length} products</p>
                <div className="mt-4 flex items-baseline justify-between border-t pt-3">
                  <span className="text-[11px] text-muted-foreground">Est. value</span>
                  <span className="text-[13px] font-semibold tabular-nums">{inrCompact(value)}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit category" : "New category"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={editing?.name ?? ""} onChange={(e) => setEditing((s) => ({ ...s, name: e.target.value }))} /></div>
            <div><Label>Description</Label><Input value={editing?.description ?? ""} onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { if (editing?.name) { save.mutate(editing as { name: string }, { onSuccess: () => setOpen(false) }); } }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}