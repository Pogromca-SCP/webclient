import { Location } from "./sharedTypes";
import { get, post, put, del } from "./basicCalls";

interface AccidentReportBase {
  bandCode: string | null,

  // Enum - EmergencyType
  emergencyType: string,

  // Integer, Min = 1
  victimCount: number,
  breathing: boolean,
  description: string
}

interface AccidentRequestBase extends AccidentReportBase {
  longitude: number,
  latitude: number
}

export interface AccidentReportUpdateRequest extends AccidentRequestBase {
  consciousness: boolean
}

export interface AccidentReportRequest extends AccidentRequestBase {
  // Email
  email: string,
  concious: boolean
}

export interface AccidentReportResponse extends AccidentReportBase {
  accidentId: number,
  date: Date,
  location: Location,
  consciousness: boolean,
  address: string
}

const accidentBase = "accident_report";
export const getAccidents = (abort: AbortController) => get(accidentBase, abort);
export const getAccidentById = (id: number, abort: AbortController) => get(`${accidentBase}/${id}`, abort);
export const getAccidentsByUser = (email: string, abort: AbortController) => get(`${accidentBase}/user/${email}`, abort);
export const createAccident = (req: Readonly<AccidentReportRequest>, abort: AbortController) => post(accidentBase, req, abort);
export const updateAccident = (id: number, req: Readonly<AccidentReportUpdateRequest>, abort: AbortController) => put(`${accidentBase}/${id}`, req, abort);
export const deleteAccident = (id: number, abort: AbortController) => del(`${accidentBase}/${id}`, abort);
