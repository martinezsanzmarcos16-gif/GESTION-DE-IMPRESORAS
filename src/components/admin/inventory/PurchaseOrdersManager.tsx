import { useState } from 'react';
import { ShoppingCart, Calendar, CheckCircle, Clock, Mail, Loader2, Check } from 'lucide-react';
import { type PurchaseOrder } from '../../../lib/mockData';
import { useERPStore } from '../../../store/useERPStore';
import PurchaseOrderForm from './PurchaseOrderForm';

const PurchaseOrdersManager = () => {
  const { purchaseOrders: orders, addPurchaseOrder, payPurchaseOrder } = useERPStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // UI Simulation state
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'success'} | null>(null);

  const handleCreateOrder = (newOrder: PurchaseOrder) => {
    addPurchaseOrder(newOrder);
    if (newOrder.status === 'Completado' || newOrder.status === 'Pagado') {
      simulatePaymentAndEmail(newOrder.id, newOrder.supplier);
    }
    setIsFormOpen(false);
  };

  const simulatePaymentAndEmail = (orderId: string, supplierName: string) => {
    setProcessingId(orderId);
    setNotification({ message: `Procesando pago y enviando correo a ${supplierName.toLowerCase().replace(/\s/g, '')}@example.com...`, type: 'info' });
    
    setTimeout(() => {
      payPurchaseOrder(orderId);
      setProcessingId(null);
      setNotification({ message: `¡Pago realizado y correo enviado con éxito a ${supplierName}!`, type: 'success' });
      
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    }, 2000);
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

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/30' 
            : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30'
        }`}>
          {notification.type === 'info' ? (
            <Loader2 className="animate-spin text-blue-500" size={20} />
          ) : (
            <Check className="text-green-500" size={20} />
          )}
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

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
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
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
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {order.status === 'Pendiente' && (
                      <button 
                        onClick={() => simulatePaymentAndEmail(order.id, order.supplier)}
                        disabled={processingId === order.id}
                        className={`p-1.5 rounded-md transition-colors ${
                          processingId === order.id 
                            ? 'text-muted-foreground bg-secondary opacity-50 cursor-not-allowed' 
                            : 'text-primary hover:bg-primary/10'
                        }`}
                        title="Marcar como Pagado y Enviar Correo"
                      >
                        {processingId === order.id ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
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
