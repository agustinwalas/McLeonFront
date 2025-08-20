
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SalesTable } from "@/components/admin/sales/table/SalesTable";

export const Sales = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Ventas</h1>
        <div className="flex gap-2">
          <Button
            className="btn btn-primary"
            onClick={() => navigate("/admin/ventas/nueva")}
          >
            Nueva Venta
          </Button>
        </div>
      </div>
      <SalesTable />
    </>
  );
};
