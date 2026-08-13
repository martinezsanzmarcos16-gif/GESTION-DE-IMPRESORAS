export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  isVisible: boolean;
  category: "lamp" | "object";
}

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Lámpara Cónica",
    description: "Diseño geométrico puro impreso en PLA reciclado. Proporciona una luz cálida y direccional, perfecta para mesas de noche o rincones de lectura.",
    price: 45.0,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop", // Placeholder for a minimalist lamp
    stock: 12,
    isVisible: true,
    category: "lamp",
  },
  {
    id: "p2",
    name: "Lámpara Nube",
    description: "Forma orgánica que difumina la luz creando una atmósfera relajante. Su textura translúcida revela el patrón de impresión 3D.",
    price: 65.0,
    imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop", // Placeholder
    stock: 5,
    isVisible: true,
    category: "lamp",
  },
  {
    id: "p3",
    name: "Jarrón Estrías",
    description: "Jarrón minimalista con textura estriada. Ideal para flores secas. No apto para contener agua sin un recipiente interior.",
    price: 28.0,
    imageUrl: "https://images.unsplash.com/photo-1613904985222-0d5344302d6c?q=80&w=800&auto=format&fit=crop", // Placeholder vase
    stock: 20,
    isVisible: true,
    category: "object",
  },
  {
    id: "p4",
    name: "Lámpara Cilindro",
    description: "Un clásico atemporal. Su forma cilíndrica ranurada ofrece una iluminación ambiental de 360 grados.",
    price: 55.0,
    imageUrl: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800&auto=format&fit=crop", // Placeholder
    stock: 0,
    isVisible: true,
    category: "lamp",
  },
  {
    id: "p5",
    name: "Organizador Hexa",
    description: "Bandeja organizadora modular en forma de hexágono. Perfecta para escritorio o recibidor.",
    price: 15.0,
    imageUrl: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=800&auto=format&fit=crop", // Placeholder tray/object
    stock: 35,
    isVisible: true,
    category: "object",
  },
  {
    id: "p6",
    name: "Lámpara Arco",
    description: "Diseño moderno y atrevido. El arco central dirige la luz hacia la base, creando un efecto flotante.",
    price: 75.0,
    imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop", // Placeholder
    stock: 8,
    isVisible: false,
    category: "lamp",
  }
];

// Inventario y Almacén

export interface Printer {
  id: string;
  brand: string;
  model: string;
  status: 'imprimiendo' | 'libre' | 'mantenimiento';
  totalHoursPrinted: number;
  powerWatts: number;
}

export const mockPrinters: Printer[] = [
  { id: 'pr1', brand: 'Bambu Lab', model: 'X1 Carbon', status: 'imprimiendo', totalHoursPrinted: 1250, powerWatts: 350 },
  { id: 'pr2', brand: 'Prusa', model: 'MK4', status: 'libre', totalHoursPrinted: 840, powerWatts: 150 },
  { id: 'pr3', brand: 'Creality', model: 'Ender 3 S1 Pro', status: 'mantenimiento', totalHoursPrinted: 3200, powerWatts: 200 },
];

export interface Material {
  id: string;
  type: string; // PLA, PETG, etc
  color: string;
  brand: string;
  quantityGrams: number;
  minThreshold: number;
  costPerGram: number;
}

export const mockMaterials: Material[] = [
  { id: 'm1', type: 'PLA', color: 'Blanco Mate', brand: 'PolyTerra', quantityGrams: 2500, minThreshold: 1000, costPerGram: 0.02 },
  { id: 'm2', type: 'PLA', color: 'Negro Mate', brand: 'PolyTerra', quantityGrams: 800, minThreshold: 1000, costPerGram: 0.02 }, // Stock bajo
  { id: 'm3', type: 'PETG', color: 'Transparente', brand: 'Prusament', quantityGrams: 3200, minThreshold: 1000, costPerGram: 0.035 },
  { id: 'm4', type: 'PLA', color: 'Terracota', brand: 'SmartMaterials', quantityGrams: 150, minThreshold: 1000, costPerGram: 0.022 }, // Stock crítico
];

