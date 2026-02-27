// Tipos para ganancias mensuales

export interface MonthlyProfit {
  year: number;
  month: number;
  totalBaseCost: number;     // Productos base (costo de compra)
  totalSaleAmount: number;   // Productos venta (monto vendido)
  totalProfit: number;       // Total ganancias
  salesCount: number;        // Cantidad de ventas
  daysWithSales: number;     // Días con ventas
}

export interface MonthlyProfitsApiResponse {
  success: boolean;
  data: MonthlyProfit[];
  message?: string;
  error?: string;
}
