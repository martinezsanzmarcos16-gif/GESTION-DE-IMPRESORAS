import { useState } from 'react';
import { Plus, Printer as PrinterIcon, Edit2, Play, Pause, Wrench, X, Save } from 'lucide-react';
import { mockPrinters, type Printer } from '../../../lib/mockData';

const PrintersManager = () => {
  const [printers, setPrinters] = useState<Printer[]>(mockPrinters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<Printer | null>(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    status: 'libre' as Printer['status'],
    totalHoursPrinted: 0
  });

  const openModal = (printer?: Printer) => {
    if (printer) {
      setEditingPrinter(printer);
      setFormData({
        brand: printer.brand,
        model: printer.model,
        status: printer.status,
        totalHoursPrinted: printer.totalHoursPrinted
      });
    } else {
      setEditingPrinter(null);
      setFormData({
        brand: '',
        model: '',
        status: 'libre',
        totalHoursPrinted: 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPrinter(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrinter) {
      setPrinters(prev => prev.map(p => p.id === editingPrinter.id ? { ...p, ...formData } : p));
    } else {
      const newPrinter: Printer = {
        id: `pr${Date.now()}`,
        ...formData
      };
      setPrinters(prev => [...prev, newPrinter]);
    }
    closeModal();
  };

  const getStatusColor = (status: Printer['status']) => {
    switch (status) {
      case 'imprimiendo':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'libre':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'mantenimiento':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: Printer['status']) => {
    switch (status) {
      case 'imprimiendo': return <Play size={14} className="mr-1" />;
      case 'libre': return <Pause size={14} className="mr-1" />;
      case 'mantenimiento': return <Wrench size={14} className="mr-1" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Gestión de Impresoras</h2>
        <button 
          onClick={() => openModal()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Añadir Impresora
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {printers.map(printer => (
          <div key={printer.id} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <PrinterIcon size={24} className="text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{printer.brand}</h3>
                  <p className="text-sm text-muted-foreground">{printer.model}</p>
                </div>
              </div>
              <button 
                onClick={() => openModal(printer)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <Edit2 size={16} />
              </button>
            </div>
            
            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">Horas Totales</span>
                <span className="font-medium">{printer.totalHoursPrinted}h</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center capitalize ${getStatusColor(printer.status)}`}>
                {getStatusIcon(printer.status)}
                {printer.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-lg border border-border flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <PrinterIcon className="text-primary" />
                {editingPrinter ? 'Editar Impresora' : 'Añadir Impresora'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Marca</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  placeholder="Ej: Creality, Prusa..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Modelo</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  placeholder="Ej: Ender 3 V2, MK3S+..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select 
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as Printer['status']})}
                >
                  <option value="libre">Libre</option>
                  <option value="imprimiendo">Imprimiendo</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>

              {editingPrinter && (
                <div>
                  <label className="block text-sm font-medium mb-1">Horas Totales (Aprox)</label>
                  <input 
                    type="number" 
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.totalHoursPrinted}
                    onChange={(e) => setFormData({...formData, totalHoursPrinted: parseFloat(e.target.value) || 0})}
                  />
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Save size={16} /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintersManager;
