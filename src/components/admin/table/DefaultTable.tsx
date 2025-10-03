import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  PaginationState,
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
import { Printer, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type AdminTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
};

export function DefaultTable<TData>({ columns, data }: AdminTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  useEffect(() => {
    localStorage.setItem("table-sorting", JSON.stringify(sorting));
  }, [sorting]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
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

  // Función para imprimir mostrando todos los resultados
  const handlePrint = () => {
    const prevPageSize = table.getState().pagination.pageSize;
    const totalRows = data.length;
    // Si ya está mostrando todos, imprimir directo
    if (prevPageSize === totalRows) {
      doPrint();
      return;
    }
    // Cambiar a mostrar todos
    table.setPageSize(totalRows);
    setTimeout(() => {
      doPrint();
      // Restaurar el valor anterior después de imprimir
      setTimeout(() => {
        table.setPageSize(prevPageSize);
      }, 500);
    }, 100);
  };

  // Lógica de impresión real
  const doPrint = () => {
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
                      className={`px-4 py-2 text-sm text-gray-800 max-w-[200px] break-words${
                        cell.column.id === "actions" ? " no-print" : ""
                      }`}
                      style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
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
                  Sin Resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Controles de paginación */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                const value = e.target.value === 'all' ? data.length : Number(e.target.value);
                table.setPageSize(value);
              }}
              className="h-8 w-[90px] rounded border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="all">Todos</option>
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Números de página */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
              const currentPage = table.getState().pagination.pageIndex;
              const totalPages = table.getPageCount();
              
              let startPage = Math.max(0, currentPage - 2);
              const endPage = Math.min(totalPages - 1, startPage + 4);
              
              if (endPage - startPage < 4) {
                startPage = Math.max(0, endPage - 4);
              }
              
              const pageNumber = startPage + i;
              
              if (pageNumber >= totalPages) return null;
              
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  className="h-8 w-8 p-0"
                  onClick={() => table.setPageIndex(pageNumber)}
                >
                  {pageNumber + 1}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Información de resultados */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Mostrando {table.getFilteredRowModel().rows.length > 0 ? (table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + 1 : 0} a{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          de {table.getFilteredRowModel().rows.length} resultado(s)
          {globalFilter && ` (filtrado de ${data.length} total)`}
        </div>
      </div>
    </div>
  );
}
