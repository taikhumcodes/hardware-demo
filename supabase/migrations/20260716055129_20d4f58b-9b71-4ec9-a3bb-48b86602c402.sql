
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('owner', 'manager', 'staff');
CREATE TYPE public.sale_status AS ENUM ('draft', 'completed', 'cancelled', 'refunded');
CREATE TYPE public.payment_status AS ENUM ('pending', 'partial', 'paid', 'overdue');
CREATE TYPE public.po_status AS ENUM ('draft', 'ordered', 'received', 'cancelled');
CREATE TYPE public.quote_status AS ENUM ('draft', 'sent', 'won', 'lost', 'expired');
CREATE TYPE public.movement_type AS ENUM ('inward', 'outward', 'adjustment', 'transfer');
CREATE TYPE public.payment_method AS ENUM ('cash', 'upi', 'card', 'bank_transfer', 'cheque', 'credit');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  branch TEXT DEFAULT 'HQ',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id);
$$;

CREATE OR REPLACE FUNCTION public.can_write(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('owner','manager'));
$$;

-- ============ AUTO-CREATE PROFILE + FIRST-USER-IS-OWNER ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  user_count INTEGER;
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)), NEW.email);

  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  IF user_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'owner');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'staff');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Profiles policies
CREATE POLICY "Staff view profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Owners manage profiles" ON public.profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'owner')) WITH CHECK (public.has_role(auth.uid(),'owner'));

-- User roles policies (owners manage; users see own)
CREATE POLICY "See own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'owner'));

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ CATEGORIES ============
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read categories" ON public.categories FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Managers write categories" ON public.categories FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ BRANDS ============
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brands TO authenticated;
GRANT ALL ON public.brands TO service_role;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read brands" ON public.brands FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Managers write brands" ON public.brands FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER trg_brands_updated BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SUPPLIERS ============
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  address TEXT,
  gstin TEXT,
  rating NUMERIC(2,1) DEFAULT 4.0,
  outstanding NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers TO authenticated;
GRANT ALL ON public.suppliers TO service_role;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read suppliers" ON public.suppliers FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Managers write suppliers" ON public.suppliers FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER trg_suppliers_updated BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ CUSTOMERS ============
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  city TEXT,
  address TEXT,
  gstin TEXT,
  credit_limit NUMERIC(14,2) NOT NULL DEFAULT 0,
  outstanding NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_spend NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read customers" ON public.customers FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Managers write customers" ON public.customers FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ PRODUCTS ============
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  unit TEXT NOT NULL DEFAULT 'pcs',
  hsn_code TEXT,
  gst_rate NUMERIC(5,2) NOT NULL DEFAULT 18,
  purchase_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  selling_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock NUMERIC(12,2) NOT NULL DEFAULT 0,
  min_stock NUMERIC(12,2) NOT NULL DEFAULT 0,
  barcode TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_brand ON public.products(brand_id);
CREATE INDEX idx_products_sku ON public.products(sku);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read products" ON public.products FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Managers write products" ON public.products FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SALES ============
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  gst_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  discount NUMERIC(14,2) NOT NULL DEFAULT 0,
  total NUMERIC(14,2) NOT NULL DEFAULT 0,
  paid NUMERIC(14,2) NOT NULL DEFAULT 0,
  status public.sale_status NOT NULL DEFAULT 'completed',
  payment_status public.payment_status NOT NULL DEFAULT 'paid',
  payment_method public.payment_method NOT NULL DEFAULT 'cash',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sales_customer ON public.sales(customer_id);
