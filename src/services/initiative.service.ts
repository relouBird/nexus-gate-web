// services/initiative.service.ts
import type { AxiosResponse } from "axios";
import { request } from "@/helpers/request.helper";
import type { ServiceProps } from "@/types/common.type";
import type { InitiativeType } from "@/types/configuration.type";

export type InitiativeServiceProps = ServiceProps<InitiativeType>;

export default function initiativeService(): InitiativeServiceProps {
  const create = async (
    payload: InitiativeType,
  ): Promise<AxiosResponse<InitiativeType>> => {
    return await request(`/initiatives`, { method: "post", data: payload });
  };

  const update = async (
    id: string,
    payload: InitiativeType,
  ): Promise<AxiosResponse<InitiativeType>> => {
    return await request(`/initiatives/${id}`, {
      method: "put",
      data: { ...payload, id: undefined, createdAt: undefined },
    });
  };

  const remove = async (id: string): Promise<AxiosResponse> => {
    return await request(`/initiatives/${id}`, { method: "delete" });
  };

  const fetchAll = async (query?: Record<string, unknown>) => {
    return await request(`/initiatives`, { method: "get", params: query });
  };

  const fetch = async (
    id: string,
    query?: Record<string, unknown>,
  ): Promise<AxiosResponse<InitiativeType>> => {
    return await request(`/initiatives/${id}`, {
      method: "get",
      params: query,
    });
  };

  return { create, update, remove, fetchAll, fetch };
}
