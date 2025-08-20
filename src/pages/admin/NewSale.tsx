
import { NewSaleForm } from "@/components/admin/sales/newSale/NewSaleForm";
import { NewSaleHeader } from "@/components/admin/sales/newSale/NewSaleHeader";

export default function NewSale() {
  return (
    <div className="container mx-auto">
      <NewSaleHeader />
      <NewSaleForm />
    </div>
  );
}
