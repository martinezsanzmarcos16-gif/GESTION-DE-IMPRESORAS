import { useState, useEffect } from 'react';
import { Plus, Search, AlertTriangle, Layers, Loader2 } from 'lucide-react';
import { type Material } from '../../../lib/types';
import { supabase } from '../../../lib/supabase';

const MaterialsManager = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setMaterials(data || []);
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter(m => 
    m.material_type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.color && m.color.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.brand && m.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-medium">Inventario de Materiales</h2>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-sm">
          <Plus size={16} /> Añadir Material
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4 bg-background/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por tipo, color, marca..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Material</th>
                  <th className="px-6 py-3 font-medium">Color</th>
                  <th className="px-6 py-3 font-medium">Marca</th>
                  <th className="px-6 py-3 font-medium">Cantidad (g)</th>
                  <th className="px-6 py-3 font-medium text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMaterials.map(material => {
                  const isLowStock = material.quantity_grams <= material.min_threshold_grams;
                  const isCriticalStock = material.quantity_grams <= (material.min_threshold_grams / 2);
                  
                  return (
                    <tr key={material.id} className={`hover:bg-secondary/50 transition-colors ${isCriticalStock ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Layers size={16} className="text-muted-foreground" />
                          <span className="font-medium">{material.material_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{material.color || '-'}</td>
                      <td className="px-6 py-4 text-muted-foreground">{material.brand || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`font-mono ${isCriticalStock ? 'text-red-600 dark:text-red-400 font-bold' : isLowStock ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}`}>
                          {Number(material.quantity_grams).toLocaleString()} g
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isCriticalStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            <AlertTriangle size={14} /> Crítico
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            <AlertTriangle size={14} /> Bajo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Óptimo
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredMaterials.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No se encontraron materiales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialsManager;
