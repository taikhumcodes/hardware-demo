import { useState } from "react";
import { Plus, Search, Phone, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { customers, recentSales, inr } from "@/lib/data";

export default function CustomersPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<typeof customers[number] | null>(null);
  const filtered = customers.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.city.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description={`${customers.length} customers with combined spend of ₹51.2 L`}
        actions={<Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Plus className="mr-2 h-4 w-4" /> Add customer</Button>}
      />
      <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
        <div className="border-b p-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers by name or city…" className="h-9 rounded-lg pl-9" />
          </div>
        </div>
        <div className="divide-y">
          {filtered.map((c) => (
            <button key={c.id} onClick={() => setActive(c)} className="grid w-full grid-cols-12 items-center gap-3 px-5 py-3 text-left hover:bg-secondary/40 transition">
              <div className="col-span-4 flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary text-[11px] font-semibold">
                  {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.id} • {c.type}</p>
                </div>
              </div>
              <p className="col-span-3 truncate text-[12.5px] text-muted-foreground">{c.phone}</p>
              <p className="col-span-2 truncate text-[12.5px] text-muted-foreground">{c.city}</p>
              <p className="col-span-2 text-right text-[13px] font-semibold tabular-nums">{inr(c.totalSpend)}</p>
              <div className="col-span-1 text-right">
                <StatusBadge status={c.outstanding > 0 ? "Pending" : "Paid"} />
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-md p-0">
          {active && (
            <>
              <SheetHeader className="border-b p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary text-[13px] font-semibold">
                    {active.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <SheetTitle className="text-[15px]">{active.name}</SheetTitle>
                    <p className="text-[11.5px] text-muted-foreground">{active.id} • {active.type}</p>
                  </div>
                </div>
              </SheetHeader>
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  <Metric label="Total spend" value={inr(active.totalSpend)} />
                  <Metric label="Outstanding" value={inr(active.outstanding)} tone={active.outstanding > 0 ? "danger" : "success"} />
                  <Metric label="Orders" value={active.orders.toString()} />
                </div>
                <div className="space-y-2 rounded-xl border p-4">
                  <p className="text-[12px] font-medium text-muted-foreground">Contact</p>
                  <p className="flex items-center gap-2 text-[13px]"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{active.phone}</p>
                  <p className="flex items-center gap-2 text-[13px]"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{active.email}</p>
                  <p className="flex items-center gap-2 text-[13px]"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{active.city}</p>
                </div>
                <div>
                  <p className="mb-2 text-[12px] font-medium text-muted-foreground">Recent transactions</p>
                  <div className="divide-y rounded-xl border">
                    {recentSales.slice(0, 4).map((s) => (
                      <div key={s.id} className="flex items-center justify-between px-4 py-2.5">
                        <div>
                          <p className="text-[12.5px] font-medium">{s.id}</p>
                          <p className="text-[11px] text-muted-foreground">{s.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[12.5px] font-semibold tabular-nums">{inr(s.amount)}</p>
                          <StatusBadge status={s.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "success" | "danger" }) {
  return (
    <div className="rounded-xl border p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={`mt-1 text-[14px] font-semibold tabular-nums ${tone === "danger" ? "text-destructive" : tone === "success" ? "text-success" : ""}`}>{value}</p>
    </div>
  );
}