import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useEffect } from "react"; 
import { cn } from "@/lib/utils";
import { useSalesStore } from "@/store/useSales";
import { useClientStore } from "@/store/useClient";
import { NewClientForm } from "@/components/admin/clients/forms/NewClientForm";
import { useSheetStore } from "@/store/useSheet";

export const Client = () => {
  // ✅ Store hooks corregidos
  const { formData, updateFormData } = useSalesStore();
  const { clients, fetchClients } = useClientStore();
  const { openSheet, closeSheet } = useSheetStore();

  // Estado para controlar el popover
  const [open, setOpen] = useState(false);

  // ✅ Fetch de clientes al montar el componente
  useEffect(() => {
    if (clients.length === 0) {
      console.log("🔍 Cargando clientes...");
      fetchClients();
    }
  }, [clients.length, fetchClients]);

  // ✅ Set default to 'Sin cliente' (empty) on mount
  useEffect(() => {
    if (!formData.client) {
      updateFormData("client", "");
    }
  }, []);

  // ✅ Helper function para manejar selección de cliente
  const handleClientSelect = (clientId: string) => {
    updateFormData("client", clientId);
    setOpen(false);
  };

  // Obtener cliente seleccionado
  const selectedClient = clients.find(
    (client) => client._id === formData.client
  );

  // ✅ Callback para cuando se crea un nuevo cliente
  const handleNewClientSuccess = (newClient?: any) => {
    if (newClient && newClient._id) {
      // Seleccionar automáticamente el nuevo cliente
      updateFormData("client", newClient._id);
    }
    closeSheet();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>👤 Información del Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div className="flex items-center justify-between mb-0">
            <label className="text-sm font-medium mb-2 block">Cliente</label>
            <div
              className="text-xs font-medium mb-2 block cursor-pointer duration-200 hover:text-blue-600 text-blue-500"
              onClick={() =>
                openSheet(
                  "Agregar Cliente",
                  "Completá los campos para crear un nuevo Cliente",
                  <NewClientForm onSuccess={handleNewClientSuccess} />
                )
              }
            >
              + Agregar Cliente
            </div>
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-10"
              >
                {selectedClient
                  ? `${selectedClient.name} - ${selectedClient.documentNumber}`
                  : "Sin cliente"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar cliente..." />
                <CommandList>
                  <CommandEmpty>
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        No se encontraron clientes.
                      </p>
                      <button
                        onClick={() => {
                          setOpen(false);
                          openSheet(
                            "Agregar Cliente",
                            "Completá los campos para crear un nuevo Cliente",
                            <NewClientForm onSuccess={handleNewClientSuccess} />
                          );
                        }}
                        className="text-xs text-blue-500 hover:text-blue-600 mt-2"
                      >
                        + Crear nuevo cliente
                      </button>
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {clients.map((client) => (
                      <CommandItem
                        key={client._id}
                        value={`${client.name} ${client.documentNumber}`}
                        onSelect={() => handleClientSelect(client._id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.client === client._id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{client.name}</span>
                          <span className="text-sm text-muted-foreground">
                            Doc: {client.documentNumber}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* ✅ Información adicional del cliente seleccionado */}
          {selectedClient && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Nombre:</span>
                  <p className="text-gray-900">{selectedClient.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Doc.:</span>
                  <p className="text-gray-900">{selectedClient.documentNumber}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
