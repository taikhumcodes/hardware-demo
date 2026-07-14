import { useMemo, useState } from "react";
import {
  ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, SortingState, useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Download, Filter, MoreHorizontal, Plus, Search, Trash2, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { products as seed, categories, inr, type Product } from "@/lib/data";

function stockLabel(p: Product) {
  if (p.stock === 0) return "Out of stock";
  if (p.stock < p.minStock) return "Low stock";
  return "In stock";
}

export default function ProductsPage() {
  const [rows] = useState<Product[]>(seed);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [openAdd, setOpenAdd] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const filtered = useMemo(() => rows.filter((r) => category === "all" || r.category === category), [rows, category]);

  const columns: ColumnDef<Product>[] = useMemo(() => [
    {
      accessorKey: "name",
      header: ({ column }) => <SortBtn column={column}>Product</SortBtn>,
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-[10.5px] font-semibold text-muted-foreground shrink-0">
            {row.original.brand.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium">{row.original.name}</p>
            <p className="text-[11px] text-muted-foreground">{row.original.brand} • {row.original.unit}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "sku", header: "SKU", cell: (c) => <span className="font-mono text-[12px] text-muted-foreground">{c.getValue<string>()}</span> },
    { accessorKey: "category", header: "Category", cell: (c) => <span className="text-[12.5px]">{c.getValue<string>()}</span> },
    { accessorKey: "purchasePrice", header: ({ column }) => <SortBtn column={column}>Purchase</SortBtn>, cell: (c) => <span className="tabular-nums text-[12.5px]">{inr(c.getValue<number>())}</span> },
    { accessorKey: "sellingPrice", header: ({ column }) => <SortBtn column={column}>Selling</SortBtn>, cell: (c) => <span className="tabular-nums text-[12.5px] font-medium">{inr(c.getValue<number>())}</span> },
    { accessorKey: "gst", header: "GST %", cell: (c) => <span className="text-[12.5px]">{c.getValue<number>()}%</span> },
    {
      accessorKey: "stock",
      header: ({ column }) => <SortBtn column={column}>Stock</SortBtn>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="tabular-nums text-[12.5px] font-medium">{row.original.stock}</span>
          <span className="text-[11px] text-muted-foreground">/ {row.original.minStock} min</span>
        </div>
      ),
    },
    { accessorKey: "supplier", header: "Supplier", cell: (c) => <span className="text-[12px] text-muted-foreground">{c.getValue<string>()}</span> },
    { id: "status", header: "Status", cell: ({ row }) => <StatusBadge status={stockLabel(row.original)} /> },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditing(row.original)}><Pencil className="mr-2 h-3.5 w-3.5" />Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success("Stock adjusted")}>Adjust stock</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleting(row.original)}>
              <Trash2 className="mr-2 h-3.5 w-3.5" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description={`${rows.length} products across ${categories.length} categories`}
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 rounded-lg"><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]">
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </DialogTrigger>
              <ProductDialog onSave={() => { setOpenAdd(false); toast.success("Product added"); }} title="Add product" />
            </Dialog>
          </>
        }
      />

      <Card className="rounded-2xl border p-0 shadow-none overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search by name, SKU, brand…" className="h-9 rounded-lg pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 w-[180px] rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9 rounded-lg"><Filter className="mr-2 h-4 w-4" /> More filters</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/40">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="hover:bg-transparent">
                  {hg.headers.map((h) => (
                    <TableHead key={h.id} className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.015 }}
                    className="border-b transition hover:bg-secondary/40 data-[state=selected]:bg-muted"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow><TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">No products found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t p-3">
          <p className="text-[12px] text-muted-foreground">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–
            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 rounded-lg" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
            <Button variant="outline" size="sm" className="h-8 rounded-lg" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
          </div>
        </div>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <ProductDialog product={editing ?? undefined} title="Edit product" onSave={() => { setEditing(null); toast.success("Product updated"); }} />
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-medium text-foreground">{deleting?.name}</span> from your catalog. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { setDeleting(null); toast.success("Product deleted"); }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SortBtn({ column, children }: { column: any; children: React.ReactNode }) {
  return (
    <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
      {children} <ArrowUpDown className="h-3 w-3" />
    </button>
  );
}

function ProductDialog({ product, title, onSave }: { product?: Product; title: string; onSave: () => void }) {
  return (
    <DialogContent className="rounded-2xl sm:max-w-[560px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>Enter product details. Changes are saved locally in this demo.</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-3 py-2">
        <Field label="Product name" defaultValue={product?.name} className="col-span-2" />
        <Field label="SKU" defaultValue={product?.sku} />
        <Field label="Brand" defaultValue={product?.brand} />
        <Field label="Category" defaultValue={product?.category} />
        <Field label="Unit" defaultValue={product?.unit} />
        <Field label="Purchase price" defaultValue={product?.purchasePrice?.toString()} type="number" />
        <Field label="Selling price" defaultValue={product?.sellingPrice?.toString()} type="number" />
        <Field label="GST %" defaultValue={product?.gst?.toString()} type="number" />
        <Field label="Current stock" defaultValue={product?.stock?.toString()} type="number" />
        <Field label="Minimum stock" defaultValue={product?.minStock?.toString()} type="number" />
        <Field label="Supplier" defaultValue={product?.supplier} className="col-span-2" />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onSave}>Cancel</Button>
        <Button className="bg-primary text-primary-foreground hover:bg-[oklch(0.647_0.19_42)]" onClick={onSave}>Save product</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function Field({ label, defaultValue, type = "text", className }: { label: string; defaultValue?: string; type?: string; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-[12px] font-medium text-muted-foreground">{label}</Label>
      <Input type={type} defaultValue={defaultValue} className="h-9 rounded-lg" />
    </div>
  );
}