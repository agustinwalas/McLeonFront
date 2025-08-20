import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PriceType } from "@/types/sale";
import { useNewSale } from "@/store/useNewSale";
import { useProductStore } from "@/store/useProduct";

export const Products = () => {
  // Store hooks
  const {
    selectedProducts,
    addProduct,
    removeProduct,
    updateProduct,
  } = useNewSale();
  
  const { products } = useProductStore();

  // Estado para controlar los popover abiertos
  const [openPopovers, setOpenPopovers] = useState<boolean[]>([]);

  // ✅ Helper function para eliminar ceros a la izquierda
  const removeLeadingZeros = (value: string): string => {
    if (value === '' || value === '0') return '0';
    return value.replace(/^0+/, '') || '0';
  };

  // ✅ Helper function para manejar cambios de cantidad
  const handleQuantityChange = (index: number, value: string) => {
    const cleanValue = removeLeadingZeros(value);
    const numValue = parseInt(cleanValue) || 0;
    const finalValue = Math.max(0, numValue);
    updateProduct(index, "quantity", finalValue);
  };

  // ✅ Helper function para manejar cambios de descuento (sin límite máximo)
  const handleDiscountChange = (index: number, value: string) => {
    const cleanValue = removeLeadingZeros(value);
    const numValue = parseInt(cleanValue);
    let finalValue = 0;
    
    if (!isNaN(numValue)) {
      finalValue = Math.max(numValue, 0); // Solo evitar negativos, sin límite superior
    }
    
    updateProduct(index, "discountPercentage", finalValue);
  };

  // ✅ Helper function para manejar selección de producto
  const handleProductSelect = (index: number, productId: string) => {
    updateProduct(index, "product", productId);
    // Cerrar el popover
    const newOpenPopovers = [...openPopovers];
    newOpenPopovers[index] = false;
    setOpenPopovers(newOpenPopovers);
  };

  // ✅ Helper function para controlar apertura/cierre de popover
  const togglePopover = (index: number, isOpen: boolean) => {
    const newOpenPopovers = [...openPopovers];
    newOpenPopovers[index] = isOpen;
    setOpenPopovers(newOpenPopovers);
  };

  // ✅ Helper function para obtener el precio unitario según el tipo
  const getUnitPrice = (item: any) => {
    const product = products.find(p => p._id === item.product);
    if (!product) return 0;
    
    return item.priceType === PriceType.WHOLESALE 
      ? product.wholesalePrice 
      : product.retailPrice;
  };

  // ✅ Inicializar array de popovers cuando se agregan productos
  const initializePopovers = () => {
    if (openPopovers.length < selectedProducts.length) {
      setOpenPopovers(prev => [
        ...prev,
        ...Array(selectedProducts.length - prev.length).fill(false)
      ]);
    }
  };

  // Inicializar popovers
  useEffect(() => {
    initializePopovers();
  }, [selectedProducts.length]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Productos</CardTitle>
        <Button type="button" onClick={addProduct} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </CardHeader>
      <CardContent>
        {selectedProducts.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No hay productos agregados
          </p>
        ) : (
          <div className="space-y-4">
            {selectedProducts.map((item, index) => {
              const selectedProduct = products.find(p => p._id === item.product);
              const unitPrice = getUnitPrice(item);
              
              return (
                <div
                  key={index}
                  className="grid gap-4 p-4 border rounded items-end"
                  style={{
                    gridTemplateColumns: "1fr auto auto auto auto auto",
                    gridTemplateAreas: `
                      "producto tipo cantidad precio descuento acciones"
                    `
                  }}
                >
                  {/* Producto - Flex para ocupar espacio restante */}
                  <div style={{ gridArea: "producto" }}>
                    <label className="text-sm font-medium mb-2 block">Producto</label>
                    <Popover 
                      open={openPopovers[index] || false} 
                      onOpenChange={(isOpen) => togglePopover(index, isOpen)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openPopovers[index] || false}
                          className="w-full justify-between h-10"
                        >
                          {selectedProduct
                            ? `${selectedProduct.name}`
                            : "Seleccionar producto..."
                          }
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar producto..." />
                          <CommandList>
                            <CommandEmpty>No se encontraron productos.</CommandEmpty>
                            <CommandGroup>
                              {products.map((product) => (
                                <CommandItem
                                  key={product._id}
                                  value={`${product.name} ${product.retailPrice}`}
                                  onSelect={() => handleProductSelect(index, product._id)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      item.product === product._id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{product.name}</span>
                                    <span className="text-sm text-muted-foreground">
                                      Minorista: ${product.retailPrice} | Mayorista: ${product.wholesalePrice}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Tipo de Precio - Ancho fijo */}
                  <div style={{ gridArea: "tipo", width: "120px" }}>
                    <label className="text-sm font-medium mb-2 block">Tipo</label>
                    <select
                      value={item.priceType}
                      onChange={(e) => updateProduct(index, "priceType", e.target.value as PriceType)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={PriceType.RETAIL}>Minorista</option>
                      <option value={PriceType.WHOLESALE}>Mayorista</option>
                    </select>
                  </div>

                  {/* Cantidad - Ancho fijo */}
                  <div style={{ gridArea: "cantidad", width: "80px" }}>
                    <label className="text-sm font-medium mb-2 block">Cantidad</label>
                    <Input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          updateProduct(index, "quantity", 0);
                        }
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        const cleanValue = removeLeadingZeros(target.value);
                        if (target.value !== cleanValue) {
                          target.value = cleanValue;
                        }
                      }}
                      className="text-center h-10"
                    />
                  </div>

                  {/* Precio Unitario - Ancho fijo */}
                  <div style={{ gridArea: "precio", width: "110px" }}>
                    <label className="text-sm font-medium mb-2 block">Precio Unit.</label>
                    <Input
                      type="text"
                      value={unitPrice > 0 ? `$${unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : '-'}
                      readOnly
                      className="bg-muted text-center cursor-not-allowed h-10"
                    />
                  </div>

                  {/* Descuento - Ancho fijo */}
                  <div style={{ gridArea: "descuento", width: "90px" }}>
                    <label className="text-sm font-medium mb-2 block">Desc. (%)</label>
                    <Input
                      type="number"
                      min="0"
                      value={item.discountPercentage}
                      onChange={(e) => handleDiscountChange(index, e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          updateProduct(index, "discountPercentage", 0);
                        }
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        const cleanValue = removeLeadingZeros(target.value);
                        if (target.value !== cleanValue) {
                          target.value = cleanValue;
                        }
                      }}
                      className="text-center h-10"
                    />
                  </div>

                  {/* Botón eliminar - Ancho fijo */}
                  <div style={{ gridArea: "acciones", width: "50px" }}>
                    <label className="text-sm font-medium mb-2 block opacity-0">.</label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeProduct(index)}
                      className="h-10 w-10 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

