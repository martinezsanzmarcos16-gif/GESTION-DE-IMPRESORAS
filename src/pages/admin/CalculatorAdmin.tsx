import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockPrinters, mockMaterials } from "../../lib/mockData";
import { Calculator, Printer, Package, Euro, Clock, Zap, Settings, ArrowRight, Lightbulb } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function CalculatorAdmin() {
  const navigate = useNavigate();

  // Estado del formulario
  const [selectedPrinterId, setSelectedPrinterId] = useState(mockPrinters[0]?.id || "");
  const [selectedMaterialId, setSelectedMaterialId] = useState(mockMaterials[0]?.id || "");
  const [printHours, setPrintHours] = useState(2);
  const [printMinutes, setPrintMinutes] = useState(30);
  const [materialGrams, setMaterialGrams] = useState(50);
  const [additionalCost, setAdditionalCost] = useState(0);
  
  // Configuraciones adicionales
  const [failureFactor, setFailureFactor] = useState(5); // %
  const [electricityPrice, setElectricityPrice] = useState(0.15); // €/kWh
  const [marginPercent, setMarginPercent] = useState(100); // %

  const selectedPrinter = mockPrinters.find(p => p.id === selectedPrinterId);
  const selectedMaterial = mockMaterials.find(m => m.id === selectedMaterialId);

  // Cálculos
  const timeInHours = printHours + (printMinutes / 60);
  
  const electricityCost = selectedPrinter ? (selectedPrinter.powerWatts / 1000) * timeInHours * electricityPrice : 0;
  const materialCostBase = selectedMaterial ? materialGrams * selectedMaterial.costPerGram : 0;
  
  // Factor de fallo aplicado a costes directos de impresión
  const failureCost = (materialCostBase + electricityCost) * (failureFactor / 100); 
  
  const totalProductionCost = materialCostBase + electricityCost + additionalCost + failureCost;
  const profitMarginAmount = totalProductionCost * (marginPercent / 100);
  const suggestedPrice = totalProductionCost + profitMarginAmount;

  const chartData = [
    { name: "Material", value: materialCostBase, color: "hsl(var(--primary))" },
    { name: "Electricidad", value: electricityCost, color: "hsl(var(--accent))" },
    { name: "Adicionales", value: additionalCost, color: "hsl(var(--muted-foreground))" },
    { name: "Fallo/Merma", value: failureCost, color: "#ef4444" },
  ].filter(d => d.value > 0);

  const handleCreateProduct = () => {
    // Redirigir a la vista de productos pasando el precio sugerido en el estado
    navigate("/admin/products", { state: { suggestedPrice: suggestedPrice.toFixed(2) } });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Calculator className="text-accent" />
            Calculadora de Costes 3D
          </h1>
          <p className="text-muted-foreground mt-1">Calcula el coste de fabricación y obtén sugerencias de precios.</p>
        </div>
        <button 
          onClick={handleCreateProduct}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
        >
          Crear Producto con este Precio
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Formulario de Entrada */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2 border-b border-border pb-4">
              <Settings size={20} className="text-muted-foreground" />
              Parámetros de Impresión
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Selección de Impresora */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Printer size={16} className="text-muted-foreground" />
                  Impresora
                </label>
                <select 
                  className="w-full bg-secondary border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none transition-shadow"
                  value={selectedPrinterId}
                  onChange={(e) => setSelectedPrinterId(e.target.value)}
                >
                  {mockPrinters.map(p => (
                    <option key={p.id} value={p.id}>{p.brand} {p.model} ({p.powerWatts}W)</option>
                  ))}
                </select>
              </div>

              {/* Selección de Material */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Package size={16} className="text-muted-foreground" />
                  Material
                </label>
                <select 
                  className="w-full bg-secondary border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none transition-shadow"
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                >
                  {mockMaterials.map(m => (
                    <option key={m.id} value={m.id}>{m.type} - {m.color} ({m.costPerGram}€/g)</option>
                  ))}
                </select>
              </div>

              {/* Tiempo de Impresión */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  Tiempo de Impresión
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input 
                      type="number" 
                      min="0"
                      className="w-full bg-secondary border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none transition-shadow"
                      value={printHours}
                      onChange={(e) => setPrintHours(Number(e.target.value))}
                    />
                    <span className="absolute right-3 top-3 text-xs text-muted-foreground font-medium">hrs</span>
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="number" 
                      min="0" max="59"
                      className="w-full bg-secondary border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none transition-shadow"
                      value={printMinutes}
                      onChange={(e) => setPrintMinutes(Number(e.target.value))}
                    />
                    <span className="absolute right-3 top-3 text-xs text-muted-foreground font-medium">min</span>
                  </div>
                </div>
              </div>

              {/* Consumo de Material */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Package size={16} className="text-muted-foreground" />
                  Consumo Material
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0" step="0.1"
                    className="w-full bg-secondary border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none transition-shadow"
                    value={materialGrams}
                    onChange={(e) => setMaterialGrams(Number(e.target.value))}
                  />
                  <span className="absolute right-3 top-3 text-xs text-muted-foreground font-medium">g</span>
                </div>
              </div>

              {/* Costes Adicionales */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb size={16} className="text-muted-foreground" />
                  Costes Adicionales (Portalámparas, cajas, extras...)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0" step="0.1"
                    className="w-full bg-secondary border-none rounded-lg px-4 py-3 text-sm pl-10 focus:ring-2 focus:ring-accent outline-none transition-shadow"
                    value={additionalCost}
                    onChange={(e) => setAdditionalCost(Number(e.target.value))}
                  />
                  <Euro size={16} className="absolute left-3 top-3.5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
             <h2 className="text-lg font-medium mb-6 flex items-center gap-2 border-b border-border pb-4">
              <Zap size={20} className="text-muted-foreground" />
              Configuración de Márgenes y Energía
            </h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Margen Beneficio (%)</label>
                  <input 
                    type="number" min="0"
                    className="w-full bg-secondary border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none transition-shadow"
                    value={marginPercent}
                    onChange={(e) => setMarginPercent(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Factor Fallo (%)</label>
                  <input 
                    type="number" min="0" max="100"
                    className="w-full bg-secondary border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none transition-shadow"
                    value={failureFactor}
                    onChange={(e) => setFailureFactor(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Precio Luz (€/kWh)</label>
                  <input 
                    type="number" min="0" step="0.01"
                    className="w-full bg-secondary border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none transition-shadow"
                    value={electricityPrice}
                    onChange={(e) => setElectricityPrice(Number(e.target.value))}
                  />
                </div>
             </div>
          </div>
        </div>

        {/* Columna Derecha: Resultados y Gráficas */}
        <div className="space-y-6">
          
          <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl p-8 shadow-xl">
            <h3 className="text-sm font-medium opacity-90 mb-2">Precio de Venta Sugerido</h3>
            <div className="text-5xl font-light mb-6 flex items-end gap-2">
              {suggestedPrice.toFixed(2)}<span className="text-3xl opacity-80">€</span>
            </div>
            
            <div className="space-y-3 pt-6 border-t border-primary-foreground/20 text-sm">
               <div className="flex justify-between items-center">
                <span className="opacity-90">Coste de Producción</span>
                <span className="font-semibold">{totalProductionCost.toFixed(2)}€</span>
               </div>
               <div className="flex justify-between items-center">
                <span className="opacity-90">Margen de Beneficio</span>
                <span className="font-semibold text-green-200">+{profitMarginAmount.toFixed(2)}€</span>
               </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-foreground mb-6">Desglose de Producción</h3>
            
            <div className="h-56 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    animationDuration={800}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${Number(value).toFixed(2)}€`, 'Coste']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors">
                <span className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span>Material</span>
                <span className="font-medium">{materialCostBase.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors">
                <span className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-accent"></span>Electricidad</span>
                <span className="font-medium">{electricityCost.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors">
                <span className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-muted-foreground"></span>Adicionales</span>
                <span className="font-medium">{additionalCost.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors">
                <span className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>Fallo / Merma</span>
                <span className="font-medium text-red-500">{failureCost.toFixed(2)}€</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
