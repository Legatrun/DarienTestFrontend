import { create } from 'zustand';
import { getReservations, getSpaces, createReservation, deleteReservation, createSpace } from '../api/reservationsApi';
import { devtools } from 'zustand/middleware';

const useReservationsStore = create(devtools((set, get) => ({
  reservations: [],
  spaces: [],
  loading: false,
  error: null,

  fetchReservations: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const data = await getReservations(page);
      set({ reservations: Array.isArray(data) ? data : data.data || [] });
    } catch (error) {
      set({ error: error.message || 'Error fetching reservations' });
    } finally {
      set({ loading: false });
    }
  },

  fetchSpaces: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getSpaces();
      set({ spaces: data });
    } catch (error) {
      set({ error: error.message || 'Error fetching spaces' });
    } finally {
      set({ loading: false });
    }
  },

  addReservation: async (reservationData) => {
    set({ loading: true, error: null });
    try {
      const newReservation = await createReservation(reservationData);
      set((state) => ({
        reservations: [...state.reservations, newReservation],
      }));
      return newReservation;
    } catch (error) {
      set({ error: error.message || 'Error creating reservation' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  removeReservation: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteReservation(id);
      set((state) => ({
        reservations: state.reservations.filter((res) => res.id !== id),
      }));
    } catch (error) {
      set({ error: error.message || 'Error deleting reservation' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addSpace: async (spaceData) => {
    set({ loading: true, error: null });
    try {
      const newSpace = await createSpace(spaceData);
      set((state) => ({
        spaces: [...state.spaces, newSpace],
      }));
      return newSpace;
    } catch (error) {
      set({ error: error.message || 'Error creating space' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
})));

export default useReservationsStore;
