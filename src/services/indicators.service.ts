// services/indicator.service.ts
import type { AxiosResponse } from "axios";
import { request } from "@/helpers/request.helper";
import type { ServiceProps } from "@/types/common.type";
import type { IndicatorsType } from "@/types/configuration.type";

export interface IndicatorServiceProps extends ServiceProps<IndicatorsType> {
  getFromParticipant: (
    participantId: number,
    initiativeId: number,
  ) => Promise<AxiosResponse<IndicatorsType[]>>;
  getFromInitiative: (
    initiativeId: number,
  ) => Promise<AxiosResponse<IndicatorsType[]>>;
}

export default function indicatorService(): IndicatorServiceProps {
  const create = async (
    payload: IndicatorsType,
  ): Promise<AxiosResponse<IndicatorsType>> => {
    return await request(`/indicateur`, { method: "post", data: payload });
  };

  const update = async (
    id: string,
    payload: IndicatorsType,
  ): Promise<AxiosResponse<IndicatorsType>> => {
    return await request(`/indicateur/${id}`, {
      method: "put",
      data: { ...payload, id: undefined, createdAt: undefined },
    });
  };

  const remove = async (id: string): Promise<AxiosResponse> => {
    return await request(`/indicateur/${id}`, { method: "delete" });
  };

  const fetchAll = async (query?: Record<string, unknown>) => {
    return await request(`/indicateur`, { method: "get", params: query });
  };

  const fetch = async (
    id: string,
    query?: Record<string, unknown>,
  ): Promise<AxiosResponse<IndicatorsType>> => {
    return await request(`/indicateur/${id}`, { method: "get", params: query });
  };

  const getFromParticipant = async (
    participantId: number,
    initiativeId: number,
  ): Promise<AxiosResponse<IndicatorsType[]>> => {
    return await request(`/participants/indicateurs`, {
      method: "post",
      data: { participantId, initiativeId },
    });
  };

  const getFromInitiative = async (
    initiativeId: number,
  ): Promise<AxiosResponse<IndicatorsType[]>> => {
    return await request(`/initiatives/${initiativeId}/indicateurs`, {
      method: "get",
    });
  };

  return {
    create,
    update,
    remove,
    fetchAll,
    fetch,
    getFromParticipant,
    getFromInitiative,
  };
}
