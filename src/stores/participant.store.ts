// stores/participant.store.ts
import { create } from "zustand";
import {
  VIEW_MODE,
  type ParticipantType,
  type ParticipationType,
} from "@/types/configuration.type";
import type { AxiosResponse } from "axios";
import participantService from "@/services/participant.service";
import type { NotifyFn } from "@/helpers/notifications.helper";
import { extractErrorMessage } from "@/helpers";

type ParticipantStoreState = {
  participants: ParticipantType[];
  selectedParticipant: ParticipantType | null;
  mode: VIEW_MODE;
  loading: boolean;
  error: string | null;
  filters: Record<string, unknown>;
};

type ParticipantStoreActions = {
  fetchParticipants: (
    query?: Record<string, unknown>,
    notify?: NotifyFn,
  ) => Promise<AxiosResponse<ParticipantType[]> | undefined>;
  fetchParticipantById: (id: string, notify?: NotifyFn) => Promise<void>;
  fetchParticipationById: (
    id: number,
    notify?: NotifyFn,
  ) => Promise<ParticipationType[]>;
  createParticipant: (
    payload: ParticipantType,
    notify?: NotifyFn,
  ) => Promise<void>;
  updateParticipant: (
    id: string,
    payload: ParticipantType,
    notify?: NotifyFn,
  ) => Promise<void>;
  deleteParticipant: (id: string, notify?: NotifyFn) => Promise<void>;
  setSelectedParticipant: (participant: ParticipantType | null) => void;
  setViewMode: (modeSet: VIEW_MODE) => void;
  setFilters: (filters: Record<string, unknown>) => void;
  clearError: () => void;
};

export const useParticipantStore = create<
  ParticipantStoreState & ParticipantStoreActions
>((set, get) => ({
  participants: [],
  selectedParticipant: null,
  mode: VIEW_MODE.LIST,
  loading: false,
  error: null,
  filters: {},

  fetchParticipants: async (query?, notify?) => {
    let responseReturn: AxiosResponse<ParticipantType[]> | undefined =
      undefined;
    try {
      set({ loading: true, error: null });
      const service = participantService();
      const finalQuery = { ...get().filters, ...query };
      const response =
        service.fetchAll &&
        ((await service.fetchAll(finalQuery)) as unknown as AxiosResponse<
          ParticipantType[]
        >);

      responseReturn = response;

      if (response && (response.status === 200 || response.status === 201)) {
        set({
          participants: response.data,
          selectedParticipant: response.data[0] || null,
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

  fetchParticipantById: async (id, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = participantService();
      const response = service.fetch && (await service.fetch(id, {}));

      if (response && (response.status === 200 || response.status === 201)) {
        set({ selectedParticipant: response.data, loading: false });
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      set({ error: message, loading: false });
      notify?.({ message, color: "error", visible: true });
      throw error;
    }
  },

  fetchParticipationById: async (id, notify?) => {
    let participations: ParticipationType[] = [];
    try {
      set({ loading: true, error: null });
      const service = participantService();
      const response =
        service.fetchParticipations && (await service.fetchParticipations(id));

      if (response && (response.status === 200 || response.status === 201)) {
        // Yeahhhh
        participations = response.data.participations ?? [];
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      set({ error: message, loading: false });
      notify?.({ message, color: "error", visible: true });
      throw error;
    }
    return participations;
  },

  createParticipant: async (payload, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = participantService();
      const response = service.create && (await service.create(payload));

      if (response && (response.status === 200 || response.status === 201)) {
        set({
          participants: [response.data, ...get().participants],
          selectedParticipant: response.data,
          loading: false,
        });
        notify?.({
          message: "Participant créé avec succès",
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

  updateParticipant: async (id, payload, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = participantService();
      const response = service.update && (await service.update(id, payload));

      if (response && (response.status === 200 || response.status === 201)) {
        const updatedList = get().participants.map((p) =>
          p.id === Number(id) ? response.data : p,
        );
        set({
          participants: updatedList,
          selectedParticipant: response.data,
          loading: false,
        });
        notify?.({
          message: "Participant modifié avec succès",
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

  deleteParticipant: async (id, notify?) => {
    try {
      set({ loading: true, error: null });
      const service = participantService();
      if (service.remove) await service.remove(id, {});

      const filtered = get().participants.filter((p) => p.id !== Number(id));
      set({
        participants: filtered,
        selectedParticipant: filtered[0] || null,
        loading: false,
      });
      notify?.({
        message: "Participant supprimé",
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

  setSelectedParticipant: (participant) =>
    set({ selectedParticipant: participant }),
  setViewMode: (modeSet) => set({ mode: modeSet }),
  setFilters: (filters) => set({ filters }),
  clearError: () => set({ error: null }),
}));