CREATE INDEX idx_sales_date ON public.sales(sale_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read sales" ON public.sales FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff create sales" ON public.sales FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Managers update sales" ON public.sales FOR UPDATE TO authenticated USING (public.can_write(auth.uid()));
CREATE POLICY "Owners delete sales" ON public.sales FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'owner'));
CREATE TRIGGER trg_sales_updated BEFORE UPDATE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SALE ITEMS ============
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity NUMERIC(12,2) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  gst_rate NUMERIC(5,2) NOT NULL DEFAULT 18,
  gst_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  line_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sale_items_sale ON public.sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON public.sale_items(product_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sale_items TO authenticated;
GRANT ALL ON public.sale_items TO service_role;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read sale items" ON public.sale_items FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff manage sale items" ON public.sale_items FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ PURCHASE ORDERS ============
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT NOT NULL UNIQUE,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  supplier_name TEXT,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_date DATE,
  received_date DATE,
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  gst_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  total NUMERIC(14,2) NOT NULL DEFAULT 0,
  status public.po_status NOT NULL DEFAULT 'draft',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_po_supplier ON public.purchase_orders(supplier_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchase_orders TO authenticated;
GRANT ALL ON public.purchase_orders TO service_role;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read PO" ON public.purchase_orders FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Managers write PO" ON public.purchase_orders FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER trg_po_updated BEFORE UPDATE ON public.purchase_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ PURCHASE ITEMS ============
CREATE TABLE public.purchase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity NUMERIC(12,2) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  gst_rate NUMERIC(5,2) NOT NULL DEFAULT 18,
  line_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  received_qty NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_pi_po ON public.purchase_items(po_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchase_items TO authenticated;
GRANT ALL ON public.purchase_items TO service_role;
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read PI" ON public.purchase_items FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Managers write PI" ON public.purchase_items FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));

-- ============ PAYMENTS ============
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number TEXT NOT NULL UNIQUE,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(14,2) NOT NULL,
  method public.payment_method NOT NULL DEFAULT 'cash',
  direction TEXT NOT NULL CHECK (direction IN ('in','out')),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
  po_id UUID REFERENCES public.purchase_orders(id) ON DELETE SET NULL,
  reference TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read payments" ON public.payments FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Managers write payments" ON public.payments FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));

-- ============ QUOTATIONS ============
CREATE TABLE public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT NOT NULL UNIQUE,
  party_name TEXT NOT NULL,
  party_contact TEXT,
  scope TEXT,
  quote_date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  gst_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  total NUMERIC(14,2) NOT NULL DEFAULT 0,
  status public.quote_status NOT NULL DEFAULT 'draft',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotations TO authenticated;
GRANT ALL ON public.quotations TO service_role;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read quotations" ON public.quotations FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Managers write quotations" ON public.quotations FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));
CREATE TRIGGER trg_quotations_updated BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ QUOTATION ITEMS ============
CREATE TABLE public.quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity NUMERIC(12,2) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  gst_rate NUMERIC(5,2) NOT NULL DEFAULT 18,
  line_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotation_items TO authenticated;
GRANT ALL ON public.quotation_items TO service_role;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read QI" ON public.quotation_items FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Managers write QI" ON public.quotation_items FOR ALL TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));

-- ============ STOCK MOVEMENTS ============
CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  movement_type public.movement_type NOT NULL,
  quantity NUMERIC(12,2) NOT NULL,
  doc_ref TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sm_product ON public.stock_movements(product_id);
CREATE INDEX idx_sm_date ON public.stock_movements(created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_movements TO authenticated;
GRANT ALL ON public.stock_movements TO service_role;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read SM" ON public.stock_movements FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert SM" ON public.stock_movements FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Managers modify SM" ON public.stock_movements FOR UPDATE TO authenticated USING (public.can_write(auth.uid()));
CREATE POLICY "Owners delete SM" ON public.stock_movements FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'owner'));

-- ============ BARCODE LABELS ============
CREATE TABLE public.barcode_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  barcode TEXT NOT NULL,
  copies INTEGER NOT NULL DEFAULT 1,
  printed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.barcode_labels TO authenticated;
GRANT ALL ON public.barcode_labels TO service_role;
ALTER TABLE public.barcode_labels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage barcode" ON public.barcode_labels FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ SETTINGS ============
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name TEXT NOT NULL DEFAULT 'Evolix Hardware Traders',
  gstin TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  invoice_prefix TEXT NOT NULL DEFAULT 'INV',
  po_prefix TEXT NOT NULL DEFAULT 'PO',
  quote_prefix TEXT NOT NULL DEFAULT 'QT',
  currency TEXT NOT NULL DEFAULT 'INR',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.settings (shop_name) VALUES ('Evolix Hardware Traders');
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read settings" ON public.settings FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Owners update settings" ON public.settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'owner'));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ACTIVITY LOGS ============
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_al_date ON public.activity_logs(created_at DESC);
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read logs" ON public.activity_logs FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

