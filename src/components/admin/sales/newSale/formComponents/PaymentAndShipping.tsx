import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSalesStore } from "@/store/useSales"; // ✅ Store unificado

export const PaymentAndShipping = () => {
  const { formData, updateFormData } = useSalesStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>💳 Método de Pago y Entrega</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Método de Pago
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => updateFormData("paymentMethod", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="CHEQUE">Cheque</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Tipo de Entrega
          </label>
          <select
            value={formData.deliveryType}
            onChange={(e) => updateFormData("deliveryType", e.target.value)} // ✅ Función actualizada
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="RETIRO_LOCAL">Retiro en Local</option>
            <option value="DELIVERY">Envío a Domicilio</option>
          </select>
        </div>

        {/* ✅ Mostrar costo de envío solo para delivery */}
        {formData.deliveryType === "DELIVERY" && (
          <div>
            <label className="text-sm font-medium mb-2 block">
              Costo de Envío
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.deliveryFee}
              onChange={(e) =>
                updateFormData("deliveryFee", parseFloat(e.target.value) || 0)
              } // ✅ Función actualizada
              placeholder="0.00"
            />
            <div className="text-xs text-gray-500 mt-1">
              Ingresa el costo adicional por envío a domicilio
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};
