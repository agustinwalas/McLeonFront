# Product Store Documentation

## Store de Productos con Zustand + Axios

Este store maneja todo el estado y las operaciones CRUD para productos, usando los types sincronizados con el backend.

## 🏪 Estado del Store

```typescript
interface ProductStoreState {
  // Estado
  products: IProduct[];              // Lista de productos básicos
  product: IProduct | null;          // Producto individual seleccionado
  productsPopulated: IProductPopulated[]; // Productos con categoría poblada
  loading: boolean;                  // Estado de carga
  error: string | null;             // Mensajes de error
  pagination: {                     // Información de paginación
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## 🚀 Acciones Disponibles

### 1. **fetchProducts** - Obtener lista de productos
```typescript
const { products, fetchProducts, loading, error } = useProductStore();

// Básico
await fetchProducts();

// Con parámetros de consulta
await fetchProducts({
  page: 1,
  limit: 20,
  search: "chocolate",
  sort: "name",
  order: "asc"
});
```

### 2. **fetchProductById** - Obtener producto individual
```typescript
const { product, fetchProductById } = useProductStore();

await fetchProductById("product_id_here");
// El producto se guarda en: product
```

### 3. **fetchProductsPopulated** - Productos con categoría poblada
```typescript
const { productsPopulated, fetchProductsPopulated } = useProductStore();

await fetchProductsPopulated({
  page: 1,
  limit: 10
});
// Cada producto tendrá: product.category = { _id, name, active }
```

### 4. **createProduct** - Crear nuevo producto
```typescript
const { createProduct } = useProductStore();

const newProduct: ProductCreateInput = {
  productCode: "PROD001",
  name: "Torta de Chocolate",
  category: "category_id_here",
  wholesalePrice: 1500,
  retailPrice: 2000,
  productCategory: "Tortas",
  associatedSuppliers: ["supplier_id"],
  image: "https://...",
  currentStock: 10,
  minimumStock: 2
};

await createProduct(newProduct);
```

### 5. **updateProduct** - Actualizar producto
```typescript
const { updateProduct } = useProductStore();

const updates: ProductUpdateInput = {
  name: "Torta de Chocolate Especial",
  retailPrice: 2200
};

await updateProduct("product_id", updates);
```

### 6. **deleteProduct** - Eliminar producto
```typescript
const { deleteProduct } = useProductStore();

await deleteProduct("product_id");
```

### 7. **Utilidades**
```typescript
const { clearError, setLoading } = useProductStore();

clearError();     // Limpiar errores
setLoading(true); // Cambiar estado de carga manualmente
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
