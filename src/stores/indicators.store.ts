// stores/indicator.store.ts
import { create } from "zustand";
import { VIEW_MODE, type IndicatorsType } from "@/types/configuration.type";
import type { AxiosResponse } from "axios";
import indicatorService from "@/services/indicators.service";
import { extractErrorMessage } from "@/helpers";
import type { NotifyFn } from "@/helpers/notifications.helper";

type IndicatorStoreState = {
  indicators: IndicatorsType[];
  selectedIndicator: IndicatorsType | null;
  mode: VIEW_MODE;
  loading: boolean;
  error: string | null;
  filters: Record<string, unknown>;
};

type IndicatorStoreActions = {
  fetchIndicators: (
    query?: Record<string, unknown>,
    notify?: NotifyFn,
  ) => Promise<AxiosResponse<IndicatorsType[]> | undefined>;
  fetchIndicatorById: (id: string, notify?: NotifyFn) => Promise<void>;
  fetchIndicatorsFromParticipant: (
    participantId: number,
    initiativeId: number,
    notify?: NotifyFn,
  ) => Promise<AxiosResponse<IndicatorsType[]> | undefined>;
  fetchIndicatorsFromInitiative: (
    initiativeId: number,
    notify?: NotifyFn,
  ) => Promise<AxiosResponse<IndicatorsType[]> | undefined>;
  createIndicator: (
    payload: IndicatorsType,
    notify?: NotifyFn,
  ) => Promise<void>;
  updateIndicator: (
    id: string,
    payload: IndicatorsType,
    notify?: NotifyFn,
  ) => Promise<void>;
  deleteIndicator: (id: string, notify?: NotifyFn) => Promise<void>;
  setSelectedIndicator: (indicator: IndicatorsType | null) => void;
  setViewMode: (modeSet: VIEW_MODE) => void;
  setFilters: (filters: Record<string, unknown>) => void;
  clearError: () => void;
};

export const useIndicatorStore = create<
  IndicatorStoreState & IndicatorStoreActions
>((set, get) => ({
  indicators: [],
  selectedIndicator: null,
  mode: VIEW_MODE.LIST,
  loading: false,
  error: null,
  filters: {},

  fetchIndicators: async (query?, notify?) => {
    let responseReturn: AxiosResponse<IndicatorsType[]> | undefined = undefined;
    try {
      set({ loading: true, error: null });
      const service = indicatorService();
      const finalQuery = { ...get().filters, ...query };
      const response =
        service.fetchAll &&
        ((await service.fetchAll(finalQuery)) as unknown as AxiosResponse<
          IndicatorsType[]
        >);

      responseReturn = response;

      if (response && (response.status === 200 || response.status === 201)) {
        set({
          indicators: response.data,
          selectedIndicator: response.data[0] || null,
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

  fetchIndicatorById: async (id, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = indicatorService();
      const response = service.fetch && (await service.fetch(id, {}));

      if (response && (response.status === 200 || response.status === 201)) {
        set({ selectedIndicator: response.data, loading: false });
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      set({ error: message, loading: false });
      notify?.({ message, color: "error", visible: true });
      throw error;
    }
  },

  fetchIndicatorsFromInitiative: async (
    initiativeId: number,
    notify?: NotifyFn,
  ) => {
    let responseReturn: AxiosResponse<IndicatorsType[]> | undefined = undefined;

    try {
      set({ loading: true, error: null });
      const service = indicatorService();
      const response =
        service.getFromInitiative &&
        (await service.getFromInitiative(initiativeId));

      responseReturn = response;

      if (response && (response.status === 200 || response.status === 201)) {
        set({
          indicators: response.data,
          selectedIndicator: response.data[0] || null,
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

  fetchIndicatorsFromParticipant: async (
    participantId: number,
    initiativeId: number,
    notify?: NotifyFn,
  ) => {
    let responseReturn: AxiosResponse<IndicatorsType[]> | undefined = undefined;

    try {
      set({ loading: true, error: null });
      const service = indicatorService();
      const response =
        service.getFromParticipant &&
        (await service.getFromParticipant(participantId, initiativeId));

      responseReturn = response;

      if (response && (response.status === 200 || response.status === 201)) {
        // CONTINUE
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      set({ error: message, loading: false });
      notify?.({ message, color: "error", visible: true });
      throw error;
    }

    return responseReturn;
  },

  createIndicator: async (payload, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = indicatorService();
      const response = service.create && (await service.create(payload));

      if (response && (response.status === 200 || response.status === 201)) {
        set({
          indicators: [response.data, ...get().indicators],
          selectedIndicator: response.data,
          loading: false,
        });
        notify?.({
          message: "Indicateur créé avec succès",
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

  updateIndicator: async (id, payload, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = indicatorService();
      const response = service.update && (await service.update(id, payload));

      if (response && (response.status === 200 || response.status === 201)) {
        const updatedList = get().indicators.map((ind) =>
          ind.id === Number(id) ? response.data : ind,
        );
        set({
          indicators: updatedList,
          selectedIndicator: response.data,
          loading: false,
        });
        notify?.({
          message: "Indicateur modifié avec succès",
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

  deleteIndicator: async (id, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = indicatorService();
      if (service.remove) await service.remove(id, {});

      const filtered = get().indicators.filter((ind) => ind.id !== Number(id));
      set({
        indicators: filtered,
        selectedIndicator: filtered[0] || null,
        loading: false,
      });
      notify?.({
        message: "Indicateur supprimé",
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

  setSelectedIndicator: (indicator) => set({ selectedIndicator: indicator }),
  setViewMode: (modeSet) => set({ mode: modeSet }),
  setFilters: (filters) => set({ filters }),
  clearError: () => set({ error: null }),
}));
