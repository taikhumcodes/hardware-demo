import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* ============ CATEGORIES ============ */
export type Category = { id: string; name: string; description: string | null; created_at: string };
export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });
export const useSaveCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: Partial<Category> & { name: string }) => {
      const { error } = c.id
        ? await supabase.from("categories").update({ name: c.name, description: c.description ?? null }).eq("id", c.id)
        : await supabase.from("categories").insert({ name: c.name, description: c.description ?? null });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};
export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

/* ============ BRANDS ============ */
export type Brand = { id: string; name: string; description: string | null };
export const useBrands = () =>
  useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brands").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as Brand[];
    },
  });
export const useSaveBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (b: Partial<Brand> & { name: string }) => {
      const { error } = b.id
        ? await supabase.from("brands").update({ name: b.name, description: b.description ?? null }).eq("id", b.id)
        : await supabase.from("brands").insert({ name: b.name, description: b.description ?? null });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["brands"] }); toast.success("Brand saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
};
export const useDeleteBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("brands").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["brands"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

/* ============ PRODUCTS ============ */
export type Product = {
  id: string; sku: string; name: string; description: string | null;
  category_id: string | null; brand_id: string | null;
  unit: string; hsn_code: string | null; gst_rate: number;
  purchase_price: number; selling_price: number;
  stock: number; min_stock: number;
  barcode: string | null; active: boolean;
  categories?: { name: string } | null;
  brands?: { name: string } | null;
};
export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name), brands(name)")
        .order("name");
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
export const useSaveProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: Partial<Product> & { sku: string; name: string }) => {
      const payload = {
        sku: p.sku, name: p.name, description: p.description ?? null,
        category_id: p.category_id || null, brand_id: p.brand_id || null,
        unit: p.unit || "pcs", hsn_code: p.hsn_code ?? null,
        gst_rate: p.gst_rate ?? 18,
        purchase_price: p.purchase_price ?? 0, selling_price: p.selling_price ?? 0,
        stock: p.stock ?? 0, min_stock: p.min_stock ?? 0,
        barcode: p.barcode ?? null, active: p.active ?? true,
      };
      const { error } = p.id
        ? await supabase.from("products").update(payload).eq("id", p.id)
        : await supabase.from("products").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success("Product saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
};
export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

/* ============ CUSTOMERS ============ */
export type Customer = {
  id: string; code: string; name: string; phone: string | null; email: string | null;
  city: string | null; address: string | null; gstin: string | null;
  credit_limit: number; outstanding: number; total_spend: number;
};
export const useCustomers = () =>
  useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as Customer[];
    },
  });
export const useSaveCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: Partial<Customer> & { name: string }) => {
      const code = c.code || `CUS-${Date.now().toString().slice(-6)}`;
      const payload = {
        code, name: c.name, phone: c.phone ?? null, email: c.email ?? null,
        city: c.city ?? null, address: c.address ?? null, gstin: c.gstin ?? null,
        credit_limit: c.credit_limit ?? 0,
      };
      const { error } = c.id
        ? await supabase.from("customers").update(payload).eq("id", c.id)
        : await supabase.from("customers").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["customers"] }); toast.success("Customer saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
};
export const useDeleteCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["customers"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

/* ============ SUPPLIERS ============ */
export type Supplier = {
  id: string; code: string; name: string; contact_person: string | null;
  phone: string | null; email: string | null; city: string | null;
  address: string | null; gstin: string | null; rating: number; outstanding: number;
};
export const useSuppliers = () =>
  useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("suppliers").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as Supplier[];
    },
  });
