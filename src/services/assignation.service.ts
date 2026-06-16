// services/assignation.service.ts
import type { AxiosResponse } from "axios";
import { request } from "@/helpers/request.helper";
import type { ServiceProps } from "@/types/common.type";
import type { AssignationType } from "@/types/configuration.type";

export type AssignationServiceProps = ServiceProps<AssignationType> & {
  /** Création en masse (bulk) à partir d'une liste d'indicateurIds pour une participation donnée */
  createBulk: (
    initiativeId: number,
    participationId: number,
    indicateurIds: number[],
  ) => Promise<AxiosResponse<AssignationType[]>>;
  /** Supprimer toutes les assignations d'une participation (ou selon critères) */
  removeByParticipation?: (participationId: number) => Promise<AxiosResponse>;
};

export default function assignationService(): AssignationServiceProps {
  /**
   * Créer une assignation unique
   */
  const create = async (
    payload: AssignationType,
  ): Promise<AxiosResponse<AssignationType>> => {
    return await request(`/assignations`, { method: "post", data: payload });
  };

  /**
   * Création en masse : associe plusieurs indicateurs à une même participation
   */
  const createBulk = async (
    initiativeId: number,
    participationId: number,
    indicateurIds: number[],
  ): Promise<AxiosResponse<AssignationType[]>> => {
    return await request(`/assignations/bulk`, {
      method: "post",
      data: { initiativeId, participationId, indicateurIds },
    });
  };

  /**
   * Supprimer une assignation par son id
   */
  const remove = async (id: string): Promise<AxiosResponse> => {
    return await request(`/assignations/${id}`, { method: "delete" });
  };

  /**
   * Supprimer toutes les assignations d'une participation (optionnel)
   */
  const removeByParticipation = async (
    participationId: number,
  ): Promise<AxiosResponse> => {
    return await request(`/assignations/participation/${participationId}`, {
      method: "delete",
    });
  };

  /**
   * Récupérer toutes les assignations (avec filtres possibles)
   * Exemple de query : { participationId, indicateurId, page, limit }
   */
  const fetchAll = async (query?: Record<string, unknown>) => {
    return await request(`/assignations`, { method: "get", params: query });
  };

  /**
   * Récupérer une assignation par son id
   */
  const fetch = async (
    id: string,
    query?: Record<string, unknown>,
  ): Promise<AxiosResponse<AssignationType>> => {
    return await request(`/assignations/${id}`, {
      method: "get",
      params: query,
    });
  };

  /**
   * Note : update n'est pas exposé car une assignation ne se modifie pas,
   * on supprime et on recrée si besoin.
   */
  return {
    create,
    createBulk,
    remove,
    removeByParticipation,
    fetchAll,
    fetch,
  };
}