-- ============ BUSINESS LOGIC TRIGGERS ============

-- Sale item: compute line_total + gst; then decrement stock and create stock movement
CREATE OR REPLACE FUNCTION public.on_sale_item_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  net NUMERIC(14,2);
BEGIN
  net := NEW.quantity * NEW.unit_price;
  NEW.gst_amount := ROUND(net * NEW.gst_rate / 100.0, 2);
  NEW.line_total := ROUND(net + NEW.gst_amount, 2);

  IF NEW.product_id IS NOT NULL THEN
    UPDATE public.products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
    INSERT INTO public.stock_movements (reference, product_id, product_name, movement_type, quantity, doc_ref)
    VALUES ('SM-'||substr(gen_random_uuid()::text,1,8), NEW.product_id, NEW.product_name, 'outward', NEW.quantity,
      (SELECT invoice_number FROM public.sales WHERE id = NEW.sale_id));
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_sale_item_insert BEFORE INSERT ON public.sale_items
FOR EACH ROW EXECUTE FUNCTION public.on_sale_item_insert();

-- After sale_items change, recalc sale totals
CREATE OR REPLACE FUNCTION public.recalc_sale_totals()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  sid UUID;
  st NUMERIC(14,2);
  gt NUMERIC(14,2);
BEGIN
  sid := COALESCE(NEW.sale_id, OLD.sale_id);
  SELECT COALESCE(SUM(quantity*unit_price),0), COALESCE(SUM(gst_amount),0)
    INTO st, gt FROM public.sale_items WHERE sale_id = sid;
  UPDATE public.sales SET
    subtotal = st,
    gst_amount = gt,
    total = ROUND(st + gt - COALESCE(discount,0), 2)
  WHERE id = sid;

  -- payment status
  UPDATE public.sales SET payment_status = CASE
    WHEN paid >= total THEN 'paid'::public.payment_status
    WHEN paid > 0 THEN 'partial'::public.payment_status
    ELSE 'pending'::public.payment_status
  END WHERE id = sid;

  RETURN NULL;
END; $$;

CREATE TRIGGER trg_recalc_sale_ins AFTER INSERT ON public.sale_items
FOR EACH ROW EXECUTE FUNCTION public.recalc_sale_totals();
CREATE TRIGGER trg_recalc_sale_upd AFTER UPDATE ON public.sale_items
FOR EACH ROW EXECUTE FUNCTION public.recalc_sale_totals();
CREATE TRIGGER trg_recalc_sale_del AFTER DELETE ON public.sale_items
FOR EACH ROW EXECUTE FUNCTION public.recalc_sale_totals();

-- After sale insert/update: update customer totals + outstanding
CREATE OR REPLACE FUNCTION public.on_sale_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.customer_id IS NOT NULL THEN
    UPDATE public.customers c SET
      total_spend = COALESCE((SELECT SUM(total) FROM public.sales WHERE customer_id = c.id AND status = 'completed'),0),
      outstanding = COALESCE((SELECT SUM(total - paid) FROM public.sales WHERE customer_id = c.id AND status = 'completed'),0)
    WHERE c.id = NEW.customer_id;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_sale_customer AFTER INSERT OR UPDATE ON public.sales
FOR EACH ROW EXECUTE FUNCTION public.on_sale_change();

-- Purchase item: line total; on PO status = received increment stock
CREATE OR REPLACE FUNCTION public.on_purchase_item_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.line_total := ROUND(NEW.quantity * NEW.unit_price * (1 + NEW.gst_rate/100.0), 2);
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_pi_insert BEFORE INSERT ON public.purchase_items
FOR EACH ROW EXECUTE FUNCTION public.on_purchase_item_insert();

