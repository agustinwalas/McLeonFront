import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function ClientLoadingSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-4 w-48 mb-1" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Error state
interface ClientErrorProps {
  error: string;
}

export function ClientError({ error }: ClientErrorProps) {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <Button asChild className="mt-4">
            <Link to="/admin/clientes">
              Volver a clientes
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Not found state
export function ClientNotFound() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">👤</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cliente no encontrado</h2>
        <p className="text-gray-600 mb-6">
          El cliente que buscas no existe o ha sido eliminado.
        </p>
        <Button variant="outline" asChild>
          <Link to="/admin/clientes">Volver a clientes</Link>
        </Button>
      </div>
    </div>
  );
}
