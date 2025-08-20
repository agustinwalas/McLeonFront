import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewSale } from "@/store/useNewSale";

export const Notes = () => {
  // Store hooks
  const { formData, setFormField } = useNewSale();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notas Adicionales</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormField('notes', e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Notas adicionales sobre la venta..."
          />
        </div>
      </CardContent>
    </Card>
  );
};
