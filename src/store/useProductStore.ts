import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { type Product, type ProductCategory, type ProductStatus } from '../lib/types';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (productData: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  toggleVisibility: (id: string, currentStatus: ProductStatus) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ products: data as Product[], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ 
        products: [data as Product, ...state.products],
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateProduct: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const { data: updatedData, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? (updatedData as Product) : p
        ),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  toggleVisibility: async (id, currentStatus) => {
    const newStatus = currentStatus === 'activo' ? 'borrador' : 'activo';
    return get().updateProduct(id, { status: newStatus });
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  }
}));
