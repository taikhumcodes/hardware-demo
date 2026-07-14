import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, FileBarChart, Warehouse, Truck, Users, Receipt } from "lucide-react";
import { toast } from "sonner";

const reports = [
  { icon: FileBarChart, name: "Sales Report", desc: "Revenue, invoices and payment status by period.", stat: "₹26.9 L this month" },
  { icon: Warehouse, name: "Inventory Report", desc: "Stock valuation, movement and reorder list.", stat: "1,842 SKUs tracked" },
  { icon: Truck, name: "Purchase Report", desc: "Supplier-wise purchases, PO status and pending dues.", stat: "18 POs this month" },
  { icon: Users, name: "Customer Report", desc: "Customer ledger, spend and outstanding balances.", stat: "1,284 customers" },
  { icon: Receipt, name: "GST Report (GSTR-1/3B)", desc: "Tax-ready summary with HSN and CGST/SGST/IGST splits.", stat: "Ready for Jul 2026" },
  { icon: FileBarChart, name: "Profit & Loss", desc: "Margin analysis by product and category.", stat: "Net margin 18.4%" },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Ready-to-share business reports. Export as PDF or Excel." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.name} className="rounded-2xl border p-5 shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-16px_rgba(15,23,42,0.15)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><r.icon className="h-5 w-5" /></div>
            <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{r.name}</h3>
            <p className="mt-1 text-[12.5px] text-muted-foreground">{r.desc}</p>
            <p className="mt-3 text-[11.5px] font-medium text-primary">{r.stat}</p>
            <div className="mt-4 flex gap-2 border-t pt-3">
              <Button variant="outline" size="sm" className="h-8 flex-1 rounded-lg text-xs" onClick={() => toast.success(`${r.name} exported`)}>
                <Download className="mr-1.5 h-3.5 w-3.5" /> Export
              </Button>
              <Button variant="outline" size="sm" className="h-8 flex-1 rounded-lg text-xs" onClick={() => toast.success("Sent to printer")}>
                <Printer className="mr-1.5 h-3.5 w-3.5" /> Print
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}