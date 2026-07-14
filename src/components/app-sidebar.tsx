import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, Warehouse, Tags, Truck, Users, ShoppingCart,
  ClipboardList, FileText, CreditCard, FileBarChart, LineChart, Settings, Wrench,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const nav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, section: "Overview" },
  { title: "Products", url: "/products", icon: Package, section: "Catalog" },
  { title: "Inventory", url: "/inventory", icon: Warehouse, section: "Catalog" },
  { title: "Categories", url: "/categories", icon: Tags, section: "Catalog" },
  { title: "Suppliers", url: "/suppliers", icon: Truck, section: "Contacts" },
  { title: "Customers", url: "/customers", icon: Users, section: "Contacts" },
  { title: "Sales", url: "/sales", icon: ShoppingCart, section: "Transactions" },
  { title: "Purchase Orders", url: "/purchase-orders", icon: ClipboardList, section: "Transactions" },
  { title: "Invoices", url: "/invoices", icon: FileText, section: "Transactions" },
  { title: "Payments", url: "/payments", icon: CreditCard, section: "Transactions" },
  { title: "Reports", url: "/reports", icon: FileBarChart, section: "Insights" },
  { title: "Analytics", url: "/analytics", icon: LineChart, section: "Insights" },
  { title: "Settings", url: "/settings", icon: Settings, section: "System" },
] as const;

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
              <span className="text-[11px] text-muted-foreground">Shop Management</span>
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
                          <span>{item.title}</span>
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