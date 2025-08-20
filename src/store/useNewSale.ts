import { create } from "zustand";
import { IProduct, IProductPopulated } from "@/types/product";
import { PaymentMethod, DeliveryType, PriceType, ICreateSaleRequest } from "@/types/sale";
import useSalesStore from "./useSales";
import { useProductStore } from "./useProduct";
import { useClientStore } from "./useClient";
import { toast } from "sonner";

export interface ProductItem {
  product: string;
  quantity: number;
  priceType: PriceType;
  discountPercentage: number;
}

export interface SaleFormData {
  client: string;
  paymentMethod: PaymentMethod;
  deliveryType: DeliveryType;
  deliveryFee: number;
  notes: string;
  deliveryAddress?: {
    street?: string;
    number?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    additionalInfo?: string;
  };
}

interface NewSaleState {
  // Form data
  formData: SaleFormData;
  selectedProducts: ProductItem[];
  
  // UI state
  isSubmitting: boolean;
  isLoading: boolean;
  
  // Actions
  setFormData: (data: Partial<SaleFormData>) => void;
  setFormField: (field: keyof SaleFormData, value: any) => void;
  
  // Product management
  addProduct: () => void;
  removeProduct: (index: number) => void;
  updateProduct: (index: number, field: keyof ProductItem, value: string | number) => void;
  clearProducts: () => void;
  
  // Calculations
  calculateSubtotal: (products: IProduct[] | IProductPopulated[]) => number;
  calculateTotal: (products: IProduct[] | IProductPopulated[]) => number;
  
  // Validation
  validateForm: () => { isValid: boolean; message: string };
  validateProducts: () => { isValid: boolean; message: string };
  
  // Submit - SIN PARÁMETROS
  submitSale: () => Promise<void>;
  
  // Reset
  resetForm: () => void;
  
  // Initialize
  initialize: () => Promise<void>;
}

const initialFormData: SaleFormData = {
  client: "",
  paymentMethod: PaymentMethod.CASH,
  deliveryType: DeliveryType.PICKUP,
  deliveryFee: 0,
  notes: "",
};

