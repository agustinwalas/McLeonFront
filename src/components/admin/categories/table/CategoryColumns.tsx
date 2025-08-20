import { ICategory } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CategoryActions } from "./CategoryActions";

export const categoryColumns: ColumnDef<ICategory>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: "active",
    header: "Estado",
    cell: ({ row }) => (
      <div>
        {row.original.active ? "Activa" : "Inactiva"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de Creación",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt || "");
      return (
        <span>
          {date.toLocaleDateString("es-AR")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CategoryActions category={row.original} />,
  },
];
