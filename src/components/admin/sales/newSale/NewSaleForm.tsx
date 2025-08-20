import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNewSale } from "@/store/useNewSale";
import { Client } from "./formComponents/Client";
import { PaymentAndShipping } from "./formComponents/PaymentAndShipping";
import { Products } from "./formComponents/Products";
import { Summary } from "./formComponents/Summary";
import { Notes } from "./formComponents/Notes";

export const NewSaleForm = () => {
  // New Sale Store
  const {
    selectedProducts,
    isSubmitting,
    isLoading,
    submitSale,
    initialize,
    resetForm,
    formData, // ✅ Agregado para acceder a los datos del formulario
  } = useNewSale();

  // Initialize store on mount
  useEffect(() => {
    initialize();
    return () => {
      resetForm(); 
    };
  }, [initialize, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ Console.log del objeto que se envía al backend
    console.log("📦 Datos enviados al backend:", {
      formData,
      selectedProducts,
      timestamp: new Date().toISOString()
    });
    
    // ✅ Console.log más detallado del objeto final
    const saleData = {
      ...formData,
      products: selectedProducts
    };
    
    console.log("🚀 Objeto final de venta:", saleData);
    console.log("🏷️ JSON stringify:", JSON.stringify(saleData, null, 2));
    
    await submitSale();
  };

  const handleCancel = () => {
    window.location.href = "/admin/ventas";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
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
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || selectedProducts.length === 0}
        >
          {isSubmitting ? "Creando..." : "Crear Venta"}
        </Button>
      </div>
    </form>
  );
};