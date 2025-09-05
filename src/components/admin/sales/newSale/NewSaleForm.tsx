import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSalesStore } from "@/store/useSales"; // ✅ Store unificado
import { Client } from "./formComponents/Client";
import { PaymentAndShipping } from "./formComponents/PaymentAndShipping";
import { Products } from "./formComponents/Products";
import { Summary } from "./formComponents/Summary";
import { Notes } from "./formComponents/Notes";
import { Loader2 } from "lucide-react";

export const NewSaleForm = () => {
  const navigate = useNavigate();

  // ✅ Usar store unificado
  const {
    selectedProducts,
    isSubmitting,
    error,
    createSale,
    initializeForm,
    resetForm,
    formData,
  } = useSalesStore();

  // Initialize form on mount
  useEffect(() => {
    console.log("🔧 Inicializando NewSaleForm");
    initializeForm();
    
    return () => {
      resetForm();
    };
  }, [initializeForm, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("📦 Datos enviados al backend:", {
      formData,
      selectedProducts,
      timestamp: new Date().toISOString()
    });

    const success = await createSale();
    
    if (success) {
      console.log("✅ Venta creada exitosamente");
      navigate("/admin/ventas");
    }
  };

  const handleCancel = () => {
    navigate("/admin/ventas");
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-red-800 font-medium">Error</div>
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Client />
          <PaymentAndShipping />
        </div>

        <Products />

        <Summary />

        <Notes />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || selectedProducts.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear Venta"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};