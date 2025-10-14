// Estilos CSS para la impresión de comprobantes

export const PRINT_STYLES = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
    line-height: 1.4;
    color: #000;
    background: white;
  }
  .comprobante {
    max-width: 210mm;
    margin: 0 auto;
    padding: 15mm;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    font-weight: normal;
    text-align: left;
  }
  strong {
    font-weight: bold;
  }
  @media print {
    body { 
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    .no-print { display: none !important; }
    
    /* Configuración agresiva para ocultar headers y footers */
    @page {
      margin: 0.3in 0.5in; /* Reducir márgenes superior e inferior */
      size: A4;
      
      /* Forzar headers en blanco */
      @top-left { 
        content: " " !important; 
        color: #ffffff !important; 
        background: #ffffff !important;
        font-size: 0 !important;
        visibility: hidden !important;
      }
      @top-center { 
        content: " " !important; 
        color: #ffffff !important; 
        background: #ffffff !important;
        font-size: 0 !important;
        visibility: hidden !important;
      }
      @top-right { 
        content: " " !important; 
        color: #ffffff !important; 
        background: #ffffff !important;
        font-size: 0 !important;
        visibility: hidden !important;
      }
      
      /* Forzar footers en blanco */
      @bottom-left { 
        content: " " !important; 
        color: #ffffff !important; 
        background: #ffffff !important;
        font-size: 0 !important;
        visibility: hidden !important;
      }
      @bottom-center { 
        content: " " !important; 
        color: #ffffff !important; 
        background: #ffffff !important;
        font-size: 0 !important;
        visibility: hidden !important;
      }
      @bottom-right { 
        content: " " !important; 
        color: #ffffff !important; 
        background: #ffffff !important;
        font-size: 0 !important;
        visibility: hidden !important;
      }
    }
    
    /* Método alternativo: crear overlays blancos */
    html::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 0.3in;
      background: #ffffff !important;
      z-index: 9999;
      display: block !important;
    }
    
    html::after {
      content: "";
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 0.3in;
      background: #ffffff !important;
      z-index: 9999;
      display: block !important;
    }
    
    /* Ocultar cualquier contenido automático del navegador */
    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    /* Forzar que el contenido principal tenga prioridad */
    .comprobante {
      position: relative;
      z-index: 10000;
      background: white !important;
    }
  }
`;

export const ADDITIONAL_PRINT_STYLES = `
  @media print {
    @page {
      margin: 0.3in 0.5in;
      size: A4;
      
      /* Método 1: Content vacío con colores blancos */
      @top-left { content: " "; color: #ffffff !important; background: #ffffff !important; font-size: 0 !important; }
      @top-center { content: " "; color: #ffffff !important; background: #ffffff !important; font-size: 0 !important; }
      @top-right { content: " "; color: #ffffff !important; background: #ffffff !important; font-size: 0 !important; }
      @bottom-left { content: " "; color: #ffffff !important; background: #ffffff !important; font-size: 0 !important; }
      @bottom-center { content: " "; color: #ffffff !important; background: #ffffff !important; font-size: 0 !important; }
      @bottom-right { content: " "; color: #ffffff !important; background: #ffffff !important; font-size: 0 !important; }
    }
    
    /* Método 2: Overlays blancos para cubrir headers/footers */
    body::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 0.4in;
      background: #ffffff !important;
      z-index: 9999;
      display: block !important;
    }
    
    body::after {
      content: "";
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 0.4in;
      background: #ffffff !important;
      z-index: 9999;
      display: block !important;
    }
    
    /* Método 3: Forzar contenido principal encima */
    .comprobante {
      position: relative !important;
      z-index: 10000 !important;
      background: white !important;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }
  }
`;

export const TITLE_OVERRIDE_STYLES = `
  @media print {
    /* Hacer que cualquier texto automático sea blanco */
    * {
      color: black !important;
    }
    
    /* Específicamente para headers/footers del navegador */
    @page {
      @top-left { content: counter(page) " " !important; color: white !important; font-size: 1px !important; }
      @top-right { content: " " !important; color: white !important; font-size: 1px !important; }
      @bottom-left { content: " " !important; color: white !important; font-size: 1px !important; }
      @bottom-right { content: " " !important; color: white !important; font-size: 1px !important; }
      @bottom-center { content: " " !important; color: white !important; font-size: 1px !important; }
    }
  }
`;