import { ISalePopulated, PriceType } from "@/types/sale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UnitOfMeasure } from "@/types/product"; // ✅ Import agregado
import { getUnitOfMeasureLabel } from "@/utils/unitOfMeasure"; // ✅ Import agregado

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
  // ✅ Función helper para manejar productos eliminados
  const getProductInfo = (productItem: any) => {
    const product = productItem.product;

    // ✅ Producto eliminado o no existe
    if (!product) {
      return {
        name: "Producto eliminado",
        productCode: "-",
        unitOfMeasure: UnitOfMeasure.UNIDAD, // ✅ Fallback para unidad
        isDeleted: true,
      };
    }

    // ✅ Producto es solo un ID (string)
    if (typeof product === "string") {
      return {
        name: `Producto ID: ${product.substring(0, 8)}...`,
        productCode: "-",
        unitOfMeasure: UnitOfMeasure.UNIDAD, // ✅ Fallback para unidad
        isDeleted: true,
      };
    }

    // ✅ Producto existe pero puede tener campos vacíos
    return {
      name: product.name || "Sin nombre",
      productCode: product.productCode || "-",
      unitOfMeasure: product.unitOfMeasure || UnitOfMeasure.UNIDAD, // ✅ Unidad del producto
      isDeleted: false,
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos ({sale.products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sale.products.map((item, index) => {
            // ✅ Obtener información del producto con manejo de eliminados
            const productInfo = getProductInfo(item);

            return (
              <div key={index} className="border rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4
                      className={`font-medium ${
                        productInfo.isDeleted ? "text-gray-500 italic" : ""
                      }`}
                    >
                      {productInfo.name}
                    </h4>
                    <p
                      className={`text-xs ${
                        productInfo.isDeleted
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Código: {productInfo.productCode}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getPriceTypeLabel(item.priceType)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Cantidad:</p>
                    <p className="font-semibold">
                      {item.quantity % 1 === 0 ? item.quantity : item.quantity.toFixed(3).replace(/\.?0+$/, '')}{" "}
                      {getUnitOfMeasureLabel(productInfo.unitOfMeasure)}{" "}
                    </p>
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
                          ).toLocaleString("es-AR", {
                            minimumFractionDigits: 2,
                          })}
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
            );
          })}

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
              <span>
                $
                {sale.totalDiscount.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Envío:</span>
              <span>
                $
                {sale.deliveryFee?.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
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
