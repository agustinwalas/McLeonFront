import { useCallback, useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";
import { useSalesStore } from "@/store/useSales";

const UNSAVED_SALE_MESSAGE = "Te estas yendo de la venta sin guardar los cambios, estas seguro salamin?";

const DEFAULT_FORM_DATA = {
  client: "",
  paymentMethod: "EFECTIVO",
  deliveryType: "DELIVERY",
  deliveryFee: 0,
  amountPaid: 0,
  notes: "",
  totalDiscount: 0,
} as const;

const normalizeFormData = (formData: ReturnType<typeof useSalesStore.getState>["formData"]) => ({
  client: formData.client || "",
  paymentMethod: formData.paymentMethod || DEFAULT_FORM_DATA.paymentMethod,
  deliveryType: formData.deliveryType || DEFAULT_FORM_DATA.deliveryType,
  deliveryFee: Number(formData.deliveryFee || 0),
  amountPaid: Number(formData.amountPaid || 0),
  notes: (formData.notes || "").trim(),
  totalDiscount: Number(formData.totalDiscount || 0),
});

const normalizeProducts = (
  products: ReturnType<typeof useSalesStore.getState>["selectedProducts"]
) =>
  products.map((product) => ({
    product: product.product || "",
    quantity: Number(product.quantity || 0),
    priceType: product.priceType,
    unitPrice: Number(product.unitPrice || 0),
    discountPercentage: Number(product.discountPercentage || 0),
    subtotal: Number(product.subtotal || 0),
  }));

const getNewSaleSnapshot = (
  formData: ReturnType<typeof useSalesStore.getState>["formData"],
  selectedProducts: ReturnType<typeof useSalesStore.getState>["selectedProducts"]
) => ({
  formData: normalizeFormData(formData),
  selectedProducts: normalizeProducts(selectedProducts),
});

const getEditSaleSnapshot = (
  currentSale: ReturnType<typeof useSalesStore.getState>["currentSale"]
) => ({
  formData: {
    client:
      typeof currentSale?.client === "string"
        ? currentSale.client
        : currentSale?.client?._id || "",
    paymentMethod: currentSale?.paymentMethod || DEFAULT_FORM_DATA.paymentMethod,
    deliveryType: currentSale?.deliveryType || DEFAULT_FORM_DATA.deliveryType,
    deliveryFee: Number(currentSale?.deliveryFee || 0),
    amountPaid: Number(currentSale?.amountPaid || 0),
    notes: (currentSale?.notes || "").trim(),
    totalDiscount: Number(currentSale?.totalDiscount || 0),
  },
  selectedProducts: (currentSale?.products || []).map((product) => ({
    product:
      typeof product.product === "string"
        ? product.product
        : product.product?._id || "",
    quantity: Number(product.quantity || 0),
    priceType: product.priceType,
    unitPrice: Number(product.unitPrice || 0),
    discountPercentage: Number(product.discountPercentage || 0),
    subtotal: Number(product.subtotal || 0),
  })),
});

const isEqualSnapshot = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

interface UseSaleUnsavedChangesOptions {
  mode: "new" | "edit";
}

export const useSaleUnsavedChanges = ({ mode }: UseSaleUnsavedChangesOptions) => {
  const { formData, selectedProducts, currentSale } = useSalesStore();
  const skipPromptRef = useRef(false);

  const isDirty = (() => {
    if (mode === "edit") {
      if (!currentSale) return false;
      return !isEqualSnapshot(
        getNewSaleSnapshot(formData, selectedProducts),
        getEditSaleSnapshot(currentSale)
      );
    }

    return !isEqualSnapshot(
      getNewSaleSnapshot(formData, selectedProducts),
      getNewSaleSnapshot(DEFAULT_FORM_DATA, [])
    );
  })();

  const blocker = useBlocker(
    useCallback(() => isDirty && !skipPromptRef.current, [isDirty])
  );

  useEffect(() => {
    if (blocker.state !== "blocked") return;

    const shouldLeave = window.confirm(UNSAVED_SALE_MESSAGE);

    if (shouldLeave) {
      skipPromptRef.current = true;
      blocker.proceed();
      return;
    }

    blocker.reset();
  }, [blocker]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || skipPromptRef.current) return;

      event.preventDefault();
      event.returnValue = UNSAVED_SALE_MESSAGE;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const confirmNavigation = useCallback(
    (callback: () => void) => {
      if (isDirty && !skipPromptRef.current) {
        const shouldLeave = window.confirm(UNSAVED_SALE_MESSAGE);
        if (!shouldLeave) return false;
      }

      skipPromptRef.current = true;
      callback();
      return true;
    },
    [isDirty]
  );

  const allowNavigation = useCallback((callback: () => void) => {
    skipPromptRef.current = true;
    callback();
  }, []);

  return {
    isDirty,
    confirmNavigation,
    allowNavigation,
  };
};
