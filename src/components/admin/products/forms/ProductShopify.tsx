import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "./schemas/productSchema";

interface ProductShopifyProps {
  form: UseFormReturn<ProductFormData>;
}

export function ProductShopify({ form }: ProductShopifyProps) {
  return (
    <FormField
      control={form.control}
      name="activeInShopify"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel className="text-sm font-normal">
            Activo en Shopify
          </FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
