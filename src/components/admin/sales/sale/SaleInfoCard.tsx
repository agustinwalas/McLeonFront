import { ISalePopulated, PaymentMethod, DeliveryType } from "@/types/sale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SaleInfoCardProps {
  sale: ISalePopulated;
}

const getPaymentMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CASH:
      return "Efectivo";
    case PaymentMethod.CREDIT_CARD:
      return "Tarjeta de Crédito";
    case PaymentMethod.DEBIT_CARD:
      return "Tarjeta de Débito";
    case PaymentMethod.BANK_TRANSFER:
      return "Transferencia";
    case PaymentMethod.CHECK:
      return "Cheque";
    case PaymentMethod.MERCADO_PAGO:
      return "Mercado Pago";
    case PaymentMethod.MULTIPLE:
      return "Múltiple";
    default:
      return method;
  }
};

const getDeliveryTypeLabel = (type: DeliveryType) => {
  switch (type) {
    case DeliveryType.PICKUP:
      return "Retiro en Local";
    case DeliveryType.DELIVERY:
      return "Envío a Domicilio";
    default:
      return type;
  }
};

// ✅ Helper para formatear el tipo de documento
const getDocumentTypeLabel = (docType: string) => {
  switch (docType) {
    case "CUIT":
      return "CUIT";
    case "DNI":
      return "DNI";
    case "CUIL":
      return "CUIL";
    case "CDI":
      return "CDI";
    case "LE":
      return "LE";
    case "LC":
      return "LC";
    case "PASSPORT":
      return "Pasaporte";
    case "CONSUMIDOR_FINAL":
      return "Consumidor Final";
    default:
      return docType || "Documento";
  }
};

export function SaleInfoCard({ sale }: SaleInfoCardProps) {
  console.log("Sale data:", sale);
  console.log("Client data:", sale.client);
  
  // ✅ Función helper para manejar el cliente
  const getClientInfo = () => {
    const client = sale.client;

    // ✅ Cliente eliminado o no existe
    if (!client) {
      return {
        name: "Sin Cliente",
        documentType: "-",
        documentNumber: "-",
        fullDocument: "-",
        isDeleted: true,
      };
    }

    // ✅ Cliente existe pero puede tener campos vacíos
    const docType = client.documentType || "";
    const docNumber = client.documentNumber || "";
    
    // ✅ Formatear documento completo
    const fullDocument = docType && docNumber 
      ? `${getDocumentTypeLabel(docType)}: ${docNumber}`
      : docNumber || "Sin Documento";

    return {
      name: client.name || "Sin nombre",
      documentType: getDocumentTypeLabel(docType),
      documentNumber: docNumber || "Sin Documento",
      fullDocument,
      isDeleted: false,
    };
  };

  // ✅ Función helper para manejar el usuario/vendedor
  const getUserInfo = () => {
    const user = sale.user;

    // ✅ Usuario eliminado o no existe
    if (!user) {
      return {
        name: "Usuario eliminado",
        isDeleted: true,
      };
    }

    // ✅ Usuario existe
    return {
      name: user.name || user.email || "Sin nombre",
      isDeleted: false,
    };
  };

  const clientInfo = getClientInfo();
  const userInfo = getUserInfo();

  // ✅ Debug adicional
  console.log("Client info processed:", clientInfo);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de la Venta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* ✅ Cliente con manejo de eliminado */}
          <div>
            <h3 className="font-medium text-gray-900">Cliente</h3>
            <p
              className={`text-gray-600 ${clientInfo.isDeleted ? "italic" : ""}`}
            >
              {clientInfo.name}
            </p>
          </div>

          {/* ✅ Documento del cliente completo con tipo */}
          <div>
            <h3 className="font-medium text-gray-900">Documento del Cliente</h3>
            <p
              className={`text-gray-600 ${clientInfo.isDeleted ? "italic" : ""}`}
            >
              {clientInfo.fullDocument}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Método de Pago</h3>
            <p className="text-gray-600">
              {getPaymentMethodLabel(sale.paymentMethod)}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Tipo de Entrega</h3>
            <p className="text-gray-600">
              {getDeliveryTypeLabel(sale.deliveryType)}
            </p>
          </div>

          {/* ✅ Vendedor con manejo de eliminado */}
          <div>
            <h3 className="font-medium text-gray-900">Vendedor</h3>
            <p
              className={`text-gray-600 ${userInfo.isDeleted ? "italic" : ""}`}
            >
              {userInfo.name}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Fecha de Venta</h3>
            <p className="text-gray-600">
              {sale.createdAt
                ? `${new Date(sale.createdAt).toLocaleDateString("es-AR")} - ${new Date(
                    sale.createdAt
                  ).toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "Fecha no disponible"}
            </p>
          </div>

          {sale.notes && (
            <div>
              <h3 className="font-medium text-gray-900">Notas</h3>
              <p className="text-gray-600">{sale.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
