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
      return <div className="font-medium">{saleNumber}</div>;
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
    accessorFn: (row) => {
      const dateValue = row.createdAt;
      if (!dateValue) return "";
      
      const date = new Date(dateValue);
      
      // Retornar fecha y hora en formato legible para búsqueda
      const dateStr = date.toLocaleDateString("es-AR");
      const timeStr = date.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      
      return `${dateStr} ${timeStr}`;
    },
    cell: ({ row }) => {
      const dateValue = row.original.createdAt;
      if (!dateValue) return <div>-</div>;
      
      const date = new Date(dateValue);

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
    accessorKey: "afipData.cae",
    header: "Factura AFIP",
    cell: ({ row }) => {
      const sale = row.original;
      const hasAfipInvoice = sale.afipData?.cae;
      
      return (
        <div>
          {hasAfipInvoice ? 'Facturada' : 'Sin facturar'}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <SaleActions sale={row.original} />,
  },
];
