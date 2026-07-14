import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, Plus, IndianRupee, Clock, AlertOctagon } from "lucide-react";
import { recentSales, inr, inrCompact } from "@/lib/data";

export default function Invoices() {
  const paid = recentSales.filter((s) => s.status === "Paid").reduce((a, s) => a + s.amount, 0);
  const pending = recentSales.filter((s) => s.status === "Pending").reduce((a, s) => a + s.amount, 0);
  const overdue = recentSales.filter((s) => s.status === "Overdue").reduce((a, s) => a + s.amount, 0);
  const preview = recentSales[0];
  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="GST-compliant invoices with payment status."
        actions={<Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Plus className="mr-2 h-4 w-4" /> New invoice</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total billed" value={inrCompact(paid + pending + overdue)} icon={IndianRupee} tone="primary" />
        <StatCard label="Paid" value={inrCompact(paid)} icon={FileText} tone="success" />
        <StatCard label="Pending" value={inrCompact(pending)} icon={Clock} tone="warning" />
        <StatCard label="Overdue" value={inrCompact(overdue)} icon={AlertOctagon} tone="danger" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border p-0 shadow-none overflow-hidden lg:col-span-1">
          <div className="border-b px-5 py-4 flex items-center justify-between">
            <h3 className="text-[15px] font-semibold tracking-tight">All invoices</h3>
            <span className="text-[11.5px] text-muted-foreground">{recentSales.length}</span>
          </div>
          <div className="max-h-[520px] divide-y overflow-y-auto">
            {recentSales.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-secondary/40 transition">
                <div>
                  <p className="text-[12.5px] font-mono text-muted-foreground">{s.id}</p>
                  <p className="mt-0.5 text-[13px] font-medium truncate max-w-[180px]">{s.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold tabular-nums">{inr(s.amount)}</p>
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border p-0 shadow-none overflow-hidden lg:col-span-2">
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-[11.5px] text-muted-foreground">Preview</p>
              <p className="text-[15px] font-semibold font-mono">{preview.id}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs"><Download className="mr-1.5 h-3.5 w-3.5" />PDF</Button>
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs"><Printer className="mr-1.5 h-3.5 w-3.5" />Print</Button>
            </div>
          </div>
          <div className="p-6 space-y-5 text-[13px]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[18px] font-semibold tracking-tight">Evolix Hardware Traders</p>
                <p className="text-[11.5px] text-muted-foreground">GSTIN 27ABCDE1234F1Z5 • Mumbai, MH</p>
              </div>
              <div className="text-right">
                <StatusBadge status={preview.status} />
                <p className="mt-2 text-[11px] text-muted-foreground">Date {preview.date}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Billed to</p>
                <p className="mt-1 font-medium">{preview.customer}</p>
                <p className="text-[11.5px] text-muted-foreground">GSTIN 27AAECV9821L1Z3</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-muted-foreground">Due date</p>
                <p className="mt-1 font-medium">2026-07-27</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border">
              <div className="grid grid-cols-12 gap-3 bg-secondary/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="col-span-6">Item</span><span className="col-span-2 text-right">Qty</span><span className="col-span-2 text-right">Rate</span><span className="col-span-2 text-right">Amount</span>
              </div>
              {[
                { n: "UltraTech PPC 50kg", q: 100, r: 430 },
                { n: "JSW TMT 12mm", q: 850, r: 71 },
                { n: "Astral CPVC Pipe 1\"", q: 40, r: 465 },
                { n: "Anchor Roma 16A Switch", q: 60, r: 135 },
              ].map((r) => (
                <div key={r.n} className="grid grid-cols-12 gap-3 border-t px-4 py-2.5 text-[12.5px]">
                  <span className="col-span-6">{r.n}</span>
                  <span className="col-span-2 text-right tabular-nums">{r.q}</span>
                  <span className="col-span-2 text-right tabular-nums">{inr(r.r)}</span>
                  <span className="col-span-2 text-right font-medium tabular-nums">{inr(r.q * r.r)}</span>
                </div>
              ))}
            </div>
            <div className="ml-auto w-full max-w-xs space-y-1.5">
              <Row label="Subtotal" value={inr(148300)} />
              <Row label="CGST 9%" value={inr(13347)} />
              <Row label="SGST 9%" value={inr(13347)} />
              <div className="my-2 border-t" />
              <Row label="Total" value={inr(preview.amount)} strong />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${strong ? "text-[15px] font-semibold" : "text-[12.5px] text-muted-foreground"}`}>
      <span>{label}</span><span className="tabular-nums text-foreground">{value}</span>
    </div>
  );
}