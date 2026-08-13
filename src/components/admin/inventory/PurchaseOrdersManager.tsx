import { useState } from 'react';
import { ShoppingCart, Calendar, CheckCircle, Clock } from 'lucide-react';
import { mockPurchaseOrders, type PurchaseOrder } from '../../../lib/mockData';
import PurchaseOrderForm from './PurchaseOrderForm';

const PurchaseOrdersManager = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateOrder = (newOrder: PurchaseOrder) => {
    setOrders([newOrder, ...orders]);
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
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">ID Pedido</th>
                <th className="px-6 py-3 font-medium">Proveedor</th>
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium">Artículos</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{order.id}</td>
                  <td className="px-6 py-4 font-medium">{order.supplier}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">{order.items} líneas</td>
                  <td className="px-6 py-4 font-medium">€{order.totalAmount.toFixed(2)}</td>
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
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No hay pedidos a proveedores registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
