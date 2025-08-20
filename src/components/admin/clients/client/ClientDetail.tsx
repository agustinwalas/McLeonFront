import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useClientStore } from "@/store/useClient";
import useSalesStore from "@/store/useSales";
import { ClientError, ClientLoadingSkeleton, ClientNotFound } from "./ClientStates";
import { ClientHeader } from "./ClientHeader";
import { ClientInfoCard } from "./ClientInfoCard";
import { ClientSalesCard } from "./ClientSalesCard";

// Componentes separados

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { 
    clients, 
    loading: clientLoading, 
    error: clientError, 
    fetchClients 
  } = useClientStore();
  
  const { 
    sales, 
    loading: salesLoading, 
    fetchSales 
  } = useSalesStore();

  // Buscar el cliente en el estado actual
  const client = clients.find(c => c._id === id);
  
  // Filtrar las ventas del cliente
  const clientSales = sales.filter(sale => 
    typeof sale.client === 'object' 
      ? sale.client._id === id 
      : sale.client === id
  );

  useEffect(() => {
    fetchClients();
    fetchSales();
  }, [fetchClients, fetchSales]);

  if (clientLoading || salesLoading) {
    return <ClientLoadingSkeleton />;
  }

  if (clientError) {
    return <ClientError error={clientError} />;
  }

  if (!client) {
    return <ClientNotFound />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <ClientHeader client={client} />

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClientInfoCard client={client} />
        <ClientSalesCard sales={clientSales} />
      </div>
    </div>
  );
}
