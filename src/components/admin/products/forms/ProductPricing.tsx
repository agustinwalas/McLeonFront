import { useEffect, useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductFormData } from "./schemas/productSchema";
import { UseFormReturn } from "react-hook-form";
import { Settings } from "lucide-react";
import { MarginInputs } from "./MarginInputs";
import axios from "@/lib/axios";

interface ProductPricingProps {
  form: UseFormReturn<ProductFormData>;
}

export function ProductPricing({ form }: ProductPricingProps) {
  const [showMargins, setShowMargins] = useState(false);
  const [wholesaleMargin, setWholesaleMargin] = useState(1.6);
  const [retailMargin, setRetailMargin] = useState(1.8);
  const [wholesaleManual, setWholesaleManual] = useState(false);
  const [retailManual, setRetailManual] = useState(false);

  // Consultar márgenes al montar
  useEffect(() => {
    axios.get("/marginConfig").then((res) => {
      if (res.data) {
        setWholesaleMargin(res.data.wholesaleMargin);
        setRetailMargin(res.data.retailMargin);
      }
    });
  }, []);

  // Actualiza los precios cuando cambian purchaseCost o los márgenes
  const purchaseCost = form.watch("purchaseCost");
  const IVA = 1.21;
  const calcWholesale = Math.ceil(purchaseCost * wholesaleMargin * IVA);
  const calcRetail = Math.ceil(purchaseCost * retailMargin * IVA);

  // Solo autocompleta si no fue editado manualmente
  useEffect(() => {
    if (!wholesaleManual) form.setValue("wholesalePrice", calcWholesale);
    if (!retailManual) form.setValue("retailPrice", calcRetail);
  }, [purchaseCost, wholesaleMargin, retailMargin]);

  return (
    <>
      <FormField
        control={form.control}
        name="purchaseCost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio Costo</FormLabel>
            <div className="flex items-center gap-2">
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="1500.00"
                  {...field}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    setWholesaleManual(false);
                    setRetailManual(false);
                  }}
                />
              </FormControl>
              <button
                type="button"
                className="p-2 rounded hover:bg-gray-200"
                onClick={() => setShowMargins((v) => !v)}
                aria-label="Configurar márgenes"
              >
                <Settings size={20} />
              </button>
            </div>
            <FormMessage />
            {showMargins && (
              <MarginInputs
                wholesaleMargin={wholesaleMargin}
                retailMargin={retailMargin}
                onChange={(type, value) => {
                  if (type === "wholesale") {
                    setWholesaleMargin(value);
                    setWholesaleManual(false);
                  }
                  if (type === "retail") {
                    setRetailMargin(value);
                    setRetailManual(false);
                  }
                }}
              />
            )}
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="wholesalePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio Mayorista</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="1500.00"
                  {...field}
                  value={form.watch("wholesalePrice")}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    setWholesaleManual(true);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="retailPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio Minorista</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="2000.00"
                  {...field}
                  value={form.watch("retailPrice")}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    setRetailManual(true);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
