import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "./schemas/productSchema";
import { SimpleRichTextEditor } from "./SimpleRichTextEditor";

interface ProductShopifyProps {
  form: UseFormReturn<ProductFormData>;
}

export function ProductShopify({ form }: ProductShopifyProps) {
  return (
    <div className="space-y-4">

      <FormField
        control={form.control}
        name="shopifyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre Shopify</FormLabel>
            <FormControl>
              <Input placeholder="Nombre personalizado para Shopify" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <SimpleRichTextEditor
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Descripción detallada del producto para mostrar en Shopify..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

    </div>
  );
}
