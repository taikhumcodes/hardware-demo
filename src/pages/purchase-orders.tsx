import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CalendarClock } from "lucide-react";
import { purchaseOrders, inr } from "@/lib/data";

export default function POs() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        description="Track supplier orders, deliveries and expected arrivals."
        actions={<Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Plus className="mr-2 h-4 w-4" /> New PO</Button>}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {purchaseOrders.map((po) => (
          <Card key={po.id} className="rounded-2xl border p-5 shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-16px_rgba(15,23,42,0.15)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-mono text-muted-foreground">{po.id}</p>
                <p className="mt-1 text-[15px] font-semibold tracking-tight">{po.supplier}</p>
              </div>
              <StatusBadge status={po.status} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-[12.5px] text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              <span>Expected {po.expected}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3">
              <div><p className="text-[11px] text-muted-foreground">Items</p><p className="text-[13.5px] font-semibold">{po.items}</p></div>
              <div className="text-right"><p className="text-[11px] text-muted-foreground">Amount</p><p className="text-[13.5px] font-semibold tabular-nums">{inr(po.amount)}</p></div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="h-8 flex-1 rounded-lg text-xs">Track</Button>
              <Button variant="outline" size="sm" className="h-8 flex-1 rounded-lg text-xs">Receive</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}