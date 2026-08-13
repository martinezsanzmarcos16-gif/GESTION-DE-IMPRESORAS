
import { useCartStore } from '../../store/useCartStore';
import { X as XIcon, Plus as PlusIcon, Minus as MinusIcon, ShoppingBag as ShoppingBagIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isDrawerOpen, toggleDrawer, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 transition-opacity"
        onClick={toggleDrawer}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-card border-l border-border shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBagIcon size={20} /> Tu Carrito
          </h2>
          <button onClick={toggleDrawer} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <XIcon size={20} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
              <ShoppingBagIcon size={48} className="opacity-20" />
              <p>Tu carrito está vacío.</p>
              <button 
                onClick={toggleDrawer}
                className="mt-4 px-6 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="w-20 h-20 bg-secondary rounded-md overflow-hidden flex-shrink-0">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm">{item.product.name}</h3>
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <XIcon size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{item.product.category}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border border-border rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-secondary transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon size={14} />
                      </button>
                      <span className="text-sm px-2 w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-secondary transition-colors"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <span className="font-medium text-sm">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-card">
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-lg font-semibold">€{getTotalPrice().toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Los impuestos y los gastos de envío se calcularán en el checkout.</p>
            <Link 
              to="/checkout"
              onClick={toggleDrawer}
              className="w-full block text-center bg-primary text-primary-foreground py-4 rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Proceder al Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
