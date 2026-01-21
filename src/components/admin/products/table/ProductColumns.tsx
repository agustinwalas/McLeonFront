import { IProductPopulated } from "@/types";
import { UnitOfMeasure } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { ProductActions } from "./ProductActions";
import { getUnitOfMeasureShort } from "@/utils/unitOfMeasure";
import { SortButton } from "../../table/SortButton";
import { CategoryFilterButton } from "../../table/CategoryFilterButton";
import { useCategoryStore } from "@/store/useCategory";

export const useProductColumns = (
  categoryFilter: string | null,
  setCategoryFilter: (id: string | null) => void,
  onStockClick: (product: IProductPopulated) => void
): ColumnDef<IProductPopulated>[] => {
  const { categories } = useCategoryStore();
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortButton
          label="Nombre"
          isSorted={column.getIsSorted()}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      cell: ({ row }) => <div className="font-medium min-w-[150px]">{row.original.name}</div>,
    },
    {
      accessorKey: "productCode",
      header: ({ column }) => (
        <SortButton
          label="Código"
          isSorted={column.getIsSorted()}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      cell: ({ row }) => <span>{row.original.productCode}</span>,
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as string;
        const b = rowB.getValue(columnId) as string;
        
        // Ordenamiento numérico natural - maneja casos como BUS1, BUS2, ..., BUS9, BUS10
        return a.localeCompare(b, undefined, { 
          numeric: true, 
          sensitivity: 'base' 
        });
      },
    },
    {
      accessorKey: "category",
      header: () => (
        <CategoryFilterButton
          categories={categories}
          value={categoryFilter}
          onChange={setCategoryFilter}
        />
      ),
      accessorFn: (row) => {
        const category = row.category;
        if (!category) return "Sin categoría";
        if (typeof category === "string") return "Sin categoría";
        if (
          category._id &&
          typeof category._id === "object" &&
          (category._id as any).name
        ) {
          return (category._id as any).name;
        }
        if (category.name && category.name !== "Categoría no encontrada") {
          return category.name;
        }
        return "Sin categoría";
      },
      cell: ({ row }) => {
        const category = row.original.category;
        if (!category) {
          return <span className="text-gray-500 italic">Sin categoría</span>;
        }
        if (typeof category === "string") {
          return <span className="text-gray-500 italic">Sin categoría</span>;
        }
        if (
          category._id &&
          typeof category._id === "object" &&
          (category._id as any).name
        ) {
          return <span>{(category._id as any).name}</span>;
        }
        if (category.name && category.name !== "Categoría no encontrada") {
          return <span>{category.name}</span>;
        }
        return <span className="text-gray-500 italic">Sin categoría</span>;
      },
    },
    {
      accessorKey: "purchaseCost",
      header: "Costo",
      cell: ({ row }) => <span>${(row.original.purchaseCost ?? 0).toFixed(2)}</span>,
    },
    {
      accessorKey: "wholesalePrice",
      header: "Mayorista",
      cell: ({ row }) => <span>${(row.original.wholesalePrice ?? 0).toFixed(2)}</span>,
    },
    {
      accessorKey: "retailPrice",
      header: "Minorista",
      cell: ({ row }) => <span>${(row.original.retailPrice ?? 0).toFixed(2)}</span>,
    },
    {
      accessorKey: "currentStock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.original.currentStock;
        const minStock = row.original.minimumStock;
        const unit = row.original.unitOfMeasure || UnitOfMeasure.UNIDAD;
        const isLowStock = stock <= minStock;

        return (
          <div 
            onClick={() => onStockClick(row.original)}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
            title="Click para editar stock"
          >
            <span>
              {stock} {getUnitOfMeasureShort(unit)}{" "}
            </span>
            {isLowStock && (
              <span className="text-red-500 text-sm block"> ¡Bajo!</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => <ProductActions product={row.original} />,
    },
  ];
};
