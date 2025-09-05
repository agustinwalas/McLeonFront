import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { ISalePopulated } from "@/types/sale";
import { voucherSchema, VoucherFormData } from "../schemas/voucherSchema";
import { populateFromSale } from "../utils/afipMappers";
import { yyyymmdd } from "../constants/afipConstants";

interface UseVoucherFormProps {
  sale?: ISalePopulated | null;
  defaults?: Partial<VoucherFormData>;
}

export function useVoucherForm({ sale, defaults }: UseVoucherFormProps) {
  // ✅ Combinar defaults con datos de la venta
  const getInitialValues = (): Partial<VoucherFormData> => {
    let initialValues: Partial<VoucherFormData> = {
      emisorCuit: "",
      ptoVta: 1,
      cbteTipo: 6,
      docTipo: 99,
      docNro: "0",
      nombreReceptor: "",
      cbteFch: yyyymmdd(new Date()),
      impTotConc: 0,
      impOpEx: 0,
      impTrib: 0,
      impNeto: 0,
      impIVA: 0,
      impTotal: 0,
      iva: [{ Id: 5, BaseImp: 0, Importe: 0 }],
      monId: "PES",
      monCotiz: 1,
    };

    // ✅ Si hay venta, popular desde ella
    if (sale) {
      const saleData = populateFromSale(sale);
      initialValues = { ...initialValues, ...saleData };
    }

    // ✅ Si hay defaults, sobrescribir
    if (defaults) {
      initialValues = { ...initialValues, ...defaults };
    }

    return initialValues;
  };

  const form = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: getInitialValues(),
  });

  // ✅ Re-popular cuando cambie la venta
  useEffect(() => {
    if (sale) {
      const saleData = populateFromSale(sale);
      console.log("🔄 Actualizando formulario con nueva venta");
      
      // Reset con los nuevos datos
      form.reset({
        ...form.getValues(),
        ...saleData,
      });

      // Recalcular totales
      setTimeout(() => {
        recalc();
      }, 100);
    }
  }, [sale]);

  // Función para recalcular totales
  function recalc() {
    const iva = form.getValues("iva");
    const impIVA = iva.reduce((a, r) => a + (Number(r.Importe) || 0), 0);
    const impNeto = iva.reduce((a, r) => a + (Number(r.BaseImp) || 0), 0);
    const impTotConc = Number(form.getValues("impTotConc") || 0);
    const impOpEx = Number(form.getValues("impOpEx") || 0);
    const impTrib = Number(form.getValues("impTrib") || 0);
    const impTotal = impNeto + impIVA + impTotConc + impOpEx + impTrib;

    form.setValue("impIVA", Number(impIVA.toFixed(2)));
    form.setValue("impNeto", Number(impNeto.toFixed(2)));
    form.setValue("impTotal", Number(impTotal.toFixed(2)));

    console.log("🧮 Totales recalculados:", {
      impNeto: Number(impNeto.toFixed(2)),
      impIVA: Number(impIVA.toFixed(2)),
      impTotal: Number(impTotal.toFixed(2))
    });
  }

  return {
    form,
    recalc,
    getInitialValues
  };
}