import { Phone, MapPin, Plus, Star } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { suppliers, inr, inrCompact } from "@/lib/data";
import { Truck, IndianRupee, ClipboardList } from "lucide-react";

export default function Suppliers() {
  const outstanding = suppliers.reduce((s, x) => s + x.outstanding, 0);
  const pending = suppliers.reduce((s, x) => s + x.pending, 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Directory, pending orders and outstanding payments."
        actions={<Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Plus className="mr-2 h-4 w-4" /> Add supplier</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total suppliers" value={suppliers.length.toString()} icon={Truck} tone="primary" />
        <StatCard label="Pending POs" value={pending.toString()} icon={ClipboardList} tone="warning" />
        <StatCard label="Outstanding" value={inrCompact(outstanding)} icon={IndianRupee} tone="danger" />
        <StatCard label="Avg. rating" value="4.65" icon={Star} tone="success" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((s) => (
          <Card key={s.id} className="rounded-2xl border p-5 shadow-none">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[15px] font-semibold tracking-tight">{s.name}</p>
                <p className="text-[12px] text-muted-foreground">{s.contact} • {s.id}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning">
                <Star className="h-3 w-3 fill-current" /> {s.rating}
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-[12.5px] text-muted-foreground">
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{s.phone}</p>
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{s.city}</p>
              <p className="font-mono text-[11.5px]">GSTIN {s.gstin}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3">
              <div>
                <p className="text-[11px] text-muted-foreground">Pending POs</p>
                <p className="text-[14px] font-semibold">{s.pending}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">Outstanding</p>
                <p className={`text-[14px] font-semibold tabular-nums ${s.outstanding > 0 ? "text-destructive" : "text-success"}`}>{inr(s.outstanding)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}