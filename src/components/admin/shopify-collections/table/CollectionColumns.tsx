// src/components/admin/shopify-collections/table/CollectionColumns.tsx
import { IShopifyCollection } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CollectionActions } from "./CollectionActions";

const getTypeText = (type: string) => {
  const typeConfig = {
    "category-based": "Categoría",
    manual: "Categoría",
    featured: "Destacados",
    seasonal: "Temporada",
  };

  return typeConfig[type as keyof typeof typeConfig] || type;
};

export const collectionColumns: ColumnDef<IShopifyCollection>[] = [
  {
    accessorKey: "collectionName",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.collectionName}</div>
    ),
  },
  {
    accessorKey: "collectionType",
    header: "Tipo",
    cell: ({ row }) => <span>{getTypeText(row.original.collectionType)}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Fecha Creación",
    cell: ({ row }) => {
      if (!row.original.createdAt) {
        return <span className="text-gray-500 italic">-</span>;
      }
      const date = new Date(row.original.createdAt);
      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString("es-AR")}</div>
          <div className="text-gray-500">
            {date.toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "shopifyCollectionId",
    header: "ID Shopify",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.shopifyCollectionId ? (
          <span className="font-mono">{row.original.shopifyCollectionId}</span>
        ) : (
          <span className="text-gray-500 italic">-</span>
        )}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CollectionActions collection={row.original} />,
  },
];
