import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Loader2, Check, Mail } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useERPStore } from '../../store/useERPStore';
import { type CustomerOrder, type PrintJob, type Transaction } from '../../lib/mockData';

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { addCustomerOrder, addPrintJob, addTransaction } = useERPStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'success'} | null>(null);

  // Redirect if cart is empty and not in success state
  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      navigate('/');
    }
  }, [items.length, isSuccess, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate email notification
    const email = (document.getElementById('email') as HTMLInputElement)?.value || 'cliente@email.com';
    const firstName = (document.getElementById('firstName') as HTMLInputElement)?.value || 'Cliente';
    const lastName = (document.getElementById('lastName') as HTMLInputElement)?.value || '';
    
    setNotification({ message: `Procesando pago y enviando correo de confirmación a ${email}...`, type: 'info' });
    
    // Simulate API call
    setTimeout(() => {
      // 1. Create Customer Order
      const orderId = `ord-${Date.now()}`;
      const newOrder: CustomerOrder = {
        id: orderId,
        customerName: `${firstName} ${lastName}`.trim(),
        entryDate: new Date().toISOString().split('T')[0],
        status: 'Pendiente'
      };
      addCustomerOrder(newOrder);

      // 2. Create Print Jobs for each item
      items.forEach((item, index) => {
        for (let i = 0; i < item.quantity; i++) {
          const newJob: PrintJob = {
            id: `pj-${Date.now()}-${index}-${i}`,
            orderId: orderId,
            productName: item.product.name,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
            status: 'Pendiente',
            estimatedHours: 4.5 // Mock estimated hours
          };
          addPrintJob(newJob);
        }
      });

      // 3. Create Income Transaction
      const newTransaction: Transaction = {
        id: `tx-in-${Date.now()}`,
        type: 'income',
        amount: getTotalPrice() + 4.99, // Subtotal + shipping
        category: 'Venta',
        description: `Venta online - Pedido ${orderId} (${firstName})`,
        date: new Date().toISOString().split('T')[0]
      };
      addTransaction(newTransaction);

      setNotification({ message: `¡Pago completado! Correo enviado con éxito a ${email}.`, type: 'success' });

      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        clearCart();
        setNotification(null);
      }, 1500);
    }, 2500);
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
          
          {/* Notification Toast */}
          {notification && (
            <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
              notification.type === 'success' 
                ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/30' 
                : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30'
            }`}>
              {notification.type === 'info' ? (
                <Loader2 className="animate-spin text-blue-500" size={20} />
              ) : (
                <Check className="text-green-500" size={20} />
              )}
              <span className="font-medium text-sm">{notification.message}</span>
            </div>
          )}
          
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
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-secondary rounded-md overflow-hidden flex-shrink-0 relative">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-xs rounded-full flex items-center justify-center font-medium">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{item.product.category}</p>
                  </div>
                  <span className="text-sm font-medium">
                    €{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
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
