import { ISalePopulated, PriceType } from "@/types/sale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SaleProductsCardProps {
  sale: ISalePopulated;
}

const getPriceTypeLabel = (type: PriceType) => {
  switch (type) {
    case PriceType.RETAIL:
      return "Minorista";
    case PriceType.WHOLESALE:
      return "Mayorista";
    default:
      return type;
  }
};

export function SaleProductsCard({ sale }: SaleProductsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos ({sale.products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sale.products.map((item, index) => (
            <div key={index} className="border rounded p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-xs text-gray-500">
                    Código: {item.product.productCode}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getPriceTypeLabel(item.priceType)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Cantidad:</p>
                  <p className="font-semibold">{item.quantity}</p>
                </div>
                <div>
                  <p className="text-gray-600">Precio unitario:</p>
                  <p className="font-semibold">
                    $
                    {item.unitPrice.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                {item.discountPercentage < 100 && (
                  <>
                    <div>
                      <p className="text-gray-600">Descuento:</p>
                      <p className="font-semibold text-green-600">
                        {100 - item.discountPercentage}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Precio con desc.:</p>
                      <p className="font-semibold">
                        $
                        {(
                          item.unitPrice *
                          (item.discountPercentage / 100)
                        ).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-3 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="font-bold">
                    $
                    {item.subtotal.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Resumen Total */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>
                $
                {sale.subtotal.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Descuento total:</span>

              {sale.totalDiscount && sale.totalDiscount > 0 && (
                <span>
                  -$
                  {sale.totalDiscount.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              )}
            </div>

            {/* ✅ Corregido: solo mostrar si deliveryFee existe y > 0 */}

            <div className="flex justify-between text-sm">
              <span>Envío:</span>
              {sale.deliveryFee && sale.deliveryFee > 0 && (
                <span>
                  $
                  {sale.deliveryFee.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              )}
            </div>

            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>
                $
                {sale.totalAmount.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
