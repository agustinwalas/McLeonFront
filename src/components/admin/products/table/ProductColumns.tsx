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
  setCategoryFilter: (id: string | null) => void
): ColumnDef<IProductPopulated>[] => {
  const { categories } = useCategoryStore();
  return [
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
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortButton
          label="Nombre"
          isSorted={column.getIsSorted()}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
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
      cell: ({ row }) => <span>${row.original.purchaseCost.toFixed(2)}</span>,
    },
    {
      accessorKey: "wholesalePrice",
      header: "Mayorista",
      cell: ({ row }) => <span>${row.original.wholesalePrice.toFixed(2)}</span>,
    },
    {
      accessorKey: "retailPrice",
      header: "Minorista",
      cell: ({ row }) => <span>${row.original.retailPrice.toFixed(2)}</span>,
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
          <div>
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
      accessorKey: "activeInShopify",
      header: ({ column }) => (
        <SortButton
          label="Shopify"
          isSorted={column.getIsSorted()}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      ),
      cell: ({ row }) => (
        <span>{row.original.activeInShopify ? "Activo" : "Inactivo"}</span>
      ),
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      cell: ({ row }) => <ProductActions product={row.original} />,
    },
  ];
};
