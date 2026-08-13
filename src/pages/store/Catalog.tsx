import { useState } from 'react';
import ProductCard from '../../components/store/ProductCard';
import { useProductStore } from '../../store/useProductStore';
import { Filter } from 'lucide-react';

export default function Catalog() {
  const [filter, setFilter] = useState<"all" | "lamp" | "object">("all");
  const products = useProductStore((state) => state.products);

  const visibleProducts = products.filter(p => p.isVisible);
  const filteredProducts = filter === "all" 
    ? visibleProducts 
    : visibleProducts.filter(p => p.category === filter);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Hero Section */}
      <div className="max-w-3xl mb-8 md:mb-16">
        <h1 className="text-3xl md:text-6xl font-light leading-tight mb-4 md:mb-6">
          Ilumina tu espacio con <span className="font-semibold text-accent">diseño impreso en 3D.</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Lámparas minimalistas y objetos decorativos fabricados bajo demanda con materiales sostenibles. 
          Formas geométricas puras y luz ambiental perfecta.
        </p>
      </div>

      {/* Filters and Catalog */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
        <h2 className="text-2xl font-light">Colección</h2>
        
        <div className="flex items-center gap-4 text-sm overflow-x-auto pb-2 sm:pb-0 whitespace-nowrap">
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
            onClick={() => setFilter("lamp")}
            className={`transition-colors ${filter === "lamp" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            Lámparas
          </button>
          <button 
            onClick={() => setFilter("object")}
            className={`transition-colors ${filter === "object" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            Objetos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 md:gap-12">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          No se encontraron productos en esta categoría.
        </div>
      )}
    </div>
  );
}
