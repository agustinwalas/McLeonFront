import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";

import { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSearchBar from "./TableSearchBar";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

type AdminTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
};

export function DefaultTable<TData>({ columns, data }: AdminTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  console.log(data);

  useEffect(() => {
    localStorage.setItem("table-sorting", JSON.stringify(sorting));
  }, [sorting]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
  });

  // Agrego estilos para ocultar columnas con la clase no-print al imprimir
  const printStyle = `
    <style>
      @media print {
        .no-print { display: none !important; }
      }
    </style>
  `;

  // Función para imprimir solo la tabla visible
  const handlePrint = () => {
    const printContent = document.getElementById("print-table");
    if (!printContent) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Imprimir tabla</title>
          <style>
            body { font-family: sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            th { background: #f3f3f3; }
          </style>
          ${printStyle}
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 no-print">
        <TableSearchBar
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <Button
          size="icon"
          variant="outline"
          onClick={handlePrint}
          title="Imprimir tabla"
          className="ml-2 no-print"
        >
          <Printer size={18} />
        </Button>
      </div>
      <div
        className="rounded-md border border-gray-200 overflow-hidden shadow-sm mt-4"
        id="print-table"
      >
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`text-left px-4 py-2 text-sm font-medium text-gray-700${
                      header.column.id === "actions" ? " no-print" : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50 even:bg-gray-100 odd:bg-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`px-4 py-2 text-sm text-gray-800${
                        cell.column.id === "actions" ? " no-print" : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
