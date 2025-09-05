import { Button } from "@/components/ui/button";
import { useNavigate, useParams, Link } from "react-router-dom";

export const EditSaleHeader = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <Link to={`/admin/ventas/editar/${id}`}>
        <h1 className="text-xl font-semibold">Editar Venta</h1>
      </Link>

      <Button onClick={() => navigate("/admin/ventas")}>Volver a Ventas</Button>
    </div>
  );
};
