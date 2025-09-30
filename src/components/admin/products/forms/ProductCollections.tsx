// src/components/admin/products/forms/ProductCollections.tsx
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "./schemas/productSchema";
import { Check, ChevronDown, X } from "lucide-react";
import { useShopifyCollectionStore } from "@/store/useShopifyCollection";

interface ProductCollectionsProps {
  form: UseFormReturn<ProductFormData>;
}

export function ProductCollections({ form }: ProductCollectionsProps) {
  const [open, setOpen] = useState(false);
  const { collections, fetchCollections, loading: collectionsLoading } = useShopifyCollectionStore();

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const selectedCollections = (field: any) => {
    return collections.filter(collection => 
      (field.value || []).includes(collection._id)
    );
  };

  const handleSelect = (collectionId: string, field: any) => {
    const currentCollections = field.value || [];
    if (currentCollections.includes(collectionId)) {
      // Remover collection
      field.onChange(currentCollections.filter((id: string) => id !== collectionId));
    } else {
      // Agregar collection
      field.onChange([...currentCollections, collectionId]);
    }
  };

  const handleRemove = (collectionId: string, field: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentCollections = field.value || [];
    field.onChange(currentCollections.filter((id: string) => id !== collectionId));
  };

  if (collectionsLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="text-sm text-gray-500">Cargando colecciones...</span>
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name="collections"
      render={({ field }) => {
        // Normalizar: si hay objetos, convertir a array de IDs
        if (Array.isArray(field.value) && field.value.some(v => typeof v === "object" && v !== null)) {
          const ids = field.value.map((c: any) => typeof c === "string" ? c : c._id);
          field.onChange(ids);
        }
        return (
          <FormItem className="md:col-span-2">
            <FormLabel>Colecciones de Shopify</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between min-h-[40px] h-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(!open);
                    }}
                  >
                    <div className="flex flex-wrap gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                      {selectedCollections(field).length === 0 ? (
                        <span className="text-gray-500">Seleccionar collections...</span>
                      ) : (
                        selectedCollections(field).map(collection => (
                          <Badge 
                            key={collection._id} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {collection.collectionName}
                            <span
                              className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500 flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(collection._id, field, e);
                              }}
                            >
                              <X />
                            </span>
                          </Badge>
                        ))
                      )}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>

                  {/* Dropdown manual */}
                  {open && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="p-2">
                        <input
                          type="text"
                          placeholder="Buscar collection..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={() => {
                            // TODO: Implementar filtro si es necesario
                          }}
                        />
                      </div>
                      <div className="max-h-48 overflow-auto">
                        {collections.length === 0 ? (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            No se encontraron collections.
                          </div>
                        ) : (
                          collections.map((collection) => {
                            const isSelected = (field.value || []).includes(collection._id);
                            return (
                              <div
                                key={collection._id}
                                className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                  handleSelect(collection._id, field);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    isSelected ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                                <div className="flex-1">
                                  <div className="font-medium">{collection.collectionName}</div>
                                  <div className="text-xs text-gray-500">
                                    {collection.collectionType === 'category-based' ? 'Basada en categoría' : 
                                     collection.collectionType === 'manual' ? 'Manual' : 
                                     collection.collectionType === 'featured' ? 'Destacados' : 'Temporada'}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Contador de seleccionadas */}
                <div className="text-xs text-gray-500">
                  ✅ Seleccionadas: {(field.value || []).length} collection(s)
                </div>

                {/* Click fuera para cerrar */}
                {open && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setOpen(false)}
                  />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}