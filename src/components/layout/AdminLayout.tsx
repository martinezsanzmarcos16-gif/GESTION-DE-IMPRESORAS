import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Package, LayoutDashboard, Store, LogOut, Wallet, Calculator, Printer, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "../theme-provider";

export default function AdminLayout() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Catálogo & Tienda", path: "/admin/products", icon: Store },
    { name: "Almacén & Stock", path: "/admin/inventory", icon: Package },
    { name: "Cuentas & Finanzas", path: "/admin/finance", icon: Wallet },
    { name: "Calculadora Costes", path: "/admin/calculator", icon: Calculator },
    { name: "Cola de Impresión", path: "/admin/production", icon: Printer },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative">
      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Elegante */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-50 w-64 border-r border-border bg-card flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link to="/" className="text-lg font-bold tracking-widest uppercase hover:text-accent transition-colors">
            Admin<span className="text-accent font-light">Panel</span>
          </Link>
          <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/admin");
            
            // Fix dashboard active state so it only highlights on exact match
            const isDashboard = item.path === "/admin";
            const isDashboardActive = isDashboard && location.pathname === "/admin";
            
            const isActuallyActive = isDashboard ? isDashboardActive : isActive;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActuallyActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Mobile / Acciones */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="font-medium text-lg hidden sm:block">Panel de Control</h2>
          </div>
          <div className="flex items-center gap-4">
             <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
             <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs cursor-pointer hover:opacity-80 transition-opacity">
                AD
             </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
