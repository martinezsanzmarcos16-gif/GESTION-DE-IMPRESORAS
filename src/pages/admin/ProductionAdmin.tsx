import { useState, useMemo } from "react";
import { mockPrintJobs, mockCustomerOrders, type PrintJob, type CustomerOrder } from "../../lib/mockData";
import { Printer, Calendar, Clock, AlertTriangle, CheckCircle2, MoreVertical, X, Package, Edit, Trash2, Plus, Send, MessageSquare, FileText } from "lucide-react";
import { differenceInDays, parseISO, startOfDay } from "date-fns";

type EnrichedPrintJob = PrintJob & {
  order: CustomerOrder;
  statusColor: string;
  statusText: string;
};

export default function ProductionAdmin() {
  const [allPrintJobs, setAllPrintJobs] = useState<PrintJob[]>(mockPrintJobs);
  const [filter, setFilter] = useState<"all" | "pending" | "printing">("all");
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  const jobs: EnrichedPrintJob[] = useMemo(() => {
    const today = startOfDay(new Date("2026-08-12")); // Using the current mock system date

    return allPrintJobs.map(job => {
      const order = mockCustomerOrders.find(o => o.id === job.orderId)!;
      const dueDate = parseISO(job.dueDate);
      const daysUntilDue = differenceInDays(dueDate, today);

      let statusColor = "bg-green-500/10 text-green-500 border-green-500/20";
      let statusText = "A tiempo";

      if (daysUntilDue < 0) {
        statusColor = "bg-red-500/10 text-red-500 border-red-500/20";
        statusText = "Atrasado";
      } else if (daysUntilDue <= 2) {
        statusColor = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        statusText = "Próximo";
      }

      // Override if already completed
      if (job.status === "Completado") {
        statusColor = "bg-slate-500/10 text-slate-500 border-slate-500/20";
        statusText = "Completado";
      }

      return {
        ...job,
        order,
        statusColor,
        statusText
      };
    });
  }, []);

  const filteredJobs = jobs.filter(job => {
    if (filter === "all") return true;
    if (filter === "pending") return job.status === "Pendiente";
    if (filter === "printing") return job.status === "Imprimiendo";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cola de Impresión</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestiona las piezas pendientes de imprimir para los pedidos de clientes.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Pendientes</h3>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Printer size={16} />
            </div>
          </div>
          <p className="text-3xl font-light">{jobs.filter(j => j.status === 'Pendiente').length}</p>
        </div>
        
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">En Impresión</h3>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-3xl font-light">{jobs.filter(j => j.status === 'Imprimiendo').length}</p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Atrasados</h3>
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-3xl font-light text-red-500">
            {jobs.filter(j => j.statusText === 'Atrasado' && j.status !== 'Completado').length}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Completados Hoy</h3>
            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-3xl font-light">{jobs.filter(j => j.status === 'Completado').length}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="font-medium">Lista de Piezas</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === "pending" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilter("printing")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${filter === "printing" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              Imprimiendo
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
              <tr>
                <th className="px-6 py-4 font-medium">Pieza / Producto</th>
                <th className="px-6 py-4 font-medium">Pedido Cliente</th>
                <th className="px-6 py-4 font-medium">Fecha Entrada</th>
                <th className="px-6 py-4 font-medium">Fecha Entrega (Due Date)</th>
                <th className="px-6 py-4 font-medium">Estado Trabajo</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {job.productName}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{job.order.customerName}</span>
                      <span className="text-xs text-muted-foreground">ID: {job.orderId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {job.order.entryDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className={job.statusText === 'Atrasado' ? 'text-red-500' : 'text-muted-foreground'} />
                      <span className="font-medium">{job.dueDate}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${job.statusColor}`}>
                        {job.statusText}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                      job.status === 'Pendiente' ? 'bg-secondary text-secondary-foreground' : 
                      job.status === 'Imprimiendo' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                      'bg-green-500/10 text-green-500 border border-green-500/20'
                    }`}>
                      {job.status === 'Imprimiendo' && <Clock size={12} />}
                      {job.status === 'Pendiente' && <Printer size={12} />}
                      {job.status === 'Completado' && <CheckCircle2 size={12} />}
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(job.order)}
                      className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
                      title="Ver detalles del pedido"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredJobs.length === 0 && (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Printer size={32} className="mb-3 opacity-20" />
              <p>No hay trabajos de impresión en esta categoría.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles del Pedido */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          printJobs={allPrintJobs}
          setPrintJobs={setAllPrintJobs}
        />
      )}
    </div>
  );
}

