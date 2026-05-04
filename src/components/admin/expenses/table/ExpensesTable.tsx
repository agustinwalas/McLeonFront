import { useEffect } from "react";
import { DefaultTable } from "../../table/DefaultTable";
import { useExpenseStore } from "@/store/useExpense";
import { ExpensesColumns } from "./ExpensesColumns";

export const ExpensesTable = () => {
  const { expenses, loading, error, fetchExpenses, clearError } = useExpenseStore();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Cargando gastos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex justify-between items-center">
          <span className="text-red-800">Error: {error}</span>
          <button onClick={clearError} className="text-red-600 hover:text-red-800 underline">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return <DefaultTable data={expenses} columns={ExpensesColumns} />;
};
