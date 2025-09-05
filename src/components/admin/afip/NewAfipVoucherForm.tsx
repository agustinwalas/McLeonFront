import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAfipStore } from "@/store/useAfip";
import { useSalesStore } from "@/store/useSales";
import { VoucherDetails } from "./voucher/VoucherDetails";
import { VoucherProducts } from "./voucher/VoucherProducts";
import { VoucherTotals } from "./voucher/VoucherTotals";
import { LoadingState, ErrorState, NotFoundState } from "./components/VoucherStates";
import { useVoucherForm } from "./hooks/useVoucherForm";
import { createAfipPayload } from "./utils/afipMappers";
import { yyyymmdd } from "./constants/afipConstants";
import { VoucherFormData } from "./schemas/voucherSchema";
import { ISalePopulated } from "@/types/sale";

interface Props {
  defaults?: Partial<VoucherFormData>;
  onSuccess?: (cae?: string) => void;
}

export function NewAfipVoucherForm({ defaults, onSuccess }: Props) {
  const { id } = useParams<{ id: string }>(); 
  const { createVoucher, loading: afipLoading } = useAfipStore();
  const { getSaleById, isLoading: saleLoading, error: saleError } = useSalesStore();

  
  // ✅ Estado local para la venta
  const [sale, setSale] = useState<ISalePopulated | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  // ✅ Función para fetch de la venta
  const fetchSale = async (id: string) => {
    setFetchAttempted(false);// Limpiar errores previos
    setSale(null);
    
    try {
      console.log("🔍 Buscando venta con ID:", id);
      
      const saleData = await getSaleById(id);
      
      console.log('DATOS')
      console.log('DATOS' + JSON.stringify(saleData))
      
      if (saleData) {
        console.log("✅ Venta encontrada:", saleData.saleNumber);
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
  };

  // ✅ Fetch de la venta al cargar el componente
  useEffect(() => {
    if (id) {
      fetchSale(id);
    } else {
      console.warn("⚠️ No se proporcionó ID de venta en la URL");
      setFetchAttempted(true);
    }
  }, [id]);

  // ✅ Custom hooks
  const { form, recalc, getInitialValues } = useVoucherForm({ sale, defaults });

  // ✅ Submit handler
  async function onSubmit(values: VoucherFormData) {
    try {
      console.log("🚀 Creando comprobante AFIP:", values);
      console.log("📋 Datos de la venta original:", sale?.saleNumber);

      const payload = createAfipPayload(values, sale);

      console.log("📤 Payload enviado:", payload);

      const resp = await createVoucher(payload);
      
      console.log("✅ Comprobante creado:", resp);
      
      onSuccess?.(resp?.CAE);
      
      // Reset solo si no hay venta (para evitar perder datos)
      if (!sale) {
        form.reset({
          ...getInitialValues(),
          cbteFch: yyyymmdd(new Date()),
        });
      }
    } catch (error: any) {
      console.error("❌ Error creando comprobante AFIP:", error?.response?.data || error);
    }
  }

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
      <div className="mb-6">
        <h2 className="text-2xl font-bold">📄 Nuevo Comprobante AFIP</h2>
        <p className="text-gray-600">
          {sale 
            ? `Generar comprobante para venta ${sale.saleNumber}` 
            : "Complete los datos para generar el comprobante electrónico"
          }
        </p>
        {sale && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm">
              <p><strong>Cliente:</strong> {sale.client.name}</p>
              <p><strong>Total:</strong> ${sale.totalAmount}</p>
              <p><strong>Condición IVA:</strong> {sale.client.taxCondition}</p>
              <p><strong>Cuit:</strong>{sale.client.cuit}</p>
            </div>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
          
          {/* Detalles del comprobante */}
          <VoucherDetails 
            control={form.control} 
            setValue={form.setValue}
          />

          {/* Productos e IVA */}
          <VoucherProducts 
            control={form.control} 
            onRecalc={recalc}
          />

          {/* Totales */}
          <VoucherTotals 
            control={form.control} 
            onRecalc={recalc}
          />

          {/* Botón submit */}
          <div className="sticky bottom-0 bg-white p-4 border-t">
            <Button type="submit" disabled={afipLoading} className="w-full">
              {afipLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando comprobante AFIP...
                </>
              ) : (
                "🚀 Generar Comprobante AFIP"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
