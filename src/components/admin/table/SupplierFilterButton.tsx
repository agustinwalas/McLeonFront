import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface SupplierFilterButtonProps {
  suppliers: { _id: string; name: string }[];
  value: string | null;
  onChange: (supplierId: string | null) => void;
}

export const SupplierFilterButton: React.FC<SupplierFilterButtonProps> = ({ suppliers, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (supplierId: string | null) => {
    onChange(supplierId);
    setOpen(false);
  };

  const handleToggle = () => {
    if (!open && buttonRef.current && !value) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      });
    }
    if (value) {
      // Si hay un filtro activo, limpiar el filtro
      onChange(null);
    } else {
      // Si no hay filtro, abrir/cerrar dropdown
      setOpen(!open);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`flex items-center gap-1 group select-none cursor-pointer rounded no-print ${
          value ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'hover:bg-gray-100'
        }`}
        onClick={handleToggle}
        tabIndex={0}
        aria-label={value ? "Limpiar filtro de proveedor" : "Filtrar por proveedor"}
      >
        {value ? (
          <>
            {suppliers.find(supplier => supplier._id === value)?.name || 'Proveedor'}
            <X size={16} className="ml-1" />
          </>
        ) : (
          <>
            Prov.
            <ChevronDown size={16} className="ml-1" />
          </>
        )}
      </button>
      <span className="print:block hidden">
        {value ? (suppliers.find(supplier => supplier._id === value)?.name || 'Proveedor') : 'Proveedor'}
      </span>
      {open && !value && (
        <div 
          className="fixed z-50 w-64 bg-white border rounded shadow-lg max-h-60 min-h-40 overflow-y-auto flex flex-col"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left
          }}
        >
          <button
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 block ${value === null ? "font-bold" : ""}`}
            onClick={() => handleSelect(null)}
          >
            Todos los proveedores
          </button>
          {suppliers.map((supplier) => (
            <button
              key={supplier._id}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 block ${value === supplier._id ? "font-bold" : ""}`}
              onClick={() => handleSelect(supplier._id)}
            >
              {supplier.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};