import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  mockMaterials, type Material, 
  mockPurchaseOrders, type PurchaseOrder,
  mockTransactions, type Transaction,
  mockCustomerOrders, type CustomerOrder,
  mockPrintJobs, type PrintJob
} from '../lib/mockData';

interface ERPState {
  materials: Material[];
  purchaseOrders: PurchaseOrder[];
  transactions: Transaction[];
  customerOrders: CustomerOrder[];
  printJobs: PrintJob[];

  // Materials
  addMaterial: (material: Material) => void;
  updateMaterial: (id: string, data: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;

  // Purchase Orders
  addPurchaseOrder: (order: PurchaseOrder) => void;
  payPurchaseOrder: (orderId: string) => void;

  // Transactions
  addTransaction: (transaction: Transaction) => void;
  
  // Orders & Jobs
  addCustomerOrder: (order: CustomerOrder) => void;
  updateCustomerOrder: (id: string, data: Partial<CustomerOrder>) => void;
  addPrintJob: (job: PrintJob) => void;
  updatePrintJob: (id: string, data: Partial<PrintJob>) => void;
  deletePrintJob: (id: string) => void;
}

export const useERPStore = create<ERPState>()(
  persist(
    (set, get) => ({
      materials: mockMaterials,
      purchaseOrders: mockPurchaseOrders,
      transactions: mockTransactions,
      customerOrders: mockCustomerOrders,
      printJobs: mockPrintJobs,

      // Materials
      addMaterial: (material) => set((state) => ({ materials: [...state.materials, material] })),
      updateMaterial: (id, data) => set((state) => ({
        materials: state.materials.map(m => m.id === id ? { ...m, ...data } : m)
      })),
      deleteMaterial: (id) => set((state) => ({
        materials: state.materials.filter(m => m.id !== id)
      })),

      // Transactions
      addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions]
      })),

      // Purchase Orders
      addPurchaseOrder: (order) => set((state) => ({
        purchaseOrders: [order, ...state.purchaseOrders]
      })),
      
      payPurchaseOrder: (orderId) => {
        const state = get();
        const orderIndex = state.purchaseOrders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return;
        
        const order = state.purchaseOrders[orderIndex];
        if (order.status === 'Pagado') return; // Already processed

        // 1. Update material stocks
        const updatedMaterials = [...state.materials];
        order.itemsList?.forEach(item => {
          if (item.materialId && item.materialId !== 'new') {
            const matIndex = updatedMaterials.findIndex(m => m.id === item.materialId);
            if (matIndex !== -1) {
              updatedMaterials[matIndex] = {
                ...updatedMaterials[matIndex],
                quantityGrams: updatedMaterials[matIndex].quantityGrams + item.quantityGrams
              };
            }
          } else if (item.materialId === 'new') {
            // Create a new material entry if it was marked as new
            updatedMaterials.push({
              id: `mat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: 'PLA', // Default
              color: item.description || 'Desconocido',
              brand: order.supplier,
              quantityGrams: item.quantityGrams,
              minThreshold: 1000,
              costPerGram: item.unitPrice / (item.quantityGrams || 1)
            });
          }
        });

        // 2. Create financial transaction
        const newTransaction: Transaction = {
          id: `tx-${Date.now()}`,
          type: 'expense',
          amount: order.totalAmount,
          category: 'Materiales',
          description: `Pago de pedido ${order.id} a ${order.supplier}`,
          date: new Date().toISOString().split('T')[0]
        };

        // 3. Update order status
        const updatedOrders = [...state.purchaseOrders];
        updatedOrders[orderIndex] = { ...order, status: 'Pagado' };

        // Save all changes
        set({
          materials: updatedMaterials,
          transactions: [newTransaction, ...state.transactions],
          purchaseOrders: updatedOrders
        });
      },

      // Customer Orders & Print Jobs
      addCustomerOrder: (order) => set((state) => ({ customerOrders: [order, ...state.customerOrders] })),
      updateCustomerOrder: (id, data) => set((state) => ({
        customerOrders: state.customerOrders.map(o => o.id === id ? { ...o, ...data } : o)
      })),
      addPrintJob: (job) => set((state) => ({ printJobs: [...state.printJobs, job] })),
      updatePrintJob: (id, data) => set((state) => ({
        printJobs: state.printJobs.map(j => j.id === id ? { ...j, ...data } : j)
      })),
      deletePrintJob: (id) => set((state) => ({
        printJobs: state.printJobs.filter(j => j.id !== id)
      }))
    }),
    {
      name: 'erp-store', // key in localStorage
    }
  )
);
