import { Bell, Search, Command as CmdIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <div className="relative hidden md:block md:w-96">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search products, invoices, customers…" className="h-9 rounded-lg border-border/70 bg-secondary/60 pl-9 pr-14 shadow-none focus-visible:bg-background" />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground flex items-center gap-0.5">
          <CmdIcon className="h-3 w-3" /> K
        </kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative rounded-lg">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-secondary transition">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">EV</AvatarFallback>
              </Avatar>
              <div className="hidden text-left leading-tight md:block">
                <div className="text-[13px] font-medium">Evolix Admin</div>
                <div className="text-[11px] text-muted-foreground">Owner</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}