import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "./schemas/productSchema";
import { UnitOfMeasure } from "@/types/product";
import { ICategory } from "@/types";

interface ProductBasicInfoProps {
  form: UseFormReturn<ProductFormData>;
  categories: ICategory[];
}

export function ProductBasicInfo({ form, categories }: ProductBasicInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="productCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Código del Producto</FormLabel>
            <FormControl>
              <Input placeholder="Ej: PROD001" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre del Producto</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Torta de Chocolate" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoría</FormLabel>
            <FormControl>
              <select
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Sin categoría</option>
                {categories.map((cat: ICategory) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="unitOfMeasure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unidad de Medida</FormLabel>
            <FormControl>
              <select
                value={field.value}
                onChange={(e) => field.onChange(e.target.value as UnitOfMeasure)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={UnitOfMeasure.UNIDAD}>Unidad</option>
                <option value={UnitOfMeasure.GRAMO}>Gramo</option>
                <option value={UnitOfMeasure.KILOGRAMO}>Kilogramo</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