CREATE OR REPLACE FUNCTION public.on_po_received()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  it RECORD;
BEGIN
  IF NEW.status = 'received' AND (OLD.status IS NULL OR OLD.status <> 'received') THEN
    FOR it IN SELECT * FROM public.purchase_items WHERE po_id = NEW.id LOOP
      IF it.product_id IS NOT NULL THEN
        UPDATE public.products SET stock = stock + it.quantity, purchase_price = it.unit_price WHERE id = it.product_id;
        INSERT INTO public.stock_movements (reference, product_id, product_name, movement_type, quantity, doc_ref)
        VALUES ('SM-'||substr(gen_random_uuid()::text,1,8), it.product_id, it.product_name, 'inward', it.quantity, NEW.po_number);
      END IF;
    END LOOP;
    NEW.received_date := CURRENT_DATE;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_po_received BEFORE UPDATE ON public.purchase_orders
FOR EACH ROW EXECUTE FUNCTION public.on_po_received();

-- Stock movement: manual adjustments update product stock
CREATE OR REPLACE FUNCTION public.apply_manual_movement()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Only apply for manual adjustments/transfers (sale/PO triggers already handled stock)
  IF NEW.doc_ref IS NULL AND NEW.product_id IS NOT NULL THEN
    IF NEW.movement_type = 'inward' THEN
      UPDATE public.products SET stock = stock + NEW.quantity WHERE id = NEW.product_id;
    ELSIF NEW.movement_type = 'outward' THEN
      UPDATE public.products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
    ELSIF NEW.movement_type = 'adjustment' THEN
      UPDATE public.products SET stock = stock + NEW.quantity WHERE id = NEW.product_id;
    END IF;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_sm_apply AFTER INSERT ON public.stock_movements
FOR EACH ROW EXECUTE FUNCTION public.apply_manual_movement();

-- Payment: update sale.paid / customer.outstanding / supplier.outstanding
CREATE OR REPLACE FUNCTION public.on_payment_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.sale_id IS NOT NULL THEN
    UPDATE public.sales SET paid = COALESCE(paid,0) + NEW.amount WHERE id = NEW.sale_id;
  END IF;
  IF NEW.customer_id IS NOT NULL AND NEW.direction = 'in' THEN
    UPDATE public.customers SET outstanding = GREATEST(outstanding - NEW.amount, 0) WHERE id = NEW.customer_id;
  END IF;
  IF NEW.supplier_id IS NOT NULL AND NEW.direction = 'out' THEN
    UPDATE public.suppliers SET outstanding = GREATEST(outstanding - NEW.amount, 0) WHERE id = NEW.supplier_id;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_payment_insert AFTER INSERT ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.on_payment_insert();

-- Quotation items: line total + recalc
CREATE OR REPLACE FUNCTION public.on_qi_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.line_total := ROUND(NEW.quantity * NEW.unit_price * (1 + NEW.gst_rate/100.0), 2);
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_qi_insert BEFORE INSERT ON public.quotation_items
FOR EACH ROW EXECUTE FUNCTION public.on_qi_insert();

CREATE OR REPLACE FUNCTION public.recalc_quotation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  qid UUID; st NUMERIC; gt NUMERIC;
BEGIN
  qid := COALESCE(NEW.quotation_id, OLD.quotation_id);
  SELECT COALESCE(SUM(quantity*unit_price),0),
         COALESCE(SUM(quantity*unit_price*gst_rate/100.0),0)
    INTO st, gt FROM public.quotation_items WHERE quotation_id = qid;
  UPDATE public.quotations SET subtotal = st, gst_amount = ROUND(gt,2), total = ROUND(st+gt,2) WHERE id = qid;
  RETURN NULL;
END; $$;
CREATE TRIGGER trg_recalc_q_ins AFTER INSERT ON public.quotation_items FOR EACH ROW EXECUTE FUNCTION public.recalc_quotation();
CREATE TRIGGER trg_recalc_q_upd AFTER UPDATE ON public.quotation_items FOR EACH ROW EXECUTE FUNCTION public.recalc_quotation();
CREATE TRIGGER trg_recalc_q_del AFTER DELETE ON public.quotation_items FOR EACH ROW EXECUTE FUNCTION public.recalc_quotation();
