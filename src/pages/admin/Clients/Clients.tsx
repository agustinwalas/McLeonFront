
import { NewClientForm } from "@/components/admin/clients/forms/NewClientForm";
import { ClientsTable } from "@/components/admin/clients/table/ClientTable";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/store/useSheet";


export const Clients = () => {
  const { openSheet, closeSheet } = useSheetStore();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Clientes</h1>
        <div className="flex gap-2">
          <Button
            className="btn btn-primary"
            onClick={() =>
              openSheet(
                "Agregar Cliente",
                "Completá los campos para crear un nuevo Cliente",
                <NewClientForm onSuccess={closeSheet} />
              )
            }
          >
            Agregar
          </Button>
        </div>
      </div>
      <ClientsTable />
    </>
  );
};
