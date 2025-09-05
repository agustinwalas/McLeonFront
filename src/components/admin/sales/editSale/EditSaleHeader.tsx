import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export const EditSaleHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <h1 className="text-xl font-semibold">Editar Venta</h1>

      <Button onClick={() => navigate("/admin/ventas")}>Volver a Ventas</Button>
    </div>
  );
};
