import { EditSaleForm } from "@/components/admin/sales/editSale/EditSaleForm";
import { EditSaleHeader } from "@/components/admin/sales/editSale/EditSaleHeader";

export default function EditSale() {
  return (
    <div className="container mx-auto">
      <div className="mx-auto">
        <EditSaleHeader />
        <EditSaleForm />
      </div>
    </div>
  );
}