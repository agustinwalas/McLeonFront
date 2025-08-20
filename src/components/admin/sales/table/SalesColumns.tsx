// src/components/admin/sales/table/SalesColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import {
  ISalePopulated,
  PaymentMethod,
  DeliveryType,
} from "@/types/sale";
import { SaleActions } from "./SaleActions";

const getPaymentMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CASH:
      return "Efectivo";
    case PaymentMethod.CREDIT_CARD:
      return "Tarjeta de Crédito";
    case PaymentMethod.DEBIT_CARD:
      return "Tarjeta de Débito";
    case PaymentMethod.BANK_TRANSFER:
      return "Transferencia";
    case PaymentMethod.CHECK:
      return "Cheque";
    case PaymentMethod.MERCADO_PAGO:
      return "Mercado Pago";
    case PaymentMethod.MULTIPLE:
      return "Múltiple";
    default:
      return method;
  }
};

const getDeliveryTypeLabel = (type: DeliveryType) => {
  switch (type) {
    case DeliveryType.PICKUP:
      return "Retiro Local";
    case DeliveryType.DELIVERY:
      return "Envío";
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
      return <div>{client.name}</div>;
    },
  },
  {
    accessorKey: "client.cuit",
    header: "Cuit",
    cell: ({ row }) => {
      const client = row.original.client;
      return <div>{client.cuit}</div>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      return (
        <div>
          ${amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de Pago",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as PaymentMethod;
      return <div>{getPaymentMethodLabel(method)}</div>;
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
    accessorKey: "saleDate",
    header: "Fecha de Venta",
    cell: ({ row }) => {
      const date = new Date(row.getValue("saleDate"));
      return (
        <div>
          <div>{date.toLocaleDateString("es-AR")}</div>
          <div>
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
      return <div>{user.name}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <SaleActions sale={row.original} />,
  },
];
