export type ProductStatus = 'activo' | 'borrador';
export type ProductCategory = 'Lámparas' | 'Objetos Decorativos';

export interface Product {
  id: string; // UUID
  title: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  images: string[];
  category: ProductCategory | null;
  status: ProductStatus;
  created_at: string;
}

export type PrinterStatus = 'imprimiendo' | 'libre' | 'mantenimiento';

export interface Printer {
  id: string; // UUID
  brand: string;
  model: string;
  status: PrinterStatus;
  total_hours_printed: number;
  created_at: string;
}

export interface Material {
  id: string; // UUID
  material_type: string;
  color: string | null;
  brand: string | null;
  quantity_grams: number;
  min_threshold_grams: number;
  created_at: string;
}

export interface Supplier {
  id: string; // UUID
  name: string;
  contact_info: string | null;
  created_at: string;
}

export type PurchaseStatus = 'Pendiente' | 'Completado' | 'Pagado';

export interface PurchaseOrder {
  id: string; // UUID
  supplier_id: string | null;
  status: PurchaseStatus;
  total_amount: number;
  created_at: string;
  suppliers?: Supplier; // For joins
}

export interface PurchaseOrderItem {
  id: string; // UUID
  purchase_order_id: string | null;
  material_id: string | null;
  description: string | null;
  quantity: number;
  unit_price: number;
  created_at: string;
  materials?: Material; // For joins
}

export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'Venta' | 'Materiales' | 'Mantenimiento' | 'Varios';

export interface Transaction {
  id: string; // UUID
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string | null;
  reference_id: string | null;
  created_at: string;
}

export type OrderStatus = 'Pendiente' | 'Pagado' | 'Enviado';

export interface Order {
  id: string; // UUID
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  payment_status: OrderStatus;
  total_amount: number;
  created_at: string;
}

export interface OrderItem {
  id: string; // UUID
  order_id: string | null;
  product_id: string | null;
  quantity: number;
  unit_price: number;
  created_at: string;
  products?: Product; // For joins
}
