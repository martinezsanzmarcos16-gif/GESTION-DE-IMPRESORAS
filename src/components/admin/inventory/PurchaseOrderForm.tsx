import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle } from 'lucide-react';
import { mockMaterials, type PurchaseOrder } from '../../../lib/mockData';

interface PurchaseOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: PurchaseOrder) => void;
}

interface OrderItem {
  id: string;
  materialId: string | 'new';
  description: string; // If 'new' or generic
  quantityGrams: number;
  unitPrice: number;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState<OrderItem[]>([
    { id: '1', materialId: '', description: '', quantityGrams: 1000, unitPrice: 0 }
  ]);
  const [status, setStatus] = useState<'Pendiente' | 'Completado'>('Completado');

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), materialId: '', description: '', quantityGrams: 1000, unitPrice: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.unitPrice), 0); 
    // Simplified: assuming unitPrice is the price for the whole quantity indicated, or we could do price per kg. Let's assume unitPrice is the line total for simplicity in this form.
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplier || items.length === 0) return;

    // TODO: In a real app, here we would update the actual material stock in the DB
    // if materialId !== 'new' and status === 'Completado'.

    const newOrder: PurchaseOrder = {
      id: `po-${Date.now()}`,
      supplier,
      date: new Date().toISOString(),
      status,
      totalAmount: calculateTotal(),
      items: items.length
    };

    onSubmit(newOrder);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">Nuevo Pedido a Proveedor</h2>
            <p className="text-sm text-muted-foreground mt-1">Registra la compra de insumos y materiales.</p>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="purchase-order-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Proveedor</label>
                <input 
                  type="text" 
                  required
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Ej. Filament2Print, Amazon..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado del Pedido</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Pendiente' | 'Completado')}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Pendiente">Pendiente (Borrador)</option>
                  <option value="Completado">Completado / Pagado</option>
                </select>
                {status === 'Completado' && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <CheckCircle size={12} className="text-green-500" />
                    Se sumará al stock y registrará el gasto automáticamente.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Líneas de Pedido</h3>
                <button 
                  type="button"
                  onClick={handleAddItem}
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                >
                  <Plus size={16} /> Añadir Línea
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-lg bg-secondary/20 relative group">
                    <div className="flex-1 space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Material</label>
                      <select 
                        value={item.materialId}
                        onChange={(e) => updateItem(item.id, 'materialId', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                        required
                      >
                        <option value="" disabled>Selecciona un material...</option>
                        <option value="new">+ Crear nuevo material</option>
                        <optgroup label="Materiales Existentes">
                          {mockMaterials.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.type} - {m.color} ({m.brand})
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      
                      {item.materialId === 'new' && (
                        <input 
                          type="text" 
                          placeholder="Descripción del nuevo material (Ej. TPU Flexible Rojo)"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 mt-2 bg-background border border-border rounded-md text-sm"
                          required
                        />
                      )}
                    </div>
                    
                    <div className="w-full md:w-32 space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Cant. (gramos)</label>
                      <input 
                        type="number" 
                        min="1"
                        value={item.quantityGrams}
                        onChange={(e) => updateItem(item.id, 'quantityGrams', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                        required
                      />
                    </div>

                    <div className="w-full md:w-32 space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Precio Total (€)</label>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                        required
                      />
                    </div>

                    <button 
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute -right-2 -top-2 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity md:static md:opacity-100 md:bg-transparent md:text-muted-foreground md:hover:text-destructive md:mt-7"
                      disabled={items.length === 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-border">
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Total Pedido</p>
                <p className="text-3xl font-light">€{calculateTotal().toFixed(2)}</p>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-border bg-secondary/30 flex justify-end gap-3 mt-auto">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-md font-medium hover:bg-secondary transition-colors text-sm"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="purchase-order-form"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 transition-opacity text-sm flex items-center gap-2"
          >
            Confirmar Pedido
          </button>
        </div>

      </div>
    </div>
  );
};

export default PurchaseOrderForm;
