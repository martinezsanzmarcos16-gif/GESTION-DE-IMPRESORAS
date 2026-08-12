import { useState } from 'react';
import PrintersManager from '../../components/admin/inventory/PrintersManager';
import MaterialsManager from '../../components/admin/inventory/MaterialsManager';
import PurchaseOrdersManager from '../../components/admin/inventory/PurchaseOrdersManager';

const InventoryAdmin = () => {
  const [activeTab, setActiveTab] = useState<'printers' | 'materials' | 'orders'>('printers');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Almacén y Stock</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de impresoras 3D, inventario de materiales y pedidos a proveedores.
          </p>
        </div>
      </div>

      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('printers')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'printers'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }
            `}
          >
            Impresoras 3D
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'materials'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }
            `}
          >
            Materiales e Insumos
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }
            `}
          >
            Pedidos a Proveedores
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'printers' && <PrintersManager />}
        {activeTab === 'materials' && <MaterialsManager />}
        {activeTab === 'orders' && <PurchaseOrdersManager />}
      </div>
    </div>
  );
};

export default InventoryAdmin;
