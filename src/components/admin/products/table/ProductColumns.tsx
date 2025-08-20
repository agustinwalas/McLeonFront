import { IProductPopulated } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ProductActions } from "./ProductActions";

export const productColumns: ColumnDef<IProductPopulated>[] = [
  {
    accessorKey: "productCode",
    header: "Código",
    cell: ({ row }) => (
      <span>{row.original.productCode}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <div>
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }) => (
      <span>
        {typeof row.original.category === 'object' ? row.original.category.name : row.original.category}
      </span>
    ),
  },
  {
    accessorKey: "wholesalePrice",
    header: "Precio Mayorista",
    cell: ({ row }) => (
      <span>
        ${row.original.wholesalePrice.toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "retailPrice",
    header: "Precio Minorista",
    cell: ({ row }) => (
      <span>
        ${row.original.retailPrice.toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "currentStock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original.currentStock;
      const minStock = row.original.minimumStock;
      const isLowStock = stock <= minStock;

      return (
        <span>
          {stock}
          {isLowStock && (
            <span> (¡Bajo!)</span>
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    cell: ({ row }) => <ProductActions product={row.original} />,
  },
];
