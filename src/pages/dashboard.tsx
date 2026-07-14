import { motion } from "framer-motion";
import {
  IndianRupee, TrendingUp, Package, AlertTriangle, ShoppingCart, Users,
  Truck, Plus, FileText, Download, ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { Progress } from "@/components/ui/progress";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import {
  products, recentSales, purchaseOrders, revenueSeries, monthlySeries,
  topProducts, inr, inrCompact,
} from "@/lib/data";

export default function Dashboard() {
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < p.minStock);
  const outOfStock = products.filter((p) => p.stock === 0);
  const todayRevenue = 156200;
  const monthRevenue = 2695000;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back, Evolix Admin. Here's what's happening in your shop today."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 rounded-lg">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]">
              <Plus className="mr-2 h-4 w-4" /> New Invoice
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} label="Today's Revenue" value={inr(todayRevenue)} delta={{ value: "12.4% vs yesterday" }} icon={IndianRupee} tone="primary" />
        <StatCard index={1} label="Monthly Revenue" value={inrCompact(monthRevenue)} delta={{ value: "8.2% vs last month" }} icon={TrendingUp} tone="success" />
        <StatCard index={2} label="Total Products" value={products.length.toString()} delta={{ value: "3 added this week" }} icon={Package} />
        <StatCard index={3} label="Low Stock Alerts" value={(lowStock.length + outOfStock.length).toString()} delta={{ value: "Needs restock", positive: false }} icon={AlertTriangle} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={4} label="Pending Orders" value="14" icon={ShoppingCart} />
        <StatCard index={5} label="Total Customers" value="1,284" delta={{ value: "56 new this month" }} icon={Users} />
        <StatCard index={6} label="Total Suppliers" value="38" icon={Truck} />
        <StatCard index={7} label="Avg. Order Value" value="₹18,420" delta={{ value: "4.1%" }} icon={ArrowUpRight} tone="primary" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue this week" subtitle="Daily sales performance" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueSeries} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => inrCompact(v)} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", boxShadow: "0 8px 24px -12px rgba(15,23,42,0.15)", fontSize: 12 }}
                formatter={(v: number) => [inr(v), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="rounded-2xl border p-5 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Inventory overview</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Live warehouse status</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <InvBar label="In stock" value={products.length - lowStock.length - outOfStock.length} total={products.length} color="bg-success" />
            <InvBar label="Low stock" value={lowStock.length} total={products.length} color="bg-warning" />
            <InvBar label="Out of stock" value={outOfStock.length} total={products.length} color="bg-destructive" />
          </div>
          <div className="mt-6 rounded-xl border bg-secondary/50 p-4">
            <p className="text-xs font-medium text-muted-foreground">Inventory value</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">₹1.42 Cr</p>
            <p className="mt-0.5 text-[11px] text-success font-medium">▲ 3.2% this month</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Monthly performance" subtitle="Sales vs. purchases (last 7 months)" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlySeries} margin={{ left: -10, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => inrCompact(v)} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }}
                formatter={(v: number, n) => [inrCompact(v), n === "sales" ? "Sales" : "Purchases"]}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
              <Bar dataKey="sales" fill="#F97316" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="purchases" fill="#E5E7EB" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="rounded-2xl border p-5 shadow-none">
          <h3 className="text-[15px] font-semibold tracking-tight">Top selling products</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">This month</p>
          <div className="mt-4 space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-[11px] font-semibold text-muted-foreground">
                  #{i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.sold.toLocaleString("en-IN")} units</p>
                </div>
                <p className="text-[13px] font-semibold tabular-nums">{inrCompact(p.revenue)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Recent sales</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Last 10 invoices</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">View all</Button>
          </div>
          <div className="divide-y">
            {recentSales.slice(0, 6).map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/50 transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary text-[11px] font-semibold">
                  {s.customer.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{s.customer}</p>
                  <p className="text-[11px] text-muted-foreground">{s.id} • {s.items} items</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold tabular-nums">{inr(s.amount)}</p>
                  <div className="mt-0.5"><StatusBadge status={s.status} /></div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Recent purchase orders</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Supplier deliveries</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">View all</Button>
          </div>
          <div className="divide-y">
            {purchaseOrders.slice(0, 6).map((po, i) => (
              <motion.div
                key={po.id}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/50 transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <Truck className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{po.supplier}</p>
                  <p className="text-[11px] text-muted-foreground">{po.id} • ETA {po.expected}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold tabular-nums">{inrCompact(po.amount)}</p>
                  <div className="mt-0.5"><StatusBadge status={po.status} /></div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border p-5 shadow-none lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Low stock alerts</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Items below minimum threshold</p>
            </div>
            <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs">Create PO</Button>
          </div>
          <div className="mt-4 space-y-3">
            {[...outOfStock, ...lowStock].slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border p-3 hover:bg-secondary/40 transition">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/15 text-warning">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.sku} • min {p.minStock} {p.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold tabular-nums">{p.stock} {p.unit}</p>
                  <StatusBadge status={p.stock === 0 ? "Out of stock" : "Low stock"} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border p-5 shadow-none">
          <h3 className="text-[15px] font-semibold tracking-tight">Quick actions</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Speed up common tasks</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { icon: Plus, label: "New Sale" },
              { icon: FileText, label: "New Invoice" },
              { icon: Package, label: "Add Product" },
              { icon: Truck, label: "New PO" },
              { icon: Users, label: "Add Customer" },
              { icon: Download, label: "GST Report" },
            ].map((a) => (
              <button key={a.label} className="flex flex-col items-start gap-2 rounded-xl border bg-card p-3 text-left transition hover:border-primary/40 hover:bg-primary/5">
                <a.icon className="h-4 w-4 text-primary" />
                <span className="text-[12.5px] font-medium">{a.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={`rounded-2xl border p-5 shadow-none ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </Card>
  );
}

function InvBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${color}`} />
          <span className="text-[12.5px] font-medium">{label}</span>
        </div>
        <span className="text-[12px] tabular-nums text-muted-foreground">{value} <span className="text-muted-foreground/60">({pct}%)</span></span>
      </div>
      <Progress value={pct} className="h-1.5 bg-secondary" />
    </div>
  );
}