import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package, Users, ShoppingCart } from "lucide-react";
import { TopProduct, TopClient } from "@/types/dashboard";

interface RankingCardsProps {
  topProducts: TopProduct[];
  topClients: TopClient[];
  isLoading: boolean;
}

export function RankingCards({ topProducts, topClients, isLoading }: RankingCardsProps) {
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

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Productos Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Top Productos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Clientes Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Top Clientes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-20" />
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
      {/* Top Productos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Top Productos</span>
            <Badge variant="secondary">{topProducts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay datos de productos para el período seleccionado
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.productName}</p>
                      {product.productCode && (
                        <p className="text-xs text-gray-500">Código: {product.productCode}</p>
                      )}
                      {product.category && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {product.category.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(product.totalRevenue)}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 justify-end">
                      <div className="flex items-center">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {formatNumber(product.totalQuantity)}
                      </div>
                      <span>•</span>
                      <div className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {product.salesCount} ventas
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Promedio: {formatCurrency(product.averagePrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Top Clientes</span>
            <Badge variant="secondary">{topClients.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topClients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay datos de clientes para el período seleccionado
            </div>
          ) : (
            <div className="space-y-4">
              {topClients.map((client, index) => (
                <div key={client.clientId} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-semibold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{client.clientName}</p>
                      {client.clientDocument && (
                        <p className="text-xs text-gray-500">Doc: {client.clientDocument}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(client.totalRevenue)}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 justify-end">
                      <div className="flex items-center">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {client.salesCount} ventas
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Ticket promedio: {formatCurrency(client.averageTicket)}
                    </p>
                    {client.lastSaleDate && (
                      <p className="text-xs text-gray-400">
                        Última venta: {new Date(client.lastSaleDate).toLocaleDateString('es-AR')}
                      </p>
                    )}
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