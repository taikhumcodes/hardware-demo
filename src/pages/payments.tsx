import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { IndianRupee, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { inr } from "@/lib/data";

const payments = [
  { id: "PAY-9821", party: "Vikas Builders Pvt Ltd", mode: "UPI", amount: 184250, type: "Received", date: "2026-07-13", status: "Paid" },
  { id: "PAY-9820", party: "Reddy Enterprises", mode: "NEFT", amount: 148500, type: "Sent", date: "2026-07-12", status: "Paid" },
  { id: "PAY-9819", party: "Skyline Infra LLP", mode: "RTGS", amount: 412900, type: "Received", date: "2026-07-13", status: "Paid" },
  { id: "PAY-9818", party: "Sharma Trading Co.", mode: "Cheque", amount: 145200, type: "Sent", date: "2026-07-11", status: "Pending" },
  { id: "PAY-9817", party: "Ramesh Kumar", mode: "Cash", amount: 24500, type: "Received", date: "2026-07-10", status: "Paid" },
  { id: "PAY-9816", party: "Singh Metal Traders", mode: "NEFT", amount: 178300, type: "Sent", date: "2026-07-08", status: "Pending" },
];

export default function Payments() {
  const received = payments.filter((p) => p.type === "Received").reduce((s, x) => s + x.amount, 0);
  const sent = payments.filter((p) => p.type === "Sent").reduce((s, x) => s + x.amount, 0);
  return (
    <div className="space-y-6">
      <PageHeader title="Payments" description="Track incoming and outgoing payments across all modes." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Received" value={inr(received)} icon={ArrowDownLeft} tone="success" />
        <StatCard label="Sent" value={inr(sent)} icon={ArrowUpRight} tone="warning" />
        <StatCard label="Net cash" value={inr(received - sent)} icon={Wallet} tone="primary" />
      </div>
      <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
        <div className="grid grid-cols-12 gap-3 bg-secondary/40 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="col-span-2">ID</span><span className="col-span-4">Party</span><span className="col-span-2">Mode</span><span className="col-span-1">Type</span><span className="col-span-2 text-right">Amount</span><span className="col-span-1 text-right">Status</span>
        </div>
        <div className="divide-y">
          {payments.map((p) => (
            <div key={p.id} className="grid grid-cols-12 items-center gap-3 px-5 py-3 hover:bg-secondary/40 transition">
              <p className="col-span-2 text-[12.5px] font-mono">{p.id}</p>
              <p className="col-span-4 truncate text-[13px] font-medium">{p.party}</p>
              <p className="col-span-2 text-[12.5px] text-muted-foreground">{p.mode}</p>
              <p className={`col-span-1 text-[12.5px] font-medium ${p.type === "Received" ? "text-success" : "text-primary"}`}>{p.type}</p>
              <p className={`col-span-2 text-right text-[13px] font-semibold tabular-nums ${p.type === "Received" ? "text-success" : "text-foreground"}`}>{p.type === "Received" ? "+" : "−"} {inr(p.amount)}</p>
              <div className="col-span-1 text-right"><StatusBadge status={p.status} /></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}