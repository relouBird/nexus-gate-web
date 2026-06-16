// services/participant.service.ts
import type { AxiosResponse } from "axios";
import { request } from "@/helpers/request.helper";
import type { ServiceProps } from "@/types/common.type";
import type { ParticipantType } from "@/types/configuration.type";

export type ParticipantServiceProps = ServiceProps<ParticipantType> & {
  /** Création en masse (bulk) à partir d'une liste d'indicateurIds pour une participation donnée */
  fetchParticipations: (
    id: number,
  ) => Promise<AxiosResponse<ParticipantType>>;
};

export default function participantService(): ParticipantServiceProps {
  const create = async (
    payload: ParticipantType,
  ): Promise<AxiosResponse<ParticipantType>> => {
    return await request(`/participants`, { method: "post", data: payload });
  };

  const update = async (
    id: string,
    payload: ParticipantType,
  ): Promise<AxiosResponse<ParticipantType>> => {
    return await request(`/participants/${id}`, {
      method: "put",
      data: { ...payload, id: undefined, createdAt: undefined },
    });
  };

  const remove = async (id: string): Promise<AxiosResponse> => {
    return await request(`/participants/${id}`, { method: "delete" });
  };

  const fetchAll = async (query?: Record<string, unknown>) => {
    return await request(`/participants`, { method: "get", params: query });
  };

  const fetchParticipations = async (id: number) => {
    return await request(`/participants/${id}/participations`, {
      method: "get",
      params: {},
    });
  };

  const fetch = async (
    id: string,
    query?: Record<string, unknown>,
  ): Promise<AxiosResponse<ParticipantType>> => {
    return await request(`/participants/${id}`, {
      method: "get",
      params: query,
    });
  };

  return { create, update, remove, fetchAll, fetch, fetchParticipations };
}
