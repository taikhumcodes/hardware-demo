import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, delta, icon: Icon, tone = "default", index = 0,
}: {
  label: string;
  value: string;
  delta?: { value: string; positive?: boolean };
  icon: LucideIcon;
  tone?: "default" | "primary" | "success" | "warning" | "danger";
  index?: number;
}) {
  const toneMap: Record<string, string> = {
    default: "bg-secondary text-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-destructive/10 text-destructive",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      className="group relative rounded-2xl border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all hover:shadow-[0_8px_28px_-16px_rgba(15,23,42,0.15)] hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12.5px] font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-[26px] font-semibold tracking-tight text-foreground">{value}</p>
          {delta && (
            <p className={cn("mt-1.5 text-[12px] font-medium", delta.positive === false ? "text-destructive" : "text-success")}>
              {delta.positive === false ? "▼" : "▲"} {delta.value}
            </p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}