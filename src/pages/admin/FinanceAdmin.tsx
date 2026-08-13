import { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Search } from 'lucide-react';
import { mockTransactions, type Transaction } from '../../lib/mockData';

// Chart colors
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function FinanceAdmin() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Calculate KPIs
  const kpis = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      if (t.type === 'expense') totalExpenses += t.amount;
    });

    const netProfit = totalIncome - totalExpenses;
    // Assuming a base budget or just displaying net profit as available
    const availableBudget = 5000 + netProfit; // arbitrary base for display

    return { totalIncome, totalExpenses, netProfit, availableBudget };
  }, [transactions]);

  // 2. Prepare Chart Data
  const { lineChartData, pieChartData } = useMemo(() => {
    // Group by date for Line/Bar chart
    const byDate: Record<string, { date: string, income: number, expense: number }> = {};
    // Group expenses by category for Pie chart
    const expensesByCategory: Record<string, number> = {};

    transactions.forEach(t => {
      // Date grouping
      if (!byDate[t.date]) {
        byDate[t.date] = { date: t.date, income: 0, expense: 0 };
      }
      if (t.type === 'income') byDate[t.date].income += t.amount;
      if (t.type === 'expense') byDate[t.date].expense += t.amount;

      // Category grouping
      if (t.type === 'expense') {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      }
    });

    const lineChartData = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
    
    const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value
    }));

    return { lineChartData, pieChartData };
  }, [transactions]);

  // 3. Filter Table Data
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, typeFilter, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Cuentas y Finanzas</h1>
          <p className="text-muted-foreground">Supervisa los ingresos, gastos y el flujo de caja.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Income */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Ingresos Totales</p>
            <h3 className="text-2xl font-semibold text-green-600 dark:text-green-500">
              €{kpis.totalIncome.toFixed(2)}
            </h3>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Gastos Totales</p>
            <h3 className="text-2xl font-semibold text-red-600 dark:text-red-500">
              €{kpis.totalExpenses.toFixed(2)}
            </h3>
          </div>
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
            <TrendingDown size={24} />
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Beneficio Neto</p>
            <h3 className={`text-2xl font-semibold ${kpis.netProfit >= 0 ? 'text-foreground' : 'text-red-500'}`}>
              €{kpis.netProfit.toFixed(2)}
            </h3>
          </div>
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Available Budget */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Presupuesto Disp.</p>
            <h3 className="text-2xl font-semibold text-foreground">
              €{kpis.availableBudget.toFixed(2)}
            </h3>
          </div>
          <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
            <Wallet size={24} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evolution Chart */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
          <h3 className="text-lg font-medium mb-6">Evolución de Ingresos vs Gastos</h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={(val) => `€${val}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem', color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="expense" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
          <h3 className="text-lg font-medium mb-6">Distribución de Gastos</h3>
          <div className="flex-1 w-full min-h-[300px]">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: any) => [`€${Number(value).toFixed(2)}`, 'Importe']}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem', color: 'hsl(var(--foreground))' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No hay datos de gastos
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-background/50">
          <h3 className="text-lg font-medium">Historial de Transacciones</h3>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="text" 
                placeholder="Buscar transacción..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
            </div>
            <div className="flex bg-background border border-border rounded-md p-1 w-full sm:w-auto">
              <button
                onClick={() => setTypeFilter('all')}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded ${typeFilter === 'all' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Todas
              </button>
              <button
                onClick={() => setTypeFilter('income')}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded ${typeFilter === 'income' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Ingresos
              </button>
              <button
                onClick={() => setTypeFilter('expense')}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded ${typeFilter === 'expense' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Gastos
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium">Descripción</th>
                <th className="px-6 py-3 font-medium">Categoría</th>
                <th className="px-6 py-3 font-medium">Tipo</th>
                <th className="px-6 py-3 font-medium text-right">Importe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium">{t.description}</td>
                  <td className="px-6 py-4 text-muted-foreground">{t.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block w-20 text-center ${
                      t.type === 'income' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold ${
                    t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}€{t.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No se encontraron transacciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
