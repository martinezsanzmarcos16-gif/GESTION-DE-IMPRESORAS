import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const products = useProductStore((state) => state.products);
  
  // Find product
  const product = products.find(p => p.id === id);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-light mb-4">Producto no encontrado</h2>
        <Link to="/" className="text-muted-foreground hover:text-foreground underline underline-offset-4">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 md:mb-8">
        <ChevronLeft size={16} /> Volver al catálogo
      </Link>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-24">
        {/* Image Gallery (Simplified for now) */}
        <div className="w-full md:w-1/2">
          <div className="aspect-square bg-secondary rounded-2xl overflow-hidden shadow-sm">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="mb-2 text-xs md:text-sm text-muted-foreground uppercase tracking-widest">
            {product.category}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-light mb-3 md:mb-4">{product.name}</h1>
          <p className="text-xl font-medium mb-8">€{product.price.toFixed(2)}</p>
          
          <div className="prose prose-sm dark:prose-invert text-muted-foreground mb-8">
            <p>{product.description}</p>
            <ul className="mt-4 space-y-2">
              <li>• Fabricado en PLA reciclado de alta calidad.</li>
              <li>• Acabado texturizado mate.</li>
              <li>• Impreso bajo demanda (tiempo de producción: 2-3 días).</li>
            </ul>
          </div>

          <div className="h-px w-full bg-border mb-8" />

          {product.stock > 0 ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-border rounded-md px-2 w-32 h-14 bg-background">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Minus size={18} />
                </button>
                <span className="flex-1 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 h-14 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag size={18} /> Añadir al Carrito
              </button>
            </div>
          ) : (
            <div className="p-4 bg-secondary text-secondary-foreground rounded-md text-center font-medium">
              Producto Agotado Temporalmente
            </div>
          )}
          
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-4">
              ¡Solo quedan {product.stock} unidades en stock!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
