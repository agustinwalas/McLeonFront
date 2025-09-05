// src/store/useSales.ts
import { create } from "zustand";
import { ISalePopulated } from "@/types/sale";
import api from "@/lib/axios";
import useAuth from "./useAuth"; 

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
    deliveryType: "RETIRO_LOCAL",
    deliveryFee: 0,
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
      console.log("🔍 Obteniendo lista de ventas...");
      const response = await api.get("/sales");
      console.log("✅ Ventas obtenidas:", response.data.length);
      set({ sales: response.data, isLoading: false });
    } catch (error: any) {
      console.error("❌ Error obteniendo ventas:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSalesByDate: async (date: string) => {
  set({ isLoading: true, error: null });
  try {
    console.log("🔍 Obteniendo ventas del día:", date);
    const response = await api.get(`/sales/date/${date}`);
    
    // ✅ Extraer solo el array de ventas, sin importar la estructura de respuesta
    const salesData = response.data.sales || response.data || [];
    
    console.log("✅ Ventas del día obtenidas:", salesData.length);
    set({ sales: salesData, isLoading: false });
    
  } catch (error: any) {
    console.error("❌ Error obteniendo ventas por fecha:", error);
    set({ error: error.message, isLoading: false });
  }
},

  getSaleById: async (id: string) => {
    try {
      console.log("🔍 Obteniendo venta por ID:", id);
      const response = await api.get(`/sales/${id}`);
      console.log("✅ Venta obtenida:", response.data.saleNumber);
      const sale = response.data;
      set({ currentSale: sale });
      return response.data;
    } catch (error: any) {
      console.error("❌ Error obteniendo venta:", error);
      set({ error: error.message });
      return null;
    }
  },

  deleteSale: async (id: string) => {
    try {
      console.log("🗑️ Eliminando venta:", id);
      await api.delete(`/sales/${id}`);

      // Actualizar lista local
      set((state) => ({
        sales: state.sales.filter((sale) => sale._id !== id),
      }));

      console.log("✅ Venta eliminada exitosamente");
      return true;
    } catch (error: any) {
      console.error("❌ Error eliminando venta:", error);
      set({ error: error.message });
      return false;
    }
  },

  // ========================================
  // ACCIONES PARA FORMULARIOS
  // ========================================

  initializeForm: () => {
    console.log("🔧 Inicializando formulario de venta");
    set({
      currentSale: null,
      formData: {
        client: "",
        paymentMethod: "EFECTIVO",
        deliveryType: "RETIRO_LOCAL",
        deliveryFee: 0,
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
    console.log("🔄 Reseteando formulario de venta");
    set({
      currentSale: null,
      formData: {
        client: "",
        paymentMethod: "EFECTIVO",
        deliveryType: "RETIRO_LOCAL",
        deliveryFee: 0,
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
    console.log("📝 Actualizando formData:", { field, value });
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    }));
  },

  addProduct: (product: any) => {
    console.log("➕ Agregando producto:", product);
    set((state) => ({
      selectedProducts: [...state.selectedProducts, product],
    }));
  },

  updateProduct: (index: number, field: string, value: any) => {
    console.log("📝 Actualizando producto:", { index, field, value });
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
    console.log("🗑️ Removiendo producto en índice:", index);
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
      console.log("📋 FormData:", JSON.stringify(formData, null, 2));
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

      if (!selectedClient) {
        throw new Error("Cliente no encontrado");
      }

      // ✅ Obtener productos para nombres
      const productStore = await import("./useProduct");
      const { products } = productStore.useProductStore.getState();

      // Calcular totales
      const subtotal = selectedProducts.reduce((sum, p) => sum + p.subtotal, 0);
      const totalAmount =
        subtotal + formData.deliveryFee - formData.totalDiscount;

      // ✅ Formatear datos para el backend
      const saleData = {
        user: {
          _id: currentUser._id,
          name: currentUser.name || currentUser.email, // Usar name o email como fallback
        }, // ✅ Usuario que realiza la venta
        client: {
          _id: selectedClient._id,
          name: selectedClient.name,
        },
        paymentMethod: formData.paymentMethod,
        deliveryType: formData.deliveryType,
        deliveryFee: formData.deliveryFee,
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

      console.log("✅ Venta creada exitosamente:", newSale.saleNumber);
      return true;
    } catch (error: any) {
      console.error("❌ Error creando venta:", error);
      console.error("❌ Error completo:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error creando venta",
        isSubmitting: false,
      });
      return false;
    }
  },

  loadSaleForEdit: async (saleId: string) => {
    console.log("🔄 Cargando venta para editar:", saleId);
    set({ isLoading: true, error: null });

    try {
      console.log("🔍 Llamando a getSaleById...");

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

        console.log("📦 Productos mapeados:", mappedProducts);

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
        };

        console.log("📝 FormData populado:", formData);

        set({
          currentSale: sale,
          formData: formData,
          selectedProducts: mappedProducts,
          isLoading: false,
          error: null,
        });

        console.log("✅ Store actualizado para edición");
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
      console.log("🚀 Actualizando venta:", saleId);

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

      if (!selectedClient) {
        throw new Error("Cliente no encontrado");
      }

      // ✅ Obtener productos para nombres
      const productStore = await import("./useProduct");
      const { products } = productStore.useProductStore.getState();

      // Calcular totales
      const subtotal = selectedProducts.reduce((sum, p) => sum + p.subtotal, 0);
      const totalAmount =
        subtotal + formData.deliveryFee - formData.totalDiscount;

      // ✅ Formatear datos para el backend
      const saleData = {
        user: {
          _id: currentUser._id,
          name: currentUser.name || currentUser.email,
        }, // ✅ Usuario que actualiza la venta
        client: {
          _id: selectedClient._id,
          name: selectedClient.name,
        },
        paymentMethod: formData.paymentMethod,
        deliveryType: formData.deliveryType,
        deliveryFee: formData.deliveryFee,
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

      console.log("✅ Venta actualizada exitosamente:", updatedSale.saleNumber);
      return true;
    } catch (error: any) {
      console.error("❌ Error actualizando venta:", error);
      console.error("❌ Error completo:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error actualizando venta",
        isSubmitting: false,
      });
      return false;
    }
  },
}));

export default useSalesStore;
