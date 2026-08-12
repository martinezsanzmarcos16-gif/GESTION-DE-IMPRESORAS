import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Eye, EyeOff, Search, Loader2 } from 'lucide-react';
import { type Product } from '../../lib/types';
import { useProductStore } from '../../store/useProductStore';
import ProductFormModal from '../../components/admin/ProductFormModal';

export default function ProductsAdmin() {
  const { products, fetchProducts, isLoading, addProduct, updateProduct, toggleVisibility } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [initialData, setInitialData] = useState<Partial<Product> | undefined>(undefined);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (location.state?.suggestedPrice) {
      setInitialData({ price: Number(location.state.suggestedPrice) });
      setEditingProduct(null);
      setIsModalOpen(true);
      // Clean up the state so it doesn't reopen on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product || null);
    if (!product) setInitialData(undefined); // Clear initial data if opening for new product manually
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (editingProduct) {
      // Edit
      await updateProduct(editingProduct.id, productData);
    } else {
      // Add new
      await addProduct(productData as Omit<Product, 'id' | 'created_at'>);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Catálogo y Tienda</h1>
          <p className="text-muted-foreground">Gestiona los productos que se muestran a tus clientes.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus size={18} /> Añadir Producto
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex items-center gap-4 bg-background/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading && products.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Producto</th>
                  <th className="px-6 py-3 font-medium">Categoría</th>
                  <th className="px-6 py-3 font-medium">Precio</th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map(product => {
                  const isVisible = product.status === 'activo';
                  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop';
                  return (
                    <tr key={product.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded overflow-hidden bg-secondary flex-shrink-0">
                            <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-medium">{product.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize text-muted-foreground">{product.category}</td>
                      <td className="px-6 py-4">€{product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock_quantity > 10 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : product.stock_quantity > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {product.stock_quantity} un.
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleVisibility(product.id, product.status)}
                          className={`flex items-center gap-1.5 text-xs font-medium ${isVisible ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}
                        >
                          {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                          {isVisible ? 'Activo' : 'Borrador'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        initialData={initialData}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
