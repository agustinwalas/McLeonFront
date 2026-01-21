import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Loader2, Printer, Search } from "lucide-react";

interface Product {
  _id: string;
  productCode: string;
  name: string;
  wholesalePrice: number;
  category?: {
    _id: string;
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
  fullName: string;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseURL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000/api";
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${baseURL}/products`),
          axios.get(`${baseURL}/categories`),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory =
        !selectedCategory || product.category?._id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#05294f" }}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-white mb-4" />
          <p className="text-white">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#05294f" }}>
        <div className="text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#05294f" }}>
      {/* Logo y Header */}
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <img 
            src="/LogoMcleon.png" 
            alt="McLeon Logo" 
            className="mx-auto mb-2 print:hidden"
            style={{ maxWidth: "100px", height: "auto" }}
          />
          <h1 className="text-3xl font-bold text-white mb-2 print:text-gray-900 print:mt-0">
            <span className="print:hidden">Catálogo de Productos</span>
            <span className="hidden print:block">Distribuidora McLeon</span>
          </h1>
          <p className="text-white/80 print:text-gray-700 print:hidden">Distribuidora McLeon</p>
          <p className="text-white/80 print:text-gray-700 hidden print:block">Precios Mayoristas</p>
        </div>
      </div>

      {/* Controles: Search, Category Filter, Print */}
      <div className="max-w-6xl mx-auto px-4 mb-6 print:hidden">
        <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Select */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Print Button */}
            <div>
              <button
                onClick={handlePrint}
                className="w-full px-4 py-2 bg-white border-2 border-gray-800 text-gray-800 rounded-md hover:bg-gray-800 hover:text-white transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Printer className="h-5 w-5" />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="max-w-6xl mx-auto px-4 pb-12 print:pb-0 print:px-2">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70">
              {searchTerm || selectedCategory
                ? "No se encontraron productos con los filtros seleccionados"
                : "No hay productos disponibles"}
            </p>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl overflow-hidden print:bg-white print:shadow-none">
            {/* Header de la tabla */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 print:p-2 print:text-sm">
              <div className="col-span-2 hidden md:block">Código</div>
              <div className="col-span-8 md:col-span-7">Producto</div>
              <div className="col-span-4 md:col-span-3 text-right">Precio</div>
            </div>

            {/* Filas de productos */}
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors print:p-2 print:text-sm print:hover:bg-transparent ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <div className="col-span-2 font-mono text-sm text-gray-600 hidden md:block">
                    {product.productCode}
                  </div>
                  <div className="col-span-8 md:col-span-7">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    {product.category && (
                      <div className="text-sm text-gray-500 mt-1">
                        {product.category.name}
                      </div>
                    )}
                  </div>
                  <div className="col-span-4 md:col-span-3 text-right">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.wholesalePrice.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <div className="text-xs text-gray-500 mt-1 md:hidden">
                      Cod: {product.productCode}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/20 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-white/70 text-sm">
          <p>© {new Date().getFullYear()} McLeon. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}
