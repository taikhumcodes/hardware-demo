import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Settings() {
  const [notif, setNotif] = useState({ email: true, sms: false, low: true, po: true });
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Business profile, GST details, preferences and notifications." />
      <Tabs defaultValue="business">
        <TabsList className="bg-secondary/60 p-1 rounded-xl">
          <TabsTrigger value="business" className="rounded-lg">Business</TabsTrigger>
          <TabsTrigger value="gst" className="rounded-lg">GST</TabsTrigger>
          <TabsTrigger value="store" className="rounded-lg">Store</TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-lg">Preferences</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <SectionCard title="Business profile" subtitle="This information appears on invoices and public documents.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Business name" defaultValue="Evolix Hardware Traders" />
              <Field label="Owner name" defaultValue="Rakesh Sharma" />
              <Field label="Phone" defaultValue="+91 98200 55555" />
              <Field label="Email" defaultValue="hello@evolixhardware.in" />
              <Field label="Address line 1" defaultValue="Shop 12, Ganesh Chowk" className="sm:col-span-2" />
              <Field label="City" defaultValue="Mumbai" />
              <Field label="State" defaultValue="Maharashtra" />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="gst">
          <SectionCard title="GST details" subtitle="Required for GST-compliant invoices and reports.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="GSTIN" defaultValue="27ABCDE1234F1Z5" />
              <Field label="PAN" defaultValue="ABCDE1234F" />
              <Field label="Composition scheme" defaultValue="No" />
              <Field label="HSN default" defaultValue="7213" />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="store">
          <SectionCard title="Store information" subtitle="Operating hours, terminals and cash counters.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Opening time" defaultValue="09:00 AM" />
              <Field label="Closing time" defaultValue="09:00 PM" />
              <Field label="POS terminals" defaultValue="2" />
              <Field label="Weekly off" defaultValue="Sunday" />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="preferences">
          <SectionCard title="User preferences" subtitle="Localization and display defaults.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Currency" defaultValue="INR (₹)" />
              <Field label="Timezone" defaultValue="Asia/Kolkata" />
              <Field label="Number format" defaultValue="Indian (1,00,000)" />
              <Field label="Language" defaultValue="English" />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="notifications">
          <SectionCard title="Notifications" subtitle="Choose what you'd like to hear about.">
            <div className="divide-y">
              {[
                { k: "email", label: "Email summaries", desc: "Daily revenue and inventory digest." },
                { k: "sms", label: "SMS alerts", desc: "Critical alerts to your phone." },
                { k: "low", label: "Low stock alerts", desc: "Notify when stock drops below minimum." },
                { k: "po", label: "PO delivery updates", desc: "Track incoming supplier deliveries." },
              ].map((n) => (
                <div key={n.k} className="flex items-center justify-between py-3.5">
                  <div><p className="text-[13.5px] font-medium">{n.label}</p><p className="text-[11.5px] text-muted-foreground">{n.desc}</p></div>
                  <Switch checked={notif[n.k as keyof typeof notif]} onCheckedChange={(v) => setNotif((x) => ({ ...x, [n.k]: v }))} />
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]" onClick={() => toast.success("Settings saved")}>Save changes</Button>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-2xl border p-6 shadow-none mt-4">
      <div className="mb-5">
        <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
        <p className="mt-0.5 text-[12.5px] text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </Card>
  );
}

function Field({ label, defaultValue, className }: { label: string; defaultValue?: string; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-[12px] font-medium text-muted-foreground">{label}</Label>
      <Input defaultValue={defaultValue} className="h-9 rounded-lg" />
    </div>
  );
}