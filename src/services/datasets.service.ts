// services/dataset.service.ts
import type { AxiosResponse } from "axios";
import { request } from "@/helpers/request.helper";
import type { ServiceProps } from "@/types/common.type";
import type { DatasetsType } from "@/types/configuration.type";

export type DatasetServiceProps = ServiceProps<DatasetsType>;

export default function datasetService(): DatasetServiceProps {
  const create = async (payload: DatasetsType): Promise<AxiosResponse<DatasetsType>> => {
    return await request(`/datasets`, { method: "post", data: payload });
  };

  const update = async (id: string, payload: DatasetsType): Promise<AxiosResponse<DatasetsType>> => {
    return await request(`/datasets/${id}`, {
      method: "put",
      data: { ...payload, id: undefined, createdAt: undefined },
    });
  };

  const remove = async (id: string): Promise<AxiosResponse> => {
    return await request(`/datasets/${id}`, { method: "delete" });
  };

  const fetchAll = async (query: Record<string, unknown>) => {
    return await request(`/datasets`, { method: "get", params: query });
  };

  const fetch = async (id: string, query?: Record<string, unknown>): Promise<AxiosResponse<DatasetsType>> => {
    return await request(`/datasets/${id}`, { method: "get", params: query });
  };

  return { create, update, remove, fetchAll, fetch };
}