export const useNewSale = create<NewSaleState>((set, get) => ({
  // Initial state
  formData: initialFormData,
  selectedProducts: [],
  isSubmitting: false,
  isLoading: false,

  // Form data actions
  setFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data }
    }));
  },

  setFormField: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value }
    }));
  },

  // Product management
  addProduct: () => {
    set((state) => ({
      selectedProducts: [
        ...state.selectedProducts,
        {
          product: "",
          quantity: 1,
          priceType: PriceType.RETAIL,
          discountPercentage: 100,
        },
      ],
    }));
  },

  removeProduct: (index) => {
    set((state) => ({
      selectedProducts: state.selectedProducts.filter((_, i) => i !== index),
    }));
  },

  updateProduct: (index, field, value) => {
    set((state) => {
      const updatedProducts = [...state.selectedProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      };
      return { selectedProducts: updatedProducts };
    });
  },

  clearProducts: () => {
    set({ selectedProducts: [] });
  },

  // Calculations
  calculateSubtotal: (products) => {
    const { selectedProducts } = get();
    return selectedProducts.reduce((total, item) => {
      const product = products.find((p) => p._id === item.product);
      if (!product) return total;

      const basePrice =
        item.priceType === PriceType.WHOLESALE
          ? product.wholesalePrice
          : product.retailPrice;

      const discountedPrice = basePrice * (item.discountPercentage / 100);
      return total + discountedPrice * item.quantity;
    }, 0);
  },

  calculateTotal: (products) => {
    const { formData } = get();
    const subtotal = get().calculateSubtotal(products);
    return subtotal + formData.deliveryFee;
  },

  // Validation
  validateForm: () => {
    const { formData } = get();
    
    if (!formData.client) {
      return { isValid: false, message: "Debe seleccionar un cliente" };
    }
    
    if (formData.deliveryType === DeliveryType.DELIVERY && formData.deliveryFee < 0) {
      return { isValid: false, message: "El costo de envío debe ser mayor o igual a 0" };
    }
    
    return { isValid: true, message: "" };
  },

  validateProducts: () => {
    const { selectedProducts } = get();
    
    if (selectedProducts.length === 0) {
      return { isValid: false, message: "Debe agregar al menos un producto" };
    }

    const invalidProducts = selectedProducts.some(
      (item) => !item.product || item.quantity <= 0 || item.discountPercentage < 0 || item.discountPercentage > 100
    );
    
    if (invalidProducts) {
      return { isValid: false, message: "Complete todos los productos correctamente" };
    }

    return { isValid: true, message: "" };
  },

  // Submit - SIN PARÁMETROS
  submitSale: async () => {
    const { formData, selectedProducts } = get();
    
    // Validate form
    const formValidation = get().validateForm();
    if (!formValidation.isValid) {
      toast.error(formValidation.message);
      return;
    }

    // Validate products
    const productValidation = get().validateProducts();
    if (!productValidation.isValid) {
      toast.error(productValidation.message);
      return;
    }

    set({ isSubmitting: true });
    
    try {
      // Get products from store
      const { products } = useProductStore.getState();
      
      // Prepare sale products
      const saleProducts = selectedProducts.map((item) => {
        const product = products.find((p) => p._id === item.product)!;
        const basePrice =
          item.priceType === PriceType.WHOLESALE
            ? product.wholesalePrice
            : product.retailPrice;

        return {
          product: item.product,
          quantity: item.quantity,
          priceType: item.priceType,
          unitPrice: basePrice,
          discountPercentage: item.discountPercentage,
          subtotal: basePrice * (item.discountPercentage / 100) * item.quantity,
        };
      });

      // Prepare sale data
      const subtotal = get().calculateSubtotal(products);
      const saleData: ICreateSaleRequest = {
        client: formData.client,
        products: saleProducts,
        subtotal,
        totalDiscount: 0,
        totalAmount: subtotal + formData.deliveryFee,
        paymentMethod: formData.paymentMethod,
        deliveryType: formData.deliveryType,
        deliveryFee: formData.deliveryFee,
        notes: formData.notes,
        ...(formData.deliveryType === DeliveryType.DELIVERY &&
          formData.deliveryAddress && {
            deliveryAddress: {
              street: formData.deliveryAddress.street || "",
              number: formData.deliveryAddress.number || "",
              city: formData.deliveryAddress.city || "",
              province: formData.deliveryAddress.province || "",
              postalCode: formData.deliveryAddress.postalCode || "",
              additionalInfo: formData.deliveryAddress.additionalInfo || "",
            },
          }),
      };

      // Create sale and wait for the response with the ID
      const { createSale } = useSalesStore.getState();
      const createdSale = await createSale(saleData);
      
      toast.success("Venta creada correctamente");
      get().resetForm();
      
      // Redirect to the sale detail page using the returned ID
      if (createdSale && createdSale._id) {
        window.location.href = `/admin/ventas/${createdSale._id}`;
      } else {
        // Fallback to sales list if no ID
        window.location.href = "/admin/ventas";
      }
      
    } catch (error) {
      console.error("Error creating sale:", error);
      toast.error("Error al crear la venta");
    } finally {
      set({ isSubmitting: false });
    }
  },

  // Reset
  resetForm: () => {
    set({
      formData: initialFormData,
      selectedProducts: [],
      isSubmitting: false,
      isLoading: false,
    });
  },

  // Initialize
  initialize: async () => {
    set({ isLoading: true });
    
    try {
      const { fetchProducts } = useProductStore.getState();
      const { fetchClients } = useClientStore.getState();
      
      await Promise.all([
        fetchProducts(),
        fetchClients(),
      ]);
      
    } catch (error) {
      console.error("Error initializing NewSale:", error);
      toast.error("Error al cargar datos");
    } finally {
      set({ isLoading: false });
    }
  },
}));