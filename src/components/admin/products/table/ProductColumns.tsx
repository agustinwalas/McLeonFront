import { IProductPopulated } from "@/types";
import { UnitOfMeasure } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { ProductActions } from "./ProductActions";
import { getUnitOfMeasureShort } from "@/utils/unitOfMeasure";

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
    cell: ({ row }) => {
      const category = row.original.category;
      
      // ✅ Si no hay categoría
      if (!category) {
        return <span className="text-gray-500 italic">Sin categoría</span>;
      }
      
      // ✅ Si category es string (ID sin poblar)
      if (typeof category === 'string') {
        return <span className="text-gray-500 italic">Sin categoría</span>;
      }
      
      // ✅ Manejar estructura anidada extraña donde _id contiene el objeto real
      if (category._id && typeof category._id === 'object' && (category._id as any).name) {
        return (
          <span>
            {(category._id as any).name}
          </span>
        );
      }
      
      // ✅ Estructura normal de categoría
      if (category.name && category.name !== "Categoría no encontrada") {
        return (
          <span>
            {category.name}
          </span>
        );
      }
      
      // ✅ Fallback para cualquier otro caso
      return <span className="text-gray-500 italic">Sin categoría</span>;
    },
  },
  {
    accessorKey: "purchaseCost",
    header: "Precio Costo",
    cell: ({ row }) => (
      <span>
        ${row.original.purchaseCost.toFixed(2)}
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
      const unit = row.original.unitOfMeasure || UnitOfMeasure.UNIDAD; 
      const isLowStock = stock <= minStock;

      return (
        <div>
          <span>
            {stock} {getUnitOfMeasureShort(unit)} {/* ✅ Mostrar stock con unidad abreviada */}
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
