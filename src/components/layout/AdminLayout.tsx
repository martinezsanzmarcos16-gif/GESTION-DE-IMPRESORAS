import { Outlet, Link, useLocation } from "react-router-dom";
import { Package, LayoutDashboard, Store, LogOut, Wallet, Calculator, Printer } from "lucide-react";
import { useTheme } from "../theme-provider";
import { Moon, Sun } from "lucide-react";

export default function AdminLayout() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Catálogo & Tienda", path: "/admin/products", icon: Store },
    { name: "Almacén & Stock", path: "/admin/inventory", icon: Package },
    { name: "Cuentas & Finanzas", path: "/admin/finance", icon: Wallet },
    { name: "Calculadora Costes", path: "/admin/calculator", icon: Calculator },
    { name: "Cola de Impresión", path: "/admin/production", icon: Printer },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      {/* Sidebar Elegante */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/" className="text-lg font-bold tracking-widest uppercase hover:text-accent transition-colors">
            Admin<span className="text-accent font-light">Panel</span>
          </Link>
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Mobile / Acciones */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
          <h2 className="font-medium text-lg">Panel de Control</h2>
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
