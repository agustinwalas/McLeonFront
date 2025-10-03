import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSalesStore } from "@/store/useSales"; // ✅ Store unificado
import { Client } from "../newSale/formComponents/Client";
import { PaymentAndShipping } from "../newSale/formComponents/PaymentAndShipping";
import { Products } from "../newSale/formComponents/Products";
import { Summary } from "../newSale/formComponents/Summary";
import { Notes } from "../newSale/formComponents/Notes";
import { Loader2 } from "lucide-react";

export const EditSaleForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ✅ Usar store unificado
  const {
    selectedProducts,
    isSubmitting,
    isLoading,
    error,
    currentSale,
    updateSale,
    loadSaleForEdit,
    resetForm,
    formData,
  } = useSalesStore();

  // Load sale for editing on mount
  useEffect(() => {
    if (id) {
      loadSaleForEdit(id);
    }

    return () => {
      resetForm();
    };
  }, [id, loadSaleForEdit, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      console.error("❌ No se encontró ID de venta");
      return;
    }

    console.log("📦 Datos enviados para actualizar:", {
      id,
      formData,
      selectedProducts,
      timestamp: new Date().toISOString(),
    });

    const success = await updateSale(id);

    if (success) {
 
      navigate("/admin/ventas");
    }
  };

  const handleCancel = () => {
    navigate("/admin/ventas");
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <div className="text-lg">Cargando venta...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-600 text-lg font-medium">
          Error al cargar la venta
        </div>
        <div className="text-gray-600 text-sm">{error}</div>
        <Button onClick={() => navigate("/admin/ventas")} variant="outline">
          Volver a ventas
        </Button>
      </div>
    );
  }

  if (!currentSale) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-gray-600 text-lg">Venta no encontrada</div>
        <Button onClick={() => navigate("/admin/ventas")} variant="outline">
          Volver a ventas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información de la venta */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          ✏️ Editando Venta {currentSale.saleNumber}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <span className="font-medium">Cliente:</span>{" "}
            {currentSale.client?.name || "N/A"}
          </div>
          <div>
            <span className="font-medium">Total:</span> $
            {currentSale.totalAmount?.toLocaleString("es-AR")}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Client />
          <PaymentAndShipping />
        </div>

        <Products />

        <Summary />

        <Notes />

        {/* Botones */}
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
                Actualizando...
              </>
            ) : (
              "Actualizar Venta"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
