import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, UserPlus, Users as UsersIcon, KeyRound, Check } from "lucide-react";

const users = [
  { name: "Rakesh Sharma", email: "rakesh@evolixhw.in", role: "Owner", branch: "HQ - Mumbai", active: true, last: "Just now" },
  { name: "Priya Nair", email: "priya@evolixhw.in", role: "Manager", branch: "HQ - Mumbai", active: true, last: "12 min ago" },
  { name: "Suresh Patil", email: "suresh@evolixhw.in", role: "Cashier", branch: "Pune Branch", active: true, last: "2 hrs ago" },
  { name: "Anil Deshmukh", email: "anil@evolixhw.in", role: "Warehouse", branch: "HQ - Mumbai", active: true, last: "Yesterday" },
  { name: "Ramesh Kumar", email: "ramesh@evolixhw.in", role: "Purchase", branch: "Delhi Branch", active: false, last: "3 days ago" },
  { name: "Neha Gupta", email: "neha@evolixhw.in", role: "Accounts", branch: "HQ - Mumbai", active: true, last: "5 hrs ago" },
];

const roles = [
  { name: "Owner", desc: "Full access to every module and settings.", count: 1, perms: ["All modules", "Settings", "User control", "Financials"] },
  { name: "Manager", desc: "Manage stock, sales and reports.", count: 2, perms: ["Products", "Inventory", "Sales", "Reports"] },
  { name: "Cashier", desc: "Billing counter — POS + invoices only.", count: 4, perms: ["Sales POS", "Invoices", "Customers"] },
  { name: "Warehouse", desc: "Stock inward, outward and adjustments.", count: 3, perms: ["Inventory", "Stock", "Barcode"] },
];

export default function UserControl() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="User Control"
        description="Team members, roles and permissions across branches."
        actions={<Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]"><UserPlus className="mr-2 h-4 w-4" /> Invite user</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={users.length.toString()} icon={UsersIcon} tone="primary" />
        <StatCard label="Active" value={users.filter((u) => u.active).length.toString()} icon={ShieldCheck} tone="success" />
        <StatCard label="Roles" value={roles.length.toString()} icon={KeyRound} tone="warning" />
        <StatCard label="Branches" value="3" icon={UsersIcon} tone="primary" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
          <div className="border-b px-5 py-3">
            <p className="text-[13px] font-semibold">Team members</p>
          </div>
          {users.map((u) => (
            <div key={u.email} className="flex items-center gap-3 border-t px-5 py-3 first:border-t-0 hover:bg-secondary/20">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-[12px] font-semibold text-primary">
                {u.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate">{u.name}</p>
                <p className="text-[11.5px] text-muted-foreground truncate">{u.email} • {u.branch}</p>
              </div>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground">{u.role}</span>
              <Switch checked={u.active} />
            </div>
          ))}
        </Card>
        <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
          <div className="border-b px-5 py-3">
            <p className="text-[13px] font-semibold">Roles & permissions</p>
          </div>
          {roles.map((r) => (
            <div key={r.name} className="border-t px-5 py-4 first:border-t-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[14px] font-semibold">{r.name}</p>
                  <p className="text-[12px] text-muted-foreground">{r.desc}</p>
                </div>
                <span className="text-[11.5px] text-muted-foreground">{r.count} user{r.count === 1 ? "" : "s"}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {r.perms.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                    <Check className="h-3 w-3" /> {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}