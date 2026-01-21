// src/store/useSales.ts
import { create } from "zustand";
import { ISalePopulated } from "@/types/sale";
import api from "@/lib/axios";
import useAuth from "./useAuth";
import { toast } from "sonner"; 

interface SalesState {
  // Data
  sales: ISalePopulated[];
  currentSale: ISalePopulated | null;

  // Form data para nueva venta y edición
  formData: {
    client: string;
    paymentMethod: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "CHEQUE";
    deliveryType: "RETIRO_LOCAL" | "DELIVERY";
    deliveryFee: number;
    amountPaid: number;
    notes: string;
    totalDiscount: number;
  };

  selectedProducts: Array<{
    product: string;
    quantity: number;
    priceType: "MAYORISTA" | "MINORISTA";
    unitPrice: number;
    discountPercentage: number;
    subtotal: number;
  }>;

  // UI States
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Actions para listado
  fetchSales: () => Promise<void>;
  fetchSalesByDate: (date: string) => Promise<void>;
  getSaleById: (id: string) => Promise<ISalePopulated | null>;
  deleteSale: (id: string) => Promise<boolean>;
  payDebt: (saleId: string) => Promise<boolean>;

  // Actions para formularios (nueva venta y edición)
  initializeForm: () => void;
  resetForm: () => void;
  updateFormData: (field: string, value: any) => void;
  addProduct: (product: any) => void;
  updateProduct: (index: number, field: string, value: any) => void;
  removeProduct: (index: number) => void;

  // Actions para crear y actualizar
  createSale: () => Promise<boolean>;
  loadSaleForEdit: (saleId: string) => Promise<void>;
  updateSale: (saleId: string) => Promise<boolean>;
}

