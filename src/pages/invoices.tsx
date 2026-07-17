import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, Plus, IndianRupee, Clock, AlertOctagon } from "lucide-react";
import { useSales, useSaleItems, useSettings, type Sale } from "@/lib/api";
import { inr, inrCompact, fmtDate } from "@/lib/format";

export default function Invoices() {
  const { data: sales = [] } = useSales();
  const { data: settings } = useSettings();
  const [selected, setSelected] = useState<Sale | null>(null);
  const preview = selected ?? sales[0] ?? null;
  const { data: items = [] } = useSaleItems(preview?.id ?? null);

  const paid = sales.filter((s) => s.payment_status === "paid").reduce((a, s) => a + Number(s.total), 0);
  const pending = sales.filter((s) => s.payment_status === "pending" || s.payment_status === "partial").reduce((a, s) => a + Number(s.total), 0);
  const overdue = sales.filter((s) => s.payment_status === "overdue").reduce((a, s) => a + Number(s.total), 0);

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
            <span className="text-[11.5px] text-muted-foreground">{sales.length}</span>
          </div>
          <div className="max-h-[520px] divide-y overflow-y-auto">
            {sales.map((s) => (
              <button key={s.id} onClick={() => setSelected(s)} className={`flex w-full items-center justify-between px-5 py-3 text-left transition ${preview?.id === s.id ? "bg-secondary/60" : "hover:bg-secondary/40"}`}>
                <div>
                  <p className="text-[12.5px] font-mono text-muted-foreground">{s.invoice_number}</p>
                  <p className="mt-0.5 text-[13px] font-medium truncate max-w-[180px]">{s.customer_name ?? "Walk-in"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold tabular-nums">{inr(Number(s.total))}</p>
                  <StatusBadge status={s.payment_status} />
                </div>
              </button>
            ))}
            {sales.length === 0 && <div className="p-6 text-center text-[12px] text-muted-foreground">No invoices</div>}
          </div>
        </Card>

        <Card className="rounded-2xl border p-0 shadow-none overflow-hidden lg:col-span-2">
         {preview ? (
          <>
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-[11.5px] text-muted-foreground">Preview</p>
              <p className="text-[15px] font-semibold font-mono">{preview.invoice_number}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs"><Download className="mr-1.5 h-3.5 w-3.5" />PDF</Button>
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs"><Printer className="mr-1.5 h-3.5 w-3.5" />Print</Button>
            </div>
          </div>
          <div className="p-6 space-y-5 text-[13px]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[18px] font-semibold tracking-tight">{settings?.shop_name ?? "Evolix Hardware"}</p>
                <p className="text-[11.5px] text-muted-foreground">GSTIN {settings?.gstin ?? "—"} • {settings?.address ?? ""}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={preview.payment_status} />
                <p className="mt-2 text-[11px] text-muted-foreground">Date {fmtDate(preview.sale_date)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Billed to</p>
                <p className="mt-1 font-medium">{preview.customer_name ?? preview.customers?.name ?? "Walk-in"}</p>
                <p className="text-[11.5px] text-muted-foreground">GSTIN {preview.customers?.gstin ?? "—"}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-muted-foreground">Payment</p>
                <p className="mt-1 font-medium capitalize">{preview.payment_method}</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border">
              <div className="grid grid-cols-12 gap-3 bg-secondary/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="col-span-6">Item</span><span className="col-span-2 text-right">Qty</span><span className="col-span-2 text-right">Rate</span><span className="col-span-2 text-right">Amount</span>
              </div>
              {items.map((r) => (
                <div key={r.id} className="grid grid-cols-12 gap-3 border-t px-4 py-2.5 text-[12.5px]">
                  <span className="col-span-6">{r.product_name}</span>
                  <span className="col-span-2 text-right tabular-nums">{r.quantity}</span>
                  <span className="col-span-2 text-right tabular-nums">{inr(Number(r.unit_price))}</span>
                  <span className="col-span-2 text-right font-medium tabular-nums">{inr(Number(r.line_total))}</span>
                </div>
              ))}
              {items.length === 0 && <div className="border-t p-4 text-center text-[12px] text-muted-foreground">No line items</div>}
            </div>
            <div className="ml-auto w-full max-w-xs space-y-1.5">
              <Row label="Subtotal" value={inr(Number(preview.subtotal))} />
              <Row label="GST" value={inr(Number(preview.gst_amount))} />
              {Number(preview.discount) > 0 && <Row label="Discount" value={`- ${inr(Number(preview.discount))}`} />}
              <div className="my-2 border-t" />
              <Row label="Total" value={inr(Number(preview.total))} strong />
            </div>
          </div>
          </>
         ) : (
          <div className="p-16 text-center text-[13px] text-muted-foreground">Select an invoice to preview</div>
         )}
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