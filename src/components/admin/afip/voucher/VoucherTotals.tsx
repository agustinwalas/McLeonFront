import { Control, useWatch } from "react-hook-form";
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
  onRecalc: () => void;
}

// ✅ Opciones de monedas sin cotización predefinida
const MONEDAS_OPTIONS = [
  { value: "PES", label: "Pesos Argentinos", symbol: "$" },
  { value: "USD", label: "Dólares Estadounidenses", symbol: "US$" },
  { value: "EUR", label: "Euros", symbol: "€" },
  { value: "BRL", label: "Reales Brasileños", symbol: "R$" },
  { value: "JPY", label: "Yenes Japoneses", symbol: "¥" },
  { value: "GBP", label: "Libras Esterlinas", symbol: "£" },
];

export function VoucherTotals({ control, onRecalc }: VoucherTotalsProps) {
  // ✅ Observar valores para calcular conversión
  const monId = useWatch({ control, name: "monId", defaultValue: "PES" });
  const monCotiz = useWatch({ control, name: "monCotiz", defaultValue: 1 });
  const impTotal = useWatch({ control, name: "impTotal", defaultValue: 0 });

  // ✅ Encontrar la moneda seleccionada
  const selectedMoneda =
    MONEDAS_OPTIONS.find((m) => m.value === monId) || MONEDAS_OPTIONS[0];

  // ✅ Calcular total en la moneda seleccionada
  const totalEnMonedaSeleccionada = monCotiz > 0 ? impTotal / monCotiz : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">💰 Importes y Totales</h3>

      {/* Importes adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="impTotConc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No Gravado ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    onRecalc();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="impOpEx"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exento ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    onRecalc();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="impTrib"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tributos ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    onRecalc();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* ✅ Moneda seleccionable */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="monId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moneda</FormLabel>
              <FormControl>
                <select
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    onRecalc();
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {MONEDAS_OPTIONS.map((moneda) => (
                    <option key={moneda.value} value={moneda.value}>
                      {moneda.symbol} {moneda.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="monCotiz"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cotización</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.0001"
                  placeholder="1.0000"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                    onRecalc();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Totales calculados */}
      <div className="mt-6">
        <h4 className="font-medium mb-5">
          📊 Totales Calculados
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="impNeto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Subtotal Neto (ARS)
                </FormLabel>
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
                <FormLabel className="">Total IVA (ARS)</FormLabel>
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
                <FormLabel className="font-medium">
                  TOTAL FINAL (ARS)
                </FormLabel>
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

      {/* ✅ Mostrar total convertido en la moneda seleccionada */}
      {monId !== "PES" && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-medium mb-2 text-green-900">
            💱 Conversión de Moneda
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-green-700 mb-1">
                Total en Pesos Argentinos:
              </p>
              <p className="text-lg font-bold text-green-900">
                ${" "}
                {impTotal.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                ARS
              </p>
            </div>
            <div>
              <p className="text-sm text-green-700 mb-1">
                Total en {selectedMoneda.label}:
              </p>
              <p className="text-lg font-bold text-green-900">
                {selectedMoneda.symbol}{" "}
                {totalEnMonedaSeleccionada.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {monId}
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600">
            Cotización: 1 {monId} = ${monCotiz.toLocaleString("es-AR")} ARS
          </div>
        </div>
      )}
    </div>
  );
}
