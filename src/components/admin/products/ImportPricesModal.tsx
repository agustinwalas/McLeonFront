import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductStore } from "@/store/useProduct";
import { Loader2, Upload, Check, X } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "sonner";

interface ImportedProduct {
  productCode: string;
  productName: string;
  newPurchaseCost: number;
  newWholesalePrice: number;
  newRetailPrice: number;
  found: boolean;
  productId?: string;
}

interface ImportPricesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportPricesModal({ isOpen, onClose }: ImportPricesModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importedProducts, setImportedProducts] = useState<ImportedProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [wholesaleMargin, setWholesaleMargin] = useState(1.6);
  const [retailMargin, setRetailMargin] = useState(1.8);
  const { products, updateProduct } = useProductStore();

  // Obtener márgenes al abrir
  useEffect(() => {
    if (isOpen) {
      axios.get("/marginConfig").then((res) => {
        if (res.data) {
          setWholesaleMargin(res.data.wholesaleMargin);
          setRetailMargin(res.data.retailMargin);
        }
      });
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      processCSV(selectedFile);
    } else {
      toast.error("Por favor selecciona un archivo CSV válido");
    }
  };

  const processCSV = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error("El archivo CSV está vacío o no tiene datos");
        setIsProcessing(false);
        return;
      }

      // Obtener encabezados (primera línea)
      const headers = lines[0].split(/[,;]/).map(h => h.trim().toLowerCase());
      
      // Buscar índices de columnas
      const codeIndex = headers.findIndex(h => h === "codigo" || h === "code");
      const priceIndex = headers.findIndex(h => h === "precio" || h === "price");

      if (codeIndex === -1 || priceIndex === -1) {
        toast.error("El CSV debe tener columnas 'codigo' y 'precio' (o 'code' y 'price')");
        setIsProcessing(false);
        return;
      }

      // Procesar productos
      const imported: ImportedProduct[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(/[,;]/).map(v => v.trim());
        const code = values[codeIndex];
        const price = parseFloat(values[priceIndex]);

        if (code && !isNaN(price)) {
          // Buscar producto en la DB
          const product = products.find(p => p.productCode === code);
          
          if (product) {
            imported.push({
              productCode: code,
              productName: product.name,
              newPurchaseCost: price,
              newWholesalePrice: Math.round(price * wholesaleMargin * 100) / 100,
              newRetailPrice: Math.round(price * retailMargin * 100) / 100,
              found: true,
              productId: product._id,
            });
          } else {
            imported.push({
              productCode: code,
              productName: "No encontrado",
              newPurchaseCost: price,
              newWholesalePrice: Math.round(price * wholesaleMargin * 100) / 100,
              newRetailPrice: Math.round(price * retailMargin * 100) / 100,
              found: false,
            });
          }
        }
      }

      setImportedProducts(imported);
      toast.success(`${imported.filter(p => p.found).length} productos encontrados`);
    } catch (error) {
      console.error("Error procesando CSV:", error);
      toast.error("Error al procesar el archivo CSV");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePriceChange = (index: number, field: 'newWholesalePrice' | 'newRetailPrice', value: number) => {
    setImportedProducts(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleUpdatePrices = async () => {
    setIsUpdating(true);
    try {
      const productsToUpdate = importedProducts.filter(p => p.found);
      
      for (const product of productsToUpdate) {
        await updateProduct(product.productId!, {
          purchaseCost: product.newPurchaseCost,
          wholesalePrice: product.newWholesalePrice,
          retailPrice: product.newRetailPrice,
        });
      }

      toast.success(`${productsToUpdate.length} productos actualizados exitosamente`);
      handleClose();
    } catch (error) {
      console.error("Error actualizando precios:", error);
      toast.error("Error al actualizar los precios");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportedProducts([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Precios desde CSV</DialogTitle>
          <DialogDescription>
            Selecciona un archivo CSV con columnas "codigo" y "precio" para actualizar los precios de los productos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("csv-file")?.click()}
              disabled={isProcessing}
            >
              <Upload className="mr-2 h-4 w-4" />
              Seleccionar CSV
            </Button>
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            {file && <span className="text-sm text-gray-600">{file.name}</span>}
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Procesando archivo...
            </div>
          )}

          {/* Products Table */}
          {importedProducts.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left w-8"></th>
                    <th className="px-4 py-2 text-left">Código</th>
                    <th className="px-4 py-2 text-left">Producto</th>
                    <th className="px-4 py-2 text-right">Precio Base</th>
                    <th className="px-4 py-2 text-right">Minorista</th>
                    <th className="px-4 py-2 text-right">Mayorista</th>
                  </tr>
                </thead>
                <tbody>
                  {importedProducts.map((product, index) => (
                    <tr key={index} className={`border-b ${!product.found ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-2">
                        {product.found ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </td>
                      <td className="px-4 py-2 font-medium">{product.productCode}</td>
                      <td className="px-4 py-2">
                        {product.found ? product.productName : (
                          <span className="text-red-600 italic">{product.productName}</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">
                        ${product.newPurchaseCost.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={product.newRetailPrice}
                          onChange={(e) => handlePriceChange(index, 'newRetailPrice', parseFloat(e.target.value) || 0)}
                          disabled={!product.found}
                          className="text-right"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={product.newWholesalePrice}
                          onChange={(e) => handlePriceChange(index, 'newWholesalePrice', parseFloat(e.target.value) || 0)}
                          disabled={!product.found}
                          className="text-right"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {importedProducts.length > 0 && (
            <div className="text-sm text-gray-600">
              {importedProducts.filter(p => p.found).length} de {importedProducts.length} productos encontrados
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleUpdatePrices}
            disabled={isUpdating || importedProducts.filter(p => p.found).length === 0}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              `Actualizar ${importedProducts.filter(p => p.found).length} productos`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
