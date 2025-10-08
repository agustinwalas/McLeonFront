import { Control, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Package } from "lucide-react";

interface VoucherProductsProps {
  control: Control<any>;
  onRecalc: () => void;
  setValue?: any; // Usar any para evitar conflictos de tipos con react-hook-form
}

export function VoucherProducts({ control, onRecalc, setValue }: VoucherProductsProps) {
  // ✅ Constante de IVA (21%)
  const IVA_RATE = 0.21;

  // ✅ Función para calcular IVA a partir de la base
  // Ejemplo: Base $1000 -> IVA $210
  const calculateIvaFromBase = (base: number): number => {
    if (isNaN(base) || base < 0) return 0;
    return parseFloat((base * IVA_RATE).toFixed(2));
  };

  // ✅ Función para calcular base a partir del IVA
  // Ejemplo: IVA $210 -> Base $1000
  const calculateBaseFromIva = (iva: number): number => {
    if (isNaN(iva) || iva < 0) return 0;
    return parseFloat((iva / IVA_RATE).toFixed(2));
  };
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
            append({ Id: 5, BaseImp: 0, Importe: 0, productName: "" });
            setTimeout(onRecalc, 0);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar producto
        </Button>
      </div>

      <div className="space-y-2">
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
              className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 flex-wrap"
            >
              {/* Campo oculto para alícuota IVA fija en 21% */}
              <FormField
                control={control}
                name={`iva.${index}.Id`}
                render={({ field }) => (
                  <input 
                    type="hidden" 
                    {...field}
                    value={5} // Siempre 21% para repostería
                  />
                )}
              />

              {/* Título del producto */}
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Package className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <FormField
                    control={control}
                    name={`iva.${index}.productName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={`Ingrese nombre del producto`}
                            value={field.value || ""}
                            onChange={field.onChange}
                            className="text-sm font-medium border-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {productInfo && (
                    <p className="text-xs text-gray-600 truncate">
                      {productInfo.quantity} × ${productInfo.unitPrice}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Base Imponible */}
              <div className="flex items-center gap-2 min-w-[120px]">
                <span className="text-xs text-gray-600 whitespace-nowrap">Base:</span>
                <FormField
                  control={control}
                  name={`iva.${index}.BaseImp`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={field.value}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const baseValue = inputValue === '' ? 0 : parseFloat(inputValue) || 0;
                            
                            // Actualizar el campo base
                            field.onChange(baseValue);
                            
                            // ✅ Calcular automáticamente el IVA
                            const calculatedIva = calculateIvaFromBase(baseValue);
                            if (setValue) {
                              setValue(`iva.${index}.Importe`, calculatedIva);
                            }
                            
                            // Recalcular totales
                            setTimeout(onRecalc, 50);
                          }}
                          className="text-sm w-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* IVA 21% */}
              <div className="flex items-center gap-2 min-w-[120px]">
                <span className="text-xs text-gray-600 whitespace-nowrap">IVA:</span>
                <FormField
                  control={control}
                  name={`iva.${index}.Importe`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={field.value}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const ivaValue = inputValue === '' ? 0 : parseFloat(inputValue) || 0;
                            
                            // Actualizar el campo IVA
                            field.onChange(ivaValue);
                            
                            // ✅ Calcular automáticamente la Base
                            const calculatedBase = calculateBaseFromIva(ivaValue);
                            if (setValue) {
                              setValue(`iva.${index}.BaseImp`, calculatedBase);
                            }
                            
                            // Recalcular totales
                            setTimeout(onRecalc, 50);
                          }}
                          className="text-sm w-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Botón eliminar */}
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    remove(index);
                    setTimeout(onRecalc, 0);
                  }}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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