// Subcomponente para el Modal
function OrderDetailsModal({ 
  order, 
  onClose,
  printJobs,
  setPrintJobs
}: { 
  order: CustomerOrder, 
  onClose: () => void,
  printJobs: PrintJob[],
  setPrintJobs: React.Dispatch<React.SetStateAction<PrintJob[]>>
}) {
  const [activeTab, setActiveTab] = useState<"resumen" | "editar" | "comentarios">("resumen");
  const [comments, setComments] = useState<{id: string, text: string, date: string, author: string}[]>([
    { id: '1', text: 'Pedido recibido correctamente. En espera de entrar a producción.', date: '2026-08-10 10:30', author: 'Sistema' }
  ]);
  const [newComment, setNewComment] = useState("");
  
  // State for new piece form
  const [newPieceName, setNewPieceName] = useState("");
  const [newPieceHours, setNewPieceHours] = useState("");

  // State for editing an existing piece
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editPieceName, setEditPieceName] = useState("");
  const [editPieceHours, setEditPieceHours] = useState("");
  const [editPieceStatus, setEditPieceStatus] = useState<"Pendiente" | "Imprimiendo" | "Completado">("Pendiente");

  const orderJobs = printJobs.filter(j => j.orderId === order.id);
  const pendingJobs = orderJobs.filter(j => j.status !== 'Completado');
  const completedJobs = orderJobs.filter(j => j.status === 'Completado');
  
  const estimatedHoursLeft = pendingJobs.reduce((acc, job) => acc + (job.estimatedHours || 0), 0);

  const handleDelete = (jobId: string) => {
    setPrintJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const handleAddPiece = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPieceName.trim() || !newPieceHours) return;
    
    const newJob: PrintJob = {
      id: `pj${Date.now()}`,
      orderId: order.id,
      productName: newPieceName,
      dueDate: order.entryDate, // Just a default
      status: 'Pendiente',
      estimatedHours: parseFloat(newPieceHours)
    };
    
    setPrintJobs(prev => [...prev, newJob]);
    setNewPieceName("");
    setNewPieceHours("");
  };

  const handleStartEdit = (job: PrintJob) => {
    setEditingJobId(job.id);
    setEditPieceName(job.productName);
    setEditPieceHours(job.estimatedHours?.toString() || "");
    setEditPieceStatus(job.status);
  };

  const handleSaveEdit = (jobId: string) => {
    setPrintJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            productName: editPieceName, 
            estimatedHours: parseFloat(editPieceHours) || 0,
            status: editPieceStatus
          } 
        : job
    ));
    setEditingJobId(null);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    setComments(prev => [...prev, {
      id: Date.now().toString(),
      text: newComment,
      date: dateStr,
      author: 'Admin'
    }]);
    setNewComment("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-lg border border-border flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Package className="text-primary" />
              Pedido: {order.customerName}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">ID: {order.id} • Fecha: {order.entryDate}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
            <X size={20} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-border px-6 mt-2">
          <button 
            onClick={() => setActiveTab("resumen")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "resumen" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <FileText size={16} /> Resumen
          </button>
          <button 
            onClick={() => setActiveTab("editar")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "editar" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <Edit size={16} /> Editar Pedido
          </button>
          <button 
            onClick={() => setActiveTab("comentarios")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "comentarios" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            <MessageSquare size={16} /> Mensajes
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "resumen" && (
            <>
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/20">
                <div>
                  <p className="text-sm font-medium text-primary mb-1">Tiempo Restante Estimado</p>
                  <p className="text-2xl font-light text-primary">{estimatedHoursLeft} horas</p>
                </div>
                <Clock size={32} className="text-primary opacity-50" />
              </div>

              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-yellow-500" />
                  Piezas Pendientes o En Producción ({pendingJobs.length})
                </h3>
                {pendingJobs.length > 0 ? (
                  <div className="space-y-2">
                    {pendingJobs.map(job => (
                      <div key={job.id} className="p-3 border border-border rounded-lg flex justify-between items-center bg-secondary/20">
                        <div>
                          <p className="font-medium">{job.productName}</p>
                          <p className="text-xs text-muted-foreground">Vence: {job.dueDate}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{job.estimatedHours}h</span>
                          <p className="text-xs text-muted-foreground">{job.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No hay piezas pendientes.</p>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  Piezas Completadas ({completedJobs.length})
                </h3>
                {completedJobs.length > 0 ? (
                  <div className="space-y-2">
                    {completedJobs.map(job => (
                      <div key={job.id} className="p-3 border border-border rounded-lg flex justify-between items-center bg-green-500/5">
                        <p className="font-medium text-muted-foreground line-through">{job.productName}</p>
                        <span className="text-xs font-bold text-green-500 uppercase">Completado</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No hay piezas completadas aún.</p>
                )}
              </div>
            </>
          )}

          {activeTab === "editar" && (
            <div className="space-y-6">
              <div className="bg-secondary/20 p-4 rounded-xl border border-border">
                <h3 className="font-medium mb-3 flex items-center gap-2"><Plus size={16}/> Añadir Nueva Pieza</h3>
                <form onSubmit={handleAddPiece} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Nombre del producto/pieza" 
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"
                    value={newPieceName}
                    onChange={(e) => setNewPieceName(e.target.value)}
                  />
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Horas est." 
                    className="w-24 bg-background border border-border rounded-lg px-3 py-2 text-sm"
                    value={newPieceHours}
                    onChange={(e) => setNewPieceHours(e.target.value)}
                  />
                  <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Añadir
                  </button>
                </form>
              </div>

              <div>
                <h3 className="font-medium mb-3">Piezas del Pedido</h3>
                <div className="space-y-2">
                  {orderJobs.map(job => (
                    <div key={job.id} className="p-3 border border-border rounded-lg bg-card">
                      {editingJobId === job.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input 
                              type="text" 
                              className="col-span-1 sm:col-span-3 bg-background border border-border rounded-lg px-3 py-2 text-sm"
                              value={editPieceName}
                              onChange={(e) => setEditPieceName(e.target.value)}
                              placeholder="Nombre de la pieza"
                            />
                            <input 
                              type="number" 
                              step="0.1"
                              className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
                              value={editPieceHours}
                              onChange={(e) => setEditPieceHours(e.target.value)}
                              placeholder="Horas"
                            />
                            <select 
                              className="col-span-1 sm:col-span-2 bg-background border border-border rounded-lg px-3 py-2 text-sm"
                              value={editPieceStatus}
                              onChange={(e) => setEditPieceStatus(e.target.value as any)}
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="Imprimiendo">Imprimiendo</option>
                              <option value="Completado">Completado</option>
                            </select>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => setEditingJobId(null)}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-secondary transition-colors"
                            >
                              Cancelar
                            </button>
                            <button 
                              onClick={() => handleSaveEdit(job.id)}
                              className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              Guardar Cambios
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{job.productName}</p>
                            <p className="text-xs text-muted-foreground">{job.status} • {job.estimatedHours}h</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleStartEdit(job)}
                              className="p-1.5 text-muted-foreground hover:bg-secondary rounded-md transition-colors" 
                              title="Editar"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => handleDelete(job.id)}
                              className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-colors" 
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "comentarios" && (
            <div className="space-y-4 flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto space-y-4 p-2">
                {comments.map(comment => (
                  <div key={comment.id} className={`p-3 rounded-xl max-w-[85%] ${comment.author === 'Admin' ? 'bg-primary/10 border border-primary/20 ml-auto' : 'bg-secondary border border-border'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-xs">{comment.author}</span>
                      <span className="text-[10px] text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendComment} className="flex gap-2 mt-auto pt-4 border-t border-border">
                <input 
                  type="text" 
                  placeholder="Escribe un mensaje al cliente (ej. retraso, cancelación)..." 
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" className="bg-primary text-primary-foreground p-2 px-4 rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
