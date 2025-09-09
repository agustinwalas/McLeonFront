import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ISupplier } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "./schemas/productSchema";

interface ProductSuppliersProps {
  form: UseFormReturn<ProductFormData>;
  suppliers: ISupplier[];
}

export function ProductSuppliers({ form, suppliers }: ProductSuppliersProps) {
  return (
    <FormField
      control={form.control}
      name="associatedSuppliers"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Proveedores Asociados</FormLabel>
          <FormControl>
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50">
              {suppliers.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {suppliers.map((supplier: ISupplier) => {
                    const isChecked = (field.value || []).includes(supplier._id);
                    return (
                      <label
                        key={supplier._id}
                        className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const currentSuppliers = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...currentSuppliers, supplier._id]);
                            } else {
                              field.onChange(
                                currentSuppliers.filter((id) => id !== supplier._id)
                              );
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700 flex-1">
                          {supplier.name}
                        </span>
                        {isChecked && (
                          <span className="text-xs text-blue-600 font-medium">✓</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No hay proveedores disponibles</p>
                  <p className="text-gray-400 text-xs mt-1">Crear proveedores primero</p>
                </div>
              )}
            </div>
          </FormControl>
          <div className="text-xs text-gray-500 mt-1">
            ✅ Seleccionados: {(field.value || []).length} proveedor(es)
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
