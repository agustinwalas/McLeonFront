import { useSheetStore } from "@/store/useSheet";
import { ISalePopulated } from "@/types/sale";
import { Button } from "@/components/ui/button";
import { Eye, Printer, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { PrintVoucher, PrintVoucherRef } from "../components/PrintVoucher";

export const AfipActions = ({ sale }: { sale: ISalePopulated }) => {
  const { openSheet, closeSheet } = useSheetStore();
  const navigate = useNavigate();
  const printRef = useRef<PrintVoucherRef>(null);

  const handleViewDetails = () => {
    openSheet(
      "Detalles del Comprobante AFIP",
      `Información completa del comprobante ${sale.saleNumber}`,
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">CAE:</p>
            <p className="font-semibold break-all">{sale.afipData?.cae}</p>
          </div>
          <div>
            <p className="text-gray-600">Vencimiento:</p>
            <p className="font-semibold">{sale.afipData?.vencimientoCae}</p>
          </div>
          <div>
            <p className="text-gray-600">Tipo:</p>
            <p className="font-semibold">
              {sale.afipData?.tipoComprobante === 1
                ? "Factura A"
                : sale.afipData?.tipoComprobante === 6
                  ? "Factura B"
                  : sale.afipData?.tipoComprobante === 11
                    ? "Factura C"
                    : `Tipo ${sale.afipData?.tipoComprobante}`}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Número:</p>
            <p className="font-semibold">
              {String(sale.afipData?.puntoVenta || 0).padStart(4, "0")}-
              {String(sale.afipData?.numeroComprobante || 0).padStart(8, "0")}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Cliente:</p>
            <p className="font-semibold">
              {sale.client?.name || "Consumidor Final"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Importe Total:</p>
            <p className="font-semibold">
              $
              {sale.afipData?.importeTotal?.toFixed(2) ||
                sale.totalAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Punto de Venta:</p>
            <p className="font-semibold">
              {sale.afipData?.puntoVenta || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Fecha Emisión:</p>
            <p className="font-semibold">
              {sale.afipData?.fechaEmision || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">CUIT Emisor:</p>
            <p className="font-semibold">{sale.afipData?.cuit || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600">Estado AFIP:</p>
            <p
              className={`font-semibold ${sale.afipData?.estado === "AUTORIZADA" ? "text-green-600" : "text-red-600"}`}
            >
              {sale.afipData?.estado || "PENDIENTE"}
            </p>
          </div>
        </div>

        {sale.afipData?.observaciones && (
          <div className="border-t pt-3">
            <p className="text-gray-600 text-sm">Observaciones:</p>
            <p className="text-sm">{sale.afipData.observaciones}</p>
          </div>
        )}

        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={closeSheet}>
            Cerrar
          </Button>
        </div>
      </div>
    );
  };

  const handlePrint = () => {
    if (printRef.current) {
      printRef.current.print();
    }
  };

  const handleViewSale = () => {
    navigate(`/admin/ventas/${sale._id}`);
  };

  return (
    <>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewDetails}
          className="h-8 w-8 p-0"
          title="Ver detalles del comprobante"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrint}
          className="h-8 w-8 p-0"
          title="Imprimir comprobante"
        >
          <Printer className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewSale}
          className="h-8 w-8 p-0"
          title="Ver venta completa"
        >
          <FileText className="h-4 w-4" />
        </Button>
      </div>

      {/* Componente de impresión oculto */}
      {sale.afipData?.cae && (
        <PrintVoucher
          ref={printRef}
          data={{
            // Datos del comprobante
            cbteTipo: sale.afipData.tipoComprobante || 6,
            ptoVta: sale.afipData.puntoVenta || 1,
            cbteDesde: sale.afipData.numeroComprobante,
            cbteHasta: sale.afipData.numeroComprobante,
            cbteFch:
              sale.afipData.fechaEmision ||
              new Date().toISOString().split("T")[0],
            cae: sale.afipData.cae,
            vencimiento: sale.afipData.vencimientoCae,

            // Datos del receptor
            docTipo: sale.afipData.documentoTipo || 96,
            docNro:
              sale.afipData.documentoNumero ||
              sale.client?.documentNumber ||
              "0",
            nombreReceptor: sale.client?.name || "Consumidor Final",
            direccionReceptor: sale.client?.address || undefined,

            // Importes
            impNeto: sale.afipData.importeNeto || sale.subtotal,
            impIVA:
              sale.afipData.importeIva || sale.totalAmount - sale.subtotal,
            impTotal: sale.afipData.importeTotal || sale.totalAmount,

            // Detalle IVA con nombres de productos
            iva:
              sale.products.length > 1
                ? sale.products.map((product) => ({
                    Id: 5, // IVA 21%
                    BaseImp: product.unitPrice * product.quantity,
                    Importe: product.unitPrice * product.quantity * 0.21,
                    productName: product.product.name,
                    productCode: product.product.productCode,
                    quantity: product.quantity,
                    unitPrice: product.unitPrice,
                  }))
                : [
                    {
                      Id: 5, // IVA 21%
                      BaseImp: sale.afipData.importeNeto || sale.subtotal,
                      Importe:
                        sale.afipData.importeIva ||
                        sale.totalAmount - sale.subtotal,
                      productName: sale.products[0]?.product.name || "Producto",
                      productCode: sale.products[0]?.product.productCode,
                      quantity: sale.products[0]?.quantity || 1,
                      unitPrice: sale.products[0]?.unitPrice || 0,
                    },
                  ],

            // Método de pago
            paymentMethod: sale.paymentMethod,

            // Otros datos requeridos
            monId: "PES",
            monCotiz: 1,
          }}
        />
      )}
    </>
  );
};
