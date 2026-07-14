// Realistic Indian hardware shop demo data
export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  gst: number;
  stock: number;
  minStock: number;
  supplier: string;
  status: "Active" | "Inactive";
};

export const categories = [
  "Paints",
  "Pipes & Fittings",
  "Steel & TMT",
  "Cement",
  "Electricals",
  "Switches",
  "Fans",
  "Tools",
  "Sanitary",
  "Hardware",
];

export const brands = [
  "Asian Paints",
  "Berger Paints",
  "Astral Pipes",
  "Supreme Pipes",
  "Finolex",
  "JSW Steel",
  "Tata Tiscon",
  "ACC Cement",
  "UltraTech Cement",
  "Havells",
  "Anchor",
  "Orient Electric",
];

export const suppliers = [
  { id: "SUP-01", name: "Sharma Trading Co.", contact: "Rajesh Sharma", phone: "+91 98200 12345", city: "Mumbai", gstin: "27AABCS1429B1Z1", outstanding: 145200, pending: 3, rating: 4.7 },
  { id: "SUP-02", name: "Gupta Hardware Distributors", contact: "Anil Gupta", phone: "+91 99870 22331", city: "Delhi", gstin: "07AAECG1234H1Z5", outstanding: 82500, pending: 2, rating: 4.5 },
  { id: "SUP-03", name: "Patel & Sons Agencies", contact: "Kiran Patel", phone: "+91 98250 66112", city: "Ahmedabad", gstin: "24AABCP7890K1Z9", outstanding: 210900, pending: 5, rating: 4.8 },
  { id: "SUP-04", name: "Reddy Enterprises", contact: "Suresh Reddy", phone: "+91 90000 45678", city: "Hyderabad", gstin: "36AAACR1122L1Z2", outstanding: 0, pending: 0, rating: 4.9 },
  { id: "SUP-05", name: "Iyer Industrial Supplies", contact: "Meena Iyer", phone: "+91 98450 33221", city: "Chennai", gstin: "33AAACI9988M1Z7", outstanding: 56800, pending: 1, rating: 4.4 },
  { id: "SUP-06", name: "Singh Metal Traders", contact: "Harpreet Singh", phone: "+91 98110 77665", city: "Ludhiana", gstin: "03AAECS4432N1Z0", outstanding: 178300, pending: 4, rating: 4.6 },
];

export const customers = [
  { id: "CUS-1001", name: "Ramesh Kumar", phone: "+91 98765 43210", email: "ramesh.k@gmail.com", city: "Pune", type: "Contractor", totalSpend: 452300, outstanding: 24500, orders: 42, lastOrder: "2026-07-11" },
  { id: "CUS-1002", name: "Sunita Verma", phone: "+91 99887 65432", email: "sunita.verma@yahoo.in", city: "Nagpur", type: "Retail", totalSpend: 68450, outstanding: 0, orders: 12, lastOrder: "2026-07-10" },
  { id: "CUS-1003", name: "Vikas Builders Pvt Ltd", phone: "+91 22400 11223", email: "accounts@vikasbuilders.in", city: "Mumbai", type: "Business", totalSpend: 1289500, outstanding: 165000, orders: 87, lastOrder: "2026-07-13" },
  { id: "CUS-1004", name: "Mohit Agarwal", phone: "+91 90123 44556", email: "mohit.a@rediffmail.com", city: "Jaipur", type: "Retail", totalSpend: 34200, outstanding: 8200, orders: 7, lastOrder: "2026-07-05" },
  { id: "CUS-1005", name: "Priya Constructions", phone: "+91 80230 99887", email: "priya.const@outlook.com", city: "Bangalore", type: "Business", totalSpend: 875600, outstanding: 92300, orders: 54, lastOrder: "2026-07-12" },
  { id: "CUS-1006", name: "Arjun Nair", phone: "+91 94470 55443", email: "arjun.nair@gmail.com", city: "Kochi", type: "Contractor", totalSpend: 214800, outstanding: 12000, orders: 28, lastOrder: "2026-07-09" },
  { id: "CUS-1007", name: "Deepa Iyer", phone: "+91 98840 22113", email: "deepa.iyer@gmail.com", city: "Chennai", type: "Retail", totalSpend: 42600, outstanding: 0, orders: 9, lastOrder: "2026-07-08" },
  { id: "CUS-1008", name: "Skyline Infra LLP", phone: "+91 11400 88776", email: "purchase@skylineinfra.in", city: "Gurgaon", type: "Business", totalSpend: 2145000, outstanding: 320000, orders: 112, lastOrder: "2026-07-13" },
];

