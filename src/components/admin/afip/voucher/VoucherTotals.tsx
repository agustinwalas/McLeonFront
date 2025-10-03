import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface VoucherTotalsProps {
  control: Control<any>;
}

export function VoucherTotals({ control }: VoucherTotalsProps) {
  return (
    <div className="space-y-4">

      {/* Campos ocultos para moneda fija en pesos */}
      <FormField
        control={control}
        name="monId"
        render={({ field }) => <input type="hidden" {...field} value="PES" />}
      />
      <FormField
        control={control}
        name="monCotiz"
        render={({ field }) => <input type="hidden" {...field} value={1} />}
      />

      {/* Totales calculados */}
      <div className="mt-6">
        <h4 className="font-medium mb-5">📊 Totales Calculados</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="impNeto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtotal Neto ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    value={field.value}
                    disabled
                    className="font-medium"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="impIVA"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Total IVA ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    value={field.value}
                    disabled
                    className="font-medium"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="impTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">TOTAL FINAL ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    value={field.value}
                    disabled
                    className="font-bold text-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
