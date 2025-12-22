import { useRef } from "react";
import { NewSupplierForm } from "@/components/admin/suppliers/forms/NewSupplierForm";
import { SuppliersTable } from "@/components/admin/suppliers/table/SuppliersTable";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/store/useSheet";
import { useSupplierStore } from "@/store/useSupplier";
import { useProductStore } from "@/store/useProduct";
import { PrintProductsBySupplier, PrintProductsBySupplierRef } from "@/components/admin/suppliers/PrintProductsBySupplier";
import { Printer } from "lucide-react";

export const Suppliers = () => {
  const { openSheet, closeSheet } = useSheetStore();
  const { suppliers } = useSupplierStore();
  const { products } = useProductStore();
  const printRef = useRef<PrintProductsBySupplierRef>(null);

  const handlePrintProductsBySupplier = () => {
    // Agrupar productos por proveedor
    const productsBySupplier = suppliers.map(supplier => {
      const supplierProducts = products.filter(product => 
        product.associatedSuppliers.some(supplierId => 
          typeof supplierId === 'string' 
            ? supplierId === supplier._id 
            : supplierId._id === supplier._id
        )
      );

      return {
        supplier,
        products: supplierProducts
      };
    }).filter(item => item.products.length > 0); // Solo proveedores con productos

    if (productsBySupplier.length === 0) {
      alert('No hay productos asociados a proveedores para imprimir');
      return;
    }

    if (printRef.current) {
      printRef.current.print();
    }
  };

  // Preparar datos para el componente de impresión
  const printData = suppliers.map(supplier => {
    const supplierProducts = products.filter(product => 
      product.associatedSuppliers.some(supplierId => 
        typeof supplierId === 'string' 
          ? supplierId === supplier._id 
          : supplierId._id === supplier._id
      )
    );

    return {
      supplier,
      products: supplierProducts
    };
  }).filter(item => item.products.length > 0);

  return (
    <>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h1 className="text-xl font-semibold">Proveedores</h1>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={handlePrintProductsBySupplier}
            disabled={suppliers.length === 0 || products.length === 0}
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir Productos por Proveedores
          </Button>
          <Button
            className="btn btn-primary"
            onClick={() =>
              openSheet(
                "Agregar Proveedor",
                "Completá los campos para crear un nuevo proveedor",
                <NewSupplierForm onSuccess={closeSheet} />
              )
            }
          >
            Agregar
          </Button>
        </div>
      </div>
      <SuppliersTable />
      
      {/* Componente de impresión oculto */}
      <PrintProductsBySupplier
        ref={printRef}
        data={printData}
      />
    </>
  );
};
