// components/admin/sales/sale/Af
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, XCircle, Clock, Printer, CreditCard, Receipt } from "lucide-react";
import { ISalePopulated } from "@/types/sale";
import { useNavigate } from "react-router";
import { useRef, useState } from "react";
import { PrintVoucher, PrintVoucherRef } from "@/components/admin/afip/components/PrintVoucher";
import { CreateNoteModal } from "../notes/CreateNoteModal";
import { NoteType } from "@/types/note";

interface AfipSectionProps {
  sale: ISalePopulated;
  onAfipGenerated: () => void;
  onNoteCreated?: () => void;
}

export function AfipSection({ sale, onNoteCreated }: AfipSectionProps) {
  const navigate = useNavigate();
  const printRef = useRef<PrintVoucherRef>(null);
  
  // Estados para los modales de notas
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showDebitModal, setShowDebitModal] = useState(false);

  const handlePrint = () => {
    if (printRef.current) {
      printRef.current.print();
    }
  };

  // Verificar si la venta tiene factura generada (con CAE)
  const hasValidInvoice = () => {
    return !!(sale.afipData?.cae && sale.saleNumber);
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "AUTORIZADA":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "RECHAZADA":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getInvoiceTypeName = (tipo: number) => {
    switch (tipo) {
      case 1:
        return "Factura A";
      case 6:
        return "Factura B";
      case 11:
        return "Factura C";
      default:
        return `Tipo ${tipo}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Comprobante AFIP
          </CardTitle>
          {sale.afipData?.cae && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"  
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
              {hasValidInvoice() && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreditModal(true)}
                    className="flex items-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Nota Crédito
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDebitModal(true)}
                    className="flex items-center gap-2"
                  >
                    <Receipt className="h-4 w-4" />
                    Nota Débito
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {sale.afipData ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Estado:</span>
              <Badge
                variant={
                  sale.afipData.estado === "AUTORIZADA"
                    ? "default"
                    : "destructive"
                }
              >
                {getStatusIcon(sale.afipData.estado || "PENDIENTE")}
                {sale.afipData.estado}
              </Badge>
            </div>

            {/* Información básica del comprobante */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Tipo:</p>
                <p className="font-semibold">
                  {getInvoiceTypeName(sale.afipData.tipoComprobante)} ({sale.afipData.tipoComprobante})
                </p>
              </div>
              <div>
                <p className="text-gray-600">Número:</p>
                <p className="font-semibold">
                  {String(sale.afipData.puntoVenta || 0).padStart(4, "0")}-
                  {String(sale.afipData.numeroComprobante || 0).padStart(8, "0")}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Punto de Venta:</p>
                <p className="font-semibold">{sale.afipData.puntoVenta || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Fecha Emisión:</p>
                <p className="font-semibold">{sale.afipData.fechaEmision || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">CAE:</p>
                <p className="font-semibold break-all">{sale.afipData.cae}</p>
              </div>
              <div>
                <p className="text-gray-600">Vencimiento CAE:</p>
                <p className="font-semibold">{sale.afipData.vencimientoCae || "N/A"}</p>
              </div>
            </div>

            {/* Información del receptor */}
            {(sale.afipData.documentoTipo || sale.afipData.documentoNumero) && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Datos del Receptor</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Tipo Documento:</p>
                    <p className="font-semibold">
                      {sale.afipData.documentoTipo === 80 ? "CUIT" : 
                       sale.afipData.documentoTipo === 86 ? "CUIL" :
                       sale.afipData.documentoTipo === 96 ? "DNI" : 
                       `Tipo ${sale.afipData.documentoTipo}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Número Documento:</p>
                    <p className="font-semibold">{sale.afipData.documentoNumero || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Información de importes */}
            {(sale.afipData?.importeTotal || sale.afipData?.importeNeto || sale.afipData?.importeIva) && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Importes</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {sale.afipData?.importeNeto && (
                    <div>
                      <p className="text-gray-600">Importe Neto:</p>
                      <p className="font-semibold">${sale.afipData?.importeNeto.toFixed(2)}</p>
                    </div>
                  )}
                  {/* IVA deshabilitado - siempre 0% */}
                  {false && sale.afipData?.importeIva && (
                    <div>
                      <p className="text-gray-600">IVA:</p>
                      <p className="font-semibold">${sale.afipData?.importeIva.toFixed(2)}</p>
                    </div>
                  )}
                  {sale.afipData?.importeTotal && (
                    <div>
                      <p className="text-gray-600">Total:</p>
                      <p className="font-semibold text-lg">${sale.afipData?.importeTotal.toFixed(2)}</p>
                    </div>
                  )}
                  {sale.afipData?.concepto && (
                    <div>
                      <p className="text-gray-600">Concepto:</p>
                      <p className="font-semibold">
                        {sale.afipData?.concepto === 1 ? "Productos" :
                         sale.afipData?.concepto === 2 ? "Servicios" :
                         sale.afipData?.concepto === 3 ? "Productos y Servicios" :
                         `Concepto ${sale.afipData?.concepto}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Información técnica adicional */}
            {sale.afipData.cuit && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Información Técnica</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">CUIT Emisor:</p>
                    <p className="font-semibold">{sale.afipData.cuit}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Estado AFIP:</p>
                    <p className="font-semibold text-green-600">
                      {sale.afipData.cae ? "Autorizado" : "Pendiente"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {sale.afipData.observaciones && (
              <div>
                <p className="text-gray-600 text-sm">Observaciones:</p>
                <p className="text-sm">{sale.afipData.observaciones}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-gray-600">No se ha generado comprobante AFIP</p>
            <Button
              className="btn btn-primary"
              onClick={() =>
                navigate(`/admin/ventas/nuevo-comprobante/${sale._id}`)
              }
            >
              Generar Comprobante AFIP
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Componente de impresión oculto */}
      {sale.afipData?.cae && (
        <PrintVoucher
          ref={printRef}
          data={{
            // Datos del comprobante
            deliveryFee: sale.deliveryFee,
            cbteTipo: sale.afipData.tipoComprobante || 6,
            ptoVta: sale.afipData.puntoVenta || 1,
            cbteDesde: sale.afipData.numeroComprobante,
            cbteHasta: sale.afipData.numeroComprobante,
            cbteFch: sale.afipData.fechaEmision || new Date().toISOString().split('T')[0],
            cae: sale.afipData.cae,
            vencimiento: sale.afipData.vencimientoCae,
            
            // Datos del receptor
            docTipo: sale.afipData.documentoTipo || 96,
            docNro: sale.afipData.documentoNumero || sale.client?.documentNumber || "0",
            nombreReceptor: sale.client?.name || "Consumidor Final",
            direccionReceptor: sale.client?.address || undefined,
            
            // Importes
            impNeto: sale.afipData.importeNeto || sale.subtotal,
            impIVA: sale.afipData.importeIva || (sale.totalAmount - sale.subtotal),
            impTotal: sale.afipData.importeTotal || sale.totalAmount,
            
            // Detalle IVA con nombres de productos
            iva: sale.products.length > 1 
              ? sale.products.map((product) => ({
                  Id: 5, // IVA 21%
                  BaseImp: product.unitPrice * product.quantity,
                  Importe: (product.unitPrice * product.quantity * 0.21),
                  productName: product.product.name,
                  productCode: product.product.productCode,
                  quantity: product.quantity,
                  unitPrice: product.unitPrice,
                }))
              : [{
                  Id: 5, // IVA 21%
                  BaseImp: sale.afipData.importeNeto || sale.subtotal,
                  Importe: sale.afipData.importeIva || (sale.totalAmount - sale.subtotal),
                  productName: sale.products[0]?.product.name || "Producto",
                  productCode: sale.products[0]?.product.productCode,
                  quantity: sale.products[0]?.quantity || 1,
                  unitPrice: sale.products[0]?.unitPrice || 0,
                }],
            
            // Método de pago
            paymentMethod: sale.paymentMethod,
            
            // Otros datos requeridos
            monId: "PES",
            monCotiz: 1
          }}
        />
      )}

      {/* Modales para Notas de Crédito y Débito */}
      {showCreditModal && (
        <CreateNoteModal
          isOpen={showCreditModal}
          onClose={() => setShowCreditModal(false)}
          noteType={NoteType.CREDITO}
          sale={sale}
          onSuccess={onNoteCreated}
        />
      )}

      {showDebitModal && (
        <CreateNoteModal
          isOpen={showDebitModal}
          onClose={() => setShowDebitModal(false)}
          noteType={NoteType.DEBITO}
          sale={sale}
          onSuccess={onNoteCreated}
        />
      )}
    </Card>
  );
}
