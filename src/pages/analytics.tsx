import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { TrendingUp, Users, Truck, IndianRupee } from "lucide-react";
import { monthlySeries, categoryPerformance, topProducts, inr, inrCompact } from "@/lib/data";

const growth = [
  { m: "Jan", customers: 820 },
  { m: "Feb", customers: 890 },
  { m: "Mar", customers: 962 },
  { m: "Apr", customers: 1042 },
  { m: "May", customers: 1128 },
  { m: "Jun", customers: 1218 },
  { m: "Jul", customers: 1284 },
];

const colors = ["#F97316", "#111827", "#16A34A", "#F59E0B", "#6366F1", "#94A3B8"];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Revenue trends, margins and growth insights." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="MoM Growth" value="+8.2%" icon={TrendingUp} tone="success" />
        <StatCard label="Gross Margin" value="24.6%" icon={IndianRupee} tone="primary" />
        <StatCard label="Customer growth" value="+66" icon={Users} tone="success" />
        <StatCard label="Supplier score" value="4.65 / 5" icon={Truck} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border p-5 shadow-none lg:col-span-2">
          <h3 className="text-[15px] font-semibold tracking-tight">Revenue trend</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Sales vs. purchases</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlySeries} margin={{ left: -10, right: 8, top: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => inrCompact(v)} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} formatter={(v: number) => [inrCompact(v), ""]} />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
              <Line type="monotone" dataKey="sales" stroke="#F97316" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="purchases" stroke="#111827" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="rounded-2xl border p-5 shadow-none">
          <h3 className="text-[15px] font-semibold tracking-tight">Category performance</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Share of revenue</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} />
              <Pie data={categoryPerformance} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {categoryPerformance.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {categoryPerformance.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-[11.5px]">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="ml-auto tabular-nums font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border p-5 shadow-none">
          <h3 className="text-[15px] font-semibold tracking-tight">Customer growth</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Total customers over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={growth} margin={{ left: -10, right: 8, top: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="m" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} />
              <Line type="monotone" dataKey="customers" stroke="#F97316" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="rounded-2xl border p-5 shadow-none lg:col-span-2">
          <h3 className="text-[15px] font-semibold tracking-tight">Best sellers</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Top 5 by revenue</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts} margin={{ left: -10, right: 8, top: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} interval={0} height={40} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => inrCompact(v)} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }} formatter={(v: number) => [inr(v), "Revenue"]} />
              <Bar dataKey="revenue" fill="#F97316" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}