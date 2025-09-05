import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalesStore } from "@/store/useSales"; 


export const Notes = () => {
  const { formData, updateFormData } = useSalesStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>📝 Notas Adicionales</CardTitle>
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
