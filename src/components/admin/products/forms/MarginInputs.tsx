import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { Save } from "lucide-react";

interface MarginInputsProps {
  wholesaleMargin: number;
  retailMargin: number;
  onChange: (type: "wholesale" | "retail", value: number) => void;
}

export function MarginInputs({ wholesaleMargin, retailMargin, onChange }: MarginInputsProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localWholesale, setLocalWholesale] = useState(wholesaleMargin);
  const [localRetail, setLocalRetail] = useState(retailMargin);

  // Convierte margen a porcentaje para mostrar
  const wholesalePercent = Math.round((localWholesale - 1) * 100);
  const retailPercent = Math.round((localRetail - 1) * 100);

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      await axios.put("/marginConfig", {
        wholesaleMargin: localWholesale,
        retailMargin: localRetail,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      alert("Error al guardar márgenes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 p-3 border rounded bg-gray-50 flex flex-col gap-2">
      <div>
        <FormLabel>Margen Mayorista</FormLabel>
        <div className="flex items-center gap-2 mt-1">
          <Input
            type="number"
            step="1"
            value={wholesalePercent}
            onChange={e => {
              const value = 1 + Number(e.target.value) / 100;
              setLocalWholesale(value);
              onChange("wholesale", value);
            }}
            min={0}
            max={100}
          />
          <span className="text-sm">%</span>
        </div>
        <FormMessage />
      </div>
      <div>
        <FormLabel>Margen Minorista</FormLabel>
        <div className="flex items-center gap-2 mt-1">
          <Input
            type="number"
            step="1"
            value={retailPercent}
            onChange={e => {
              const value = 1 + Number(e.target.value) / 100;
              setLocalRetail(value);
              onChange("retail", value);
            }}
            min={0}
            max={100}
          />
          <span className="text-sm">%</span>
        </div>
        <FormMessage />
      </div>
      <div className="flex items-center justify-end mt-2">
        <Button size="icon" onClick={handleSave} disabled={loading} title="Guardar cambios" className="h-7 w-7 p-1">
          {success ? <Save className="text-green-600" size={16} /> : <Save size={16} />}
        </Button>
      </div>
    </div>
  );
}
