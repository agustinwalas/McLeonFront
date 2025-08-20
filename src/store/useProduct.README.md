# Product Store Documentation

## Store de Productos Optimizado para Admin

Store simplificado para administración de productos. **Fetch una sola vez** y mantenimiento del estado a través de operaciones CRUD.

## 🏪 Estado del Store

```typescript
interface ProductStoreState {
  // Estado
  products: IProduct[];              // Lista de productos
  product: IProduct | null;          // Producto individual seleccionado
  productsPopulated: IProductPopulated[]; // Productos con categoría poblada
  loading: boolean;                  // Estado de carga
  error: string | null;             // Mensajes de error
  isInitialized: boolean;           // Flag para saber si ya se cargaron los datos
  pagination: {                     // Información de paginación
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## 🎯 **Filosofía del Store:**

### ✅ **Para Admin - Una sola carga:**
- **Fetch inicial**: Se ejecuta solo una vez cuando se monta el componente
- **Estado persistente**: Los datos se mantienen durante toda la sesión de admin
- **Actualizaciones optimistas**: CREATE/UPDATE/DELETE actualizan el estado inmediatamente
- **Sin cache**: No necesita invalidar cache porque siempre está actualizado

## 🚀 Acciones Principales

### 1. **fetchProducts** - Carga inicial (solo una vez)
```typescript
const { products, fetchProducts, isInitialized } = useProductStore();

useEffect(() => {
  if (!isInitialized) {
    fetchProducts(); // Solo se ejecuta una vez
  }
}, [isInitialized, fetchProducts]);
```

### 2. **createProduct** - Agregar producto
```typescript
const { createProduct } = useProductStore();

const newProduct: ProductCreateInput = {
  productCode: "PROD001",
  name: "Torta de Chocolate",
  category: "category_id_here",
  wholesalePrice: 1500,
  retailPrice: 2000,
  productCategory: "Tortas"
};

await createProduct(newProduct);
// ✅ Se agrega automáticamente al array de products
```

### 3. **updateProduct** - Actualizar producto
```typescript
const { updateProduct } = useProductStore();

await updateProduct("product_id", { 
  name: "Nuevo nombre",
  retailPrice: 2500 
});
// ✅ Se actualiza automáticamente en el array de products
```

### 4. **deleteProduct** - Eliminar producto
```typescript
const { deleteProduct } = useProductStore();

await deleteProduct("product_id");
// ✅ Se elimina automáticamente del array de products
```

### 5. **reset** - Limpiar estado
```typescript
const { reset } = useProductStore();

reset(); // Vuelve al estado inicial, útil al cerrar sesión
```

## 📝 Ejemplo de Uso en Componente

```tsx
import { useProductStore } from "@/store/useProduct";
import { useEffect } from "react";

export const ProductsTable = () => {
  const { 
    products, 
    loading, 
    error, 
    pagination,
    fetchProducts,
    deleteProduct,
    clearError 
  } = useProductStore();

  useEffect(() => {
    fetchProducts({ page: 1, limit: 10 });
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar producto?")) {
      await deleteProduct(id);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Productos ({pagination.total})</h2>
      {products.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>Código: {product.productCode}</p>
          <p>Precio: ${product.retailPrice}</p>
          <button onClick={() => handleDelete(product._id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
};
```

## 🔧 Características

- ✅ **Tipado fuerte** con TypeScript
- ✅ **Manejo de errores** con AxiosError
- ✅ **Paginación** integrada
- ✅ **Búsqueda y filtros** via QueryParams
- ✅ **Estado optimista** - actualiza UI inmediatamente
- ✅ **Productos poblados** con categorías
- ✅ **CRUD completo** - Create, Read, Update, Delete
- ✅ **Logging** de errores en consola
- ✅ **Compatibilidad total** con types del backend

## 🌐 URLs de API que consume

- `GET /product` - Lista de productos
- `GET /product?populate=category` - Productos con categoría
- `GET /product/:id` - Producto individual
- `POST /product` - Crear producto
- `PUT /product/:id` - Actualizar producto  
- `DELETE /product/:id` - Eliminar producto
