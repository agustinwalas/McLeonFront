import { Control, UseFormSetValue } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CBTE_TIPO, DOCTIPO, onlyDigits } from "../constants/afipConstants";
import { VoucherFormData } from "../schemas/voucherSchema";

interface VoucherDetailsProps {
  control: Control<any>;
  setValue: UseFormSetValue<VoucherFormData>;
}

export function VoucherDetails({ control, setValue }: VoucherDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Sección Emisor */}
      <div>
        <h3 className="text-lg font-medium mb-4">📤 Datos del Emisor</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="emisorCuit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CUIT Emisor</FormLabel>
                <FormControl>
                  <Input placeholder="20123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="ptoVta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Punto de Venta</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormLabel>Número Documento</FormLabel>
                <FormControl>
                  <Input
                    placeholder="CUIT/CUIL/DNI o 0"
                    value={field.value}
                    onChange={(e) => field.onChange(onlyDigits(e.target.value))}
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
                  <Input placeholder="Cliente S.A. / Juan Pérez" {...field} />
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
