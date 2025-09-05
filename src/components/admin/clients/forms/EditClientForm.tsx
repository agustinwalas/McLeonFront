import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import {
  TaxCondition,
  DocumentType,
  ClientType,
  IClient,
} from "@/types/client";
import { useClientStore } from "@/store/useClient";
import { z } from "zod";

// ✅ Mapeo para AfipCondicionIva
const taxConditionToAfipMap: Record<string, number> = {
  "Responsable Inscripto": 1,
  "Exento": 2,
  "Consumidor Final": 5,
  "No Responsable": 6,
  "Monotributo": 11,
  "Pequeño Contribuyente Eventual": 13,
  "Monotributo Social": 14,
  "Pequeño Contribuyente Eventual Social": 15,
  "No Categorizado": 99,
};

// ===============================
// ✅ Schema con validación condicional (igual que NewClientForm)
// ===============================
const clientFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  clientType: z.enum(["PERSONA_FISICA", "PERSONA_JURIDICA"]),
  documentType: z.string().min(1, "El tipo de documento es requerido"),
  documentNumber: z.string().min(1, "El número de documento es requerido"),
  taxCondition: z.string().min(1, "La condición fiscal es requerida"),
  email: z.string().email("Debe ser un email válido").optional().or(z.literal("")),
  phone: z.string().optional(),
  // ✅ Campos de dirección opcionales por defecto
  street: z.string().optional(),
  number: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
}).superRefine((data, ctx) => {
  // ✅ Si es Responsable Inscripto, la dirección es obligatoria
  if (data.taxCondition === "Responsable Inscripto") {
    if (!data.street || data.street.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La calle es requerida para Responsables Inscriptos",
        path: ["street"],
      });
    }
    
    if (!data.number || data.number.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El número es requerido para Responsables Inscriptos",
        path: ["number"],
      });
    }
    
    if (!data.city || data.city.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La ciudad es requerida para Responsables Inscriptos",
        path: ["city"],
      });
    }
    
    if (!data.province || data.province.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La provincia es requerida para Responsables Inscriptos",
        path: ["province"],
      });
    }
    
    if (!data.postalCode || data.postalCode.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El código postal es requerido para Responsables Inscriptos",
        path: ["postalCode"],
      });
    }
  }
});

type ClientFormData = z.infer<typeof clientFormSchema>;

interface FormProps {
  client: IClient;
  onSuccess?: () => void;
}