export const products: Product[] = [
  { id: "P-1001", name: "Asian Paints Royale Luxury Emulsion 20L", sku: "AP-RYL-20L", category: "Paints", brand: "Asian Paints", unit: "Bucket", purchasePrice: 6800, sellingPrice: 7950, gst: 18, stock: 42, minStock: 10, supplier: "Sharma Trading Co.", status: "Active" },
  { id: "P-1002", name: "Berger Silk Glamor 10L White", sku: "BG-SLK-10L", category: "Paints", brand: "Berger Paints", unit: "Bucket", purchasePrice: 3200, sellingPrice: 3850, gst: 18, stock: 5, minStock: 8, supplier: "Sharma Trading Co.", status: "Active" },
  { id: "P-1003", name: "Astral CPVC Pipe 1 inch 3m", sku: "AS-CPVC-1-3", category: "Pipes & Fittings", brand: "Astral Pipes", unit: "Piece", purchasePrice: 380, sellingPrice: 465, gst: 18, stock: 240, minStock: 60, supplier: "Patel & Sons Agencies", status: "Active" },
  { id: "P-1004", name: "Supreme PVC Pipe 4 inch 6m", sku: "SP-PVC-4-6", category: "Pipes & Fittings", brand: "Supreme Pipes", unit: "Piece", purchasePrice: 720, sellingPrice: 895, gst: 18, stock: 88, minStock: 40, supplier: "Patel & Sons Agencies", status: "Active" },
  { id: "P-1005", name: "Finolex FRLS Wire 2.5 sq.mm 90m Red", sku: "FN-FRLS-25-R", category: "Electricals", brand: "Finolex", unit: "Coil", purchasePrice: 2100, sellingPrice: 2495, gst: 18, stock: 62, minStock: 20, supplier: "Gupta Hardware Distributors", status: "Active" },
  { id: "P-1006", name: "JSW Neosteel TMT Bar Fe-550D 12mm", sku: "JSW-TMT-12", category: "Steel & TMT", brand: "JSW Steel", unit: "Kg", purchasePrice: 62, sellingPrice: 71, gst: 18, stock: 4820, minStock: 1000, supplier: "Singh Metal Traders", status: "Active" },
  { id: "P-1007", name: "Tata Tiscon 500D TMT Bar 16mm", sku: "TT-TMT-16", category: "Steel & TMT", brand: "Tata Tiscon", unit: "Kg", purchasePrice: 64, sellingPrice: 73, gst: 18, stock: 620, minStock: 800, supplier: "Singh Metal Traders", status: "Active" },
  { id: "P-1008", name: "UltraTech Cement PPC 50kg", sku: "UT-PPC-50", category: "Cement", brand: "UltraTech Cement", unit: "Bag", purchasePrice: 385, sellingPrice: 430, gst: 28, stock: 320, minStock: 100, supplier: "Reddy Enterprises", status: "Active" },
  { id: "P-1009", name: "ACC Gold Cement 50kg", sku: "ACC-GLD-50", category: "Cement", brand: "ACC Cement", unit: "Bag", purchasePrice: 370, sellingPrice: 415, gst: 28, stock: 0, minStock: 80, supplier: "Reddy Enterprises", status: "Active" },
  { id: "P-1010", name: "Havells Fabio 1200mm Ceiling Fan Pearl White", sku: "HV-FAB-1200-W", category: "Fans", brand: "Havells", unit: "Piece", purchasePrice: 2450, sellingPrice: 3199, gst: 18, stock: 24, minStock: 8, supplier: "Iyer Industrial Supplies", status: "Active" },
  { id: "P-1011", name: "Anchor Roma 16A Modular Switch", sku: "AN-RMA-16A", category: "Switches", brand: "Anchor", unit: "Piece", purchasePrice: 95, sellingPrice: 135, gst: 18, stock: 480, minStock: 100, supplier: "Gupta Hardware Distributors", status: "Active" },
  { id: "P-1012", name: "Orient Electric Aeroquiet 1200mm Fan", sku: "OR-AEQ-1200", category: "Fans", brand: "Orient Electric", unit: "Piece", purchasePrice: 3100, sellingPrice: 3850, gst: 18, stock: 6, minStock: 10, supplier: "Iyer Industrial Supplies", status: "Active" },
  { id: "P-1013", name: "Havells LED Bulb 9W Cool Daylight", sku: "HV-LED-9W", category: "Electricals", brand: "Havells", unit: "Piece", purchasePrice: 78, sellingPrice: 115, gst: 18, stock: 720, minStock: 200, supplier: "Gupta Hardware Distributors", status: "Active" },
  { id: "P-1014", name: "Asian Paints Apex Ultima 20L Exterior", sku: "AP-APX-20L", category: "Paints", brand: "Asian Paints", unit: "Bucket", purchasePrice: 8200, sellingPrice: 9650, gst: 18, stock: 18, minStock: 6, supplier: "Sharma Trading Co.", status: "Active" },
  { id: "P-1015", name: "Finolex Aluminium Ladder 8ft", sku: "FN-LDR-8", category: "Tools", brand: "Finolex", unit: "Piece", purchasePrice: 3800, sellingPrice: 4650, gst: 18, stock: 12, minStock: 4, supplier: "Iyer Industrial Supplies", status: "Active" },
  { id: "P-1016", name: "Astral SWR Pipe 110mm 6m", sku: "AS-SWR-110", category: "Pipes & Fittings", brand: "Astral Pipes", unit: "Piece", purchasePrice: 890, sellingPrice: 1095, gst: 18, stock: 3, minStock: 20, supplier: "Patel & Sons Agencies", status: "Active" },
  { id: "P-1017", name: "Berger WeatherCoat Anti-Dust 10L", sku: "BG-WCT-10L", category: "Paints", brand: "Berger Paints", unit: "Bucket", purchasePrice: 4300, sellingPrice: 5150, gst: 18, stock: 34, minStock: 10, supplier: "Sharma Trading Co.", status: "Active" },
  { id: "P-1018", name: "Anchor Penta Junction Box 4x4", sku: "AN-JB-4x4", category: "Switches", brand: "Anchor", unit: "Piece", purchasePrice: 42, sellingPrice: 68, gst: 18, stock: 1240, minStock: 300, supplier: "Gupta Hardware Distributors", status: "Active" },
  { id: "P-1019", name: "Havells Trumpet 1.5-ton 3-star AC Inverter", sku: "HV-AC-15-3S", category: "Electricals", brand: "Havells", unit: "Piece", purchasePrice: 32500, sellingPrice: 38900, gst: 28, stock: 8, minStock: 3, supplier: "Iyer Industrial Supplies", status: "Active" },
  { id: "P-1020", name: "UltraTech Weather Plus Cement 50kg", sku: "UT-WPL-50", category: "Cement", brand: "UltraTech Cement", unit: "Bag", purchasePrice: 420, sellingPrice: 475, gst: 28, stock: 92, minStock: 60, supplier: "Reddy Enterprises", status: "Active" },
];

