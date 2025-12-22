import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Send,
  Calendar,
  Printer
} from "lucide-react";
import { ISalePopulated } from "@/types/sale";
import { useEffect, useState, useRef } from "react";
import { useNote } from "@/store/useNote";
import { Note, NoteType } from "@/types/note";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { PrintNote, PrintNoteRef } from "../notes/PrintNote";

interface NotesSectionProps {
  sale: ISalePopulated;
  onNoteCreated?: () => void;
}

export function NotesSection({ sale, onNoteCreated }: NotesSectionProps) {
  const { getNotesBySale, sendNoteToAfip, loading } = useNote();
  const [notes, setNotes] = useState<Note[]>([]);
  const [sendingNoteId, setSendingNoteId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Refs para los componentes de impresión (uno por nota)
  const printRefs = useRef<Map<string, PrintNoteRef>>(new Map());

  // Cargar notas cuando se monta el componente o cambia refreshKey
  useEffect(() => {
    const loadNotes = async () => {
      if (sale._id) {
        try {
          const fetchedNotes = await getNotesBySale(sale._id);
          setNotes(fetchedNotes);
        } catch (error) {
          console.error("Error loading notes:", error);
        }
      }
    };

    loadNotes();
  }, [sale._id, getNotesBySale, refreshKey]);

  // Función para recargar las notas
  const reloadNotes = () => {
    setRefreshKey(prev => prev + 1);
    onNoteCreated?.();
  };

  // Si no hay notas, no mostrar nada
  if (notes.length === 0) {
    return null;
  }

  const handleSendToAfip = async (noteId: string) => {
    try {
      setSendingNoteId(noteId);
      const updatedNote = await sendNoteToAfip(noteId);
      
      // Actualizar la nota en el estado local
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? updatedNote : note
        )
      );
      
      toast.success(`Nota enviada a AFIP exitosamente. CAE: ${updatedNote.cae}`);
      reloadNotes(); // Recargar para asegurar sincronización
    } catch (error: any) {
      toast.error(error.message || "Error al enviar nota a AFIP");
    } finally {
      setSendingNoteId(null);
    }
  };

  const handlePrintNote = (noteId: string) => {
    const printRef = printRefs.current.get(noteId);
    if (printRef) {
      printRef.print();
      toast.success("Imprimiendo nota...");
    } else {
      toast.error("No se pudo preparar la impresión");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Autorizada
          </Badge>
        );
      case "DRAFT":
      case "PENDING":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "SENT_TO_AFIP":
        return (
          <Badge variant="secondary" className="bg-blue-500 text-white">
            <Send className="h-3 w-3 mr-1" />
            Enviando...
          </Badge>
        );
      case "ERROR":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (noteType: NoteType) => {
    return noteType === NoteType.CREDITO ? "💳" : "📝";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const creditNotes = notes.filter(n => n.noteType === NoteType.CREDITO);
  const debitNotes = notes.filter(n => n.noteType === NoteType.DEBITO);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notas de Crédito y Débito
            <Badge variant="outline" className="ml-2">
              {notes.length} {notes.length === 1 ? "nota" : "notas"}
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Notas de Crédito */}
        {creditNotes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              💳 Notas de Crédito ({creditNotes.length})
            </h3>
            {creditNotes.map((note) => (
              <Card key={note.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Header de la nota */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(note.noteType)}</span>
                          <span className="font-semibold">
                            {note.noteNumber || "Sin número"}
                          </span>
                          {getStatusBadge(note.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {note.description}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(note.totalAmount)}
                          </div>
                          {/* IVA deshabilitado - siempre 0% */}
                          {false && (
                          <div className="text-xs text-muted-foreground">
                            IVA: {formatCurrency(note.ivaAmount)}
                          </div>
                          )}
                        </div>
                        {/* Botones en la esquina superior derecha */}
                        <div className="flex gap-2">
                          {note.cae && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handlePrintNote(note.id)}
                            >
                              <Printer className="h-4 w-4 mr-1" />
                              Imprimir
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Detalles */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(note.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                      </div>
                      {note.cae && (
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground">CAE:</span>{" "}
                          <span className="font-mono text-xs">{note.cae}</span>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    {note.items && note.items.length > 0 && (
                      <div className="border-t pt-2 mt-2">
                        <p className="text-xs font-semibold mb-1">Items:</p>
                        <div className="space-y-1">
                          {note.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                {item.quantity}x {item.productName}
                              </span>
                              <span>{formatCurrency(item.totalPrice)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botón Enviar a AFIP solo si no está completada */}
                    {(note.status === "DRAFT" || note.status === "PENDING" || note.status === "ERROR") && (
                      <div className="pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendToAfip(note.id)}
                          disabled={loading || sendingNoteId === note.id}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {sendingNoteId === note.id ? "Enviando..." : "Enviar a AFIP"}
                        </Button>
                      </div>
                    )}

                    {/* Componente de impresión oculto */}
                    <PrintNote
                      note={note}
                      ref={(ref) => {
                        if (ref) {
                          printRefs.current.set(note.id, ref);
                        }
                      }}
                    />

                    {/* Observaciones de error */}
                    {note.status === "ERROR" && note.observaciones && (
                      <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
                        <p className="text-xs text-red-700">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          {note.observaciones}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Notas de Débito */}
        {debitNotes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              📝 Notas de Débito ({debitNotes.length})
            </h3>
            {debitNotes.map((note) => (
              <Card key={note.id} className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Header de la nota */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(note.noteType)}</span>
                          <span className="font-semibold">
                            {note.noteNumber || "Sin número"}
                          </span>
                          {getStatusBadge(note.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {note.description}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <div>
                          <div className="text-lg font-bold text-orange-600">
                            {formatCurrency(note.totalAmount)}
                          </div>
                          {/* IVA deshabilitado - siempre 0% */}
                          {false && (
                          <div className="text-xs text-muted-foreground">
                            IVA: {formatCurrency(note.ivaAmount)}
                          </div>
                          )}
                        </div>
                        {/* Botones en la esquina superior derecha */}
                        <div className="flex gap-2">
                          {note.cae && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handlePrintNote(note.id)}
                            >
                              <Printer className="h-4 w-4 mr-1" />
                              Imprimir
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Detalles */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(note.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                      </div>
                      {note.cae && (
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground">CAE:</span>{" "}
                          <span className="font-mono text-xs">{note.cae}</span>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    {note.items && note.items.length > 0 && (
                      <div className="border-t pt-2 mt-2">
                        <p className="text-xs font-semibold mb-1">Items:</p>
                        <div className="space-y-1">
                          {note.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                {item.quantity}x {item.productName}
                              </span>
                              <span>{formatCurrency(item.totalPrice)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botón Enviar a AFIP solo si no está completada */}
                    {(note.status === "DRAFT" || note.status === "PENDING" || note.status === "ERROR") && (
                      <div className="pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendToAfip(note.id)}
                          disabled={loading || sendingNoteId === note.id}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {sendingNoteId === note.id ? "Enviando..." : "Enviar a AFIP"}
                        </Button>
                      </div>
                    )}

                    {/* Componente de impresión oculto */}
                    <PrintNote
                      note={note}
                      ref={(ref) => {
                        if (ref) {
                          printRefs.current.set(note.id, ref);
                        }
                      }}
                    />

                    {/* Observaciones de error */}
                    {note.status === "ERROR" && note.observaciones && (
                      <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
                        <p className="text-xs text-red-700">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          {note.observaciones}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Resumen total */}
        {notes.length > 1 && (
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {creditNotes.length > 0 && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Total Notas de Crédito</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(
                      creditNotes.reduce((sum, note) => sum + note.totalAmount, 0)
                    )}
                  </p>
                </div>
              )}
              {debitNotes.length > 0 && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Total Notas de Débito</p>
                  <p className="text-lg font-bold text-orange-600">
                    {formatCurrency(
                      debitNotes.reduce((sum, note) => sum + note.totalAmount, 0)
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