export interface PurchaseOrder {
  id: string;
  supplier: string;
  date: string;
  status: 'Pendiente' | 'Completado' | 'Pagado';
  totalAmount: number;
  items: number;
}

export const mockPurchaseOrders: PurchaseOrder[] = [
  { id: 'po1', supplier: 'Filament2Print', date: '2026-08-10', status: 'Completado', totalAmount: 150.50, items: 6 },
  { id: 'po2', supplier: '3D Jake', date: '2026-08-12', status: 'Pendiente', totalAmount: 85.00, items: 3 },
];

// Finanzas y Transacciones
export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'Venta' | 'Materiales' | 'Mantenimiento' | 'Varios';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string;
}

export const mockTransactions: Transaction[] = [
  { id: 't1', type: 'income', amount: 45.00, category: 'Venta', description: 'Venta de Lámpara Cónica', date: '2026-08-10' },
  { id: 't2', type: 'expense', amount: 150.50, category: 'Materiales', description: 'Compra Filament2Print', date: '2026-08-10' },
  { id: 't3', type: 'income', amount: 130.00, category: 'Venta', description: 'Venta de Lámpara Nube x2', date: '2026-08-11' },
  { id: 't4', type: 'expense', amount: 45.00, category: 'Mantenimiento', description: 'Repuestos Ender 3', date: '2026-08-11' },
  { id: 't5', type: 'income', amount: 28.00, category: 'Venta', description: 'Venta de Jarrón Estrías', date: '2026-08-12' },
  { id: 't6', type: 'expense', amount: 12.00, category: 'Varios', description: 'Suscripción Software', date: '2026-08-12' },
];

// Producción y Pedidos de Clientes
export interface CustomerOrder {
  id: string;
  customerName: string;
  entryDate: string;
  status: 'Pendiente' | 'En Producción' | 'Completado' | 'Enviado';
}

export interface PrintJob {
  id: string;
  orderId: string;
  productName: string;
  dueDate: string;
  status: 'Pendiente' | 'Imprimiendo' | 'Completado';
  estimatedHours: number;
}

export const mockCustomerOrders: CustomerOrder[] = [
  { id: 'ord1', customerName: 'María García', entryDate: '2026-08-10', status: 'En Producción' },
  { id: 'ord2', customerName: 'Carlos López', entryDate: '2026-08-11', status: 'Pendiente' },
  { id: 'ord3', customerName: 'Ana Martínez', entryDate: '2026-08-12', status: 'Pendiente' },
];

export const mockPrintJobs: PrintJob[] = [
  { id: 'pj1', orderId: 'ord1', productName: 'Lámpara Cónica', dueDate: '2026-08-11', status: 'Pendiente', estimatedHours: 4.5 }, // Atrasado (Rojo)
  { id: 'pj2', orderId: 'ord1', productName: 'Base Lámpara', dueDate: '2026-08-13', status: 'Imprimiendo', estimatedHours: 2.0 }, // Próximo (Amarillo)
  { id: 'pj3', orderId: 'ord2', productName: 'Jarrón Estrías', dueDate: '2026-08-15', status: 'Pendiente', estimatedHours: 6.0 }, // A tiempo (Verde)
  { id: 'pj4', orderId: 'ord2', productName: 'Lámpara Nube', dueDate: '2026-08-13', status: 'Pendiente', estimatedHours: 8.5 }, // Próximo (Amarillo)
  { id: 'pj5', orderId: 'ord3', productName: 'Organizador Hexa', dueDate: '2026-08-18', status: 'Pendiente', estimatedHours: 3.0 }, // A tiempo (Verde)
  { id: 'pj6', orderId: 'ord1', productName: 'Tornillo de sujeción', dueDate: '2026-08-11', status: 'Completado', estimatedHours: 0.5 },
];

