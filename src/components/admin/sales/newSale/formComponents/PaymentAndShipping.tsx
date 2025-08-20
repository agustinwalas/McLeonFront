import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaymentMethod, DeliveryType } from "@/types/sale";
import { useNewSale } from "@/store/useNewSale";

export const PaymentAndShipping = () => {
  // Store hooks
  const { formData, setFormField } = useNewSale();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Método de Pago y Entrega</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Método de Pago</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormField('paymentMethod', e.target.value as PaymentMethod)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={PaymentMethod.CASH}>Efectivo</option>
            <option value={PaymentMethod.CREDIT_CARD}>
              Tarjeta de Crédito
            </option>
            <option value={PaymentMethod.DEBIT_CARD}>
              Tarjeta de Débito
            </option>
            <option value={PaymentMethod.BANK_TRANSFER}>
              Transferencia
            </option>
            <option value={PaymentMethod.MERCADO_PAGO}>
              Mercado Pago
            </option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Tipo de Entrega</label>
          <select
            value={formData.deliveryType}
            onChange={(e) => setFormField('deliveryType', e.target.value as DeliveryType)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={DeliveryType.PICKUP}>Retiro en Local</option>
            <option value={DeliveryType.DELIVERY}>
              Envío a Domicilio
            </option>
          </select>
        </div>

        {formData.deliveryType === DeliveryType.DELIVERY && (
          <div>
            <label className="text-sm font-medium mb-2 block">Costo de Envío</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.deliveryFee}
              onChange={(e) => setFormField('deliveryFee', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
