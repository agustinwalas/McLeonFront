import { DefaultTable } from "../../table/DefaultTable";
import { useEffect } from "react";
import { useClientStore } from "@/store/useClient";
import { clientColumns } from "./ClientColumns";

export const ClientsTable = () => {
  const { 
    clients, 
    loading, 
    error, 
    isInitialized,
    fetchClients,
    clearError 
  } = useClientStore();

  useEffect(() => {
    if (!isInitialized) {
      fetchClients();
    }
  }, [isInitialized, fetchClients]);

  // Manejo de estados
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Cargando clientes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex justify-between items-center">
          <span className="text-red-800">Error: {error}</span>
          <button 
            onClick={clearError}
            className="text-red-600 hover:text-red-800 underline"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DefaultTable data={clients} columns={clientColumns} />
    </>
  );
};
