import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryType, PriceType } from "@/types/sale";
import { useNewSale } from "@/store/useNewSale";
import { useProductStore } from "@/store/useProduct";

export const Summary = () => {
  // Store hooks
  const { formData, selectedProducts, calculateSubtotal, calculateTotal } =
    useNewSale();
  const { products } = useProductStore();

  // Calculate values
  const subtotal = calculateSubtotal(products);
  const total = calculateTotal(products);

  // ✅ Helper function para calcular el subtotal de cada producto
  const getProductSubtotal = (item: any) => {
    const product = products.find((p) => p._id === item.product);
    if (!product) return 0;

    const basePrice =
      item.priceType === PriceType.WHOLESALE
        ? product.wholesalePrice
        : product.retailPrice;

    const discountedPrice = basePrice * (item.discountPercentage / 100);
    return discountedPrice * item.quantity;
  };

  // ✅ Helper function para obtener el precio unitario
  const getUnitPrice = (item: any) => {
    const product = products.find((p) => p._id === item.product);
    if (!product) return 0;

    return item.priceType === PriceType.WHOLESALE
      ? product.wholesalePrice
      : product.retailPrice;
  };

  // Don't render if no products selected
  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Venta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Detalle de productos */}
          <div className="space-y-2">
            {selectedProducts.map((item, index) => {
              const product = products.find((p) => p._id === item.product);
              const unitPrice = getUnitPrice(item);
              const productSubtotal = getProductSubtotal(item);

              if (!product) return null;

              return (
                <div
                  key={index}
                  className="flex flex-col gap-1 py-1 bg-muted/30 rounded text-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-medium">{product.name}</span>
                      <div className="text-xs text-muted-foreground">
                        {item.quantity} × $
                        {unitPrice.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                        (
                        {item.priceType === PriceType.WHOLESALE
                          ? "Mayorista"
                          : "Minorista"}
                        )
                        {item.discountPercentage < 100 && (
                          <span className="ml-1 text-orange-600">
                            - {100 - item.discountPercentage}% desc.
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-medium">
                      $
                      {productSubtotal.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Separador */}

          {/* Costo de envío */}
          {formData.deliveryType === DeliveryType.DELIVERY && (
            <div className="flex justify-between mt-2">
              <span>Costo de Envío:</span>
              <span>
                $
                {formData.deliveryFee.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total:</span>
            <span>
              ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
