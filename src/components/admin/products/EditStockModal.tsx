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
import { IProductPopulated } from "@/types";
import { useProductStore } from "@/store/useProduct";
import { Loader2 } from "lucide-react";

interface EditStockModalProps {
  product: IProductPopulated | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditStockModal({ product, isOpen, onClose }: EditStockModalProps) {
  const [newStock, setNewStock] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateProduct } = useProductStore();

  // Resetear el stock cuando cambia el producto
  useEffect(() => {
    if (product && isOpen) {
      setNewStock(0);
    }
  }, [product?._id, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    try {
      await updateProduct(product._id, {
        currentStock: newStock,
      });
      
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onClose();
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Stock</DialogTitle>
          <DialogDescription>
            Actualiza el stock actual de <strong>{product.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="stock">Nuevo Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="0.01"
                value={newStock}
                onChange={(e) => setNewStock(parseFloat(e.target.value) || 0)}
                disabled={isSubmitting}
                autoFocus
              />
              <p className="text-sm text-gray-500">
                Stock actual: {product.currentStock}
              </p>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
