import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useSalesStore from "@/store/useSales";
import { SaleError, SaleLoadingSkeleton, SaleNotFound } from "./SaleStates";
import { SaleHeader } from "./SaleHeader";
import { SaleInfoCard } from "./SaleInfoCard";
import { SaleProductsCard } from "./SaleProductsCard";
import { AfipSection } from "../AfipSection";


export default function SaleDetail() {
  const { id } = useParams<{ id: string }>();
  const { 
    sales, 
    loading, 
    error, 
    getSaleById,
    fetchSales
  } = useSalesStore();

  // Buscar la venta en el estado actual
  const sale = sales.find(s => s._id === id);

  useEffect(() => {
    const loadSale = async () => {
      if (!id) return;

      try {
        // Si no hay ventas cargadas, cargar todas primero
        if (sales.length === 0) {
          await fetchSales();
          return; // El siguiente useEffect se encargará de buscar la venta específica
        }

        // Si hay ventas pero no encontramos la específica, intentar cargarla por ID
        if (!sale && !loading) {
          await getSaleById(id);
        }
      } catch (error) {
        console.error("Error loading sale:", error);
      }
    };

    loadSale();
  }, [id, sales.length, fetchSales, getSaleById, loading]);

  // Segundo useEffect para buscar la venta después de cargar todas las ventas
  useEffect(() => {
    const foundSale = sales.find(s => s._id === id);
    
    // Si cargamos todas las ventas pero aún no encontramos la específica
    if (id && sales.length > 0 && !foundSale && !loading) {
      getSaleById(id);
    }
  }, [id, sales, getSaleById, loading]);

  const handleAfipGenerated = () => {
    // Recargar la venta para obtener los datos AFIP actualizados
    if (id) {
      getSaleById(id);
    }
  };

  if (loading) {
    return <SaleLoadingSkeleton />;
  }

  if (error) {
    return <SaleError error={error} />;
  }

  // Si no está cargando, no hay error, pero tampoco hay venta después de intentar cargar
  if (!sale && sales.length > 0) {
    return <SaleNotFound />;
  }

  // Si aún no hay venta y no hemos cargado ventas, mostrar loading
  if (!sale) {
    return <SaleLoadingSkeleton />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <SaleHeader sale={sale} />

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SaleInfoCard sale={sale} />
        <SaleProductsCard sale={sale} />
      </div>

      {/* Nueva sección AFIP */}
      <AfipSection sale={sale} onAfipGenerated={handleAfipGenerated} />
    </div>
  );
}
