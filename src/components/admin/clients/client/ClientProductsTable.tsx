import { useMemo } from "react";
import { ISalePopulated } from "@/types/sale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

interface ClientProductsTableProps {
  sales: ISalePopulated[];
}

interface ProductSummary {
  productId: string;
  name: string;
  productCode: string;
  totalQuantity: number;
  totalAmount: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export function ClientProductsTable({ sales }: ClientProductsTableProps) {
  const productSummaries = useMemo<ProductSummary[]>(() => {
    const map = new Map<string, ProductSummary>();

    for (const sale of sales) {
      for (const item of sale.products) {
        const prod = item.product;
        if (!prod?._id) continue;

        const existing = map.get(prod._id);
        if (existing) {
          existing.totalQuantity += item.quantity;
          existing.totalAmount += item.subtotal;
        } else {
          map.set(prod._id, {
            productId: prod._id,
            name: prod.name,
            productCode: prod.productCode,
            totalQuantity: item.quantity,
            totalAmount: item.subtotal,
          });
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [sales]);

  if (productSummaries.length === 0) return null;

  const totalAmount = productSummaries.reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-500" />
          <CardTitle>Productos Comprados Históricamente</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 pr-4 font-medium">#</th>
                <th className="pb-3 pr-4 font-medium">Producto</th>
                <th className="pb-3 pr-4 font-medium">Código</th>
                <th className="pb-3 pr-4 font-medium text-right">Cantidad Total</th>
                <th className="pb-3 font-medium text-right">Total Facturado</th>
              </tr>
            </thead>
            <tbody>
              {productSummaries.map((product, index) => (
                <tr
                  key={product.productId}
                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 pr-4 text-gray-400 font-medium">{index + 1}</td>
                  <td className="py-3 pr-4 font-medium text-gray-900">{product.name}</td>
                  <td className="py-3 pr-4 text-gray-500 font-mono text-xs">{product.productCode}</td>
                  <td className="py-3 pr-4 text-right text-gray-700">
                    {product.totalQuantity % 1 === 0
                      ? product.totalQuantity.toLocaleString("es-AR")
                      : product.totalQuantity.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-right font-semibold text-gray-900">
                    {formatCurrency(product.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 bg-gray-50">
                <td colSpan={3} className="py-3 pr-4 font-bold text-gray-700 pl-2">
                  Total ({productSummaries.length} productos)
                </td>
                <td className="py-3 pr-4" />
                <td className="py-3 text-right font-bold text-gray-900">
                  {formatCurrency(totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
