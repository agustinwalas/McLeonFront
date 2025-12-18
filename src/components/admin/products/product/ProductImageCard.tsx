import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IProductPopulated } from "@/types";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageCardProps {
  product: IProductPopulated;
}

export function ProductImageCard({ product }: ProductImageCardProps) {
  // Estado para manejar la imagen actual seleccionada
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Obtener las imágenes del producto
  const images = product.images || [];
  const hasImages = images.length > 0;

  // Función para cambiar a la imagen anterior
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Función para cambiar a la imagen siguiente
  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // ✅ Función para obtener el nombre de la categoría
  const getCategoryName = () => {
    if (!product.category) {
      return "Sin categoría";
    }

    // Si es solo un string (ID sin poblar)
    if (typeof product.category === "string") {
      return "Sin categoría";
    }

    // Si es un objeto pero sin nombre
    return product.category.name || "Sin categoría";
  };

  // ✅ Función para determinar el variant del badge
  const getCategoryVariant = () => {
    if (
      !product.category ||
      typeof product.category === "string" ||
      !product.category.name
    ) {
      return "outline"; // Badge gris para "Sin categoría"
    }
    return "secondary"; // Badge normal para categorías válidas
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Producto</CardTitle>
      </CardHeader>
      <CardContent>
        {hasImages ? (
          <div className="space-y-4">
            {/* Imagen principal con navegación */}
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={`${product.name} - Imagen ${currentImageIndex + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />

              {/* Botones de navegación solo si hay más de una imagen */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Indicador de imagen actual */}
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
            <span className="text-gray-500">Sin imagen</span>
          </div>
        )}

        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Categoría:</span>
            <Badge variant={getCategoryVariant()}>{getCategoryName()}</Badge>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Fecha Creacion</h3>
            <p className="text-gray-600">
              {product.createdAt
                ? new Date(product.createdAt).toLocaleDateString("es-AR")
                : "N/A"}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Fecha Modificación</h3>
            <p className="text-gray-600">
              {product.updatedAt
                ? new Date(product.updatedAt).toLocaleDateString("es-AR")
                : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
