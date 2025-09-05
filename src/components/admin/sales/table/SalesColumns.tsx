// src/components/admin/sales/table/SalesColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { ISalePopulated, DeliveryType } from "@/types/sale";
import { SaleActions } from "./SaleActions";


const getDeliveryTypeLabel = (type: DeliveryType) => {
  switch (type) {
    case DeliveryType.PICKUP:
      return "Retiro Local";
    case DeliveryType.DELIVERY:
      return "Envío Domicilio";
    default:
      return type;
  }
};

export const salesColumns: ColumnDef<ISalePopulated>[] = [
  {
    accessorKey: "saleNumber",
    header: "N° Venta",
    cell: ({ row }) => {
      const saleNumber = row.getValue("saleNumber") as string;
      return <div>{saleNumber}</div>;
    },
  },
  {
    accessorKey: "client.name",
    header: "Cliente",
    cell: ({ row }) => {
      const client = row.original.client;

      if (!client) {
        return <div className="text-gray-500 italic">Sin Cliente</div>;
      }

      return (
        <div>
          {client.name || (
            <span className="text-gray-500 italic">Sin nombre</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      return (
        <div>
          $
          {amount?.toLocaleString("es-AR", { minimumFractionDigits: 2 }) ||
            "0.00"}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de Pago",
    cell: ({ row }) => {
      const paymentMethod = row.original.paymentMethod;
      return <div className="lowercase">{paymentMethod}</div>;
    },
  },
  {
    accessorKey: "deliveryType",
    header: "Tipo de Entrega",
    cell: ({ row }) => {
      const type = row.getValue("deliveryType") as DeliveryType;
      return <div>{getDeliveryTypeLabel(type)}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de Venta",
    cell: ({ row }) => {
      const dateValue = row.getValue("createdAt");
      const date = new Date(dateValue as string);

      return (
        <div>
          <div>{date.toLocaleDateString("es-AR")}</div>
          <div className="text-sm text-gray-600">
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
    accessorKey: "user.name",
    header: "Vendedor",
    cell: ({ row }) => {
      const user = row.original.user;

      // ✅ Manejar usuario borrado o undefined
      if (!user) {
        return <div className="text-gray-500 italic">Usuario eliminado</div>;
      }

      return (
        <div>
          {user.name || user.email || (
            <span className="text-gray-500 italic">Sin nombre</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <SaleActions sale={row.original} />,
  },
];
