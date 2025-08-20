import { Link } from "react-router-dom";
import { ISalePopulated } from "@/types/sale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ClientSalesCardProps {
  sales: ISalePopulated[];
}

const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case "CASH":
      return "Efectivo";
    case "CREDIT_CARD":
      return "Tarjeta de Crédito";
    case "DEBIT_CARD":
      return "Tarjeta de Débito";
    case "BANK_TRANSFER":
      return "Transferencia";
    case "CHECK":
      return "Cheque";
    case "MERCADO_PAGO":
      return "Mercado Pago";
    case "MULTIPLE":
      return "Múltiple";
    default:
      return method;
  }
};

export function ClientSalesCard({ sales }: ClientSalesCardProps) {
  const totalSales = sales.length;
  const totalAmount = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Compras ({totalSales})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Resumen */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
              <p className="text-sm text-gray-600">Total Ventas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${totalAmount.toLocaleString("es-AR")}
              </p>
              <p className="text-sm text-gray-600">Total Facturado</p>
            </div>
          </div>
        </div>

        {/* Lista de ventas */}
        <div className="space-y-3">
          {sales.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Este cliente aún no tiene compras registradas
            </p>
          ) : (
            sales.slice(0, 10).map((sale) => (
              <div key={sale._id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">Venta #{sale.saleNumber}</h4>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <p>{new Date(sale.saleDate).toLocaleDateString("es-AR")}</p>
                      <p>{getPaymentMethodLabel(sale.paymentMethod)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold">
                        ${sale.totalAmount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 w-8 p-0"
                    >
                      <Link to={`/admin/ventas/${sale._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {sales.length > 10 && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Mostrando las últimas 10 ventas de {totalSales} totales
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
