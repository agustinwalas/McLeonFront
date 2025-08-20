import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function ProductLoadingSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-64 w-full mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface ProductErrorProps {
  error: string;
}

export function ProductError({ error }: ProductErrorProps) {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <Button asChild className="mt-4">
            <Link to="/admin/productos">
              Volver a productos
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProductNotFound() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 text-lg">Producto no encontrado</p>
          <Button asChild className="mt-4">
            <Link to="/admin/productos">
              Volver a productos
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
