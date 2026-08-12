import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { type Product, type ProductCategory, type ProductStatus } from '../../lib/types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  initialData?: Partial<Product>;
  onSave: (product: Partial<Product>) => void;
}

export default function ProductFormModal({ isOpen, onClose, product, initialData, onSave }: ProductFormModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    images: [''],
    category: 'Lámparas',
    status: 'activo',
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        stock_quantity: 0,
        images: [''],
        category: 'Lámparas',
        status: 'activo',
        ...initialData,
      });
    }
  }, [product, isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'images') {
      setFormData(prev => ({ ...prev, images: [value] }));
      return;
    }

    if (name === 'isVisible') {
      setFormData(prev => ({ ...prev, status: (e.target as HTMLInputElement).checked ? 'activo' : 'borrador' }));
      return;
    }

    let parsedValue: string | number | boolean = value;
    if (type === 'number') {
      parsedValue = parseFloat(value);
    }

    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isVisible = formData.status === 'activo';
  const imageUrl = formData.images && formData.images.length > 0 ? formData.images[0] : '';

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-background">
          <h2 className="text-xl font-medium">{product ? 'Editar Producto' : 'Añadir Producto'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1">Nombre del Producto</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange}
                required 
                className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">Descripción</label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description || ''} 
                onChange={handleChange}
                required 
                rows={4}
                className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none" 
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-muted-foreground mb-1">Precio (€)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                value={formData.price} 
                onChange={handleChange}
                required 
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
              />
            </div>

            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-muted-foreground mb-1">Stock</label>
              <input 
                type="number" 
                id="stock_quantity" 
                name="stock_quantity" 
                value={formData.stock_quantity} 
                onChange={handleChange}
                required 
                min="0"
                className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-muted-foreground mb-1">Categoría</label>
              <select 
                id="category" 
                name="category" 
                value={formData.category || 'Lámparas'} 
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="Lámparas">Lámpara</option>
                <option value="Objetos Decorativos">Objeto Decorativo</option>
              </select>
            </div>

            <div>
              <label htmlFor="images" className="block text-sm font-medium text-muted-foreground mb-1">URL de Imagen</label>
              <input 
                type="url" 
                id="images" 
                name="images" 
                value={imageUrl} 
                onChange={handleChange}
                required 
                placeholder="https://..."
                className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3 mt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isVisible" 
                  checked={isVisible} 
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                <span className="ml-3 text-sm font-medium text-foreground">Visible en la tienda</span>
              </label>
            </div>

          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-background flex justify-end gap-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2 border border-border rounded-md font-medium hover:bg-secondary transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}
