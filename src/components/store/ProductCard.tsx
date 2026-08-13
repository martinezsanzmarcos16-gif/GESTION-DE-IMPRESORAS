import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { type Product } from '../../lib/mockData';
import { useCartStore } from '../../store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-square mb-4 overflow-hidden bg-secondary rounded-2xl">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {!product.stock && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <span className="font-semibold tracking-widest text-sm">AGOTADO</span>
          </div>
        )}
        <button
          onClick={handleAddToCart}
          disabled={!product.stock}
          className="absolute bottom-2 right-2 md:bottom-4 md:right-4 p-2 md:p-3 bg-background/90 backdrop-blur-md rounded-full shadow-sm opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 disabled:hidden hover:bg-primary hover:text-primary-foreground"
          aria-label="Add to cart"
        >
          <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
        </div>
        <span className="font-medium">€{product.price.toFixed(2)}</span>
      </div>
    </Link>
  );
}
