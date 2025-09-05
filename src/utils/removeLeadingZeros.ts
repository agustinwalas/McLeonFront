export const removeLeadingZeros = (value: string): string => {
  if (value === '' || value === '0') return '0';
  return value.replace(/^0+/, '') || '0';
};

// ✅ Función global para manejar inputs
export const setupGlobalNumberInputHandler = () => {
  // Remover listener previo si existe
  document.removeEventListener('input', globalInputHandler);
  
  // Agregar nuevo listener
  document.addEventListener('input', globalInputHandler);
};

const globalInputHandler = (event: Event) => {
  const target = event.target as HTMLInputElement;
  
  // Solo aplicar a inputs de tipo number
  if (target.type !== 'number') return;
  
  const originalValue = target.value;
  const cleanValue = removeLeadingZeros(originalValue);
  
  // Solo actualizar si cambió
  if (originalValue !== cleanValue) {
    target.value = cleanValue;
    
    // Disparar evento change para que React lo detecte
    const changeEvent = new Event('change', { bubbles: true });
    target.dispatchEvent(changeEvent);
  }
};

// ✅ Cleanup function
export const removeGlobalNumberInputHandler = () => {
  document.removeEventListener('input', globalInputHandler);
};