import { IClient } from "@/types/client";
import { ColumnDef } from "@tanstack/react-table";
import { ClientActions } from "./ClientActions";

export const clientColumns: ColumnDef<IClient>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: "cuit",
    header: "CUIT",
    cell: ({ row }) => <span>{row.original.cuit}</span>,
  },
  {
    accessorKey: "taxCondition",
    header: "Condición Fiscal",
    cell: ({ row }) => (
      <div>
        {row.original.taxCondition}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Dirección",
    cell: ({ row }) => (
      <span>
        {row.original.address}
      </span>
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
