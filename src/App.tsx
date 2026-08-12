import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import StoreLayout from "./components/layout/StoreLayout";
import AdminLayout from "./components/layout/AdminLayout";
import Catalog from "./pages/store/Catalog";
import ProductDetail from "./pages/store/ProductDetail";
import Checkout from "./pages/store/Checkout";
import About from "./pages/store/About";
import ProductsAdmin from "./pages/admin/ProductsAdmin";

import InventoryAdmin from "./pages/admin/InventoryAdmin";
import FinanceAdmin from "./pages/admin/FinanceAdmin";
import CalculatorAdmin from "./pages/admin/CalculatorAdmin";

// Vistas Placeholder para Admin
const AdminDashboard = () => (
  <div>
    <h1 className="text-2xl font-semibold mb-6">Resumen General</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Ventas del Mes</h3>
        <p className="text-3xl font-light">€4,250</p>
      </div>
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Pedidos Pendientes</h3>
        <p className="text-3xl font-light">12</p>
      </div>
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Stock Bajo (Filamento)</h3>
        <p className="text-3xl font-light text-red-500">3 rollos</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="lumina-theme">
      <BrowserRouter>
        <Routes>
          {/* Rutas de la Tienda */}
          <Route path="/" element={<StoreLayout />}>
            <Route index element={<Catalog />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* Rutas de Administración */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="inventory" element={<InventoryAdmin />} />
            <Route path="finance" element={<FinanceAdmin />} />
            <Route path="calculator" element={<CalculatorAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
