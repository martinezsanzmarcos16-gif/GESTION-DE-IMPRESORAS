import { useState, useEffect } from 'react';
import ProductCard from '../../components/store/ProductCard';
import { useProductStore } from '../../store/useProductStore';
import { Filter, Loader2 } from 'lucide-react';

export default function Catalog() {
  const [filter, setFilter] = useState<"all" | "Lámparas" | "Objetos Decorativos">("all");
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const visibleProducts = products.filter(p => p.status === 'activo');
  const filteredProducts = filter === "all" 
    ? visibleProducts 
    : visibleProducts.filter(p => p.category === filter);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      {/* Hero Section */}
      <div className="max-w-3xl mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-light leading-tight mb-6">
          Ilumina tu espacio con <span className="font-semibold text-accent">diseño impreso en 3D.</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Lámparas minimalistas y objetos decorativos fabricados bajo demanda con materiales sostenibles. 
          Formas geométricas puras y luz ambiental perfecta.
        </p>
      </div>

      {/* Filters and Catalog */}
      <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-2xl font-light">Colección</h2>
        
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <Filter size={16} /> Filtrar:
          </span>
          <button 
            onClick={() => setFilter("all")}
            className={`transition-colors ${filter === "all" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            Todo
          </button>
          <button 
            onClick={() => setFilter("Lámparas")}
            className={`transition-colors ${filter === "Lámparas" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            Lámparas
          </button>
          <button 
            onClick={() => setFilter("Objetos Decorativos")}
            className={`transition-colors ${filter === "Objetos Decorativos" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            Objetos
          </button>
        </div>
      </div>

      {isLoading && products.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No se encontraron productos en esta categoría.
            </div>
          )}
        </>
      )}
    </div>
  );
}
