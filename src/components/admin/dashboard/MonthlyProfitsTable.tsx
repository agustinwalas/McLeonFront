// src/components/admin/dashboard/MonthlyProfitsTable.tsx

import { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { DefaultTable } from "../table/DefaultTable";
import useMonthlyProfits from "@/store/useMonthlyProfits";
import { MonthlyProfit } from "@/types/monthlyProfits";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const columns: ColumnDef<MonthlyProfit, unknown>[] = [
  {
    accessorKey: "period",
    header: "Mes",
    accessorFn: (row) => `${MONTH_NAMES[row.month - 1]} ${row.year}`,
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "totalBaseCost",
    header: "Productos Base",
    cell: ({ row }) => (
      <span className="text-gray-700">
        {formatCurrency(row.original.totalBaseCost)}
      </span>
    ),
  },
  {
    accessorKey: "totalSaleAmount",
    header: "Productos Venta",
    cell: ({ row }) => (
      <span className="text-blue-700 font-medium">
        {formatCurrency(row.original.totalSaleAmount)}
      </span>
    ),
  },
  {
    accessorKey: "totalProfit",
    header: "Total Ganancias",
    cell: ({ row }) => {
      const profit = row.original.totalProfit;
      return (
        <span
          className={`font-bold ${
            profit >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatCurrency(profit)}
        </span>
      );
    },
  },
  {
    accessorKey: "salesCount",
    header: "Ventas",
    cell: ({ row }) => (
      <span className="text-gray-600">{row.original.salesCount}</span>
    ),
  },
];

export function MonthlyProfitsTable() {
  const navigate = useNavigate();
  const { monthlyProfits, isLoading, fetchMonthlyProfits } =
    useMonthlyProfits();

  useEffect(() => {
    fetchMonthlyProfits();
  }, [fetchMonthlyProfits]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/admin/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Ganancias Mensuales
            </h1>
            <p className="text-gray-600 mt-1">
              Resumen de ganancias agrupadas por mes
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchMonthlyProfits()}
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>Actualizar</span>
        </Button>
      </div>

      {/* Totales generales */}
      {monthlyProfits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Total Costo Base</p>
            <p className="text-2xl font-bold text-gray-700">
              {formatCurrency(
                monthlyProfits.reduce((sum, m) => sum + m.totalBaseCost, 0)
              )}
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Total Ventas</p>
            <p className="text-2xl font-bold text-blue-700">
              {formatCurrency(
                monthlyProfits.reduce((sum, m) => sum + m.totalSaleAmount, 0)
              )}
            </p>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">Total Ganancias</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(
                monthlyProfits.reduce((sum, m) => sum + m.totalProfit, 0)
              )}
            </p>
          </div>
        </div>
      )}

      {/* Tabla */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DefaultTable columns={columns} data={monthlyProfits} />
      )}
    </div>
  );
}
