import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSalesStore } from "@/store/useSales"; // ✅ Store unificado
import { useProductStore } from "@/store/useProduct";
import { getUnitOfMeasureShort } from "@/utils/unitOfMeasure";

export const Products = () => {
  // ✅ Store hooks corregidos
  const {
    selectedProducts,
    addProduct,
    removeProduct,
    updateProduct,
  } = useSalesStore();
  
  const { products, fetchProducts } = useProductStore(); // ✅ Agregado fetchProducts

  // Estado para controlar los popover abiertos
  const [openPopovers, setOpenPopovers] = useState<boolean[]>([]);
  
  // Estado para mantener los valores de cantidad como strings mientras se escriben
  const [quantityInputs, setQuantityInputs] = useState<string[]>([]);

  // ✅ Fetch de productos al montar el componente
  useEffect(() => {
    if (products.length === 0) {
 
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  // ✅ Helper function para eliminar ceros a la izquierda
  const removeLeadingZeros = (value: string): string => {
    if (value === '' || value === '0') return '0';
    return value.replace(/^0+/, '') || '0';
  };

  // ✅ Helper function para manejar cambios de cantidad (con decimales)
  const handleQuantityChange = (index: number, value: string) => {
    // Permitir solo números, punto, coma y un solo separador decimal
    const sanitizedValue = value.replace(/[^0-9.,]/g, '');
    
    // Contar separadores decimales
    const commaCount = (sanitizedValue.match(/,/g) || []).length;
    const dotCount = (sanitizedValue.match(/\./g) || []).length;
    
    // Si hay más de un separador, no actualizar
    if (commaCount + dotCount > 1) {
      return;
    }
    
    // Actualizar el input visual inmediatamente (permite "0,2", "0.", etc)
    const newQuantityInputs = [...quantityInputs];
    newQuantityInputs[index] = sanitizedValue;
    setQuantityInputs(newQuantityInputs);
    
    // Permitir valores decimales con punto o coma
    const normalizedValue = sanitizedValue.replace(',', '.');
    const numValue = parseFloat(normalizedValue);
    
    // Si no es un número válido o está vacío, usar 0
    if (isNaN(numValue) || sanitizedValue === '') {
      updateProduct(index, "quantity", 0);
      recalculateSubtotal(index, 0);
      return;
    }
    
    // Asegurar que sea positivo y limitar a 2 decimales
    const finalValue = Math.max(0, Math.round(numValue * 100) / 100);
    
    // Actualizar cantidad y recalcular subtotal
    updateProduct(index, "quantity", finalValue);
    recalculateSubtotal(index, finalValue);
  };
  
  // ✅ Helper function para manejar cuando el input pierde el foco
  const handleQuantityBlur = (index: number) => {
    const item = selectedProducts[index];
    // Actualizar el input con el valor final formateado (máximo 2 decimales)
    const newQuantityInputs = [...quantityInputs];
    newQuantityInputs[index] = item.quantity.toString();
    setQuantityInputs(newQuantityInputs);
  };

  // ✅ Helper function para manejar cambios de descuento
  const handleDiscountChange = (index: number, value: string) => {
    const cleanValue = removeLeadingZeros(value);
    const numValue = parseInt(cleanValue);
    let finalValue = 0;
    
    if (!isNaN(numValue)) {
      finalValue = Math.max(numValue, 0);
    }
    
    // Actualizar descuento y recalcular subtotal
    updateProduct(index, "discountPercentage", finalValue);
    recalculateSubtotalWithDiscount(index, finalValue);
  };

  // ✅ Helper function para manejar cambio de tipo de precio
  const handlePriceTypeChange = (index: number, priceType: "MAYORISTA" | "MINORISTA") => {
    updateProduct(index, "priceType", priceType);
    
    // Recalcular precio unitario y subtotal
    const item = selectedProducts[index];
    const product = products.find(p => p._id === item.product);
    if (product) {
      const newUnitPrice = priceType === "MAYORISTA" 
        ? product.wholesalePrice 
        : product.retailPrice;
      
      updateProduct(index, "unitPrice", newUnitPrice);
      recalculateSubtotalFull(index, item.quantity, newUnitPrice, item.discountPercentage);
    }
  };

  // ✅ Helper function para recalcular subtotal cuando cambia cantidad
  const recalculateSubtotal = (index: number, newQuantity: number) => {
    const item = selectedProducts[index];
    const subtotal = newQuantity * item.unitPrice * (item.discountPercentage / 100);
    updateProduct(index, "subtotal", subtotal);
  };

  // ✅ Helper function para recalcular subtotal cuando cambia descuento
  const recalculateSubtotalWithDiscount = (index: number, newDiscount: number) => {
    const item = selectedProducts[index];
    const subtotal = item.quantity * item.unitPrice * (newDiscount / 100);
    updateProduct(index, "subtotal", subtotal);
  };

  // ✅ Helper function para recalcular subtotal completo
  const recalculateSubtotalFull = (index: number, quantity: number, unitPrice: number, discountPercentage: number) => {
    const subtotal = quantity * unitPrice * (discountPercentage / 100);
    updateProduct(index, "subtotal", subtotal);
  };

  // ✅ Helper function para manejar selección de producto
  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    const item = selectedProducts[index];
    const unitPrice = item.priceType === "MAYORISTA" 
      ? product.wholesalePrice 
      : product.retailPrice;

    // Actualizar producto, precio unitario y recalcular subtotal
    updateProduct(index, "product", productId);
    updateProduct(index, "unitPrice", unitPrice);
    recalculateSubtotalFull(index, item.quantity, unitPrice, item.discountPercentage);

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
    
    return item.priceType === "MAYORISTA" 
      ? product.wholesalePrice 
      : product.retailPrice;
  };

  // ✅ Helper function para agregar producto
  const handleAddProduct = () => {
    const newProduct = {
      product: "",
      quantity: 1,
      priceType: "MAYORISTA" as "MAYORISTA" | "MINORISTA",
      unitPrice: 0,
      discountPercentage: 100,
      subtotal: 0,
    };
    addProduct(newProduct);
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

  // Inicializar popovers y quantity inputs
  useEffect(() => {
    initializePopovers();
    
    // Inicializar quantityInputs con los valores actuales
    if (quantityInputs.length !== selectedProducts.length) {
      setQuantityInputs(selectedProducts.map(item => item.quantity.toString()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts.length]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>🛍️ Productos</CardTitle>
        <Button type="button" onClick={handleAddProduct} size="sm">
          <Plus />
          Agregar Producto
        </Button>
      </CardHeader>
      <CardContent>
        {selectedProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay productos agregados</p>
            <p className="text-sm">Agrega productos para continuar con la venta</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedProducts.map((item, index) => {
              const selectedProduct = products.find(p => p._id === item.product);
              const unitPrice = getUnitPrice(item);
              
              return (
                <div
                  key={index}
                  className="grid gap-4 p-4 border rounded items-end overflow-x-auto"
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
                            ? `${selectedProduct.productCode} - ${selectedProduct.name}`
                            : "Seleccionar producto..."
                          }
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar por nombre o código..." />
                          <CommandList>
                            <CommandEmpty>No se encontraron productos.</CommandEmpty>
                            <CommandGroup>
                              {products.map((product) => (
                                <CommandItem
                                  key={product._id}
                                  value={`${product.name} ${product.productCode} ${product.retailPrice}`}
                                  onSelect={() => handleProductSelect(index, product._id)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      item.product === product._id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{product.productCode} - <span className="lowercase">{product.name}</span></span>
                                    <span className="text-sm text-muted-foreground">
                                      Código: {product.productCode} | Minorista: ${product.retailPrice} | Mayorista: ${product.wholesalePrice}
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
                      onChange={(e) => handlePriceTypeChange(index, e.target.value as "MAYORISTA" | "MINORISTA")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="MINORISTA">Minorista</option>
                      <option value="MAYORISTA">Mayorista</option>
                    </select>
                  </div>

                  {/* Cantidad - Ancho fijo (acepta decimales) */}
                  <div style={{ gridArea: "cantidad", width: "80px" }}>
                    <label className="text-sm font-medium mb-2 block">Cant.  {selectedProduct ? getUnitOfMeasureShort(selectedProduct.unitOfMeasure) : ''} </label>
                    <Input
                      type="text"
                      value={quantityInputs[index] || item.quantity.toString()}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      onBlur={() => handleQuantityBlur(index)}
                      className="text-center h-10"
                      placeholder="0.0"
                    />
                  </div>

                  {/* Precio Unitario  */}
                  <div style={{ gridArea: "precio", width: "110px" }}>
                    <label className="text-sm font-medium mb-2 block">Precio Unit.</label>
                    <Input
                      type="text"
                      value={unitPrice > 0 ? `$${unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : '-'}
                      readOnly
                      className="bg-muted text-center cursor-not-allowed h-10"
                    />
                  </div>

                  {/* Descuento */}
                  <div style={{ gridArea: "descuento", width: "90px" }}>
                    <label className="text-sm font-medium mb-2 block">Desc. (%)</label>
                    <Input
                      type="number"
                      min="0"
                      value={item.discountPercentage}
                      onChange={(e) => handleDiscountChange(index, e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          updateProduct(index, "discountPercentage", 100);
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
                      className="h-10 w-10 p-0 cursor-pointer bg-black"
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

