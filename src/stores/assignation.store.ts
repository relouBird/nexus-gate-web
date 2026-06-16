// stores/assignation.store.ts
import { create } from "zustand";
import { VIEW_MODE, type AssignationType } from "@/types/configuration.type";
import type { AxiosResponse } from "axios";
import assignationService from "@/services/assignation.service";
import type { NotifyFn } from "@/helpers/notifications.helper";
import { extractErrorMessage } from "@/helpers";

type AssignationStoreState = {
  assignations: AssignationType[];
  selectedAssignation: AssignationType | null;
  mode: VIEW_MODE;
  loading: boolean;
  error: string | null;
  filters: Record<string, unknown>;
};

type AssignationStoreActions = {
  fetchAssignations: (
    query?: Record<string, unknown>,
    notify?: NotifyFn,
  ) => Promise<AxiosResponse<AssignationType[]> | undefined>;
  fetchAssignationById: (id: string, notify?: NotifyFn) => Promise<void>;
  createAssignation: (
    payload: AssignationType,
    notify?: NotifyFn,
  ) => Promise<void>;
  createAssignationsBulk: (
    initiativeId: number,
    participationId: number,
    indicateurIds: number[],
    notify?: NotifyFn,
  ) => Promise<void>;
  deleteAssignation: (id: string, notify?: NotifyFn) => Promise<void>;
  deleteAssignationsByParticipation: (
    participationId: number,
    notify?: NotifyFn,
  ) => Promise<void>;
  setSelectedAssignation: (assignation: AssignationType | null) => void;
  setViewMode: (modeSet: VIEW_MODE) => void;
  setFilters: (filters: Record<string, unknown>) => void;
  clearError: () => void;
};

export const useAssignationStore = create<
  AssignationStoreState & AssignationStoreActions
>((set, get) => ({
  assignations: [],
  selectedAssignation: null,
  mode: VIEW_MODE.LIST,
  loading: false,
  error: null,
  filters: {},

  fetchAssignations: async (query?, notify?) => {
    let responseReturn: AxiosResponse<AssignationType[]> | undefined =
      undefined;
    try {
      set({ loading: true, error: null });
      const service = assignationService();
      const finalQuery = { ...get().filters, ...query };
      const response = service.fetchAll && (await service.fetchAll(finalQuery));
      responseReturn = response as unknown as AxiosResponse<AssignationType[]>;
      if (response && (response.status === 200 || response.status === 201)) {
        set({
          assignations: response.data as unknown as AssignationType[],
          selectedAssignation:
            (response.data as unknown as AssignationType[])[0] || null,
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

  fetchAssignationById: async (id, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = assignationService();
      const response = service.fetch && (await service.fetch(id, {}));
      if (response && (response.status === 200 || response.status === 201)) {
        set({ selectedAssignation: response.data, loading: false });
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      set({ error: message, loading: false });
      notify?.({ message, color: "error", visible: true });
      throw error;
    }
  },

  createAssignation: async (payload, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = assignationService();
      const response = service.create && (await service.create(payload));
      if (response && (response.status === 200 || response.status === 201)) {
        set({
          assignations: [response.data, ...get().assignations],
          selectedAssignation: response.data,
          loading: false,
        });
        notify?.({
          message: "Assignation créée avec succès",
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

  createAssignationsBulk: async (
    initiativeId,
    participationId,
    indicateurIds,
    notify?,
  ) => {
    try {
      set({ loading: true, error: null });
      const service = assignationService();
      const response = await service.createBulk(
        initiativeId,
        participationId,
        indicateurIds,
      );
      if (response && (response.status === 200 || response.status === 201)) {
        const newAssignations = response.data;
        set({
          assignations: [...newAssignations, ...get().assignations],
          loading: false,
        });
        notify?.({
          message: `${indicateurIds.length} indicateur(s) assigné(s) avec succès`,
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

  deleteAssignation: async (id, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = assignationService();
      if (service.remove) await service.remove(id, {});
      const filtered = get().assignations.filter((a) => String(a.id) !== id);
      set({
        assignations: filtered,
        selectedAssignation: filtered[0] || null,
        loading: false,
      });
      notify?.({
        message: "Assignation supprimée",
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

  deleteAssignationsByParticipation: async (participationId, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = assignationService();
      if (service.removeByParticipation)
        await service.removeByParticipation(participationId);
      const filtered = get().assignations.filter(
        (a) => a.participationId !== participationId,
      );
      set({
        assignations: filtered,
        selectedAssignation: filtered[0] || null,
        loading: false,
      });
      notify?.({
        message:
          "Toutes les assignations de cette participation ont été supprimées",
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

  setSelectedAssignation: (assignation) =>
    set({ selectedAssignation: assignation }),
  setViewMode: (modeSet) => set({ mode: modeSet }),
  setFilters: (filters) => set({ filters }),
  clearError: () => set({ error: null }),
}));
