import { Link } from "react-router-dom";
import { useSheetStore } from "@/store/useSheet";
import { ISupplier } from "@/types";
import { useDialogStore } from "@/store/useDialog";
import { useSupplierStore } from "@/store/useSupplier";
import { useProductStore } from "@/store/useProduct";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, TrendingUp, Printer } from "lucide-react";
import { EditSupplierForm } from "../forms/EditSupplierForm";
import { UpdateSupplierPrices } from "../forms/UpdateSupplierPrices";

export const SupplierActions = ({ supplier }: { supplier: ISupplier }) => {
  const { openSheet, closeSheet } = useSheetStore();
  const { deleteSupplier } = useSupplierStore();
  const { openDialog, closeDialog } = useDialogStore();
  const { products } = useProductStore();

  const handleEdit = () => {
    openSheet(
      "Editar proveedor",
      "Completá los campos para editar tu proveedor",
      <EditSupplierForm supplier={supplier} onSuccess={closeSheet} />
    );
  };

  const handleUpdatePrices = () => {
    openSheet(
      "Actualizar precios",
      `Ajustá los precios de todos los productos de ${supplier.name}`,
      <UpdateSupplierPrices supplier={supplier} onSuccess={closeSheet} />
    );
  };

  const handleDelete = () => {
    const confirmDelete = async () => {
      await deleteSupplier(supplier._id);
      closeDialog();
    };

    openDialog({
      title: "Eliminar proveedor",
      description: `¿Estás seguro de que querés eliminar el proveedor "${supplier.name}"? Esta acción no se puede deshacer.`,
      content: (
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={closeDialog}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            Eliminar
          </Button>
        </div>
      ),
    });
  };

  const handlePrint = () => {
    // Filtrar productos de este proveedor
    const supplierProducts = products.filter(product => 
      product.associatedSuppliers?.some(s => 
        typeof s === 'string' ? s === supplier._id : s._id === supplier._id
      )
    );

    if (supplierProducts.length === 0) {
      alert(`No hay productos asociados al proveedor "${supplier.name}"`);
      return;
    }

    const getCategoryName = (category: any): string => {
      if (!category) return "Sin categoría";
      if (typeof category === "string") return "Sin categoría";
      if (category._id && typeof category._id === "object") {
        return category._id.fullName || category._id.name || "Sin categoría";
      }
      if (category.fullName && category.fullName !== "Categoría no encontrada") {
        return category.fullName;
      }
      if (category.name && category.name !== "Categoría no encontrada") {
        return category.name;
      }
      return "Sin categoría";
    };

    const fileName = `Productos_${supplier.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

    // Construir info del supplier
    const supplierInfoParts = [];
    if (supplier.phone) supplierInfoParts.push(`📞 ${supplier.phone}`);
    if (supplier.email) supplierInfoParts.push(`📧 ${supplier.email}`);
    if (supplier.location) supplierInfoParts.push(`📍 ${supplier.location}`);
    const supplierInfo = supplierInfoParts.join(' | ');

    const PRINT_STYLES = `
      @page {
        size: A4;
        margin: 0.5cm;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Arial', sans-serif;
        font-size: 10pt;
        line-height: 1.3;
        color: #000;
        background: white;
      }

      .page-container {
        width: 100%;
        max-width: 21cm;
        margin: 0 auto;
        padding: 0.5cm;
        background: white;
      }

      .supplier-section {
        min-height: 90vh;
      }

      .supplier-header {
        background-color: #f0f0f0;
        padding: 10px;
        margin-bottom: 10px;
        border-left: 4px solid #333;
      }

      .supplier-name {
        font-size: 14pt;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .supplier-info {
        font-size: 9pt;
        color: #666;
      }

      .products-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
      }

      .products-table thead {
        background-color: #333;
        color: white;
      }

      .products-table th {
        padding: 8px;
        text-align: left;
        font-weight: bold;
        font-size: 9pt;
        border: 1px solid #333;
      }

      .products-table td {
        padding: 6px 8px;
        border: 1px solid #ddd;
        font-size: 9pt;
      }

      .products-table tbody tr:nth-child(even) {
        background-color: #f9f9f9;
      }

      .products-table tbody tr:hover {
        background-color: #f0f0f0;
      }

      .text-right {
        text-align: right;
      }

      .text-center {
        text-align: center;
      }

      @media print {
        body {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }

        .page-container {
          page-break-inside: avoid;
        }

        .products-table {
          page-break-inside: auto;
        }

        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }

        thead {
          display: table-header-group;
        }
      }
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${fileName}</title>
        <meta charset="UTF-8">
        <style>${PRINT_STYLES}</style>
      </head>
      <body>
        <div class="page-container">
          <div class="supplier-section">
            <div class="supplier-header">
              <div class="supplier-name">${supplier.name}</div>
              <div class="supplier-info">${supplierInfo}</div>
            </div>

            <table class="products-table">
              <thead>
                <tr>
                  <th style="width: 10%">Código</th>
                  <th style="width: 30%">Nombre</th>
                  <th style="width: 10%" class="text-center">Stock</th>
                  <th style="width: 15%">Categoría</th>
                  <th style="width: 11%" class="text-right">Costo</th>
                  <th style="width: 12%" class="text-right">Mayorista</th>
                  <th style="width: 12%" class="text-right">Minorista</th>
                </tr>
              </thead>
              <tbody>
                ${supplierProducts.map(product => `
                  <tr>
                    <td>${product.productCode || 'N/A'}</td>
                    <td>${product.name}</td>
                    <td class="text-center">${product.currentStock || 0}</td>
                    <td>${getCategoryName(product.category)}</td>
                    <td class="text-right">$${product.purchaseCost?.toFixed(2) || '0.00'}</td>
                    <td class="text-right">$${product.wholesalePrice?.toFixed(2) || '0.00'}</td>
                    <td class="text-right">$${product.retailPrice?.toFixed(2) || '0.00'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=900,height=900');
    
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.document.title = fileName;
      
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        setTimeout(() => printWindow.close(), 1000);
      }, 500);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
        <Link to={`/admin/proveedores/${supplier._id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        className="h-8 w-8 p-0"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleUpdatePrices}
        className="h-8 w-8 p-0"
        title="Actualizar precios"
      >
        <TrendingUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrint}
        className="h-8 w-8 p-0"
        title="Imprimir productos"
      >
        <Printer className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="h-8 w-8 p-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
