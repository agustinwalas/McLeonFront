import { Link } from "react-router-dom";
import { IClient } from "@/types/client";
import { Button } from "@/components/ui/button";

interface ClientHeaderProps {
  client: IClient;
}

export function ClientHeader({ client }: ClientHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{client.name}</h1>
        <p className="text-gray-500">CUIT: {client.cuit}</p>
        <p className="text-gray-500">
          Cliente desde: {new Date(client.createdAt || "").toLocaleDateString("es-AR")}
        </p>
      </div>
      <Button asChild>
        <Link to="/admin/clientes">
          Volver a clientes
        </Link>
      </Button>
    </div>
  );
}
