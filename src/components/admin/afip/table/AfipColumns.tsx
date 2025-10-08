import { ISalePopulated } from "@/types/sale";
import { ColumnDef } from "@tanstack/react-table";
import { AfipActions } from "./AfipActions";

const getInvoiceTypeName = (tipo: number) => {
  switch (tipo) {
    case 1:
      return "Factura A";
    case 6:
      return "Factura B";
    case 11:
      return "Factura C";
    default:
      return `Tipo ${tipo}`;
  }
};

export const AfipColumns: ColumnDef<ISalePopulated>[] = [
  {
    accessorKey: "saleNumber",
    header: "N° Venta",
    cell: ({ row }) => <span className="font-medium">{row.original.saleNumber}</span>,
  },
  {
    accessorKey: "afipData.tipoComprobante",
    header: "Tipo Comprobante",
    cell: ({ row }) => (
      <span>
        {getInvoiceTypeName(row.original.afipData?.tipoComprobante || 0)}
      </span>
    ),
  },
  {
    accessorKey: "afipData.numeroComprobante",
    header: "N° Comprobante",
    cell: ({ row }) => {
      const ptoVta = row.original.afipData?.puntoVenta || 0;
      const numero = row.original.afipData?.numeroComprobante || 0;
      return (
        <span className="font-mono">
          {String(ptoVta).padStart(4, "0")}-{String(numero).padStart(8, "0")}
        </span>
      );
    },
  },
  {
    accessorKey: "afipData.cae",
    header: "CAE",
    cell: ({ row }) => (
      <span className="font-mono text-sm break-all">
        {row.original.afipData?.cae}
      </span>
    ),
  },
  {
    accessorKey: "afipData.estado",
    header: "Estado",
    cell: ({ row }) => (
      <span>
        {row.original.afipData?.estado}
      </span>
    ),
  },
  {
    accessorKey: "afipData.importeTotal",
    header: "Importe",
    cell: ({ row }) => (
      <span>
        ${row.original.afipData?.importeTotal?.toFixed(2) || row.original.totalAmount.toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "client.name",
    header: "Cliente",
    cell: ({ row }) => (
      <span>{row.original.client?.name || "Consumidor Final"}</span>
    ),
  },
  {
    accessorKey: "afipData.fechaEmision",
    header: "Fecha Emisión",
    cell: ({ row }) => {
      const fecha = row.original.afipData?.fechaEmision || row.original.createdAt;
      if (!fecha) return <span>-</span>;
      const date = new Date(fecha);
      return (
        <span>
          {date.toLocaleDateString("es-AR")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <AfipActions sale={row.original} />,
  },
];
