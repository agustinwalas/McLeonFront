import { create } from 'zustand';
import api from '../lib/axios';
import { 
  Note, 
  CreateNoteData, 
  UpdateNoteData, 
  NoteFilters, 
  NoteStats,
  NoteType 
} from '../types/note';

interface NoteStore {
  // Estado
  notes: Note[];
  currentNote: Note | null;
  stats: NoteStats | null;
  loading: boolean;
  error: string | null;
  
  // Paginación
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  
  // Acciones
  getAllNotes: (filters?: NoteFilters) => Promise<void>;
  getNoteById: (id: string) => Promise<void>;
  getNotesBySale: (saleId: string) => Promise<Note[]>;
  createNote: (data: CreateNoteData) => Promise<Note>;
  updateNote: (id: string, data: UpdateNoteData) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  getNoteStats: (dateFrom?: string, dateTo?: string) => Promise<void>;
  sendNoteToAfip: (noteId: string) => Promise<Note>;
  
  // Utilidades
  clearError: () => void;
  setCurrentNote: (note: Note | null) => void;
  resetNotes: () => void;
}

export const useNote = create<NoteStore>((set) => ({
  // Estado inicial
  notes: [],
  currentNote: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },

  // Obtener todas las notas con filtros
  getAllNotes: async (filters?: NoteFilters) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      
      if (filters?.noteType) params.append('noteType', filters.noteType);
      if (filters?.clientId) params.append('clientId', filters.clientId);
      if (filters?.originalSaleId) params.append('originalSaleId', filters.originalSaleId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.reason) params.append('reason', filters.reason);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/notes?${params.toString()}`);
      
      if (response.data.success) {
        set({ 
          notes: response.data.data.notes,
          pagination: response.data.data.pagination,
          loading: false 
        });
      } else {
        set({ error: response.data.message || 'Error al obtener notas', loading: false });
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al obtener notas', 
        loading: false 
      });
    }
  },

  // Obtener nota por ID
  getNoteById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/notes/${id}`);
      
      if (response.data.success) {
        set({ 
          currentNote: response.data.data,
          loading: false 
        });
      } else {
        set({ error: response.data.message || 'Error al obtener nota', loading: false });
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al obtener nota', 
        loading: false 
      });
    }
  },

  // Obtener notas por venta específica
  getNotesBySale: async (saleId: string): Promise<Note[]> => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/notes/sale/${saleId}`);
      
      if (response.data.success) {
        set({ loading: false });
        return response.data.data;
      } else {
        set({ error: response.data.message || 'Error al obtener notas de la venta', loading: false });
        return [];
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al obtener notas de la venta', 
        loading: false 
      });
      return [];
    }
  },

  // Crear nueva nota
  createNote: async (data: CreateNoteData): Promise<Note> => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/notes', data);
      
      if (response.data.success) {
        const newNote = response.data.data;
        
        // Agregar la nueva nota al estado
        set(state => ({ 
          notes: [newNote, ...state.notes],
          loading: false 
        }));
        
        return newNote;
      } else {
        set({ error: response.data.message || 'Error al crear nota', loading: false });
        throw new Error(response.data.message || 'Error al crear nota');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear nota';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Actualizar nota
  updateNote: async (id: string, data: UpdateNoteData): Promise<Note> => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/notes/${id}`, data);
      
      if (response.data.success) {
        const updatedNote = response.data.data;
        
        // Actualizar la nota en el estado
        set(state => ({
          notes: state.notes.map(note => 
            note.id === id ? updatedNote : note
          ),
          currentNote: state.currentNote?.id === id ? updatedNote : state.currentNote,
          loading: false
        }));
        
        return updatedNote;
      } else {
        set({ error: response.data.message || 'Error al actualizar nota', loading: false });
        throw new Error(response.data.message || 'Error al actualizar nota');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar nota';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Eliminar nota
  deleteNote: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/notes/${id}`);
      
      if (response.data.success) {
        // Remover la nota del estado
        set(state => ({
          notes: state.notes.filter(note => note.id !== id),
          currentNote: state.currentNote?.id === id ? null : state.currentNote,
          loading: false
        }));
      } else {
        set({ error: response.data.message || 'Error al eliminar nota', loading: false });
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al eliminar nota', 
        loading: false 
      });
    }
  },

  // Obtener estadísticas
  getNoteStats: async (dateFrom?: string, dateTo?: string) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await api.get(`/notes/stats?${params.toString()}`);
      
      if (response.data.success) {
        set({ 
          stats: response.data.data,
          loading: false 
        });
      } else {
        set({ error: response.data.message || 'Error al obtener estadísticas', loading: false });
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al obtener estadísticas', 
        loading: false 
      });
    }
  },

  // Enviar nota a AFIP para obtener CAE
  sendNoteToAfip: async (noteId: string): Promise<Note> => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/notes/${noteId}/send-to-afip`);
      
      if (response.data.success) {
        const updatedNote = response.data.data;
        
        // Actualizar la nota en el estado
        set(state => ({
          notes: state.notes.map(note => 
            note.id === noteId ? updatedNote : note
          ),
          currentNote: state.currentNote?.id === noteId ? updatedNote : state.currentNote,
          loading: false
        }));
        
        return updatedNote;
      } else {
        set({ error: response.data.message || 'Error al enviar nota a AFIP', loading: false });
        throw new Error(response.data.message || 'Error al enviar nota a AFIP');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al enviar nota a AFIP';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Utilidades
  clearError: () => set({ error: null }),
  
  setCurrentNote: (note: Note | null) => set({ currentNote: note }),
  
  resetNotes: () => set({ 
    notes: [], 
    currentNote: null, 
    stats: null, 
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    }
  })
}));

// Hook para funciones específicas de notas de crédito/débito
export const useNoteActions = () => {
  const { createNote, getNotesBySale, sendNoteToAfip } = useNote();

  // Crear nota de crédito desde una venta
  const createCreditNote = async (
    saleId: string,
    reason: string,
    description: string,
    items: any[]
  ) => {
    return await createNote({
      noteType: NoteType.CREDITO,
      originalSaleId: saleId,
      reason: reason as any,
      description,
      items
    });
  };

  // Crear nota de débito desde una venta
  const createDebitNote = async (
    saleId: string,
    reason: string,
    description: string,
    items: any[]
  ) => {
    return await createNote({
      noteType: NoteType.DEBITO,
      originalSaleId: saleId,
      reason: reason as any,
      description,
      items
    });
  };

  // Verificar si una venta puede tener notas (tiene CAE válido)
  const canCreateNote = (sale: any): boolean => {
    return !!(sale?.afipData?.cae && sale?.saleNumber);
  };

  return {
    createCreditNote,
    createDebitNote,
    canCreateNote,
    getNotesBySale,
    sendNoteToAfip
  };
};