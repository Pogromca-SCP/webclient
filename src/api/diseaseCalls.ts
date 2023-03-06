import { get, post, put, del } from "./basicCalls";

interface DiseaseBase {
  // Not blank
  diseaseName: string,

  // Not blank
  description: string
  shareWithBand: boolean
}

export interface DiseaseRequest extends DiseaseBase {
  // Email
  userEmail: string
}

export interface DiseaseResponse extends DiseaseBase {
  diseaseId: number
}

const diseaseBase = "disease";
export const getDiseases = (abort: AbortController) => get(diseaseBase, abort);
export const getDiseaseById = (id: number, abort: AbortController) => get(`${diseaseBase}/${id}`, abort);
export const createDisease = (req: Readonly<DiseaseRequest>, abort: AbortController) => post(diseaseBase, req, abort);
export const updateDisease = (id: number, req: Readonly<DiseaseRequest>, abort: AbortController) => put(`${diseaseBase}/${id}`, req, abort);
export const deleteDisease = (id: number, abort: AbortController) => del(`${diseaseBase}/${id}`, abort);
