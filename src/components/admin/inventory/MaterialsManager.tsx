import { useState } from 'react';
import { Plus, Search, AlertTriangle, Layers, Edit2, Trash2, X, Save } from 'lucide-react';
import { useERPStore } from '../../../store/useERPStore';
import { type Material } from '../../../lib/mockData';

const MaterialsManager = () => {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useERPStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    type: 'PLA' as Material['type'],
    color: '',
    brand: '',
    quantityGrams: 0,
    minThreshold: 500
  });

  const openModal = (material?: Material) => {
    if (material) {
      setEditingMaterial(material);
      setFormData({
        type: material.type,
        color: material.color,
        brand: material.brand,
        quantityGrams: material.quantityGrams,
        minThreshold: material.minThreshold
      });
    } else {
      setEditingMaterial(null);
      setFormData({
        type: 'PLA',
        color: '',
        brand: '',
        quantityGrams: 0,
        minThreshold: 500
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMaterial(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMaterial) {
      updateMaterial(editingMaterial.id, formData);
    } else {
      const newMaterial: Material = {
        id: `mat${Date.now()}`,
        ...formData,
        costPerGram: 0.02 // Default or random
      };
      addMaterial(newMaterial);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    deleteMaterial(id);
  };

  const filteredMaterials = materials.filter(m => 
    m.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-medium">Inventario de Materiales</h2>
        <button 
          onClick={() => openModal()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center gap-2 text-sm"
        >
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
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Material</th>
                <th className="px-6 py-3 font-medium">Color</th>
                <th className="px-6 py-3 font-medium">Marca</th>
                <th className="px-6 py-3 font-medium">Cantidad (g)</th>
                <th className="px-6 py-3 font-medium text-right">Estado</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMaterials.map(material => {
                const isLowStock = material.quantityGrams <= material.minThreshold;
                const isCriticalStock = material.quantityGrams <= (material.minThreshold / 2);
                
                return (
                  <tr key={material.id} className={`hover:bg-secondary/50 transition-colors ${isCriticalStock ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Layers size={16} className="text-muted-foreground" />
                        <span className="font-medium">{material.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{material.color}</td>
                    <td className="px-6 py-4 text-muted-foreground">{material.brand}</td>
                    <td className="px-6 py-4">
                      <span className={`font-mono ${isCriticalStock ? 'text-red-600 dark:text-red-400 font-bold' : isLowStock ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}`}>
                        {material.quantityGrams.toLocaleString()} g
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => openModal(material)}
                          className="p-1.5 text-muted-foreground hover:bg-secondary rounded-md transition-colors" 
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(material.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-colors" 
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-lg border border-border flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Layers className="text-primary" />
                {editingMaterial ? 'Editar Material' : 'Añadir Material'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo</label>
                  <select 
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as Material['type']})}
                  >
                    <option value="PLA">PLA</option>
                    <option value="PETG">PETG</option>
                    <option value="ABS">ABS</option>
                    <option value="TPU">TPU</option>
                    <option value="Resin">Resina</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    placeholder="Ej: Negro, Blanco..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Marca</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  placeholder="Ej: Polymaker, Sunlu..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Actual (g)</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.quantityGrams}
                    onChange={(e) => setFormData({...formData, quantityGrams: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Umbral Mínimo (g)</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({...formData, minThreshold: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

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

export default MaterialsManager;
