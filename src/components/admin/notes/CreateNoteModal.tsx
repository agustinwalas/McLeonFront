import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Trash2, Plus } from "lucide-react";
import {
  NoteType,
  CreateNoteItem,
  DEBIT_REASON_LABELS,
  CREDIT_REASON_LABELS,
} from "../../../types/note";
import { useNoteActions } from "../../../store/useNote";
import { toast } from "sonner";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: any; // Sale object
  noteType: NoteType;
  onSuccess?: () => void;
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  sale,
  noteType,
  onSuccess,
}) => {
  const { createCreditNote, createDebitNote, canCreateNote, sendNoteToAfip } = useNoteActions();

  const [formData, setFormData] = useState({
    reason: "",
    customReason: "",
    description: "",
    items: [] as CreateNoteItem[],
  });

  const [loading, setLoading] = useState(false);
  const [sendToAfip, setSendToAfip] = useState(true); // Enviar a AFIP por defecto

  // Resetear formulario cuando se abre el modal y cargar productos originales
  useEffect(() => {
    if (isOpen && sale?.products) {
      // Convertir productos de la venta original al formato de CreateNoteItem
      const originalItems: CreateNoteItem[] = sale.products.map((product: any) => ({
        productName: product.product?.name || product.productName || 'Producto sin nombre',
        productCode: product.product?.productCode || product.productCode || '',
        quantity: product.quantity || 1,
        unitPrice: product.unitPrice || 0,
        description: `${product.product?.description || ''}`
      }));

      setFormData({
        reason: "",
        customReason: "",
        description: `Nota de ${noteType.toLowerCase()} para factura ${sale.saleNumber}`,
        items: originalItems,
      });
    }
  }, [isOpen, sale, noteType]);

  // Verificar si la venta puede tener notas
  if (!canCreateNote(sale)) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>No se puede crear nota</DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Esta venta no tiene un CAE válido de AFIP. Solo se pueden crear
              notas sobre facturas electrónicas.
            </p>
            <Button onClick={onClose}>Entendido</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const reasonOptions =
    noteType === NoteType.DEBITO
      ? Object.entries(DEBIT_REASON_LABELS).map(([key, label]) => ({
          value: key,
          label,
        }))
      : Object.entries(CREDIT_REASON_LABELS).map(([key, label]) => ({
          value: key,
          label,
        }));

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productName: "",
          productCode: "",
          quantity: 1,
          unitPrice: 0,
          description: "",
        },
      ],
    }));
  };

  const updateItem = (
    index: number,
    field: keyof CreateNoteItem,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateTotals = () => {
    // El precio unitario YA incluye IVA, entonces lo desglosamos
    const totalWithIva = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    
    // Desglosamos: Total = Neto + IVA, donde IVA = Neto * 0.21
    // Total = Neto * 1.21, entonces Neto = Total / 1.21
    const subtotal = totalWithIva / 1.21; // Neto sin IVA
    const ivaAmount = totalWithIva - subtotal; // IVA desglosado
    const total = totalWithIva; // Total ya viene con IVA incluido

    return { 
      subtotal: Math.round(subtotal * 100) / 100, // Redondear a 2 decimales
      ivaAmount: Math.round(ivaAmount * 100) / 100, 
      total 
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.reason ||
      !formData.description ||
      formData.items.length === 0
    ) {
      toast.error("Complete todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      console.log("=== CREANDO NOTA DE", noteType, "===");
      console.log("🔸 Sale ID:", sale._id);
      console.log("🔸 Motivo:", formData.reason);
      console.log("🔸 Descripción:", formData.description);
      console.log("🔸 Items:", formData.items);
      console.log("🔸 Enviar a AFIP:", sendToAfip);

      let createdNote;

      // Crear la nota según el tipo
      if (noteType === NoteType.CREDITO) {
        createdNote = await createCreditNote(
          sale._id,
          formData.reason,
          formData.description,
          formData.items
        );
      } else {
        createdNote = await createDebitNote(
          sale._id,
          formData.reason,
          formData.description,
          formData.items
        );
      }

      console.log("✅ Nota creada exitosamente:", createdNote);

      // Si la opción está habilitada, enviar directamente a AFIP
      if (sendToAfip) {
        try {
          console.log("📤 Enviando nota a AFIP...");
          const noteWithCae = await sendNoteToAfip(createdNote.id);
          console.log("✅ Nota enviada a AFIP. CAE:", noteWithCae.cae);
          toast.success(
            `Nota de ${noteType.toLowerCase()} creada y autorizada por AFIP. CAE: ${noteWithCae.cae}`
          );
        } catch (afipError: any) {
          console.error("❌ Error al enviar a AFIP:", afipError);
          toast.warning(
            `Nota creada pero error al enviar a AFIP: ${afipError.message}. Puede enviarla manualmente más tarde.`
          );
        }
      } else {
        toast.success(
          `Nota de ${noteType.toLowerCase()} creada exitosamente. Recuerde enviarla a AFIP para obtener el CAE.`
        );
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("❌ Error al crear la nota:", error);
      toast.error(error.message || "Error al crear la nota");
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, ivaAmount, total } = calculateTotals();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        style={{ maxWidth: "800px" }}
        className="max-w-9xl w-[95vw] max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>
            Crear Nota de {noteType === NoteType.DEBITO ? "Débito" : "Crédito"}
          </DialogTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">Factura: {sale?.saleNumber}</Badge>
            <Badge variant="outline">Cliente: {sale?.client?.name}</Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Motivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reason">Motivo *</Label>
              <select
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.reason}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reason: e.target.value }))
                }
              >
                <option value="">Seleccionar motivo</option>
                {reasonOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.reason === "OTROS" && (
              <div>
                <Label htmlFor="customReason">Motivo personalizado</Label>
                <Input
                  className="mt-2"
                  id="customReason"
                  value={formData.customReason}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customReason: e.target.value,
                    }))
                  }
                  placeholder="Especificar motivo"
                />
              </div>
            )}
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              className="mt-2"
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Descripción detallada de la nota"
              rows={3}
            />
          </div>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Items de la Nota</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg"
                >
                  <div className="col-span-3">
                    <Label>Producto *</Label>
                    <Input
                      value={item.productName}
                      onChange={(e) =>
                        updateItem(index, "productName", e.target.value)
                      }
                      placeholder="Nombre del producto"
                      className="mt-2"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Código</Label>
                    <Input
                      className="mt-2"
                      value={item.productCode || ""}
                      onChange={(e) =>
                        updateItem(index, "productCode", e.target.value)
                      }
                      placeholder="Código"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Cantidad *</Label>
                    <Input
                      className="mt-2"
                      type="number"
                      step="0.001"
                      min="0.001"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "quantity",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Precio Unit. *</Label>
                    <Input
                      className="mt-2"
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unitPrice",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Total</Label>
                    <Input
                      value={(item.quantity * item.unitPrice).toFixed(2)}
                      disabled
                      className="bg-muted mt-2"
                    />
                  </div>

                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {formData.items.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <p>No hay items agregados</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addItem}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar primer item
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumen de totales */}
          {formData.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA 21%:</span>
                    <span>${ivaAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Opción de envío a AFIP */}
          <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/50">
            <input
              type="checkbox"
              id="sendToAfip"
              checked={sendToAfip}
              onChange={(e) => setSendToAfip(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="sendToAfip" className="text-sm font-medium cursor-pointer">
              Enviar automáticamente a AFIP para obtener CAE
            </label>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Procesando..."
                : sendToAfip
                ? `Crear y Enviar a AFIP`
                : `Crear Nota (sin CAE)`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
