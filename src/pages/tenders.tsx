import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileSignature, Plus, Clock, CheckCircle2, IndianRupee, Send, Copy } from "lucide-react";
import { useQuotations, useSaveQuotation } from "@/lib/api";
import { inr, inrCompact, fmtDate } from "@/lib/format";

export default function Tenders() {
  const { data: quotes = [] } = useQuotations();
  const save = useSaveQuotation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ party_name: "", scope: "", total: 0, valid_until: "" });
  const pipeline = quotes.filter((q) => q.status === "sent" || q.status === "draft").reduce((s, q) => s + Number(q.total), 0);
  const won = quotes.filter((q) => q.status === "won").reduce((s, q) => s + Number(q.total), 0);
  const winRate = quotes.length ? Math.round((quotes.filter((q) => q.status === "won").length / quotes.filter((q) => q.status === "won" || q.status === "lost").length) * 100) || 0 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tender Quotations"
        description="Prepare, send and track quotations for tenders and B2B enquiries."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><Plus className="mr-2 h-4 w-4" /> New quotation</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-lg">
              <DialogHeader><DialogTitle>New quotation</DialogTitle></DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1.5"><Label>Party name</Label><Input value={form.party_name} onChange={(e) => setForm({ ...form, party_name: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Scope</Label><Textarea value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Total</Label><Input type="number" value={form.total} onChange={(e) => setForm({ ...form, total: Number(e.target.value) })} /></div>
                  <div className="space-y-1.5"><Label>Valid until</Label><Input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} /></div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={!form.party_name || save.isPending} onClick={async () => { await save.mutateAsync({ ...form, valid_until: form.valid_until || null }); setOpen(false); setForm({ party_name:"", scope:"", total:0, valid_until:"" }); }} className="bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open quotes" value={quotes.filter((q) => q.status !== "won" && q.status !== "lost").length.toString()} icon={FileSignature} tone="primary" />
        <StatCard label="Pipeline" value={inrCompact(pipeline)} icon={Clock} tone="warning" />
        <StatCard label="Won total" value={inrCompact(won)} icon={CheckCircle2} tone="success" />
        <StatCard label="Win rate" value={`${winRate}%`} icon={IndianRupee} tone="primary" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quotes.map((q) => (
          <Card key={q.id} className="rounded-2xl border p-5 shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-16px_rgba(15,23,42,0.15)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-mono text-muted-foreground">{q.quote_number}</p>
                <p className="mt-1 text-[15px] font-semibold tracking-tight">{q.party_name}</p>
              </div>
              <StatusBadge status={q.status} />
            </div>
            <p className="mt-2 text-[12.5px] text-muted-foreground">{q.scope ?? "—"}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3">
              <div>
                <p className="text-[11px] text-muted-foreground">Amount</p>
                <p className="text-[14px] font-semibold tabular-nums">{inr(Number(q.total))}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground">Valid till</p>
                <p className="text-[13px] font-medium">{fmtDate(q.valid_until)}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="h-8 flex-1 rounded-lg text-xs"><Send className="mr-1.5 h-3.5 w-3.5" /> Send</Button>
              <Button variant="outline" size="sm" className="h-8 flex-1 rounded-lg text-xs"><Copy className="mr-1.5 h-3.5 w-3.5" /> Duplicate</Button>
            </div>
          </Card>
        ))}
        {quotes.length === 0 && <div className="col-span-full p-12 text-center text-[13px] text-muted-foreground">No quotations yet</div>}
      </div>
    </div>
  );
}