export const useSaveSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: Partial<Supplier> & { name: string }) => {
      const code = s.code || `SUP-${Date.now().toString().slice(-6)}`;
      const payload = {
        code, name: s.name, contact_person: s.contact_person ?? null,
        phone: s.phone ?? null, email: s.email ?? null, city: s.city ?? null,
        address: s.address ?? null, gstin: s.gstin ?? null, rating: s.rating ?? 4.5,
      };
      const { error } = s.id
        ? await supabase.from("suppliers").update(payload).eq("id", s.id)
        : await supabase.from("suppliers").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["suppliers"] }); toast.success("Supplier saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
};
export const useDeleteSupplier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("suppliers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["suppliers"] }); toast.success("Deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

/* ============ SALES ============ */
export type Sale = {
  id: string; invoice_number: string; customer_id: string | null; customer_name: string | null;
  sale_date: string; subtotal: number; gst_amount: number; discount: number;
  total: number; paid: number; status: string; payment_status: string; payment_method: string;
  customers?: { name: string; gstin: string | null; city: string | null } | null;
};
export type SaleItem = {
  id: string; sale_id: string; product_id: string | null; product_name: string;
  quantity: number; unit_price: number; gst_rate: number; gst_amount: number; line_total: number;
};
export const useSales = () =>
  useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("*, customers(name, gstin, city)")
        .order("sale_date", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as Sale[];
    },
  });
export const useSaleItems = (saleId: string | null) =>
  useQuery({
    queryKey: ["sale-items", saleId],
    enabled: !!saleId,
    queryFn: async () => {
      const { data, error } = await supabase.from("sale_items").select("*").eq("sale_id", saleId!);
      if (error) throw error;
      return (data ?? []) as SaleItem[];
    },
  });

export const useCreateSale = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      customer_id: string | null;
      customer_name: string;
      payment_method: string;
      paid: number;
      discount: number;
      items: { product_id: string; product_name: string; quantity: number; unit_price: number; gst_rate: number }[];
    }) => {
      const invoice_number = `INV-${Date.now()}`;
      const { data: sale, error: e1 } = await supabase
        .from("sales")
        .insert({
          invoice_number,
          customer_id: input.customer_id,
          customer_name: input.customer_name,
          payment_method: input.payment_method,
          paid: input.paid,
          discount: input.discount,
          status: "completed",
        })
        .select()
        .single();
      if (e1) throw e1;
      const rows = input.items.map((i) => ({ sale_id: sale.id, ...i }));
      const { error: e2 } = await supabase.from("sale_items").insert(rows);
      if (e2) throw e2;
      return sale;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sales"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["stock-movements"] });
      toast.success("Sale recorded");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

/* ============ PURCHASE ORDERS ============ */
export type PO = {
  id: string; po_number: string; supplier_id: string | null; supplier_name: string | null;
  order_date: string; expected_date: string | null; total: number; status: string;
  suppliers?: { name: string } | null;
};
export const usePOs = () =>
  useQuery({
    queryKey: ["purchase_orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_orders")
        .select("*, suppliers(name)")
        .order("order_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PO[];
    },
  });
export const useSavePO = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      supplier_id: string; supplier_name: string; expected_date: string | null;
      items: { product_id: string; product_name: string; quantity: number; unit_price: number; gst_rate: number }[];
    }) => {
      const po_number = `PO-${Date.now()}`;
      const subtotal = input.items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
      const gst = input.items.reduce((s, i) => s + i.quantity * i.unit_price * i.gst_rate / 100, 0);
      const { data: po, error: e1 } = await supabase
        .from("purchase_orders")
        .insert({
          po_number, supplier_id: input.supplier_id, supplier_name: input.supplier_name,
          expected_date: input.expected_date, subtotal, gst_amount: gst, total: subtotal + gst,
          status: "ordered",
        })
        .select()
        .single();
      if (e1) throw e1;
      const rows = input.items.map((i) => ({ po_id: po.id, ...i }));
      const { error: e2 } = await supabase.from("purchase_items").insert(rows);
      if (e2) throw e2;
      return po;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchase_orders"] });
      toast.success("PO created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};
export const useReceivePO = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("purchase_orders").update({ status: "received" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchase_orders"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stock-movements"] });
      toast.success("Stock received & inventory updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

/* ============ STOCK MOVEMENTS ============ */
export type StockMovement = {
  id: string; reference: string; product_id: string | null; product_name: string;
  movement_type: "inward" | "outward" | "adjustment" | "transfer";
  quantity: number; doc_ref: string | null; created_at: string;
};
export const useStockMovements = () =>
  useQuery({
    queryKey: ["stock-movements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_movements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as StockMovement[];
    },
  });
export const useAddStockMovement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (m: { product_id: string; product_name: string; movement_type: string; quantity: number; notes?: string }) => {
      const reference = `SM-${Date.now().toString().slice(-6)}`;
      const { error } = await supabase.from("stock_movements").insert({ reference, ...m });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stock-movements"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Stock updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

/* ============ QUOTATIONS ============ */
export type Quotation = {
  id: string; quote_number: string; party_name: string; scope: string | null;
  quote_date: string; valid_until: string | null; total: number; status: string;
};
export const useQuotations = () =>
  useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("quotations").select("*").order("quote_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Quotation[];
    },
  });
export const useSaveQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (q: Partial<Quotation> & { party_name: string }) => {
      const quote_number = q.quote_number || `QT-${Date.now().toString().slice(-6)}`;
      const payload = {
        quote_number, party_name: q.party_name, scope: q.scope ?? null,
        valid_until: q.valid_until ?? null, total: q.total ?? 0,
        status: q.status ?? "draft",
      };
      const { error } = q.id
        ? await supabase.from("quotations").update(payload).eq("id", q.id)
        : await supabase.from("quotations").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["quotations"] }); toast.success("Quotation saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
};

