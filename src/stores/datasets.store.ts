// stores/dataset.store.ts
import { create } from "zustand";
import {
  VIEW_MODE,
  type DatasetsType,
  type InitiativeType,
} from "@/types/configuration.type";
import type { AxiosResponse } from "axios";
import datasetService from "@/services/datasets.service";
import { extractErrorMessage } from "@/helpers";
import type { NotifyFn } from "@/helpers/notifications.helper";
import type { ResponsePagination } from "@/types/common.type";

type DatasetStoreState = {
  datasets: DatasetsType[];
  selectedDataset: DatasetsType | null;
  mode: VIEW_MODE;
  loading: boolean;
  error: string | null;
  filters: Record<string, unknown>;
};

type DatasetStoreActions = {
  fetchDatasets: (
    query?: Record<string, unknown>,
    notify?: NotifyFn,
  ) => Promise<AxiosResponse<ResponsePagination<DatasetsType>> | undefined>;
  fetchDatasetById: (id: string, notify?: NotifyFn) => Promise<void>;
  createDataset: (payload: DatasetsType, notify?: NotifyFn) => Promise<void>;
  updateDataset: (
    id: string,
    payload: DatasetsType,
    notify?: NotifyFn,
  ) => Promise<void>;
  deleteDataset: (id: string, notify?: NotifyFn) => Promise<void>;
  setSelectedDataset: (dataset: DatasetsType | null) => void;
  setViewMode: (modeSet: VIEW_MODE) => void;
  setFilters: (filters: Record<string, unknown>) => void;
  clearError: () => void;
};

export const useDatasetStore = create<DatasetStoreState & DatasetStoreActions>(
  (set, get) => ({
    datasets: [],
    selectedDataset: null,
    mode: VIEW_MODE.LIST,
    loading: false,
    error: null,
    filters: {},

    fetchDatasets: async (query?, notify?) => {
      let responseReturn:
        | AxiosResponse<ResponsePagination<DatasetsType>>
        | undefined = undefined;
      try {
        set({ loading: true, error: null });
        const service = datasetService();
        const finalQuery = { ...get().filters, ...query };
        const response =
          service.fetchAll && (await service.fetchAll(finalQuery));

        responseReturn = response;

        if (response && (response.status === 200 || response.status === 201)) {
          const datasets = response.data.data;
          for (let i = 0; i < datasets.length; i++) {
            if (!datasets[i].initiative) {
              datasets[i].initiative = {} as InitiativeType;
            }
          }
          set({
            datasets,
            selectedDataset: response.data.data[0] || null,
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

    fetchDatasetById: async (id, notify?) => {
      try {
        set({ loading: true, error: null });
        const service = datasetService();
        const response = service.fetch && (await service.fetch(id, {}));

        if (response && (response.status === 200 || response.status === 201)) {
          set({ selectedDataset: response.data, loading: false });
        }
      } catch (error) {
        const message = extractErrorMessage(error);
        set({ error: message, loading: false });
        notify?.({ message, color: "error", visible: true });
        throw error;
      }
    },

    createDataset: async (payload, notify?) => {
      try {
        set({ loading: true, error: null });
        const service = datasetService();
        const response = service.create && (await service.create(payload));

        if (response && (response.status === 200 || response.status === 201)) {
          set({
            datasets: [response.data, ...get().datasets],
            selectedDataset: response.data,
            loading: false,
          });
          notify?.({
            message: "Dataset créé avec succès",
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

    updateDataset: async (id, payload, notify?) => {
      try {
        set({ loading: true, error: null });
        const service = datasetService();
        const response = service.update && (await service.update(id, payload));

        if (response && (response.status === 200 || response.status === 201)) {
          const updatedList = get().datasets.map((d) =>
            d.id === Number(id) ? response.data : d,
          );
          set({
            datasets: updatedList,
            selectedDataset: response.data,
            loading: false,
          });
          notify?.({
            message: "Dataset modifié avec succès",
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

    deleteDataset: async (id, notify?) => {
      try {
        set({ loading: true, error: null });
        const service = datasetService();
        if (service.remove) await service.remove(id, {});

        const filtered = get().datasets.filter((d) => d.id !== Number(id));
        set({
          datasets: filtered,
          selectedDataset: filtered[0] || null,
          loading: false,
        });
        notify?.({
          message: "Dataset supprimé",
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

    setSelectedDataset: (dataset) => set({ selectedDataset: dataset }),
    setViewMode: (modeSet) => set({ mode: modeSet }),
    setFilters: (filters) => set({ filters }),
    clearError: () => set({ error: null }),
  }),
);
