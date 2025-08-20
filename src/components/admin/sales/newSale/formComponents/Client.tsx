import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNewSale } from "@/store/useNewSale";
import { useClientStore } from "@/store/useClient";

export const Client = () => {
  // Store hooks
  const { formData, setFormField } = useNewSale();
  const { clients } = useClientStore();

  // Estado para controlar el popover
  const [open, setOpen] = useState(false);

  // Helper function para manejar selección de cliente
  const handleClientSelect = (clientId: string) => {
    setFormField("client", clientId);
    setOpen(false);
  };

  // Obtener cliente seleccionado
  const selectedClient = clients.find(client => client._id === formData.client);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <label className="text-sm font-medium mb-2 block">Cliente</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-10"
              >
                {selectedClient
                  ? `${selectedClient.name} - ${selectedClient.cuit}`
                  : "Seleccionar cliente..."
                }
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar cliente..." />
                <CommandList>
                  <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                  <CommandGroup>
                    {clients.map((client) => (
                      <CommandItem
                        key={client._id}
                        value={`${client.name} ${client.cuit}`}
                        onSelect={() => handleClientSelect(client._id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.client === client._id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{client.name}</span>
                          <span className="text-sm text-muted-foreground">
                            CUIT: {client.cuit}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};
