import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export function PremiumBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary/15 to-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary ring-1 ring-primary/20 ${className}`}>
      <Sparkles className="h-2.5 w-2.5" /> Premium
    </span>
  );
}

export function UpgradeDialog({ open, onOpenChange, module }: { open: boolean; onOpenChange: (v: boolean) => void; module?: string }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
        <div className="relative bg-gradient-to-br from-primary/10 via-background to-amber-500/5 px-6 pt-8 pb-4">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl" />
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-amber-500 text-primary-foreground shadow-lg shadow-primary/30"
          >
            <Lock className="h-6 w-6" strokeWidth={2.4} />
          </motion.div>
          <div className="relative mt-4 text-center">
            <PremiumBadge />
            <DialogHeader className="mt-3 space-y-1.5">
              <DialogTitle className="text-center text-xl font-semibold tracking-tight">
                {module ? `${module} — Premium Module` : "Premium Module"}
              </DialogTitle>
              <DialogDescription className="text-center text-[13px] leading-relaxed">
                This feature is not included in your current package.
                <br />
                Upgrade to <span className="font-semibold text-foreground">Phase 2</span> or{" "}
                <span className="font-semibold text-foreground">Phase 3</span> to unlock this functionality.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
        <div className="space-y-3 px-6 pb-6 pt-2">
          <div className="rounded-xl border bg-secondary/40 p-3.5">
            <p className="text-[11.5px] font-medium uppercase tracking-wider text-muted-foreground">Contact Evolix</p>
            <div className="mt-2 space-y-1.5 text-[13px]">
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-primary" /> hello@evolix.in</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary" /> +91 98765 43210</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" className="flex-1 rounded-lg" onClick={() => onOpenChange(false)}>
              Maybe later
            </Button>
            <Button className="flex-1 rounded-lg bg-gradient-to-r from-primary to-amber-500 text-primary-foreground shadow-md hover:opacity-95">
              Request Upgrade
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PremiumLock({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative min-h-[70vh]">
      <div aria-hidden className="pointer-events-none select-none blur-[6px] opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background/95" />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border bg-card p-7 text-center shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]"
        >
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />
          <motion.div
            initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.05 }}
            className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-amber-500 text-primary-foreground shadow-xl shadow-primary/30"
          >
            <Lock className="h-7 w-7" strokeWidth={2.4} />
          </motion.div>
          <div className="relative mt-5">
            <PremiumBadge />
          </div>
          <h2 className="relative mt-3 text-xl font-semibold tracking-tight">{title}</h2>
          <p className="relative mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
            {description ?? "This module is part of our premium package. Upgrade to Phase 2 or Phase 3 to unlock the full experience."}
          </p>
          <div className="relative mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              onClick={() => setOpen(true)}
              className="rounded-lg bg-gradient-to-r from-primary to-amber-500 text-primary-foreground shadow-md hover:opacity-95"
            >
              <Sparkles className="mr-1.5 h-4 w-4" /> Upgrade to unlock
            </Button>
            <Button variant="outline" className="rounded-lg" disabled>
              Preview only
            </Button>
          </div>
          <p className="relative mt-5 text-[11px] text-muted-foreground">
            Contact <span className="font-medium text-foreground">Evolix</span> to enable this feature.
          </p>
        </motion.div>
      </div>
      <UpgradeDialog open={open} onOpenChange={setOpen} title-placeholder="" module={title} />
    </div>
  );
}