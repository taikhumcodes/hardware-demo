import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, Warehouse, Tags, Truck, Users, ShoppingCart,
  ClipboardList, FileText, CreditCard, FileBarChart, LineChart, Settings, Wrench,
  Boxes, Bookmark, Barcode, FileSignature, ShieldCheck, Lock, Sparkles,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  section: string;
  premium?: boolean;
};

const nav: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, section: "Overview" },
  { title: "Products", url: "/products", icon: Package, section: "Inventory" },
  { title: "Categories", url: "/categories", icon: Tags, section: "Inventory" },
  { title: "Brands", url: "/brands", icon: Bookmark, section: "Inventory" },
  { title: "Inventory Master", url: "/inventory", icon: Warehouse, section: "Inventory" },
  { title: "Stock Management", url: "/stock", icon: Boxes, section: "Inventory" },
  { title: "Barcode", url: "/barcode", icon: Barcode, section: "Inventory" },
  { title: "Suppliers", url: "/suppliers", icon: Truck, section: "Contacts" },
  { title: "Customers", url: "/customers", icon: Users, section: "Contacts" },
  { title: "Sales POS", url: "/sales", icon: ShoppingCart, section: "Sales" },
  { title: "Invoices", url: "/invoices", icon: FileText, section: "Sales" },
  { title: "Tender Quotations", url: "/tenders", icon: FileSignature, section: "Sales" },
  { title: "Purchase Orders", url: "/purchase-orders", icon: ClipboardList, section: "Purchase" },
  { title: "Credit Management", url: "/credit", icon: CreditCard, section: "Finance" },
  { title: "Payments", url: "/payments", icon: CreditCard, section: "Finance", premium: true },
  { title: "Reports", url: "/reports", icon: FileBarChart, section: "Insights" },
  { title: "Analytics", url: "/analytics", icon: LineChart, section: "Insights", premium: true },
  { title: "User Control", url: "/users", icon: ShieldCheck, section: "System" },
  { title: "Settings", url: "/settings", icon: Settings, section: "System" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const sections = Array.from(new Set(nav.map((n) => n.section)));

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Wrench className="h-4.5 w-4.5" strokeWidth={2.2} />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-semibold tracking-tight">Evolix Hardware</span>
              <span className="text-[11px] text-muted-foreground">Phase 1 • Shop Management</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-1 pt-2">
        {sections.map((section) => (
          <SidebarGroup key={section}>
            {!collapsed && <SidebarGroupLabel className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground/70">{section}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.filter((n) => n.section === section).map((item) => {
                  const active = item.url === "/" ? currentPath === "/" : currentPath.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title} className="h-9 rounded-lg data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium">
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 truncate">{item.title}</span>
                          {item.premium && !collapsed && (
                            <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-primary/15 to-amber-500/15 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-primary ring-1 ring-primary/20">
                              <Lock className="h-2.5 w-2.5" />
                            </span>
                          )}
                          {item.premium && collapsed && (
                            <Sparkles className="ml-auto h-3 w-3 text-primary" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}