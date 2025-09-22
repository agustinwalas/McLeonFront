import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupplierStore } from "@/store/useSupplier";
import { ISupplier } from "@/types";
import { toast } from "sonner";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

interface UpdateSupplierPricesProps {
  supplier: ISupplier;
  onSuccess?: () => void;
}

export const UpdateSupplierPrices = ({ 
  supplier, 
  onSuccess 
}: UpdateSupplierPricesProps) => {
  const [percentage, setPercentage] = useState<string>("110");
  const [isLoading, setIsLoading] = useState(false);
  const { updateSupplierProductsPrices } = useSupplierStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numPercentage = parseFloat(percentage);
    
    // Validaciones
    if (isNaN(numPercentage) || numPercentage <= 0) {
      toast.error("El porcentaje debe ser un número válido mayor a 0");
      return;
    }
    
    if (numPercentage < 50 || numPercentage > 200) {
      toast.error("El porcentaje debe estar entre 50% y 200% por seguridad");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await updateSupplierProductsPrices(supplier._id, numPercentage);
      
      const changeType = numPercentage > 100 ? "aumento" : "reducción";
      const changeAmount = Math.abs(numPercentage - 100);
      
      toast.success(
        `✅ ${changeType.toUpperCase()} del ${changeAmount}% aplicado correctamente`,
        {
          description: `${result.productsUpdated} productos actualizados para ${supplier.name}`
        }
      );
      
      onSuccess?.();
    } catch (error) {
      console.error("Error al actualizar precios:", error);
      toast.error("Error al actualizar los precios", {
        description: "Por favor, intentá de nuevo"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const numPercentage = parseFloat(percentage) || 0;
  const isIncrease = numPercentage > 100;
  const changeAmount = Math.abs(numPercentage - 100);

  // Ejemplos de precios
  const examplePrices = {
    cost: 100,
    wholesale: 150,
    retail: 200
  };

  const newPrices = {
    cost: (examplePrices.cost * numPercentage / 100).toFixed(2),
    wholesale: (examplePrices.wholesale * numPercentage / 100).toFixed(2),
    retail: (examplePrices.retail * numPercentage / 100).toFixed(2)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="percentage" className="text-base font-semibold">
            Porcentaje de ajuste
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Ingresá el porcentaje para ajustar todos los precios del proveedor <strong>{supplier.name}</strong>
          </p>
          
          <div className="relative">
            <Input
              id="percentage"
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="110"
              min="50"
              max="200"
              step="0.1"
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
          
          <div className="mt-2 text-sm text-muted-foreground space-y-1">
            <p>• <strong>110</strong> = Aumentar 10%</p>
            <p>• <strong>90</strong> = Reducir 10%</p>
            <p>• <strong>125</strong> = Aumentar 25%</p>
          </div>
        </div>

        {/* Vista previa del cambio */}
        {numPercentage > 0 && (
          <div className="p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center gap-2 mb-3">
              {isIncrease ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`font-semibold ${
                isIncrease ? "text-green-700" : "text-red-700"
              }`}>
                {isIncrease ? "AUMENTO" : "REDUCCIÓN"} del {changeAmount}%
              </span>
            </div>
            
            <div className="text-sm space-y-2">
              <p className="font-medium">Ejemplo de cambio de precios:</p>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="font-medium">Costo</p>
                  <p className="text-muted-foreground">${examplePrices.cost} → ${newPrices.cost}</p>
                </div>
                <div>
                  <p className="font-medium">Mayorista</p>
                  <p className="text-muted-foreground">${examplePrices.wholesale} → ${newPrices.wholesale}</p>
                </div>
                <div>
                  <p className="font-medium">Minorista</p>
                  <p className="text-muted-foreground">${examplePrices.retail} → ${newPrices.retail}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button
          type="submit"
          disabled={isLoading || numPercentage <= 0}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualizando...
            </>
          ) : (
            <>
              {isIncrease ? (
                <TrendingUp className="mr-2 h-4 w-4" />
              ) : (
                <TrendingDown className="mr-2 h-4 w-4" />
              )}
              Aplicar cambios
            </>
          )}
        </Button>
      </div>
    </form>
  );
};