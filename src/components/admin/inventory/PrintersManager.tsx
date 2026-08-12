import { useState, useEffect } from 'react';
import { Plus, Printer as PrinterIcon, Edit2, Play, Pause, Wrench, Loader2 } from 'lucide-react';
import { type Printer } from '../../../lib/types';
import { supabase } from '../../../lib/supabase';

const PrintersManager = () => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPrinters() {
      try {
        const { data, error } = await supabase
          .from('printers')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setPrinters(data || []);
      } catch (error) {
        console.error('Error fetching printers:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrinters();
  }, []);

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
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-sm">
          <Plus size={16} /> Añadir Impresora
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
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
                <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  <Edit2 size={16} />
                </button>
              </div>
              
              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1">Horas Totales</span>
                  <span className="font-medium">{printer.total_hours_printed}h</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center capitalize ${getStatusColor(printer.status)}`}>
                  {getStatusIcon(printer.status)}
                  {printer.status}
                </span>
              </div>
            </div>
          ))}
          {printers.length === 0 && (
            <div className="col-span-full py-8 text-center text-muted-foreground bg-card border border-border rounded-xl">
              No hay impresoras registradas.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PrintersManager;
