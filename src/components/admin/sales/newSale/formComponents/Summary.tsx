import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductStore } from "@/store/useProduct";
import { useSalesStore } from "@/store/useSales"; // ✅ Import correcto

export const Summary = () => {
  // ✅ Store hooks corregidos
  const { formData, selectedProducts, updateFormData } = useSalesStore();
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
    const discountPercentage = formData.totalDiscount || 0;
    const discountAmount = subtotal * (discountPercentage / 100);
    return subtotal + deliveryFee - discountAmount;
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

            {/* Descuento total de venta */}
            <div className="space-y-2">
              <Label htmlFor="totalDiscount" className="text-sm font-medium text-gray-700">
                Descuento Total de Venta
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="totalDiscount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.totalDiscount || 0}
                  onChange={(e) => updateFormData("totalDiscount", parseFloat(e.target.value) || 0)}
                  className="flex-1"
                  placeholder="0"
                />
                <span className="text-gray-600 font-medium min-w-[30px]">%</span>
              </div>
            </div>

            {/* Mostrar descuento si es mayor a 0 */}
            {formData.totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Descuento ({formData.totalDiscount}%):</span>
                <span className="font-medium">
                  -$
                  {(calculateSubtotal() * (formData.totalDiscount / 100)).toLocaleString("es-AR", {
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

          {/* Pago Actual y Faltante */}
          {formData.amountPaid > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-800 font-medium">Pago Actual:</span>
                <span className="font-semibold text-blue-900">
                  $
                  {formData.amountPaid.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              {formData.amountPaid < total && (
                <div className="flex justify-between text-sm">
                  <span className="text-orange-800 font-medium">Faltante:</span>
                  <span className="font-semibold text-orange-900">
                    $
                    {(total - formData.amountPaid).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
              {formData.amountPaid >= total && (
                <div className="text-center text-sm text-green-700 font-medium">
                  ✓ Pago completo
                </div>
              )}
            </div>
          )}

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
