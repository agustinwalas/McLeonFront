import { IClient } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientInfoCardProps {
  client: IClient;
}

export function ClientInfoCard({ client }: ClientInfoCardProps) {
  // ✅ Función para construir la dirección completa
  const buildFullAddress = () => {
    if (!client.fiscalAddress) return null;
    
    const address = client.fiscalAddress;
    const addressParts = [];
    
    // Calle y número
    if (address.street && address.number) {
      addressParts.push(`${address.street} ${address.number}`);
    } else if (address.street) {
      addressParts.push(address.street);
    }
    
    // Piso y departamento
    if (address.floor) {
      addressParts.push(`Piso ${address.floor}`);
    }
    if (address.apartment) {
      addressParts.push(`Depto ${address.apartment}`);
    }
    
    // Ciudad
    if (address.city) {
      addressParts.push(address.city);
    }
    
    // Provincia
    if (address.province) {
      addressParts.push(address.province);
    }
    
    // Código postal
    if (address.postalCode) {
      addressParts.push(`CP ${address.postalCode}`);
    }
    
    // País (solo si no es Argentina o está definido)
    if (address.country && address.country !== "Argentina") {
      addressParts.push(address.country);
    }
    
    return addressParts.length > 0 ? addressParts.join(", ") : null;
  };

  const fullAddress = buildFullAddress();

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
          
          {/* ✅ Solo mostrar CUIT si existe */}
          {client.cuit && (
            <div>
              <h3 className="font-medium text-gray-900">CUIT</h3>
              <p className="text-gray-600">{client.cuit}</p>
            </div>
          )}
          
          {/* ✅ Mostrar tipo y número de documento como alternativa */}
          {!client.cuit && (
            <div>
              <h3 className="font-medium text-gray-900">Documento</h3>
              <p className="text-gray-600">
                {client.documentType}: {client.documentNumber}
              </p>
            </div>
          )}
          
          <div>
            <h3 className="font-medium text-gray-900">Condición Fiscal</h3>
            <p className="text-gray-600">{client.taxCondition}</p>
          </div>
          
          {/* ✅ Solo mostrar email si existe */}
          {client.email && (
            <div>
              <h3 className="font-medium text-gray-900">Email</h3>
              <p className="text-gray-600">{client.email}</p>
            </div>
          )}
          
          {/* ✅ Solo mostrar dirección si existe */}
          {fullAddress && (
            <div>
              <h3 className="font-medium text-gray-900">Dirección Fiscal</h3>
              <p className="text-gray-600">{fullAddress}</p>
            </div>
          )}
          
          {/* ✅ Solo mostrar teléfono si existe */}
          {client.phone && (
            <div>
              <h3 className="font-medium text-gray-900">Teléfono</h3>
              <p className="text-gray-600">{client.phone}</p>
            </div>
          )}
          
          {/* ✅ Solo mostrar fecha si existe */}
          {client.createdAt && (
            <div>
              <h3 className="font-medium text-gray-900">Fecha de Registro</h3>
              <p className="text-gray-600">
                {new Date(client.createdAt).toLocaleDateString("es-AR")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
