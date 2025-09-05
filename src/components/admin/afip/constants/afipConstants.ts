export const CBTE_TIPO = [
  { value: 1, label: "Factura A" },
  { value: 6, label: "Factura B" },
  { value: 11, label: "Factura C" },
];

export const DOCTIPO = [
  { value: 80, label: "CUIT" },
  { value: 86, label: "CUIL" },
  { value: 96, label: "DNI" },
  { value: 99, label: "Consumidor Final" },
];

export const IVA_ID = [
  { value: 5, label: "21%" },
  { value: 4, label: "10,5%" },
  { value: 6, label: "27%" },
  { value: 8, label: "5%" },
  { value: 9, label: "2,5%" },
];

// ✅ Monedas actualizadas con más opciones
export const MONEDAS = [
  { value: "PES", label: "Pesos Argentinos", symbol: "$" },
  { value: "USD", label: "Dólares Estadounidenses", symbol: "US$" },
  { value: "EUR", label: "Euros", symbol: "€" },
  { value: "BRL", label: "Reales Brasileños", symbol: "R$" },
  { value: "JPY", label: "Yenes Japoneses", symbol: "¥" },
  { value: "GBP", label: "Libras Esterlinas", symbol: "£" },
];

// Utils
export const yyyymmdd = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
};

export const onlyDigits = (v: string) => (v || "").replace(/\D+/g, "");