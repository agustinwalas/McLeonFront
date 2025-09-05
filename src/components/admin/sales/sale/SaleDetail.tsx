import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSalesStore } from "@/store/useSales";
import { SaleError, SaleLoadingSkeleton, SaleNotFound } from "./SaleStates";
import { SaleHeader } from "./SaleHeader";
import { SaleInfoCard } from "./SaleInfoCard";
import { SaleProductsCard } from "./SaleProductsCard";
import { AfipSection } from "../AfipSection";

export default function SaleDetail() {
  const { id } = useParams<{ id: string }>();
  const { getSaleById, isLoading, error, currentSale } = useSalesStore();

  useEffect(() => {
    if (id) {
      getSaleById(id);
    }
  }, [id, getSaleById]);

  const handleAfipGenerated = async () => {
    if (id) {
      await getSaleById(id); 
    }
  };

  if (isLoading) {
    return <SaleLoadingSkeleton />;
  }

  if (error) {
    return <SaleError error={error} />;
  }

  if (!currentSale) {
    return <SaleNotFound />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <SaleHeader sale={currentSale} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SaleInfoCard sale={currentSale} />
        <SaleProductsCard sale={currentSale} />
      </div>

      <AfipSection sale={currentSale} onAfipGenerated={handleAfipGenerated} />
    </div>
  );
}
