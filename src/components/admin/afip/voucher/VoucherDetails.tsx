import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CBTE_TIPO, DOCTIPO, onlyDigits, EMISOR_CONFIG } from "../constants/afipConstants";
import { VoucherFormData } from "../schemas/voucherSchema";

interface VoucherDetailsProps {
  control: Control<any>;
  setValue: UseFormSetValue<VoucherFormData>;
}

export function VoucherDetails({ control, setValue }: VoucherDetailsProps) {
  // ✅ Observar el tipo de documento para auto-completación
  const docTipo = useWatch({ control, name: "docTipo" });
  const isConsumidorFinal = docTipo === 99;

  return (
    <div className="space-y-6">
      {/* Sección Emisor */}
      <div>
        <h3 className="text-lg font-medium mb-4">📤 Datos del Emisor</h3>
        {/* Campos ocultos para datos del emisor */}
        <FormField
          control={control}
          name="emisorCuit"
          render={({ field }) => (
            <input type="hidden" {...field} value={EMISOR_CONFIG.CUIT} />
          )}
        />
        
        <FormField
          control={control}
          name="ptoVta"
          render={({ field }) => (
            <input type="hidden" {...field} value={EMISOR_CONFIG.PUNTO_VENTA} />
          )}
        />

        {/* Panel informativo del emisor */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-900">Razón Social</label>
              <p className="text-sm text-gray-800 font-medium">{EMISOR_CONFIG.RAZON_SOCIAL}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">CUIT</label>
              <p className="text-sm text-gray-800 font-mono">{EMISOR_CONFIG.CUIT}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Punto de Venta</label>
              <p className="text-sm text-gray-800 font-mono">{EMISOR_CONFIG.PUNTO_VENTA.toString().padStart(4, '0')}</p>
            </div>
          </div>
        </div>

        {/* Tipo de comprobante (editable) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="cbteTipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Comprobante</FormLabel>
                <FormControl>
                  <select
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {CBTE_TIPO.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Sección Receptor */}
      <div>
        <h3 className="text-lg font-medium mb-4">📥 Datos del Receptor</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={control}
            name="docTipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo Documento</FormLabel>
                <FormControl>
                  <select
                    value={field.value}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      field.onChange(v);
                      if (v === 99) {
                        setValue("docNro", "0");
                      }
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {DOCTIPO.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
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
            name="docNro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Número Documento
                  {isConsumidorFinal && (
                    <span className="text-xs text-gray-500 ml-2">(Auto: 0)</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={isConsumidorFinal ? "0 (Consumidor Final)" : "CUIT/CUIL/DNI"}
                    value={isConsumidorFinal ? "0" : field.value}
                    onChange={(e) => {
                      if (!isConsumidorFinal) {
                        field.onChange(onlyDigits(e.target.value));
                      }
                    }}
                    disabled={isConsumidorFinal}
                    className={isConsumidorFinal ? "bg-gray-100 text-gray-600" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="nombreReceptor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre/Razón Social</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={
                      isConsumidorFinal 
                        ? "Consumidor Final" 
                        : "Cliente S.A. / Juan Pérez"
                    } 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="cbteFch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha (AAAAMMDD)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="20250825"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ""))
                    }
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
