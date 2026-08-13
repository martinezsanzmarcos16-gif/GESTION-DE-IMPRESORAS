import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockProducts, type Product } from '../lib/mockData';

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  toggleVisibility: (id: string) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: mockProducts, // Initialize with mock data

      addProduct: (product) => 
        set((state) => ({ products: [...state.products, product] })),

      updateProduct: (id, data) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      toggleVisibility: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isVisible: !p.isVisible } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'product-store', // key in localStorage
    }
  )
);
