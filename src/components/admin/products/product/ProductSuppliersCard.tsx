import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ISupplier, IProductPopulated } from "@/types";

interface ProductSuppliersCardProps {
  suppliers: ISupplier[];
  allProducts?: IProductPopulated[]; // Para calcular el conteo real
}

export function ProductSuppliersCard({ suppliers, allProducts = [] }: ProductSuppliersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proveedores Asociados</CardTitle>
      </CardHeader>
      <CardContent>
        {suppliers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((supplier) => (
              <Link
                key={supplier._id}
                to={`/admin/proveedores/${supplier._id}`}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer block"
              >
                <h3 className="font-semibold text-lg">{supplier.name}</h3>
                <p className="text-sm text-gray-500 mb-2">Proveedor</p>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Teléfono:</span> {supplier.phone}</p>
                  <p><span className="font-medium">Email:</span> {supplier.email}</p>
                  <p><span className="font-medium">Ubicación:</span> {supplier.location}</p>
                  <p><span className="font-medium">Productos:</span> {allProducts.length > 0 
                    ? allProducts.filter(product => product.associatedSuppliers.some(supplierObj => supplierObj._id === supplier._id)).length 
                    : supplier.suppliedProducts.length
                  } productos</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Este producto no tiene proveedores asociados</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
