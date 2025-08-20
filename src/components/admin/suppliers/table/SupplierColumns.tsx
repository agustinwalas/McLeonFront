import { ISupplier, IProductPopulated } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { SupplierActions } from "./SupplierActions";

export const createSupplierColumns = (products: IProductPopulated[]): ColumnDef<ISupplier>[] => [
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
    accessorKey: "phone",
    header: "Teléfono",
    cell: ({ row }) => (
      <span>{row.original.phone}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span>{row.original.email}</span>
    ),
  },
  {
    accessorKey: "location",
    header: "Ubicación",
    cell: ({ row }) => (
      <span>{row.original.location}</span>
    ),
  },
  {
    accessorKey: "suppliedProducts",
    header: "Productos",
    cell: ({ row }) => {
      // Calcular la cantidad real de productos asociados
      // Ahora associatedSuppliers son objetos, no strings
      const associatedProducts = products.filter(product => 
        product.associatedSuppliers.some(supplier => supplier._id === row.original._id)
      );
      const productCount = associatedProducts.length;
      
      return (
        <span>
          {productCount} producto{productCount !== 1 ? 's' : ''}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <SupplierActions supplier={row.original} />,
  },
];
