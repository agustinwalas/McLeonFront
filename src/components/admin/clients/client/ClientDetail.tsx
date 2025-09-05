import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useClientStore } from "@/store/useClient";
import useSalesStore from "@/store/useSales";
import { ClientError, ClientLoadingSkeleton, ClientNotFound } from "./ClientStates";
import { ClientHeader } from "./ClientHeader";
import { ClientInfoCard } from "./ClientInfoCard";
import { ClientSalesCard } from "./ClientSalesCard";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { 
    currentClient, 
    loading: clientLoading, 
    error: clientError, 
    fetchClient,
    clearCurrentClient
  } = useClientStore();
  
  const { 
    sales, 
    loading: salesLoading, 
    fetchSales 
  } = useSalesStore();

  // ✅ Mover el filtro a un useMemo que dependa de currentClient y sales
  const clientSales = useMemo(() => {
    if (!currentClient || !sales || sales.length === 0) {
      console.log("🔍 No hay cliente o ventas para filtrar");
      return [];
    }

    console.log("🔍 Filtrando ventas para cliente:", currentClient._id);
    console.log("🔍 Total de ventas:", sales.length);
    
    const filtered = sales.filter(sale => {
      // ✅ Validar que sale y sale.client existen
      if (!sale || !sale.client) {
        console.log("⚠️ Venta sin cliente:", sale);
        return false;
      }

      const clientId = typeof sale.client === 'object' 
        ? sale.client._id 
        : sale.client;
      
      const matches = clientId === currentClient._id;
      
      if (matches) {
        console.log("✅ Venta encontrada:", sale.saleNumber);
      }
      
      return matches;
    });

    console.log("✅ Ventas filtradas:", filtered.length);
    return filtered;
  }, [currentClient, sales]);

  useEffect(() => {
    if (id) {
      console.log("🔍 ClientDetail - Cargando cliente:", id);
      fetchClient(id);
      fetchSales();
    }

    return () => {
      clearCurrentClient();
    };
  }, [id, fetchClient, fetchSales, clearCurrentClient]);

  // ✅ Loading state
  if (clientLoading || salesLoading) {
    return <ClientLoadingSkeleton />;
  }

  // ✅ Error state
  if (clientError) {
    return <ClientError error={clientError} />;
  }

  // ✅ No ID provided
  if (!id) {
    return <ClientNotFound />;
  }

  // ✅ Client not found
  if (!currentClient) {
    return <ClientNotFound />;
  }

  console.log("✅ ClientDetail - Mostrando cliente:", currentClient.name);
  console.log("✅ ClientDetail - Ventas del cliente:", clientSales.length);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <ClientHeader client={currentClient} />

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClientInfoCard client={currentClient} />
        <ClientSalesCard sales={clientSales} />
      </div>
    </div>
  );
}
