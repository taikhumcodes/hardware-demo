import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSignature, Plus, Clock, CheckCircle2, XCircle, IndianRupee, Send, Copy } from "lucide-react";
import { inr, inrCompact } from "@/lib/data";

const quotes = [
  { id: "QT-2026-042", party: "Skyline Infra LLP", scope: "TMT + Cement for Tower B", amount: 1842500, valid: "2026-07-28", status: "Sent" },
  { id: "QT-2026-041", party: "Vikas Builders Pvt Ltd", scope: "Sanitary fittings — 2 floors", amount: 384250, valid: "2026-07-25", status: "Won" },
  { id: "QT-2026-040", party: "PWD Pune Circle", scope: "PVC pipes 6\" — govt tender", amount: 2148900, valid: "2026-07-30", status: "Sent" },
  { id: "QT-2026-039", party: "Reddy Enterprises", scope: "Paints — commercial complex", amount: 512400, valid: "2026-07-20", status: "Draft" },
  { id: "QT-2026-038", party: "MHADA Sub-division 3", scope: "Electricals — housing block", amount: 984200, valid: "2026-07-18", status: "Lost" },
  { id: "QT-2026-037", party: "Sharma Trading Co.", scope: "Steel + Hardware bulk", amount: 428100, valid: "2026-07-22", status: "Won" },
];

export default function Tenders() {
  const pipeline = quotes.filter((q) => q.status === "Sent" || q.status === "Draft").reduce((s, q) => s + q.amount, 0);
  const won = quotes.filter((q) => q.status === "Won").reduce((s, q) => s + q.amount, 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tender Quotations"
        description="Prepare, send and track quotations for tenders and B2B enquiries."
        actions={<Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Plus className="mr-2 h-4 w-4" /> New quotation</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open quotes" value={quotes.filter((q) => q.status !== "Won" && q.status !== "Lost").length.toString()} icon={FileSignature} tone="primary" />
        <StatCard label="Pipeline" value={inrCompact(pipeline)} icon={Clock} tone="warning" />
        <StatCard label="Won this month" value={inrCompact(won)} icon={CheckCircle2} tone="success" />
        <StatCard label="Win rate" value="58%" icon={IndianRupee} tone="primary" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quotes.map((q) => (
          <Card key={q.id} className="rounded-2xl border p-5 shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-16px_rgba(15,23,42,0.15)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-mono text-muted-foreground">{q.id}</p>
                <p className="mt-1 text-[15px] font-semibold tracking-tight">{q.party}</p>
              </div>
              <StatusBadge status={q.status} />
            </div>
            <p className="mt-2 text-[12.5px] text-muted-foreground">{q.scope}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3">
              <div>
                <p className="text-[11px] text-muted-foreground">Amount</p>
                <p className="text-[14px] font-semibold tabular-nums">{inr(q.amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground">Valid till</p>
                <p className="text-[13px] font-medium">{q.valid}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="h-8 flex-1 rounded-lg text-xs"><Send className="mr-1.5 h-3.5 w-3.5" /> Send</Button>
              <Button variant="outline" size="sm" className="h-8 flex-1 rounded-lg text-xs"><Copy className="mr-1.5 h-3.5 w-3.5" /> Duplicate</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}