export const recentSales = [
  { id: "INV-2026-0421", customer: "Vikas Builders Pvt Ltd", date: "2026-07-13", items: 14, amount: 184250, status: "Paid" as const },
  { id: "INV-2026-0420", customer: "Ramesh Kumar", date: "2026-07-13", items: 6, amount: 32480, status: "Pending" as const },
  { id: "INV-2026-0419", customer: "Skyline Infra LLP", date: "2026-07-13", items: 22, amount: 412900, status: "Paid" as const },
  { id: "INV-2026-0418", customer: "Sunita Verma", date: "2026-07-12", items: 3, amount: 8650, status: "Paid" as const },
  { id: "INV-2026-0417", customer: "Priya Constructions", date: "2026-07-12", items: 11, amount: 92300, status: "Overdue" as const },
  { id: "INV-2026-0416", customer: "Arjun Nair", date: "2026-07-11", items: 4, amount: 14620, status: "Paid" as const },
  { id: "INV-2026-0415", customer: "Mohit Agarwal", date: "2026-07-10", items: 2, amount: 6350, status: "Paid" as const },
  { id: "INV-2026-0414", customer: "Deepa Iyer", date: "2026-07-10", items: 5, amount: 18420, status: "Pending" as const },
  { id: "INV-2026-0413", customer: "Vikas Builders Pvt Ltd", date: "2026-07-09", items: 9, amount: 76300, status: "Paid" as const },
  { id: "INV-2026-0412", customer: "Skyline Infra LLP", date: "2026-07-08", items: 18, amount: 298450, status: "Paid" as const },
];

