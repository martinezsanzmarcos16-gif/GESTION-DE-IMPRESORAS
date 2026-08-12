import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { supabase } from '../../lib/supabase';

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if cart is empty and not in success state
  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      navigate('/');
    }
  }, [items.length, isSuccess, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Crear el pedido principal
      const orderData = {
        customer_name: (document.getElementById('firstName') as HTMLInputElement).value + ' ' + (document.getElementById('lastName') as HTMLInputElement).value,
        customer_email: (document.getElementById('email') as HTMLInputElement).value,
        customer_address: (document.getElementById('address') as HTMLInputElement).value + ', ' + (document.getElementById('city') as HTMLInputElement).value + ', ' + (document.getElementById('zipCode') as HTMLInputElement).value,
        payment_status: 'Pagado', // Simulating successful payment
        total_amount: getTotalPrice() + 4.99 // subtotal + shipping
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Crear las líneas de pedido y descontar stock (esto normalmente se hace en backend, pero lo simulamos aquí)
      for (const item of items) {
        // Insert order item
        await supabase
          .from('order_items')
          .insert([{
            order_id: order.id,
            product_id: item.product.id,
            quantity: item.quantity,
            unit_price: item.product.price
          }]);
          
        // Update product stock (since we are doing it from frontend for now)
        await supabase
          .from('products')
          .update({ stock_quantity: item.product.stock_quantity - item.quantity })
          .eq('id', item.product.id);
      }

      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert('Hubo un error al procesar el pedido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-light mb-4">¡Pedido completado!</h1>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          Gracias por tu compra. Hemos recibido tu pedido y comenzaremos la producción pronto. Te enviaremos un email con los detalles.
        </p>
        <Link 
          to="/"
          className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = 4.99;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ChevronLeft size={16} /> Volver a la tienda
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Form Area */}
        <div className="w-full lg:w-3/5">
          <h1 className="text-2xl font-light mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info */}
            <div>
              <h2 className="text-lg font-medium mb-4">Información de Contacto</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                  <input type="email" id="email" required className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="tu@email.com" />
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div>
              <h2 className="text-lg font-medium mb-4">Dirección de Envío</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-muted-foreground mb-1">Nombre</label>
                  <input type="text" id="firstName" required className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-muted-foreground mb-1">Apellidos</label>
                  <input type="text" id="lastName" required className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-muted-foreground mb-1">Dirección</label>
                  <input type="text" id="address" required className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-muted-foreground mb-1">Ciudad</label>
                  <input type="text" id="city" required className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-muted-foreground mb-1">Código Postal</label>
                  <input type="text" id="zipCode" required className="w-full px-4 py-3 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                </div>
              </div>
            </div>

            {/* Payment (Simulated) */}
            <div>
              <h2 className="text-lg font-medium mb-4">Pago</h2>
              <div className="p-4 border border-border rounded-md bg-secondary/50 text-sm text-muted-foreground">
                <p>Este es un entorno de demostración. No se procesarán pagos reales. Haz clic en "Pagar y Confirmar" para simular una compra exitosa.</p>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-4 rounded-md font-medium text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? "Procesando..." : "Pagar y Confirmar"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-2/5">
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8 sticky top-24 shadow-sm">
            <h2 className="text-lg font-medium mb-6">Resumen del Pedido</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => {
                const imageUrl = item.product.images && item.product.images.length > 0 
                  ? item.product.images[0] 
                  : 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop';
                  
                return (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-secondary rounded-md overflow-hidden flex-shrink-0 relative">
                      <img src={imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-xs rounded-full flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.product.title}</h4>
                      <p className="text-xs text-muted-foreground capitalize">{item.product.category}</p>
                    </div>
                    <span className="text-sm font-medium">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Envío</span>
                <span>€{shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
