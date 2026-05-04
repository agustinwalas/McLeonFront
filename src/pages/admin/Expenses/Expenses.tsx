import { ExpenseForm } from "@/components/admin/expenses/forms/ExpenseForm";
import { ExpensesTable } from "@/components/admin/expenses/table/ExpensesTable";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/store/useSheet";

export const Expenses = () => {
  const { openSheet, closeSheet } = useSheetStore();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Gastos</h1>
        <Button
          onClick={() =>
            openSheet(
              "Agregar gasto",
              "Completá los campos para registrar un nuevo gasto",
              <ExpenseForm onSuccess={closeSheet} />
            )
          }
        >
          Agregar
        </Button>
      </div>
      <ExpensesTable />
    </>
  );
};
