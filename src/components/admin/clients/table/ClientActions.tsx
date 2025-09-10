import { Link } from "react-router-dom";
import { useSheetStore } from "@/store/useSheet";
import { IClient } from "@/types/client";
import { useDialogStore } from "@/store/useDialog";
import { useClientStore } from "@/store/useClient";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { EditClientForm } from "../forms/EditClientForm";

export const ClientActions = ({ client }: { client: IClient }) => {
  const { openSheet, closeSheet } = useSheetStore();
  const { deleteClient } = useClientStore();
  const { openDialog, closeDialog } = useDialogStore();

  const handleEdit = () => {
    openSheet(
      "Editar cliente",
      "Completá los campos para editar el cliente",
      <EditClientForm client={client} onSuccess={closeSheet} />
    );
  };

  const handleDelete = () => {
    const confirmDelete = async () => {
      deleteClient(client._id);
      closeDialog();
    };

    openDialog({
      title: "Eliminar cliente",
      description: `¿Estás seguro de que quieres eliminar "${client.name}"?`,
      content: (
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={closeDialog}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>Eliminar</Button>
        </div>
      ),
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
        <Link to={`/admin/clientes/${client._id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        className="h-8 w-8 p-0"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="h-8 w-8 p-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