export const purchaseOrders = [
  { id: "PO-2026-118", supplier: "Sharma Trading Co.", date: "2026-07-12", items: 8, amount: 245800, status: "In Transit" as const, expected: "2026-07-17" },
  { id: "PO-2026-117", supplier: "Reddy Enterprises", date: "2026-07-11", items: 3, amount: 148500, status: "Delivered" as const, expected: "2026-07-13" },
  { id: "PO-2026-116", supplier: "Singh Metal Traders", date: "2026-07-10", items: 5, amount: 612300, status: "Pending" as const, expected: "2026-07-18" },
  { id: "PO-2026-115", supplier: "Patel & Sons Agencies", date: "2026-07-09", items: 12, amount: 89400, status: "Delivered" as const, expected: "2026-07-11" },
  { id: "PO-2026-114", supplier: "Gupta Hardware Distributors", date: "2026-07-08", items: 6, amount: 132600, status: "In Transit" as const, expected: "2026-07-15" },
  { id: "PO-2026-113", supplier: "Iyer Industrial Supplies", date: "2026-07-06", items: 4, amount: 78900, status: "Delivered" as const, expected: "2026-07-09" },
];

export const revenueSeries = [
  { day: "Mon", revenue: 84200, orders: 42 },
  { day: "Tue", revenue: 96800, orders: 51 },
  { day: "Wed", revenue: 74200, orders: 38 },
  { day: "Thu", revenue: 118400, orders: 58 },
  { day: "Fri", revenue: 132900, orders: 67 },
  { day: "Sat", revenue: 156200, orders: 74 },
  { day: "Sun", revenue: 92450, orders: 46 },
];

export const monthlySeries = [
  { month: "Jan", sales: 1840000, purchases: 1420000 },
  { month: "Feb", sales: 2010000, purchases: 1590000 },
  { month: "Mar", sales: 2360000, purchases: 1720000 },
  { month: "Apr", sales: 2180000, purchases: 1610000 },
  { month: "May", sales: 2540000, purchases: 1880000 },
  { month: "Jun", sales: 2820000, purchases: 2050000 },
  { month: "Jul", sales: 2695000, purchases: 1960000 },
];

export const topProducts = [
  { name: "UltraTech PPC 50kg", sold: 4820, revenue: 2072600 },
  { name: "JSW TMT 12mm", sold: 38200, revenue: 2712200 },
  { name: "Asian Paints Royale 20L", sold: 186, revenue: 1478700 },
  { name: "Finolex FRLS 2.5 sq.mm", sold: 412, revenue: 1027940 },
  { name: "Havells Fabio Fan", sold: 224, revenue: 716576 },
];

export const categoryPerformance = [
  { name: "Paints", value: 28 },
  { name: "Cement", value: 22 },
  { name: "Steel & TMT", value: 19 },
  { name: "Electricals", value: 14 },
  { name: "Pipes", value: 10 },
  { name: "Other", value: 7 },
];

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const inrCompact = (n: number) => {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + " L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
  return "₹" + n;
};