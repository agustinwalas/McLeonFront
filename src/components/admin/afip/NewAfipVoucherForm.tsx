import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2, AlertTriangle, Printer } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useWatch } from "react-hook-form";
import { useAfipStore } from "@/store/useAfip";
import { useSalesStore } from "@/store/useSales";
import { VoucherDetails } from "./voucher/VoucherDetails";
import { VoucherProducts } from "./voucher/VoucherProducts";
import { VoucherTotals } from "./voucher/VoucherTotals";
import {
  LoadingState,
  ErrorState,
  NotFoundState,
} from "./components/VoucherStates";
import { useVoucherForm } from "./hooks/useVoucherForm";
import { createAfipPayload } from "./utils/afipMappers";
import { VoucherFormData } from "./schemas/voucherSchema";
import { ISalePopulated } from "@/types/sale";
import { PrintVoucher, PrintVoucherRef } from "./components/PrintVoucher";

interface Props {
  defaults?: Partial<VoucherFormData>;
  onSuccess?: (cae?: string) => void;
}

export function NewAfipVoucherForm({ defaults, onSuccess }: Props) {
  const { id } = useParams<{ id: string }>();
  const { createVoucher, loading: afipLoading } = useAfipStore();
  const {
    getSaleById,
    isLoading: saleLoading,
    error: saleError,
  } = useSalesStore();

  // ✅ Estado local para la venta
  const [sale, setSale] = useState<ISalePopulated | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  // ✅ Ref para el componente de impresión
  const printRef = useRef<PrintVoucherRef>(null);

  // ✅ Función para fetch de la venta
  const fetchSale = useCallback(async (id: string) => {
    setFetchAttempted(false); // Limpiar errores previos
    setSale(null);

    try {
      const saleData = await getSaleById(id);

      if (saleData) {
        setSale(saleData);
      } else {
        console.warn("⚠️ No se encontró la venta");
        setSale(null);
      }
    } catch (error: any) {
      console.error("❌ Error al buscar venta:", error);
      setSale(null);
    } finally {
      setFetchAttempted(true);
    }
  }, [getSaleById]);

  // ✅ Fetch de la venta al cargar el componente
  useEffect(() => {
    if (id) {
      fetchSale(id);
    } else {
      console.warn("⚠️ No se proporcionó ID de venta en la URL");
      setFetchAttempted(true);
    }
  }, [id, fetchSale]);

  // ✅ Custom hooks
  const { form, recalc, getInitialValues } = useVoucherForm({ sale, defaults });

  // ✅ Observar valores del formulario para validaciones
  const cbteTipo = useWatch({ control: form.control, name: "cbteTipo" });
  const docTipo = useWatch({ control: form.control, name: "docTipo" });

  // ✅ Validar si la combinación es inválida
  const isInvalidCombination = cbteTipo === 1 && (docTipo === 96 || docTipo === 99); // Factura A con DNI o Consumidor Final
  const isButtonDisabled = afipLoading || isInvalidCombination;

  // ✅ Función helper para formato de fecha
  const yyyymmdd = (date: Date): string => {
    return date.toISOString().slice(0, 10).replace(/-/g, '');
  };

  // ✅ Submit handler - PRODUCCIÓN
  async function onSubmit(values: VoucherFormData) {
    try {
      const payload = createAfipPayload(values, sale);

      const resp = await createVoucher(payload);

      onSuccess?.(resp?.CAE);

      // Reset solo si no hay venta (para evitar perder datos)
      if (!sale) {
        form.reset({
          ...getInitialValues(),
          cbteFch: yyyymmdd(new Date()),
        });
      }
    } catch (error: any) {
      console.error(
        "❌ Error creando comprobante AFIP:",
        error?.response?.data || error
      );
    }
  }

  // ✅ Función para probar la impresión con datos random
  const handleTestPrint = () => {
    if (printRef.current) {
      printRef.current.print();
    }
  };

  // ✅ Datos de prueba para el PrintVoucher
  const mockPrintData = {
    cbteTipo: 1,
    ptoVta: 1,
    cbteDesde: 123,
    cbteHasta: 123,
    cbteFch: "20251003",
    cae: "74123456789012",
    vencimiento: "20251013",
    docTipo: 80,
    docNro: "20123456784",
    nombreReceptor: "Juan Pérez Cliente de Prueba S.A.",
    impNeto: 13000.00,
    impIVA: 2750.50,
    impTotal: 15750.50,
    monId: "PES",
    monCotiz: 1,
    iva: [
      {
        Id: 5,
        BaseImp: 10000.00,
        Importe: 2100.00,
        productName: "Producto Premium"
      },
      {
        Id: 4,
        BaseImp: 3000.00,
        Importe: 650.50,
        productName: "Consultoría Especializada"
      }
    ]
  };

  if (saleLoading) {
    return <LoadingState message="Cargando datos de la venta..." />;
  }

  if (saleError && fetchAttempted) {
    return <ErrorState error={saleError} onRetry={() => id && fetchSale(id)} />;
  }

  if (!sale && id && fetchAttempted) {
    return <NotFoundState id={id} />;
  }

  if (id && !fetchAttempted) {
    return <LoadingState message="Inicializando..." />;
  }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit as any)}
          className="space-y-8"
        >
          {/* Detalles del comprobante */}
          <VoucherDetails control={form.control} setValue={form.setValue} />

          {/* Productos e IVA */}
          <VoucherProducts control={form.control} onRecalc={recalc} setValue={form.setValue} />

          {/* Totales */}
          <VoucherTotals control={form.control}/>

          {/* Alerta de validación */}
          {isInvalidCombination && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">
                  ⚠️ Combinación no válida para AFIP
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  <strong>Factura A</strong> requiere que el receptor tenga <strong>CUIT</strong>, no DNI ni Consumidor Final.
                  <br />
                  Por favor cambia a:
                </p>
                <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
                  <li><strong>Factura B</strong> (para consumidores con DNI o consumidores finales)</li>
                  <li>O ingresa el <strong>CUIT del cliente</strong> si es responsable inscripto</li>
                </ul>
              </div>
            </div>
          )}

          {/* Botón submit */}
          <div className="sticky bottom-0 bg-white p-4 border-t space-y-3">
            <Button 
              type="submit" 
              disabled={isButtonDisabled} 
              className={`w-full ${isInvalidCombination ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {afipLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando comprobante AFIP...
                </>
              ) : (
                "🚀 Generar Comprobante AFIP"
              )}
            </Button>

            {/* Botón de prueba para imprimir */}
            <Button 
              type="button"
              variant="outline"
              onClick={handleTestPrint}
              className="w-full"
            >
              <Printer className="mr-2 h-4 w-4" />
              Probar Impresión (Datos de prueba)
            </Button>
            
            {isInvalidCombination && (
              <p className="text-xs text-red-600 text-center mt-2">
                Corrige la combinación Tipo de Comprobante / Tipo de Documento para continuar
              </p>
            )}
          </div>
        </form>
      </Form>

      {/* Componente de impresión (oculto) */}
      <PrintVoucher 
        ref={printRef}
        data={mockPrintData}
      />
    </div>
  );
}
