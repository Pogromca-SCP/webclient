import { get, post, put, del } from "./basicCalls";

interface AllergyBase {
  // Enum - AllergyType
  allergyType: string,

  // Not blank
  allergyName: string,

  // Not blank
  other: string
}

export interface AllergyRequest extends AllergyBase {
  // Email
  userEmail: string
}

export interface AllergyResponse extends AllergyBase {
  allergyId: number
}

const allergyBase = "allergy";
export const getAllergies = (abort: AbortController) => get(allergyBase, abort);
export const getAllergyById = (id: number, abort: AbortController) => get(`${allergyBase}/${id}`, abort);
export const createAllergy = (req: Readonly<AllergyRequest>, abort: AbortController) => post(allergyBase, req, abort);
export const updateAllergy = (id: number, req: Readonly<AllergyRequest>, abort: AbortController) => put(`${allergyBase}/${id}`, req, abort);
export const deleteAllergy = (id: number, abort: AbortController) => del(`${allergyBase}/${id}`, abort);
