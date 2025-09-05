import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductStore } from "@/store/useProduct";
import { useSalesStore } from "@/store/useSales"; // ✅ Import correcto

export const Summary = () => {
  // ✅ Store hooks corregidos
  const { formData, selectedProducts } = useSalesStore();
  const { products } = useProductStore();

  // ✅ Funciones helper actualizadas para el nuevo formato
  const getProductDetails = (item: any) => {
    const product = products.find((p) => p._id === item.product);
    return product;
  };

  // ✅ Calcular subtotal total
  const calculateSubtotal = () => {
    return selectedProducts.reduce((sum, item) => sum + item.subtotal, 0);
  };

  // ✅ Calcular total final
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee =
      formData.deliveryType === "DELIVERY" ? formData.deliveryFee : 0;
    const discount = formData.totalDiscount || 0;
    return subtotal + deliveryFee - discount;
  };

  // Don't render if no products selected
  if (selectedProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Resumen de Venta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No hay productos seleccionados</p>
            <p className="text-sm">Agrega productos para ver el resumen</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const subtotal = calculateSubtotal();
  const total = calculateTotal();

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Resumen de Venta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Detalle de productos */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700 mb-2">
              Productos ({selectedProducts.length})
            </h4>
            {selectedProducts.map((item, index) => {
              const product = getProductDetails(item);

              if (!product) {
                return 
              }

              return (
                <div
                  key={index}
                  className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {product.name}
                      </span>
                      <div className="text-xs text-gray-600 mt-1">
                        {item.quantity} × $
                        {item.unitPrice.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        (
                        {item.priceType === "MAYORISTA"
                          ? "Mayorista"
                          : "Minorista"}
                        )
                        {item.discountPercentage < 100 && (
                          <span className="ml-2 text-orange-600 font-medium">
                            -{(100 - item.discountPercentage).toFixed(0)}% desc.
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        $
                        {item.subtotal.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Separador */}
          <hr className="border-gray-200" />

          {/* Cálculos */}
          <div className="space-y-2">
            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">
                $
                {subtotal.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            {/* Descuento total */}
            {formData.totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Descuento:</span>
                <span>
                  -$
                  {formData.totalDiscount.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            {/* Costo de envío */}
            {formData.deliveryType === "DELIVERY" &&
              formData.deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Costo de Envío:</span>
                  <span>
                    +$
                    {formData.deliveryFee.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
          </div>

          {/* Total */}
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">
                Total Final:
              </span>
              <span className="text-2xl font-bold">
                $
                {total.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Info adicional */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
              <div>
                <span className="font-medium">Método de Pago:</span>
                <br />
                {formData.paymentMethod}
              </div>
              <div>
                <span className="font-medium">Entrega:</span>
                <br />
                {formData.deliveryType === "DELIVERY"
                  ? "Delivery"
                  : "Retiro en Local"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
