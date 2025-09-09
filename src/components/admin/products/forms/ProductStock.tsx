import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "./schemas/productSchema";

interface ProductStockProps {
  form: UseFormReturn<ProductFormData>;
}

export function ProductStock({ form }: ProductStockProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="currentStock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stock Actual</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="10" 
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="minimumStock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stock Mínimo</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="2" 
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
