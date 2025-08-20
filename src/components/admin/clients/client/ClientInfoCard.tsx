import { IClient } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientInfoCardProps {
  client: IClient;
}

export function ClientInfoCard({ client }: ClientInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Nombre</h3>
            <p className="text-gray-600">{client.name}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900">CUIT</h3>
            <p className="text-gray-600">{client.cuit}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900">Condición Fiscal</h3>
            <p className="text-gray-600">{client.taxCondition}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900">Dirección</h3>
            <p className="text-gray-600">{client.address}</p>
          </div>
          
          {client.phone && (
            <div>
              <h3 className="font-medium text-gray-900">Teléfono</h3>
              <p className="text-gray-600">{client.phone}</p>
            </div>
          )}
          
          <div>
            <h3 className="font-medium text-gray-900">Fecha de Registro</h3>
            <p className="text-gray-600">
              {new Date(client.createdAt || "").toLocaleDateString("es-AR")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
