import { DefaultTable } from "../../table/DefaultTable";
import { useEffect, useState, useMemo } from "react";
import { useSupplierInvoiceStore } from "@/store/useSupplierInvoice";
import { useSupplierStore } from "@/store/useSupplier";
import { SupplierInvoicesColumns } from "./SupplierInvoicesColumns";

export const SuppliersInvoicesTable = () => {
  const { 
    invoices, 
    loading, 
    error, 
    fetchInvoices,
    clearError 
  } = useSupplierInvoiceStore();

  const { suppliers, fetchSuppliers } = useSupplierStore();
  const [supplierFilter, setSupplierFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
    fetchSuppliers();
  }, [fetchInvoices, fetchSuppliers]);

  // Filtrar facturas por proveedor
  const filteredInvoices = useMemo(() => {
    if (!supplierFilter) return invoices;
    return invoices.filter(invoice => 
      invoice.supplier && invoice.supplier._id === supplierFilter
    );
  }, [invoices, supplierFilter]);


  // Manejo de estados
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Cargando facturas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex justify-between items-center">
          <span className="text-red-800">Error: {error}</span>
          <button 
            onClick={clearError}
            className="text-red-600 hover:text-red-800 underline"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DefaultTable 
        data={filteredInvoices} 
        columns={SupplierInvoicesColumns(suppliers, supplierFilter, setSupplierFilter)} 
      />
    </>
  );
};
