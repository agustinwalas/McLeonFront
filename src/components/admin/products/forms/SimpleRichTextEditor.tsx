import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FormLabel } from "@/components/ui/form";
import { Edit, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SimpleRichTextEditor({ value, onChange, placeholder }: SimpleRichTextEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Colores de la marca predefinidos
  const brandColors = [
    { name: 'Azul Claro', hex: '#E7F5F7' },
    { name: 'Amarillo Claro', hex: '#FFFCEB' },
    { name: 'Rojo Oscuro', hex: '#A93B2A' },
    { name: 'Negro', hex: '#000000' },
    { name: 'Gris Oscuro', hex: '#374151' }
  ];
  
  // Estados para los botones activos
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    h1: false,
    h2: false,
    h3: false,
    h4: false,
    p: false
  });

  const handleOpen = () => {
    setTempValue(value);
    setIsOpen(true);
    // Inicializar el contenido después de que el dialog se abra
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = value;
        editorRef.current.focus();
        updateActiveStates();
      }
    }, 100);
  };

  // Función para actualizar los estados activos según la posición del cursor
  const updateActiveStates = () => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    setActiveStates({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      alignLeft: document.queryCommandState('justifyLeft'),
      alignCenter: document.queryCommandState('justifyCenter'),
      alignRight: document.queryCommandState('justifyRight'),
      h1: document.queryCommandValue('formatBlock') === 'h1',
      h2: document.queryCommandValue('formatBlock') === 'h2',
      h3: document.queryCommandValue('formatBlock') === 'h3',
      h4: document.queryCommandValue('formatBlock') === 'h4',
      p: document.queryCommandValue('formatBlock') === 'p' || document.queryCommandValue('formatBlock') === ''
    });
  };

  const handleSave = () => {
    onChange(tempValue);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsOpen(false);
  };

  // Funciones de formato mejoradas con actualización de estado
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setTempValue(editorRef.current.innerHTML);
      setTimeout(updateActiveStates, 10);
    }
  };

  const formatBold = () => {
    execCommand('bold');
    editorRef.current?.focus();
  };
  
  const formatItalic = () => {
    execCommand('italic');
    editorRef.current?.focus();
  };
  
  const formatUnderline = () => {
    execCommand('underline');
    editorRef.current?.focus();
  };
  
  const formatBulletList = () => {
    execCommand('insertUnorderedList');
    editorRef.current?.focus();
  };
  
  const formatNumberList = () => {
    execCommand('insertOrderedList');
    editorRef.current?.focus();
  };
  
  const formatAlignLeft = () => {
    execCommand('justifyLeft');
    editorRef.current?.focus();
  };
  
  const formatAlignCenter = () => {
    execCommand('justifyCenter');
    editorRef.current?.focus();
  };
  
  const formatAlignRight = () => {
    execCommand('justifyRight');
    editorRef.current?.focus();
  };
  
  const formatColor = () => {
    execCommand('foreColor', selectedColor);
    editorRef.current?.focus();
  };
  
  const formatHeading = (tag: string) => {
    execCommand('formatBlock', tag);
    editorRef.current?.focus();
  };

  return (
    <div className="space-y-2">
      <FormLabel>Descripción (Opcional)</FormLabel>
      
      {/* Preview area */}
      <div className="relative">
        <div
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 pr-10 min-h-[2.5rem] cursor-pointer"
          onClick={handleOpen}
        >
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: value }} className="line-clamp-2" />
          ) : (
            <span className="text-muted-foreground">{placeholder || "Descripción del producto..."}</span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          onClick={handleOpen}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {/* Dialog del editor simple */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Editor de Descripción</DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col space-y-4 min-h-0">
            {/* Barra de herramientas */}
            <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-slate-50">
              {/* Encabezados */}
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant={activeStates.h1 ? "default" : "outline"} 
                  onClick={() => formatHeading('H1')}
                >
                  H1
                </Button>
                <Button 
                  size="sm" 
                  variant={activeStates.h2 ? "default" : "outline"} 
                  onClick={() => formatHeading('H2')}
                >
                  H2
                </Button>
                <Button 
                  size="sm" 
                  variant={activeStates.h3 ? "default" : "outline"} 
                  onClick={() => formatHeading('H3')}
                >
                  H3
                </Button>
                <Button 
                  size="sm" 
                  variant={activeStates.h4 ? "default" : "outline"} 
                  onClick={() => formatHeading('H4')}
                >
                  H4
                </Button>
                <Button 
                  size="sm" 
                  variant={activeStates.p ? "default" : "outline"} 
                  onClick={() => formatHeading('P')}
                >
                  P
                </Button>
              </div>
              
              <div className="border-l border-gray-300 h-8"></div>
              
              {/* Formato */}
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant={activeStates.bold ? "default" : "outline"} 
                  onClick={formatBold}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant={activeStates.italic ? "default" : "outline"} 
                  onClick={formatItalic}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant={activeStates.underline ? "default" : "outline"} 
                  onClick={formatUnderline}
                >
                  <Underline className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="border-l border-gray-300 h-8"></div>
              
              {/* Alineación */}
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant={activeStates.alignLeft ? "default" : "outline"} 
                  onClick={formatAlignLeft}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant={activeStates.alignCenter ? "default" : "outline"} 
                  onClick={formatAlignCenter}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant={activeStates.alignRight ? "default" : "outline"} 
                  onClick={formatAlignRight}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="border-l border-gray-300 h-8"></div>
              
              {/* Listas */}
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={formatBulletList}>
                  <List className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={formatNumberList}>
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="border-l border-gray-300 h-8"></div>
              
              {/* Color */}
              <div className="flex gap-2 items-center">
                <div className="flex gap-1">
                  {brandColors.map((colorOption) => (
                    <button
                      key={colorOption.hex}
                      type="button"
                      className={`w-8 h-8 border-2 rounded cursor-pointer transition-all hover:scale-110 ${
                        selectedColor === colorOption.hex ? 'border-gray-600 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: colorOption.hex }}
                      onClick={() => setSelectedColor(colorOption.hex)}
                      title={`${colorOption.name} (${colorOption.hex})`}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-8 h-8 border rounded cursor-pointer ml-2"
                  title={`Color personalizado: ${selectedColor}`}
                />
                <Button size="sm" variant="outline" onClick={formatColor}>
                  Aplicar Color
                </Button>
                <span className="text-xs text-gray-500 ml-1">
                  {selectedColor.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 min-h-[400px] border rounded-lg">
              <style>
                {`
                  .rich-text-editor h1 {
                    font-size: 2rem !important;
                    font-weight: bold !important;
                    line-height: 1.2 !important;
                    margin: 0.5rem 0 !important;
                  }
                  .rich-text-editor h2 {
                    font-size: 1.5rem !important;
                    font-weight: bold !important;
                    line-height: 1.3 !important;
                    margin: 0.4rem 0 !important;
                  }
                  .rich-text-editor h3 {
                    font-size: 1.25rem !important;
                    font-weight: bold !important;
                    line-height: 1.4 !important;
                    margin: 0.3rem 0 !important;
                  }
                  .rich-text-editor h4 {
                    font-size: 1.125rem !important;
                    font-weight: bold !important;
                    line-height: 1.4 !important;
                    margin: 0.3rem 0 !important;
                  }
                  .rich-text-editor p {
                    font-size: 1rem !important;
                    line-height: 1.6 !important;
                    margin: 0.2rem 0 !important;
                  }
                  .rich-text-editor ul {
                    list-style-type: disc !important;
                    margin: 0.5rem 0 !important;
                    padding-left: 1.5rem !important;
                  }
                  .rich-text-editor ol {
                    list-style-type: decimal !important;
                    margin: 0.5rem 0 !important;
                    padding-left: 1.5rem !important;
                  }
                  .rich-text-editor li {
                    margin: 0.2rem 0 !important;
                    line-height: 1.5 !important;
                  }
                  .rich-text-editor ul ul {
                    list-style-type: circle !important;
                    margin: 0.2rem 0 !important;
                  }
                  .rich-text-editor ol ol {
                    list-style-type: lower-alpha !important;
                    margin: 0.2rem 0 !important;
                  }
                `}
              </style>
              <div
                ref={editorRef}
                contentEditable
                className="rich-text-editor w-full h-full p-4 focus:outline-none prose max-w-none"
                style={{ minHeight: '400px' }}
                onInput={(e) => {
                  const target = e.target as HTMLDivElement;
                  setTempValue(target.innerHTML);
                  updateActiveStates();
                }}
                onKeyUp={updateActiveStates}
                onMouseUp={updateActiveStates}
                onFocus={updateActiveStates}
                onBlur={(e) => {
                  const target = e.target as HTMLDivElement;
                  setTempValue(target.innerHTML);
                }}
                suppressContentEditableWarning={true}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave}>
              Guardar Descripción
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}