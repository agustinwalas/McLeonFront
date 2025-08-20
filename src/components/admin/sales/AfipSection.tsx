// components/admin/sales/sale/AfipSection.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { ISalePopulated } from "@/types/sale";
import { toast } from "sonner";

interface AfipSectionProps {
  sale: ISalePopulated;
  onAfipGenerated: () => void;
}

export function AfipSection({ sale, onAfipGenerated }: AfipSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAfipInvoice = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch(`/api/sales/${sale._id}/afip/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Comprobante AFIP generado correctamente');
        onAfipGenerated();
      } else {
        toast.error(data.message || 'Error generando comprobante');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error conectando con AFIP');
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'AUTORIZADA':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'RECHAZADA':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getInvoiceTypeName = (tipo: number) => {
    switch (tipo) {
      case 1: return 'Factura A';
      case 6: return 'Factura B';
      case 11: return 'Factura C';
      default: return `Tipo ${tipo}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Comprobante AFIP
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sale.afipData ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Estado:</span>
              <Badge variant={sale.afipData.estado === 'AUTORIZADA' ? 'default' : 'destructive'}>
                {getStatusIcon(sale.afipData.estado || 'PENDIENTE')}
                {sale.afipData.estado}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Tipo:</p>
                <p className="font-semibold">{getInvoiceTypeName(sale.afipData.tipoComprobante)}</p>
              </div>
              <div>
                <p className="text-gray-600">Número:</p>
                <p className="font-semibold">
                  {String(sale.afipData.puntoVenta).padStart(4, '0')}-
                  {String(sale.afipData.numeroComprobante).padStart(8, '0')}
                </p>
              </div>
              <div>
                <p className="text-gray-600">CAE:</p>
                <p className="font-semibold">{sale.afipData.cae}</p>
              </div>
              <div>
                <p className="text-gray-600">Vencimiento:</p>
                <p className="font-semibold">{sale.afipData.vencimientoCae}</p>
              </div>
            </div>

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
              onClick={generateAfipInvoice}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generando...' : 'Generar Comprobante AFIP'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}