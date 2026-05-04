import { ColumnDef } from "@tanstack/react-table";
import { IExpense } from "@/types/expense";
import { SortButton } from "../../table/SortButton";
import { ExpensesActions } from "./ExpensesActions";

export const ExpensesColumns: ColumnDef<IExpense>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <SortButton
        label="Título"
        isSorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <SortButton
        label="Fecha"
        isSorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => {
      const d = new Date(row.original.date);
      const day = d.getUTCDate().toString().padStart(2, "0");
      const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
      const year = d.getUTCFullYear();
      return <span>{`${day}/${month}/${year}`}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <SortButton
        label="Gasto"
        isSorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-red-600">
        $
        {row.original.amount.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <ExpensesActions expense={row.original} />,
  },
];
