import { z } from "zod";

export const ivaSchema = z.object({
  Id: z.number().int().min(1),
  BaseImp: z.number().nonnegative(),
  Importe: z.number().nonnegative(),
  // ✅ Campos opcionales para información del producto
  productName: z.string().optional(),
  quantity: z.number().optional(),
  unitPrice: z.number().optional(),
});

export const voucherSchema = z.object({
  // Emisor
  emisorCuit: z.string().min(11, "CUIT emisor inválido"),
  ptoVta: z.number().int().positive(),
  cbteTipo: z.number().int(),

  // Receptor
  docTipo: z.number().int(),
  docNro: z.string().min(1, "Documento requerido"),
  nombreReceptor: z.string().min(1, "Nombre/Razón social requerido"),

  // Fecha
  cbteFch: z.string().min(8, "Formato AAAAMMDD"),

  // Importes
  impTotConc: z.number().nonnegative().default(0),
  impOpEx: z.number().nonnegative().default(0),
  impTrib: z.number().nonnegative().default(0),

  // Calculados
  impNeto: z.number().nonnegative(),
  impIVA: z.number().nonnegative(),
  impTotal: z.number().nonnegative(),

  // IVA detalle
  iva: z.array(ivaSchema).min(1, "Debe agregar al menos un producto"),

  // ✅ Moneda actualizada para soportar múltiples opciones
  monId: z.enum(["PES", "USD", "EUR", "BRL", "JPY", "GBP"]).default("PES"),
  monCotiz: z.number().positive().default(1),
});

export type VoucherFormData = z.infer<typeof voucherSchema>;
export type IvaData = z.infer<typeof ivaSchema>;