import { NewSupplierForm } from "@/components/admin/suppliers/forms/NewSupplierForm";
import { SuppliersTable } from "@/components/admin/suppliers/table/SuppliersTable";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/store/useSheet";

export const Suppliers = () => {
  const { openSheet, closeSheet } = useSheetStore();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Proveedores</h1>
        <div className="flex gap-2">
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
    </>
  );
};
