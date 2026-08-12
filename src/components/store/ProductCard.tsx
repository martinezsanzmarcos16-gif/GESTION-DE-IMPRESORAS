import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { type Product } from '../../lib/types';
import { useCartStore } from '../../store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product as any); // temporary cast until cart store is updated
  };

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop';

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-square mb-4 overflow-hidden bg-secondary rounded-2xl">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.stock_quantity <= 0 && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <span className="font-semibold tracking-widest text-sm">AGOTADO</span>
          </div>
        )}
        <button
          onClick={handleAddToCart}
          disabled={product.stock_quantity <= 0}
          className="absolute bottom-4 right-4 p-3 bg-background/80 backdrop-blur-md rounded-full shadow-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 disabled:hidden hover:bg-primary hover:text-primary-foreground"
          aria-label="Add to cart"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-foreground">{product.title}</h3>
          <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
        </div>
        <span className="font-medium">€{product.price.toFixed(2)}</span>
      </div>
    </Link>
  );
}
