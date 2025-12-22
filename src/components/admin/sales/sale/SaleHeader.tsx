import { Link, useNavigate } from "react-router-dom";
import { ISalePopulated } from "@/types/sale";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import useSalesStore from "@/store/useSales";
import { useDialogStore } from "@/store/useDialog";
import { toast } from "sonner";
import { Printer } from "lucide-react";
import { PrintSale, PrintSaleRef } from "../PrintSale";

interface SaleHeaderProps {
  sale: ISalePopulated;
}

export function SaleHeader({ sale }: SaleHeaderProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteSale } = useSalesStore();
  const { openDialog, closeDialog } = useDialogStore();
  const navigate = useNavigate();
  const printRef = useRef<PrintSaleRef>(null);

  const handlePrint = () => {
    if (printRef.current) {
      printRef.current.print();
    }
  };

  const handleDelete = () => {
    const confirmDelete = async () => {
      setIsDeleting(true);
      try {
        await deleteSale(sale._id!);
        toast.success("Venta eliminada correctamente");
        closeDialog();
      } catch {
        toast.error("Error al eliminar la venta");
      } finally {
        setIsDeleting(false);
        navigate("/admin/ventas")
      }
    };

    openDialog({
      title: "Eliminar venta",
      description: `¿Estás seguro de que quieres eliminar la venta ${sale.saleNumber}?`,
      content: (
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={closeDialog}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      ),
    });
  };

  const getClientInfo = () => {
    const client = sale.client;

    if (!client) {
      return {
        name: "Sin Cliente",
        DocumentNumber: "-",
        isDeleted: true,
      };
    }

    return {
      name: client.name || "Sin nombre",
      documentNumber: client.documentNumber || "Sin Documento",
      isDeleted: false,
    };
  };

  const clientInfo = getClientInfo();

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{sale.saleNumber}</h1>
        </div>

        {/* ✅ Cliente con manejo de eliminado */}
        <p className={`text-gray-500 ${clientInfo.isDeleted ? "italic" : ""}`}>
          Cliente: {clientInfo.name} - {clientInfo.documentNumber}
        </p>

        {/* ✅ Fecha con manejo seguro */}
        <p className="text-gray-500">
          Fecha:{" "}
          {sale.createdAt
            ? new Date(sale.createdAt).toLocaleDateString("es-AR")
            : "Fecha no disponible"}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap justify-end">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Imprimir Venta
        </Button>
        <Button onClick={handleDelete}>
          Eliminar Venta
        </Button>
        <Button>
          <Link to={`/admin/ventas/editar/${sale._id}`}>Editar Venta</Link>
        </Button>
        <Button>
          <Link to="/admin/ventas">Volver a ventas</Link>
        </Button>
      </div>

      <PrintSale ref={printRef} sale={sale} />
    </div>
  );
}
