import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Cargando datos de la venta..." }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Reintentar
          </Button>
        )}
      </div>
    </div>
  );
}

interface NotFoundStateProps {
  id: string;
}

export function NotFoundState({ id }: NotFoundStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
        <p className="text-yellow-600">No se encontró la venta con ID: {id}</p>
      </div>
    </div>
  );
}