import { useState, useEffect } from 'react';
import { ShoppingCart, Calendar, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { type PurchaseOrder } from '../../../lib/types';
import { supabase } from '../../../lib/supabase';
import PurchaseOrderForm from './PurchaseOrderForm';

const PurchaseOrdersManager = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          suppliers ( name )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = () => {
    fetchOrders(); // Refresh after creating
    setIsFormOpen(false);
  };

  const getStatusIcon = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'Completado':
      case 'Pagado':
        return <CheckCircle size={14} className="mr-1.5" />;
      case 'Pendiente':
        return <Clock size={14} className="mr-1.5" />;
    }
  };

  const getStatusColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'Completado':
      case 'Pagado':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Pendiente':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-medium">Pedidos a Proveedores</h2>
          <p className="text-sm text-muted-foreground mt-1">Historial de compras de insumos y materiales.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
        >
          <ShoppingCart size={18} /> Hacer Pedido a Proveedor
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">ID Pedido</th>
                  <th className="px-6 py-3 font-medium">Proveedor</th>
                  <th className="px-6 py-3 font-medium">Fecha</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {order.id.split('-')[0]}...
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {/* En caso de que se una la tabla suppliers */}
                      {order.suppliers ? (order.suppliers as any).name : 'Proveedor'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">€{Number(order.total_amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No hay pedidos a proveedores registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <PurchaseOrderForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleCreateOrder} 
      />
    </div>
  );
};

export default PurchaseOrdersManager;
