import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CreditCard, FileText, Percent } from "lucide-react";
import { PaymentMethodStats, AfipStats } from "@/types/dashboard";

interface StatsCardsProps {
  paymentMethods: PaymentMethodStats[];
  afipStats: AfipStats[];
  isLoading: boolean;
}

export function StatsCards({ paymentMethods, afipStats, isLoading }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-AR').format(num);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'EFECTIVO':
        return '💵';
      case 'TARJETA':
        return '💳';
      case 'TRANSFERENCIA':
        return '🏦';
      case 'CHEQUE':
        return '📄';
      default:
        return '💰';
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'EFECTIVO':
        return 'bg-green-100 text-green-700';
      case 'TARJETA':
        return 'bg-blue-100 text-blue-700';
      case 'TRANSFERENCIA':
        return 'bg-purple-100 text-purple-700';
      case 'CHEQUE':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {/* Métodos de Pago Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Métodos de Pago</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AFIP Stats Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Comprobantes AFIP</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Métodos de Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Métodos de Pago</span>
            <Badge variant="secondary">{paymentMethods.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay datos de métodos de pago para el período seleccionado
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.paymentMethod} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getPaymentMethodColor(method.paymentMethod)}`}>
                      <span className="text-lg">
                        {getPaymentMethodIcon(method.paymentMethod)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm capitalize">
                        {method.paymentMethod.toLowerCase().replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatNumber(method.salesCount)} ventas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(method.totalRevenue)}</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Percent className="h-3 w-3" />
                      <span>{method.percentage.toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Promedio: {formatCurrency(method.averageTicket)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comprobantes AFIP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Comprobantes AFIP</span>
            <Badge variant="secondary">{afipStats.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {afipStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay datos de comprobantes AFIP para el período seleccionado
            </div>
          ) : (
            <div className="space-y-3">
              {afipStats.map((afip) => (
                <div key={afip.comprobanteTipo} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700">
                      <span className="text-sm font-semibold">
                        {afip.comprobanteTipo}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{afip.comprobanteName}</p>
                      <p className="text-xs text-gray-500">
                        {formatNumber(afip.salesCount)} comprobantes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(afip.totalRevenue)}</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Percent className="h-3 w-3" />
                      <span>{afip.percentage.toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Promedio: {formatCurrency(afip.averageTicket)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}