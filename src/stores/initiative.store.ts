// stores/initiative.store.ts
import { create } from "zustand";
import {
  VIEW_MODE,
  type DatasetsType,
  type InitiativeType,
} from "@/types/configuration.type";
import type { AxiosResponse } from "axios";
import initiativeService from "@/services/initiative.service";
import type { NotifyFn } from "@/helpers/notifications.helper";
import { extractErrorMessage } from "@/helpers";

type InitiativeStoreState = {
  initiatives: InitiativeType[];
  selectedInitiative: InitiativeType | null;
  mode: VIEW_MODE;
  loading: boolean;
  error: string | null;
  filters: Record<string, unknown>;
};

type InitiativeStoreActions = {
  fetchInitiatives: (
    query?: Record<string, unknown>,
    notify?: NotifyFn,
  ) => Promise<AxiosResponse<InitiativeType[]> | undefined>;
  fetchInitiativeById: (id: string, notify?: NotifyFn) => Promise<void>;
  createInitiative: (
    payload: InitiativeType,
    notify?: NotifyFn,
  ) => Promise<void>;
  updateInitiative: (
    id: string,
    payload: InitiativeType,
    notify?: NotifyFn,
  ) => Promise<void>;
  deleteInitiative: (id: string, notify?: NotifyFn) => Promise<void>;
  setSelectedInitiative: (initiative: InitiativeType | null) => void;
  setViewMode: (modeSet: VIEW_MODE) => void;
  setFilters: (filters: Record<string, unknown>) => void;
  clearError: () => void;
};

export const useInitiativeStore = create<
  InitiativeStoreState & InitiativeStoreActions
>((set, get) => ({
  initiatives: [],
  selectedInitiative: null,
  mode: VIEW_MODE.LIST,
  loading: false,
  error: null,
  filters: {},

  fetchInitiatives: async (query?, notify?) => {
    let responseReturn: AxiosResponse<InitiativeType[]> | undefined = undefined;
    try {
      set({ loading: true, error: null });
      const service = initiativeService();
      const finalQuery = { ...get().filters, ...query };
      const response =
        service.fetchAll &&
        ((await service.fetchAll(finalQuery)) as unknown as AxiosResponse<
          InitiativeType[]
        >);

      responseReturn = response;

      if (response && (response.status === 200 || response.status === 201)) {
        const initiatives = response.data;
        for (let i = 0; i < initiatives.length; i++) {
          if (!initiatives[i].dataset) {
            initiatives[i].dataset = {} as DatasetsType;
          }
        }
        set({
          initiatives,
          selectedInitiative: response.data[0] || null,
          loading: false,
        });
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      set({ error: message, loading: false });
      notify?.({ message, color: "error", visible: true });
      throw error;
    }
    return responseReturn;
  },

  fetchInitiativeById: async (id, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = initiativeService();
      const response = service.fetch && (await service.fetch(id, {}));

      if (response && (response.status === 200 || response.status === 201)) {
        set({ selectedInitiative: response.data, loading: false });
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      set({ error: message, loading: false });
      notify?.({ message, color: "error", visible: true });
      throw error;
    }
  },

  createInitiative: async (payload, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = initiativeService();
      const response = service.create && (await service.create(payload));

      if (response && (response.status === 200 || response.status === 201)) {
        set({
          initiatives: [response.data, ...get().initiatives],
          selectedInitiative: response.data,
          loading: false,
        });
        notify?.({
          message: "Initiative créée avec succès",
          color: "success",
          visible: true,
        });
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      set({ error: message, loading: false });
      notify?.({ message, color: "error", visible: true });
      throw error;
    }
  },

  updateInitiative: async (id, payload, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = initiativeService();
      const response = service.update && (await service.update(id, payload));

      if (response && (response.status === 200 || response.status === 201)) {
        const updatedList = get().initiatives.map((i) =>
          i.id === Number(id) ? response.data : i,
        );
        set({
          initiatives: updatedList,
          selectedInitiative: response.data,
          loading: false,
        });
        notify?.({
          message: "Initiative modifiée avec succès",
          color: "success",
          visible: true,
        });
      }
    } catch (error) {
      console.log("ERREUR UPDATE ====>", error);
      const message = extractErrorMessage(error);
      set({ error: message, loading: false });
      notify?.({ message, color: "error", visible: true });
      throw error;
    }
  },

  deleteInitiative: async (id, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = initiativeService();
      if (service.remove) await service.remove(id, {});

      const filtered = get().initiatives.filter((i) => i.id !== Number(id));
      set({
        initiatives: filtered,
        selectedInitiative: filtered[0] || null,
        loading: false,
      });
      notify?.({
        message: "Initiative supprimée",
        color: "success",
        visible: true,
      });
    } catch (error) {
      const message = extractErrorMessage(error);
      set({ error: message, loading: false });
      notify?.({ message, color: "error", visible: true });
      throw error;
    }
  },

  setSelectedInitiative: (initiative) =>
    set({ selectedInitiative: initiative }),
  setViewMode: (modeSet) => set({ mode: modeSet }),
  setFilters: (filters) => set({ filters }),
  clearError: () => set({ error: null }),
}));
