import { Outlet, Link, useLocation } from "react-router-dom";
import { Moon, Sun, ShoppingCart, Menu } from "lucide-react";
import { useTheme } from "../theme-provider";
import { useCartStore } from "../../store/useCartStore";
import CartDrawer from "../store/CartDrawer";

export default function StoreLayout() {
  const { theme, setTheme } = useTheme();
  const { toggleDrawer, getTotalItems } = useCartStore();
  const location = useLocation();
  
  const isCheckout = location.pathname === '/checkout';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Navbar Minimalista */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-muted-foreground hover:text-foreground">
              <Menu size={20} />
            </button>
            <Link to="/" className="text-xl font-bold tracking-widest uppercase">
              Lumina<span className="text-accent font-light">3D</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="hover:text-accent transition-colors">Catálogo</Link>
            <Link to="/about" className="hover:text-accent transition-colors">Nosotros</Link>
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">Admin</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {!isCheckout && (
              <button 
                onClick={toggleDrawer}
                className="p-2 rounded-full hover:bg-secondary transition-colors relative"
              >
                <ShoppingCart size={18} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer Minimalista */}
      <footer className="border-t border-border py-8 mt-12 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Lumina3D. Diseñado con luz.</p>
        </div>
      </footer>
    </div>
  );
}
