import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { UseFormReturn } from "react-hook-form"
import { ProductFormData } from "./forms/schemas/productSchema";

interface ProductActiveShopifyProps {
  form: UseFormReturn<ProductFormData>;
}

export const ProductActiveShopify = ({ form }: ProductActiveShopifyProps) => {
  return (
    <FormField
      control={form.control}
      name="activeInShopify"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel className="text-base font-medium">
              Activo en Shopify
            </FormLabel>
            <div className="text-sm text-muted-foreground">
              Sincronizar este producto con tu tienda de Shopify
            </div>
          </div>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}