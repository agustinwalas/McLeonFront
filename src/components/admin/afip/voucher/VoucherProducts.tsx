import { Control, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Package } from "lucide-react";
import { IVA_ID } from "../constants/afipConstants";

interface VoucherProductsProps {
  control: Control<any>;
  onRecalc: () => void;
}

export function VoucherProducts({ control, onRecalc }: VoucherProductsProps) {
  const { fields, append, remove } = useFieldArray({ 
    control, 
    name: "iva" 
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">🛍️ Productos e IVA</h3>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            append({ Id: 5, BaseImp: 0, Importe: 0 });
            setTimeout(onRecalc, 0);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar producto
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => {
          // ✅ Obtener información del producto si existe
          const productInfo = (field as any).productName ? {
            name: (field as any).productName,
            quantity: (field as any).quantity,
            unitPrice: (field as any).unitPrice,
          } : null;

          return (
            <div 
              key={field.id} 
              className="p-4 border rounded-lg bg-gray-50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-sm">
                      {productInfo ? productInfo.name : `Producto ${index + 1}`}
                    </h4>
                    {productInfo && (
                      <p className="text-xs text-gray-600">
                        Cantidad: {productInfo.quantity} × ${productInfo.unitPrice}
                      </p>
                    )}
                  </div>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      remove(index);
                      setTimeout(onRecalc, 0);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={control}
                  name={`iva.${index}.Id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alícuota IVA</FormLabel>
                      <FormControl>
                        <select
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                            onRecalc();
                          }}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {IVA_ID.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name={`iva.${index}.BaseImp`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Imponible ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="1000.00"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                            onRecalc();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name={`iva.${index}.Importe`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IVA ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="210.00"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                            onRecalc();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ✅ Mostrar información adicional del producto */}
              {productInfo && (
                <div className="mt-3 p-2 bg-blue-50 rounded border border-grey-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="font-medium">Cantidad:</span> {productInfo.quantity}
                    </div>
                    <div>
                      <span className="font-medium">Precio Unit.:</span> ${productInfo.unitPrice}
                    </div>
                    <div>
                      <span className="font-medium">Subtotal:</span> ${(productInfo.quantity * productInfo.unitPrice).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No hay productos agregados</p>
          <p className="text-sm">Agregá al menos un producto para continuar</p>
        </div>
      )}
    </div>
  );
}