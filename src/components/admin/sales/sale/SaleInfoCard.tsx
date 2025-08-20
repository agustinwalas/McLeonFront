import { ISalePopulated, PaymentMethod, DeliveryType } from "@/types/sale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SaleInfoCardProps {
  sale: ISalePopulated;
}

const getPaymentMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CASH:
      return "Efectivo";
    case PaymentMethod.CREDIT_CARD:
      return "Tarjeta de Crédito";
    case PaymentMethod.DEBIT_CARD:
      return "Tarjeta de Débito";
    case PaymentMethod.BANK_TRANSFER:
      return "Transferencia";
    case PaymentMethod.CHECK:
      return "Cheque";
    case PaymentMethod.MERCADO_PAGO:
      return "Mercado Pago";
    case PaymentMethod.MULTIPLE:
      return "Múltiple";
    default:
      return method;
  }
};

const getDeliveryTypeLabel = (type: DeliveryType) => {
  switch (type) {
    case DeliveryType.PICKUP:
      return "Retiro en Local";
    case DeliveryType.DELIVERY:
      return "Envío a Domicilio";
    default:
      return type;
  }
};

export function SaleInfoCard({ sale }: SaleInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de la Venta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Cliente</h3>
            <p className="text-gray-600">{sale.client.name}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">CUIT del Cliente</h3>
            <p className="text-gray-600">{sale.client.cuit}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Método de Pago</h3>
            <p className="text-gray-600">{getPaymentMethodLabel(sale.paymentMethod)}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Tipo de Entrega</h3>
            <p className="text-gray-600">{getDeliveryTypeLabel(sale.deliveryType)}</p>
          </div>

          {sale.deliveryType === DeliveryType.DELIVERY && sale.deliveryAddress && (
            <div>
              <h3 className="font-medium text-gray-900">Dirección de Entrega</h3>
              <div className="text-gray-600">
                <p>{sale.deliveryAddress.street} {sale.deliveryAddress.number}</p>
                <p>{sale.deliveryAddress.city}, {sale.deliveryAddress.province}</p>
                <p>{sale.deliveryAddress.postalCode}</p>
                {sale.deliveryAddress.additionalInfo && (
                  <p>{sale.deliveryAddress.additionalInfo}</p>
                )}
              </div>
            </div>
          )}

          {sale.deliveryFee && sale.deliveryFee > 0 && (
            <div>
              <h3 className="font-medium text-gray-900">Costo de Envío</h3>
              <p className="text-gray-600">${sale.deliveryFee.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>
            </div>
          )}

          <div>
            <h3 className="font-medium text-gray-900">Vendedor</h3>
            <p className="text-gray-600">{sale.user.name}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Email del Vendedor</h3>
            <p className="text-gray-600">{sale.user.email}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Fecha de Venta</h3>
            <p className="text-gray-600">
              {new Date(sale.saleDate).toLocaleDateString("es-AR")} - {new Date(sale.saleDate).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          {sale.deliveryDate && (
            <div>
              <h3 className="font-medium text-gray-900">Fecha de Entrega Programada</h3>
              <p className="text-gray-600">
                {new Date(sale.deliveryDate).toLocaleDateString("es-AR")}
              </p>
            </div>
          )}

          {sale.notes && (
            <div>
              <h3 className="font-medium text-gray-900">Notas</h3>
              <p className="text-gray-600">{sale.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
