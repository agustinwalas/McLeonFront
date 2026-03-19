// src/components/admin/sales/newSale/formComponents/EditPriceModal.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings, Loader2 } from "lucide-react";
import { useProductStore } from "@/store/useProduct";
import { MarginInputs } from "@/components/admin/products/forms/MarginInputs";
import axios from "@/lib/axios";

interface EditPriceModalProps {
  productId: string;
  productName: string;
  priceType: "MAYORISTA" | "MINORISTA";
  isOpen: boolean;
  onClose: () => void;
  onPriceUpdated: (newUnitPrice: number, wholesalePrice: number, retailPrice: number) => void;
}

export function EditPriceModal({
  productId,
  productName,
  priceType,
  isOpen,
  onClose,
  onPriceUpdated,
}: EditPriceModalProps) {
  const [purchaseCost, setPurchaseCost] = useState<number>(0);
  const [wholesalePrice, setWholesalePrice] = useState<number>(0);
  const [retailPrice, setRetailPrice] = useState<number>(0);
  const [showMargins, setShowMargins] = useState(false);
  const [wholesaleMargin, setWholesaleMargin] = useState(1.6);
  const [retailMargin, setRetailMargin] = useState(1.8);
  const [wholesaleManual, setWholesaleManual] = useState(false);
  const [retailManual, setRetailManual] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateProduct } = useProductStore();

  // Cargar datos del producto y márgenes al abrir
  useEffect(() => {
    if (isOpen && productId) {
      // Cargar márgenes
      axios.get("/marginConfig").then((res) => {
        if (res.data) {
          setWholesaleMargin(res.data.wholesaleMargin);
          setRetailMargin(res.data.retailMargin);
        }
      });

      // Cargar datos actuales del producto
      axios.get(`/products/${productId}`).then((res) => {
        const product = res.data;
        setPurchaseCost(product.purchaseCost || 0);
        setWholesalePrice(product.wholesalePrice || 0);
        setRetailPrice(product.retailPrice || 0);
        setWholesaleManual(false);
        setRetailManual(false);
      });
    }
  }, [isOpen, productId]);

  // Recalcular precios cuando cambia el costo base
  useEffect(() => {
    if (purchaseCost > 0) {
      const calcWholesale = Math.round(purchaseCost * wholesaleMargin * 100) / 100;
      const calcRetail = Math.round(purchaseCost * retailMargin * 100) / 100;

      if (!wholesaleManual) setWholesalePrice(calcWholesale);
      if (!retailManual) setRetailPrice(calcRetail);
    }
  }, [purchaseCost, wholesaleMargin, retailMargin, wholesaleManual, retailManual]);

  const handlePurchaseCostChange = (value: number) => {
    setPurchaseCost(value);
    setWholesaleManual(false);
    setRetailManual(false);
  };

  const handleSubmit = async () => {
    if (!productId) return;

    setIsSubmitting(true);
    try {
      await updateProduct(productId, {
        purchaseCost,
        wholesalePrice,
        retailPrice,
      });

      // Devolver el precio según el tipo seleccionado
      const newUnitPrice = priceType === "MAYORISTA" ? wholesalePrice : retailPrice;
      onPriceUpdated(newUnitPrice, wholesalePrice, retailPrice);
      onClose();
    } catch (error) {
      console.error("Error al actualizar precios:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Editar Precios</DialogTitle>
          <DialogDescription>
            Actualiza los precios de <strong>{productName}</strong>
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="grid gap-4 py-4">
            {/* Precio Costo */}
            <div className="grid gap-2">
              <Label htmlFor="purchaseCost">Precio Costo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="purchaseCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={purchaseCost}
                  onChange={(e) => handlePurchaseCostChange(parseFloat(e.target.value) || 0)}
                  placeholder="1500.00"
                />
                <button
                  type="button"
                  className="p-2 rounded hover:bg-gray-200"
                  onClick={() => setShowMargins((v) => !v)}
                  aria-label="Configurar márgenes"
                >
                  <Settings size={20} />
                </button>
              </div>
              {showMargins && (
                <MarginInputs
                  wholesaleMargin={wholesaleMargin}
                  retailMargin={retailMargin}
                  onChange={(type, value) => {
                    if (type === "wholesale") {
                      setWholesaleMargin(value);
                      setWholesaleManual(false);
                    }
                    if (type === "retail") {
                      setRetailMargin(value);
                      setRetailManual(false);
                    }
                  }}
                />
              )}
            </div>

            {/* Precio Mayorista y Minorista */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="wholesalePrice">
                  Precio Mayorista
                  {priceType === "MAYORISTA" && (
                    <span className="ml-1 text-xs text-blue-600 font-normal">(activo)</span>
                  )}
                </Label>
                <Input
                  id="wholesalePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={wholesalePrice}
                  onChange={(e) => {
                    setWholesalePrice(parseFloat(e.target.value) || 0);
                    setWholesaleManual(true);
                  }}
                  placeholder="1500.00"
                  className={priceType === "MAYORISTA" ? "border-blue-400 ring-1 ring-blue-200" : ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="retailPrice">
                  Precio Minorista
                  {priceType === "MINORISTA" && (
                    <span className="ml-1 text-xs text-blue-600 font-normal">(activo)</span>
                  )}
                </Label>
                <Input
                  id="retailPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={retailPrice}
                  onChange={(e) => {
                    setRetailPrice(parseFloat(e.target.value) || 0);
                    setRetailManual(true);
                  }}
                  placeholder="2000.00"
                  className={priceType === "MINORISTA" ? "border-blue-400 ring-1 ring-blue-200" : ""}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Aplicar Precios"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
