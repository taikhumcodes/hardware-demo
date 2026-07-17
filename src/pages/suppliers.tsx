import { useState } from "react";
import { Phone, MapPin, Plus, Star, Truck, IndianRupee, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatCard } from "@/components/stat-card";
import { useSuppliers, useSaveSupplier } from "@/lib/api";
import { inr, inrCompact } from "@/lib/format";

export default function Suppliers() {
  const { data: suppliers = [] } = useSuppliers();
  const save = useSaveSupplier();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", contact_person: "", phone: "", city: "", gstin: "" });
  const outstanding = suppliers.reduce((s, x) => s + Number(x.outstanding), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Directory, pending orders and outstanding payments."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Plus className="mr-2 h-4 w-4" /> Add supplier</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-lg">
              <DialogHeader><DialogTitle>Add supplier</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3 py-2">
                {(["name","contact_person","phone","city","gstin"] as const).map((k) => (
                  <div key={k} className={k === "name" ? "col-span-2 space-y-1.5" : "space-y-1.5"}>
                    <Label className="capitalize">{k.replace("_"," ")}</Label>
                    <Input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={!form.name || save.isPending} onClick={async () => { await save.mutateAsync(form); setOpen(false); setForm({ name:"", contact_person:"", phone:"", city:"", gstin:"" }); }} className="bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total suppliers" value={suppliers.length.toString()} icon={Truck} tone="primary" />
        <StatCard label="Pending POs" value="—" icon={ClipboardList} tone="warning" />
        <StatCard label="Outstanding" value={inrCompact(outstanding)} icon={IndianRupee} tone="danger" />
        <StatCard label="Avg. rating" value={(suppliers.reduce((s,x)=>s+Number(x.rating),0)/(suppliers.length||1)).toFixed(2)} icon={Star} tone="success" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((s) => (
          <Card key={s.id} className="rounded-2xl border p-5 shadow-none">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[15px] font-semibold tracking-tight">{s.name}</p>
                <p className="text-[12px] text-muted-foreground">{s.contact_person ?? "—"} • {s.code}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning">
                <Star className="h-3 w-3 fill-current" /> {s.rating}
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-[12.5px] text-muted-foreground">
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{s.phone ?? "—"}</p>
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{s.city ?? "—"}</p>
              <p className="font-mono text-[11.5px]">GSTIN {s.gstin ?? "—"}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3">
              <div>
                <p className="text-[11px] text-muted-foreground">Rating</p>
                <p className="text-[14px] font-semibold">{s.rating}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Outstanding</p>
                <p className={`text-[14px] font-semibold tabular-nums ${Number(s.outstanding) > 0 ? "text-destructive" : "text-success"}`}>{inr(Number(s.outstanding))}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}