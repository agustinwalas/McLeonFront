// Utilidades para el formateo de comprobantes de impresión

// Función para obtener el nombre del tipo de comprobante
export const getTipoComprobanteNombre = (tipo: number): string => {
  switch (tipo) {
    case 1: return 'FACTURA A';
    case 6: return 'FACTURA B';
    case 11: return 'FACTURA C';
    default: return 'COMPROBANTE';
  }
};

// Función para obtener el nombre del tipo de documento
export const getTipoDocumentoNombre = (tipo: number): string => {
  switch (tipo) {
    case 80: return 'CUIT';
    case 86: return 'CUIL';
    case 96: return 'DNI';
    case 99: return 'CF';
    default: return 'DOC';
  }
};

// Función para formatear fecha
export const formatearFecha = (fechaString: string): string => {
  // Formato AFIP: YYYYMMDD (8 caracteres)
  if (fechaString.length === 8) {
    const year = fechaString.substring(0, 4);
    const month = fechaString.substring(4, 6);
    const day = fechaString.substring(6, 8);
    return `${day}/${month}/${year}`;
  }
  
  // Formato ISO: YYYY-MM-DD (10 caracteres)
  if (fechaString.length === 10 && fechaString.includes('-')) {
    const [year, month, day] = fechaString.split('-');
    return `${day}/${month}/${year}`;
  }
  
  // Si ya está en formato DD/MM/YYYY o no reconocemos el formato, devolver tal como está
  return fechaString;
};

// Función para convertir números a letras
export const numeroALetras = (num: number): string => {
  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  const entero = Math.floor(num);
  const decimales = Math.round((num - entero) * 100);

  const convertirGrupo = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return unidades[n];
    if (n < 20) return especiales[n - 10];
    if (n < 100) {
      const dec = Math.floor(n / 10);
      const uni = n % 10;
      return decenas[dec] + (uni > 0 ? ' Y ' + unidades[uni] : '');
    }
    const cen = Math.floor(n / 100);
    const resto = n % 100;
    return (n === 100 ? 'CIEN' : centenas[cen]) + (resto > 0 ? ' ' + convertirGrupo(resto) : '');
  };

  const convertirMiles = (n: number): string => {
    if (n === 0) return 'CERO';
    if (n < 1000) return convertirGrupo(n);
    
    const miles = Math.floor(n / 1000);
    const resto = n % 1000;
    
    let resultado = '';
    if (miles === 1) {
      resultado = 'MIL';
    } else {
      resultado = convertirGrupo(miles) + ' MIL';
    }
    
    if (resto > 0) {
      resultado += ' ' + convertirGrupo(resto);
    }
    
    return resultado;
  };

  let resultado = convertirMiles(entero);
  resultado += ` CON ${decimales.toString().padStart(2, '0')}/100`;
  
  return resultado;
};

// Función para formatear cantidad con decimales opcionales
export const formatearCantidad = (cantidad?: number): string => {
  if (!cantidad) return '1.00';
  return cantidad % 1 === 0 
    ? cantidad.toString() 
    : cantidad.toFixed(2).replace(/\.?0+$/, '');
};

// Función para generar nombre de archivo sugerido
export const generarNombreArchivo = (
  cbteDesde?: number, 
  ptoVta?: number, 
  nombreReceptor?: string, 
  cbteTipo?: number
): string => {
  const numeroFactura = cbteDesde ? 
    `${ptoVta?.toString().padStart(5, '0')}-${cbteDesde.toString().padStart(8, '0')}` : 
    'SN';
  const nombreReceptorLimpio = nombreReceptor
    ?.replace(/[^a-zA-Z0-9\s]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .substring(0, 20) || 'CLIENTE'; // Limitar longitud
  const tipoFactura = cbteTipo === 1 ? 'A' : cbteTipo === 6 ? 'B' : 'C';
  return `FAC-${tipoFactura}-${numeroFactura}-${nombreReceptorLimpio}`;
};