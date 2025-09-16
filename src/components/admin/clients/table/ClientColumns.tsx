import { IClient } from "@/types/client";
import { ColumnDef } from "@tanstack/react-table";
import { ClientActions } from "./ClientActions";
import { SortButton } from "../../table/SortButton";

export const clientColumns: ColumnDef<IClient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortButton
        label="Nombre"
        isSorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: "DocumentNumber",
    header: "Documento",
    cell: ({ row }) => <span>{row.original.documentNumber}</span>,
  },
  {
    accessorKey: "taxCondition",
    header: ({ column }) => (
      <SortButton
        label="Condición Fiscal"
        isSorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.taxCondition}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
    cell: ({ row }) => (
      <span>
        {row.original.phone || "No especificado"}
      </span>
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
    cell: ({ row }) => <ClientActions client={row.original} />,
  },
];
