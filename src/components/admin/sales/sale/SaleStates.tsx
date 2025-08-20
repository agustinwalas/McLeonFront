import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Loading skeleton
export function SaleLoadingSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-1" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded p-3 space-y-2">
                <Skeleton className="h-5 w-48" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Error state
interface SaleErrorProps {
  error: string;
}

export function SaleError({ error }: SaleErrorProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center py-12">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar la venta</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="space-x-4">
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/ventas">Volver a ventas</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Not found state
export function SaleNotFound() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Venta no encontrada</h2>
        <p className="text-gray-600 mb-6">
          La venta que buscas no existe o ha sido eliminada.
        </p>
        <Button variant="outline" asChild>
          <Link to="/admin/ventas">Volver a ventas</Link>
        </Button>
      </div>
    </div>
  );
}
