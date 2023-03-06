import { Location } from "./sharedTypes";
import { get, del, post, put } from "./basicCalls";

interface FacilityBase {
  // Not blank
  name: string,

  // Enum - FacilityType
  facilityType: string
}

export interface FacilityRequest extends FacilityBase {
  longitude: number,
  latitude: number
}

export interface FacilityResponse extends FacilityBase {
  facilityId: number,
  location: Location,
  address: string
}

const facilityBase = "facility";
export const getFacilities = (abort: AbortController) => get(facilityBase, abort);
export const getFacilityById = (id: number, abort: AbortController) => get(`${facilityBase}/${id}`, abort);
export const deleteFacility = (id: number, abort: AbortController) => del(`${facilityBase}/${id}`, abort);
export const createFacility = (req: Readonly<FacilityRequest>, abort: AbortController) => post(facilityBase, req, abort);
export const updateFacility = (id: number, req: Readonly<FacilityRequest>, abort: AbortController) => put(`${facilityBase}/${id}`, req, abort);
