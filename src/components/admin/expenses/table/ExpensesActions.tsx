import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useSheetStore } from "@/store/useSheet";
import { useDialogStore } from "@/store/useDialog";
import { useExpenseStore } from "@/store/useExpense";
import { IExpense } from "@/types/expense";
import { EditExpenseForm } from "../forms/EditExpenseForm";

export const ExpensesActions = ({ expense }: { expense: IExpense }) => {
  const { openSheet } = useSheetStore();
  const { openDialog, closeDialog } = useDialogStore();
  const { deleteExpense } = useExpenseStore();

  const handleEdit = () => {
    openSheet(
      "Editar gasto",
      "Modificá los campos del gasto",
      <EditExpenseForm expense={expense} onSuccess={closeDialog} />
    );
  };

  const handleDelete = () => {
    openDialog({
      title: "Eliminar gasto",
      description: `¿Estás seguro de que querés eliminar el gasto "${expense.title}"? Esta acción no se puede deshacer.`,
      content: (
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={closeDialog}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await deleteExpense(expense._id);
              closeDialog();
            }}
          >
            Eliminar
          </Button>
        </div>
      ),
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        className="h-8 w-8 p-0"
        title="Editar gasto"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="h-8 w-8 p-0"
        title="Eliminar gasto"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
