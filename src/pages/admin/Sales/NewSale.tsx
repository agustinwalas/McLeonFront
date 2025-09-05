
import { NewSaleForm } from "@/components/admin/sales/newSale/NewSaleForm";
import { NewSaleHeader } from "@/components/admin/sales/newSale/NewSaleHeader";
import useAuth from "@/store/useAuth";


export default function NewSale() {

  const { getCurrentUser } = useAuth();

  getCurrentUser()

  return (
    <div className="container mx-auto">
      <NewSaleHeader />
      <NewSaleForm />
    </div>
  );
}