/* ============ PAYMENTS ============ */
export type Payment = {
  id: string; payment_number: string; payment_date: string; amount: number;
  method: string; direction: "in" | "out"; reference: string | null;
  customers?: { name: string } | null; suppliers?: { name: string } | null;
};
export const usePayments = () =>
  useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("payments").select("*, customers(name), suppliers(name)").order("payment_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Payment[];
    },
  });

/* ============ DASHBOARD ============ */
export const useDashboard = () =>
  useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const today = new Date();
      const start30 = new Date(today.getTime() - 30 * 86400000).toISOString().slice(0, 10);
      const [prod, cust, sales30, salesToday, stockLow, po] = await Promise.all([
        supabase.from("products").select("id, stock, purchase_price, min_stock"),
        supabase.from("customers").select("id, outstanding"),
        supabase.from("sales").select("total, sale_date").gte("sale_date", start30),
        supabase.from("sales").select("total").eq("sale_date", today.toISOString().slice(0, 10)),
        supabase.from("products").select("id").lt("stock", 20).eq("active", true),
        supabase.from("purchase_orders").select("id").eq("status", "ordered"),
      ]);

      const products = (prod.data ?? []) as { stock: number; purchase_price: number; min_stock: number }[];
      const customers = (cust.data ?? []) as { outstanding: number }[];
      const s30 = (sales30.data ?? []) as { total: number; sale_date: string }[];
      const sT = (salesToday.data ?? []) as { total: number }[];

      const stockValue = products.reduce((s, p) => s + Number(p.stock) * Number(p.purchase_price), 0);
      const outstanding = customers.reduce((s, c) => s + Number(c.outstanding), 0);
      const revenue30 = s30.reduce((s, x) => s + Number(x.total), 0);
      const revenueToday = sT.reduce((s, x) => s + Number(x.total), 0);
      const lowStock = stockLow.data?.length ?? 0;
      const openPOs = po.data?.length ?? 0;

      // build 30-day series
      const map = new Map<string, number>();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today.getTime() - i * 86400000).toISOString().slice(0, 10);
        map.set(d, 0);
      }
      s30.forEach((r) => map.set(r.sale_date, (map.get(r.sale_date) ?? 0) + Number(r.total)));
      const series = Array.from(map.entries()).map(([date, revenue]) => ({ date: date.slice(5), revenue }));

      return { stockValue, outstanding, revenue30, revenueToday, lowStock, openPOs, series, productCount: products.length };
    },
  });

/* ============ TEAM ============ */
export const useTeam = () =>
  useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("user_roles").select("*"),
      ]);
      return { profiles: profiles ?? [], roles: roles ?? [] };
    },
  });

/* ============ SETTINGS ============ */
export const useSettings = () =>
  useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
export const useSaveSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: { id: string; [k: string]: unknown }) => {
      const { id, ...rest } = s;
      const { error } = await supabase.from("settings").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["settings"] }); toast.success("Settings updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
};