export const useSalesStore = create<SalesState>((set, get) => ({
  // Initial state
  sales: [],
  currentSale: null,
  formData: {
    client: "",
    paymentMethod: "EFECTIVO",
    deliveryType: "DELIVERY",
    deliveryFee: 0,
    amountPaid: 0,
    notes: "",
    totalDiscount: 0,
  },
  selectedProducts: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  // ========================================
  // ACCIONES PARA LISTADO
  // ========================================

  fetchSales: async () => {
    set({ isLoading: true, error: null });
    try {
 
      const response = await api.get("/sales");
 
      set({ sales: response.data, isLoading: false });
    } catch (error: any) {
      console.error("❌ Error obteniendo ventas:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error al obtener ventas";
      toast.error(errorMessage);
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchSalesByDate: async (date: string) => {
  set({ isLoading: true, error: null });
  try {
    const response = await api.get(`/sales/date/${date}`);
    
    const salesData = response.data.sales || response.data || [];
    
    set({ sales: salesData, isLoading: false });
    
  } catch (error: any) {
    console.error("❌ Error obteniendo ventas por fecha:", error);
    const errorMessage = error.response?.data?.message || error.message || "Error al obtener ventas por fecha";
    toast.error(errorMessage);
    set({ error: errorMessage, isLoading: false });
  }
},

  getSaleById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
 
      const response = await api.get(`/sales/${id}`);
 
      const sale = response.data;
      set({ currentSale: sale, isLoading: false });
      return response.data;
    } catch (error: any) {
      console.error("❌ Error obteniendo venta:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error al obtener venta";
      toast.error(errorMessage);
      set({ error: errorMessage, isLoading: false, currentSale: null });
      return null;
    }
  },

  deleteSale: async (id: string) => {
    try {
 
      await api.delete(`/sales/${id}`);

      // Actualizar lista local
      set((state) => ({
        sales: state.sales.filter((sale) => sale._id !== id),
      }));

 
      toast.success("Venta eliminada exitosamente");
      return true;
    } catch (error: any) {
      console.error("❌ Error eliminando venta:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error al eliminar venta";
      toast.error(errorMessage);
      set({ error: errorMessage });
      return false;
    }
  },

  payDebt: async (saleId: string) => {
    try {
      const sale = get().sales.find(s => s._id === saleId);
      if (!sale) {
        toast.error("Venta no encontrada");
        return false;
      }

      const remaining = sale.totalAmount - (sale.amountPaid || 0);
      if (remaining <= 0) {
        toast.info("Esta venta ya está completamente pagada");
        return false;
      }

      // Actualizar el amountPaid para que sea igual al totalAmount
      await api.patch(`/sales/${saleId}`, {
        amountPaid: sale.totalAmount
      });

      // Actualizar en la lista local
      set((state) => ({
        sales: state.sales.map((s) =>
          s._id === saleId ? { ...s, amountPaid: s.totalAmount } : s
        ),
      }));

      toast.success(`Deuda pagada: $${remaining.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`);
      return true;
    } catch (error: any) {
      console.error("❌ Error pagando deuda:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error al pagar la deuda";
      toast.error(errorMessage);
      return false;
    }
  },

  // ========================================
  // ACCIONES PARA FORMULARIOS
  // ========================================

  initializeForm: () => {
 
    set({
      currentSale: null,
      formData: {
        client: "",
        paymentMethod: "EFECTIVO",
        deliveryType: "DELIVERY",
        deliveryFee: 0,
        amountPaid: 0,
        notes: "",
        totalDiscount: 0,
      },
      selectedProducts: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
    });
  },

  resetForm: () => {
 
    set({
      currentSale: null,
      formData: {
        client: "",
        paymentMethod: "EFECTIVO",
        deliveryType: "DELIVERY",
        deliveryFee: 0,
        amountPaid: 0,
        notes: "",
        totalDiscount: 0,
      },
      selectedProducts: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
    });
  },

  updateFormData: (field: string, value: any) => {
 
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    }));
  },

  addProduct: (product: any) => {
 
    set((state) => ({
      selectedProducts: [...state.selectedProducts, product],
    }));
  },

  updateProduct: (index: number, field: string, value: any) => {
 
    set((state) => {
      const updatedProducts = [...state.selectedProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      };
      return { selectedProducts: updatedProducts };
    });
  },

  removeProduct: (index: number) => {
 
    set((state) => ({
      selectedProducts: state.selectedProducts.filter((_, i) => i !== index),
    }));
  },

  // ========================================
  // ACCIONES PARA CREAR Y ACTUALIZAR
  // ========================================

  createSale: async () => {
    const { formData, selectedProducts } = get();
    set({ isSubmitting: true, error: null });

    try {
 
      console.log(
        "🛍️ SelectedProducts:",
        JSON.stringify(selectedProducts, null, 2)
      );

      // ✅ Obtener el usuario actual usando la nueva función
      const currentUser = useAuth.getState().getCurrentUser();
      if (!currentUser) {
        throw new Error("Usuario no autenticado o sesión expirada");
      }

      console.log("👤 Usuario autenticado:", {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
      });

      // ✅ Obtener el cliente completo desde el store
      const clientStore = await import("./useClient");
      const { clients } = clientStore.useClientStore.getState();
      const selectedClient = clients.find((c) => c._id === formData.client);

      // ✅ Obtener productos para nombres
      const productStore = await import("./useProduct");
      const { products } = productStore.useProductStore.getState();

      // Calcular totales
      const subtotal = selectedProducts.reduce((sum, p) => sum + p.subtotal, 0);
      const discountAmount = subtotal * (formData.totalDiscount / 100);
      const totalAmount = subtotal + formData.deliveryFee - discountAmount;

      // ✅ Formatear datos para el backend
      const saleData = {
        user: {
          _id: currentUser._id,
          name: currentUser.name || currentUser.email, // Usar name o email como fallback
        }, // ✅ Usuario que realiza la venta
        ...(selectedClient ? { client: { _id: selectedClient._id, name: selectedClient.name } } : {}),
        paymentMethod: formData.paymentMethod,
        deliveryType: formData.deliveryType,
        deliveryFee: formData.deliveryFee,
        amountPaid: formData.amountPaid || 0,
        notes: formData.notes,
        totalDiscount: formData.totalDiscount,
        products: selectedProducts.map((p) => {
          const product = products.find((prod) => prod._id === p.product);
          return {
            product: {
              _id: p.product,
              name: product?.name || "Producto",
            },
            quantity: p.quantity,
            priceType: p.priceType,
            unitPrice: p.unitPrice,
            discountPercentage: p.discountPercentage,
            subtotal: p.subtotal,
          };
        }),
        subtotal,
        totalAmount,
      };

      console.log(
        "📦 Datos de nueva venta con usuario:",
        JSON.stringify(saleData, null, 2)
      );

      const response = await api.post("/sales", saleData);
      const newSale = response.data;

      // Agregar a la lista local
      set((state) => ({
        sales: [newSale, ...state.sales],
        isSubmitting: false,
      }));

 
      toast.success(`Venta ${newSale.saleNumber} creada exitosamente`);
      return true;
    } catch (error: any) {
      console.error("❌ Error creando venta:", error);
      console.error("❌ Error completo:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const errorMessage = error.response?.data?.message || error.message || "Error creando venta";
      toast.error(errorMessage);
      
      set({
        error: errorMessage,
        isSubmitting: false,
      });
      return false;
    }
  },

  loadSaleForEdit: async (saleId: string) => {
 
    set({ isLoading: true, error: null });

    try {
 

      const sale = await get().getSaleById(saleId);

      console.log("📋 Respuesta de getSaleById:", {
        hasResult: !!sale,
        saleNumber: sale?.saleNumber,
        clientName:
          typeof sale?.client === "object" ? sale.client?.name : "Cliente ID",
        productsCount: sale?.products?.length,
        totalAmount: sale?.totalAmount,
      });

      if (sale) {
        console.log("✅ Venta cargada para edición:", {
          id: sale._id,
          saleNumber: sale.saleNumber,
          client:
            typeof sale.client === "object" ? sale.client?.name : sale.client,
          products: sale.products?.length,
        });

        // Mapear productos al formato del formulario
        const mappedProducts = sale.products.map((p) => {
          console.log("🔄 Mapeando producto:", {
            name: typeof p.product === "object" ? p.product?.name : "Producto",
            productId:
              typeof p.product === "string" ? p.product : p.product?._id,
            quantity: p.quantity,
            priceType: p.priceType,
          });

          return {
            product:
              typeof p.product === "string" ? p.product : p.product?._id || "",
            quantity: p.quantity,
            priceType: p.priceType,
            unitPrice: p.unitPrice,
            discountPercentage: p.discountPercentage,
            subtotal: p.subtotal,
          };
        });

 

        // Populate form with sale data
        const formData = {
          client:
            typeof sale.client === "string"
              ? sale.client
              : sale.client?._id || "",
          paymentMethod: sale.paymentMethod as
            | "EFECTIVO"
            | "TARJETA"
            | "TRANSFERENCIA"
            | "CHEQUE",
          deliveryType: sale.deliveryType as "RETIRO_LOCAL" | "DELIVERY",
          deliveryFee: sale.deliveryFee || 0,
          notes: sale.notes || "",
          totalDiscount: sale.totalDiscount || 0,
          amountPaid: sale.amountPaid || 0,
        };

 

        set({
          currentSale: sale,
          formData: formData,
          selectedProducts: mappedProducts,
          isLoading: false,
          error: null,
        });

 
      } else {
        console.warn("⚠️ No se encontró la venta con ID:", saleId);
        set({
          error: "Venta no encontrada",
          isLoading: false,
        });
      } 
    } catch (error: any) {
      console.error("❌ Error cargando venta para edición:", {
        error,
        message: error.message,
        saleId,
        timestamp: new Date().toISOString(),
      });

      set({
        error: error.message || "Error cargando venta",
        isLoading: false,
      });
    }
  },

  updateSale: async (saleId: string) => {
    const { formData, selectedProducts } = get();
    set({ isSubmitting: true, error: null });

    try {
 

      // ✅ Obtener el usuario actual usando la nueva función
      const currentUser = useAuth.getState().getCurrentUser();
      if (!currentUser) {
        throw new Error("Usuario no autenticado o sesión expirada");
      }

      console.log("👤 Usuario autenticado para actualización:", {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
      });

      // ✅ Obtener el cliente completo desde el store
      const clientStore = await import("./useClient");
      const { clients } = clientStore.useClientStore.getState();
      const selectedClient = clients.find((c) => c._id === formData.client);

      // ✅ Obtener productos para nombres
      const productStore = await import("./useProduct");
      const { products } = productStore.useProductStore.getState();

      // Calcular totales
      const subtotal = selectedProducts.reduce((sum, p) => sum + p.subtotal, 0);
      const discountAmount = subtotal * (formData.totalDiscount / 100);
      const totalAmount = subtotal + formData.deliveryFee - discountAmount;

      // ✅ Formatear datos para el backend
      const saleData = {
        user: {
          _id: currentUser._id,
          name: currentUser.name || currentUser.email,
        }, // ✅ Usuario que actualiza la venta
        ...(selectedClient ? { client: { _id: selectedClient._id, name: selectedClient.name } } : {}),
        paymentMethod: formData.paymentMethod,
        deliveryType: formData.deliveryType,
        deliveryFee: formData.deliveryFee,
        notes: formData.notes,
        totalDiscount: formData.totalDiscount,
        amountPaid: formData.amountPaid || 0,
        products: selectedProducts.map((p) => {
          const product = products.find((prod) => prod._id === p.product);
          return {
            product: {
              _id: p.product,
              name: product?.name || "Producto",
            },
            quantity: p.quantity,
            priceType: p.priceType,
            unitPrice: p.unitPrice,
            discountPercentage: p.discountPercentage,
            subtotal: p.subtotal,
          };
        }),
        subtotal,
        totalAmount,
      };

      console.log(
        "📦 Datos a actualizar con usuario:",
        JSON.stringify(saleData, null, 2)
      );

      const response = await api.put(`/sales/${saleId}`, saleData);
      const updatedSale = response.data;

      // Actualizar en la lista local
      set((state) => ({
        sales: state.sales.map((sale) =>
          sale._id === saleId ? updatedSale : sale
        ),
        currentSale: updatedSale,
        isSubmitting: false,
      }));

 
      toast.success(`Venta ${updatedSale.saleNumber} actualizada exitosamente`);
      return true;
    } catch (error: any) {
      console.error("❌ Error actualizando venta:", error);
      console.error("❌ Error completo:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const errorMessage = error.response?.data?.message || error.message || "Error actualizando venta";
      toast.error(errorMessage);
      
      set({
        error: errorMessage,
        isSubmitting: false,
      });
      return false;
    }
  },
}));

export default useSalesStore;
