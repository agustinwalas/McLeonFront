import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSalesStore } from "@/store/useSales"; 
import { BadgePercent } from "lucide-react";


export const Notes = () => {
  const { formData, updateFormData } = useSalesStore();

  const formatDiscount = (value: number) =>
    Number.isInteger(value)
      ? value.toString()
      : value.toLocaleString("es-AR", { maximumFractionDigits: 2 });

  const handleAddDiscountNote = () => {
    if (!formData.totalDiscount || formData.totalDiscount <= 0) return;

    const discountNote = `Aplicado ${formatDiscount(formData.totalDiscount)}% de descuento por pago contra entrega efectivo`;
    const discountNoteRegex = /^Aplicado\s+[\d.,]+%\s+de descuento por pago contra entrega efectivo$/im;

    const cleanedNotes = formData.notes
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !discountNoteRegex.test(line))
      .join("\n");

    const nextNotes = cleanedNotes
      ? `${cleanedNotes}\n${discountNote}`
      : discountNote;

    updateFormData("notes", nextNotes);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>📝 Notas Adicionales</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAddDiscountNote}
          disabled={!formData.totalDiscount || formData.totalDiscount <= 0}
          title="Agregar nota de descuento"
          aria-label="Agregar nota de descuento"
          className="h-8 w-8"
        >
          <BadgePercent className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div>
          <textarea
            value={formData.notes}
            onChange={(e) => updateFormData('notes', e.target.value)} 
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Notas adicionales sobre la venta..."
          />
          <div className="text-xs text-gray-500 mt-2">
            {formData.notes.length}/500 caracteres
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
