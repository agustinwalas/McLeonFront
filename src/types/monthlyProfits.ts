// Tipos para ganancias mensuales

export interface MonthlyProfit {
  year: number;
  month: number;
  totalBaseCost: number;
  totalSaleAmount: number;
  totalProfit: number;
  salesCount: number;
  daysWithSales: number;
  supplierInvoicesTotal: number;
  expensesTotal: number;
  netProfit: number;
}

export interface MonthlyProfitsApiResponse {
  success: boolean;
  data: MonthlyProfit[];
  message?: string;
  error?: string;
}
