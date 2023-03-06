import { Location, PathElement } from "./sharedTypes";
import { get, post, put, delBody, del } from "./basicCalls";

interface LicensePlate {
  // Length = 3-8
  licensePlate: string
}

interface AmbulanceBase extends LicensePlate {
  // Enum - AmbulanceClass
  ambulanceClass: string,

  // Enum - AmbulanceType
  ambulanceType: string,

   // Integer, Min = 1
   seats: number
}

export interface AddAmbulanceRequest extends AmbulanceBase {
  longitude: number,
  latitude: number
}

export interface AmbulanceResponse extends AmbulanceBase {
  ambulanceStateType: string,
  ambulanceId: number,
  currentLocation: Location
}

export interface PostAmbulanceLocationRequest {
  longitude: number,
  latitude: number
}

export interface AmbulanceStateResponse {
  type: string,
  timestamp: Date
}

export interface AmbulanceHistoryResponse extends LicensePlate {
  ambulanceHistory: AmbulanceStateResponse[]
}

export interface AmbulancePathResponse {
  path: PathElement[],
  incidentId: number
}

export interface MedicResponse {
  firstName: string,
  lastName: string,
  email: string,
  userId: number
}

const ambulanceBase = "ambulance";
export const getAmbulances = (abort: AbortController) => get(ambulanceBase, abort);
export const getAmbulanceByLicensePlate = (licensePlate: string, abort: AbortController) => get(`${ambulanceBase}/${licensePlate}`, abort);
export const getAmbulanceHistory = (licensePlate: string, abort: AbortController) => get(`${ambulanceBase}/${licensePlate}/history`, abort);
export const getAmbulanceState = (licensePlate: string, abort: AbortController) => get(`${ambulanceBase}/${licensePlate}/state`, abort);
export const getAmbulancePath = (licensePlate: string, abort: AbortController) => get(`${ambulanceBase}/${licensePlate}/location/path`, abort);
export const getIncidentPath = (licensePlate: string, incidentId: number, abort: AbortController) => get(`${ambulanceBase}/${licensePlate}/location/path/${incidentId}`, abort);
export const getItems = (licensePlate: string, abort: AbortController) => get(`${ambulanceBase}/${licensePlate}/equipment`, abort);
export const getCurrentIncident = (licensePlate: string, abort: AbortController) => get(`${ambulanceBase}/${licensePlate}/incident`, abort);
export const getAmbulanceIncidents = (licensePlate: string, abort: AbortController) => get(`${ambulanceBase}/${licensePlate}/incident/all`, abort);
export const getMedics = (licensePlate: string, abort: AbortController) => get(`${ambulanceBase}/${licensePlate}/crew`, abort);

export const addItem = (licensePlate: string, itemId: number, abort: AbortController, count?: number) => post(`${ambulanceBase}/${licensePlate}/items/add/${itemId}?count=${count ?? 1}`, undefined, abort);
export const changeItemUnit = (licensePlate: string, itemId: number, unit: string, abort: AbortController) => put(`${ambulanceBase}/${licensePlate}/items/add/${itemId}?unit=${unit}`, undefined, abort);
export const changeAmbulanceState = (licensePlate: string, ambulanceState: string, abort: AbortController)  => post(`${ambulanceBase}/${licensePlate}/state/${ambulanceState}`, undefined, abort);
export const createAmbulance = (req: Readonly<AddAmbulanceRequest>, abort: AbortController) => post(ambulanceBase, req, abort);
export const postAmbulanceLocation = (licensePlate: string, req: Readonly<PostAmbulanceLocationRequest>, abort: AbortController) => post(`${ambulanceBase}/${licensePlate}/location`, req, abort);
export const addMedics = (licensePlate: string, medics: Readonly<number[]>, abort: AbortController) => post(`${ambulanceBase}/${licensePlate}/crew`, medics, abort);
export const removeMedics = (licensePlate: string, medics: Readonly<number[]>, abort: AbortController) => delBody(`${ambulanceBase}/${licensePlate}/crew`, medics, abort);

export const updateAmbulance = (req: Readonly<AddAmbulanceRequest>, abort: AbortController) => put(ambulanceBase, req, abort);

export const deleteAmbulance = (licensePlate: string, abort: AbortController) => del(`${ambulanceBase}/${licensePlate}`, abort);
export const removeItem = (licensePlate: string, itemId: number, abort: AbortController, count?: number) => del(`${ambulanceBase}/${licensePlate}/items/remove/${itemId}?count=${count ?? 1}`, abort);
export const removeAllItems = (licensePlate: string, itemId: number, abort: AbortController) => del(`${ambulanceBase}/${licensePlate}/items/remove/${itemId}/all`, abort);
export const clearItems = (licensePlate: string, abort: AbortController) => del(`${ambulanceBase}/${licensePlate}/items/remove/all`, abort);