export function EditClientForm({ client, onSuccess }: FormProps) {
  const { updateClient, loading } = useClientStore();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: client.name || "",
      clientType: client.clientType || "PERSONA_FISICA",
      documentType: client.documentType || "",
      documentNumber: client.documentNumber || "",
      taxCondition: client.taxCondition || "",
      email: client.email || "",
      phone: client.phone || "",
      // ✅ Manejo seguro de fiscalAddress opcional
      street: client.fiscalAddress?.street || "",
      number: client.fiscalAddress?.number || "",
      city: client.fiscalAddress?.city || "",
      province: client.fiscalAddress?.province || "",
      postalCode: client.fiscalAddress?.postalCode || "",
      country: client.fiscalAddress?.country || "Argentina",
    },
  });

  // ✅ Watch para observar la condición fiscal
  const watchTaxCondition = form.watch("taxCondition");
  const isResponsableInscripto = watchTaxCondition === "Responsable Inscripto";

  // ✅ Efecto para validación cuando cambia la condición
  useEffect(() => {
    form.trigger();
  }, [isResponsableInscripto, form]);

  // ✅ Función para manejar cambio en condición fiscal
  const handleTaxConditionChange = (value: string) => {
    form.setValue("taxCondition", value);
    
    // ✅ Si selecciona Responsable Inscripto y el tipo de documento no es CUIT
    if (value === "Responsable Inscripto" && form.getValues("documentType") !== "CUIT") {
      form.setValue("documentType", "CUIT");
    }
    
    form.trigger();
  };

  async function onSubmit(values: ClientFormData) {
    try {
      const clientData: IClient = {
        ...client,
        name: values.name,
        clientType: values.clientType as ClientType,
        documentType: values.documentType as DocumentType,
        documentNumber: values.documentNumber,
        taxCondition: values.taxCondition as TaxCondition,
        afipCondicionIva: taxConditionToAfipMap[values.taxCondition],
        email: values.email || undefined,
        phone: values.phone || undefined,
        // ✅ Solo incluir fiscalAddress si hay datos o si es obligatoria
        ...(values.street || values.city || isResponsableInscripto ? {
          fiscalAddress: {
            street: values.street || "",
            number: values.number || "",
            city: values.city || "",
            province: values.province || "",
            postalCode: values.postalCode || "",
            country: values.country || "Argentina",
          }
        } : {}),
      };

      await updateClient(client._id, clientData);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating client:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre / Razón Social</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo de Cliente */}
        <FormField
          control={form.control}
          name="clientType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Cliente</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="PERSONA_FISICA">Persona Física</option>
                  <option value="PERSONA_JURIDICA">Persona Jurídica</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Tipo de Documento */}
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Documento</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="CUIT">CUIT</option>
                    <option value="DNI">DNI</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Número de Documento */}
          <FormField
            control={form.control}
            name="documentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Doc.</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 20123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ✅ Condición Fiscal con handler personalizado */}
        <FormField
          control={form.control}
          name="taxCondition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condición Fiscal</FormLabel>
              <FormControl>
                <select
                  value={field.value}
                  onChange={(e) => handleTaxConditionChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="" disabled>
                    Seleccionar condición
                  </option>
                  <option value="Responsable Inscripto">
                    Responsable Inscripto
                  </option>
                  <option value="Monotributo">Monotributo</option>
                  <option value="Consumidor Final">Consumidor Final</option>
                  <option value="Exento">Exento</option>
                  <option value="No Responsable">No Responsable</option>
                  <option value="Monotributo Social">Monotributo Social</option>
                  <option value="Pequeño Contribuyente Eventual">
                    Pequeño Contribuyente Eventual
                  </option>
                  <option value="Pequeño Contribuyente Eventual Social">
                    Pequeño Contribuyente Eventual Social
                  </option>
                  <option value="No Categorizado">No Categorizado</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="cliente@correo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Teléfono */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Número de teléfono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ✅ Sección de Dirección con indicador dinámico */}
        <div className={`space-y-4 p-4 rounded-lg border transition-all duration-300 ${
          isResponsableInscripto 
            ? 'bg-yellow-50 border-yellow-300 shadow-sm' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-sm">
                📍 Dirección Fiscal
              </h4>
              {isResponsableInscripto ? (
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  Obligatoria
                </span>
              ) : (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  Opcional
                </span>
              )}
            </div>
            
            {/* ✅ Mensaje explicativo */}
            {isResponsableInscripto && (
              <span className="text-xs text-yellow-700">
                Requerida por AFIP
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Calle */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isResponsableInscripto ? "text-gray-900" : "text-gray-600"}>
                    Calle {isResponsableInscripto && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: Av. Siempre Viva" 
                      {...field}
                      className={isResponsableInscripto ? "border-yellow-300" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número */}
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isResponsableInscripto ? "text-gray-900" : "text-gray-600"}>
                    Número {isResponsableInscripto && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: 742" 
                      {...field}
                      className={isResponsableInscripto ? "border-yellow-300" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Ciudad */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isResponsableInscripto ? "text-gray-900" : "text-gray-600"}>
                  Ciudad {isResponsableInscripto && <span className="text-red-500">*</span>}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ej: Buenos Aires" 
                    {...field}
                    className={isResponsableInscripto ? "border-yellow-300" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Provincia */}
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isResponsableInscripto ? "text-gray-900" : "text-gray-600"}>
                    Provincia {isResponsableInscripto && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: Buenos Aires" 
                      {...field}
                      className={isResponsableInscripto ? "border-yellow-300" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Código Postal */}
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isResponsableInscripto ? "text-gray-900" : "text-gray-600"}>
                    Código Postal {isResponsableInscripto && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: 1000" 
                      {...field}
                      className={isResponsableInscripto ? "border-yellow-300" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* País */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isResponsableInscripto ? "text-gray-900" : "text-gray-600"}>
                  País
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ej: Argentina" 
                    {...field}
                    className={isResponsableInscripto ? "border-yellow-300" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Botón submit */}
        <Button type="submit" disabled={loading} className="w-full mt-5">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualizando cliente...
            </>
          ) : (
            "Actualizar cliente"
          )}
        </Button>
      </form>
    </Form>
  );
}
