# Types Documentation

Este directorio contiene todas las definiciones de tipos TypeScript para el frontend, replicando y adaptando los types del backend.

## Estructura

- `category.ts` - Tipos para categorías
- `client.ts` - Tipos para clientes (incluye enums para condición fiscal y tipo de documento)
- `product.ts` - Tipos para productos
- `supplier.ts` - Tipos para proveedores
- `user.ts` - Tipos para usuarios y autenticación
- `index.ts` - Exportaciones centralizadas y tipos comunes de API

## Uso

### Importación simple desde el index
```typescript
import { IProduct, ICategory, TaxCondition, ApiResponse } from '@/types';
```

### Importación específica
```typescript
import { IProduct, ProductCreateInput } from '@/types/product';
import { TaxCondition, DocumentType } from '@/types/client';
```

## Patrones de Naming

- `I[Entity]` - Interface principal de la entidad (ej: `IProduct`, `IClient`)
- `[Entity]CreateInput` - Tipo para crear nueva entidad (sin _id)
- `[Entity]UpdateInput` - Tipo para actualizar entidad (todos los campos opcionales)
- `I[Entity]Populated` - Versión con referencias pobladas

## Tipos Comunes de API

- `ApiResponse<T>` - Respuesta estándar de la API
- `PaginatedResponse<T>` - Respuesta paginada
- `QueryParams` - Parámetros de consulta comunes
- `ErrorResponse` - Respuesta de error estándar

## Enums

### TaxCondition
- `RESPONSABLE_INSCRIPTO`
- `MONOTRIBUTO`
- `CONSUMIDOR_FINAL`

### DocumentType
- `DNI`
- `CUIT`
- `CUIL`
- `PASSPORT`

## Ejemplos de Uso

### Crear un producto
```typescript
const newProduct: ProductCreateInput = {
  productCode: "PROD001",
  name: "Torta de Chocolate",
  category: "category_id_here",
  wholesalePrice: 1500,
  retailPrice: 2000,
  productCategory: "Tortas"
};
```

### Manejar respuesta de API
```typescript
const response: ApiResponse<IProduct[]> = await api.getProducts();
if (response.success && response.data) {
  // response.data es IProduct[]
}
```

### Cliente con condición fiscal
```typescript
const client: ClientCreateInput = {
  name: "Juan Pérez",
  cuit: "20-12345678-9",
  taxCondition: TaxCondition.MONOTRIBUTO,
  documentType: DocumentType.DNI,
  address: "Av. Siempreviva 123"
};
```
