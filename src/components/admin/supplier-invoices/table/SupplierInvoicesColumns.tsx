import { ISupplierInvoice, ISupplier } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { SortButton } from "../../table/SortButton";
import { SupplierInvoicesActions } from "./SupplierInvoicesActions";
import { SupplierFilterButton } from "../../table/SupplierFilterButton";

export const SupplierInvoicesColumns = (
  suppliers: ISupplier[] = [],
  supplierFilter: string | null = null,
  onSupplierFilterChange: (supplierId: string | null) => void = () => {}
): ColumnDef<ISupplierInvoice>[] => [
  {
    accessorKey: "supplier.name",
    header: () => (
      <div className="flex items-center gap-2">
        <SupplierFilterButton
          suppliers={suppliers}
          value={supplierFilter}
          onChange={onSupplierFilterChange}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.supplier?.name || "N/A"}</div>
    ),
  },
  {
    accessorKey: "businessName",
    header: ({ column }) => (
      <SortButton
        label="Razón Social"
        isSorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => <span>{row.original.businessName}</span>,
  },
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <SortButton
        label="Número de Factura"
        isSorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.invoiceNumber}</span>
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
      const date = new Date(row.original.date);
      return <span>{date.toLocaleDateString("es-AR")}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <SortButton
        label="Importe"
        isSorted={column.getIsSorted()}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => {
      const amount = row.original.amount;
      return (
        <span className="font-medium">
          $
          {amount.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <SupplierInvoicesActions invoice={row.original} />,
  },
];
